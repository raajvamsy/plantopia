'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { usePlantColors } from '@/lib/theme';
import { 
  Camera, 
  RotateCcw,
  Check,
  Droplets,
  Sun,
  Leaf,
  Bell,
  Moon,
  Lightbulb,
  Info,
  Star
} from 'lucide-react';
import BottomNavigation from '@/components/ui/bottom-navigation';
import PlantopiaHeader from '@/components/ui/plantopia-header';
import { LeafSpinner } from '@/components/ui';
import { useApiCall } from '@/lib/loading';

interface PlantAnalysis {
  name: string;
  health: number;
  confidence: number;
  age?: string;
  species?: string;
  care: {
    watering: string;
    sunlight: string;
    nutrients: string;
  };
  tips: {
    watering: string;
    sunlight: string;
  };
}

// Mock Gemini AI analysis function
const analyzePlantWithGemini = async (imageData: string): Promise<PlantAnalysis> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock analysis results
  const mockAnalyses: PlantAnalysis[] = [
    {
      name: 'Peace Lily',
      health: 75,
      confidence: 92,
      age: '6-12 months',
      species: 'Spathiphyllum wallisii',
      care: {
        watering: 'Check soil moisture weekly',
        sunlight: 'Ensure adequate indirect light',
        nutrients: 'Apply liquid fertilizer monthly'
      },
      tips: {
        watering: 'The soil should feel dry to the touch before watering again. This prevents root rot.',
        sunlight: 'Place your plant in a spot with indirect bright light for at least 6 hours a day.'
      }
    },
    {
      name: 'Snake Plant',
      health: 88,
      confidence: 96,
      age: '2-3 years',
      species: 'Sansevieria trifasciata',
      care: {
        watering: 'Water every 2-3 weeks',
        sunlight: 'Tolerates low to bright indirect light',
        nutrients: 'Feed quarterly during growing season'
      },
      tips: {
        watering: 'Allow soil to dry completely between waterings. Snake plants are drought tolerant.',
        sunlight: 'Very adaptable to different light conditions, but grows faster in brighter light.'
      }
    },
    {
      name: 'Monstera Deliciosa',
      health: 82,
      confidence: 89,
      age: '1-2 years',
      species: 'Monstera deliciosa',
      care: {
        watering: 'Water when top inch of soil is dry',
        sunlight: 'Bright, indirect light preferred',
        nutrients: 'Monthly feeding during spring/summer'
      },
      tips: {
        watering: 'Water thoroughly but ensure good drainage. Yellow leaves often indicate overwatering.',
        sunlight: 'Bright indirect light promotes larger, more fenestrated leaves.'
      }
    }
  ];
  
  return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
};

export default function CapturePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const colors = usePlantColors();
  const { processImage } = useApiCall();
  const [captureMode, setCaptureMode] = useState<'permission' | 'camera' | 'captured' | 'analyzing' | 'analyzed'>('permission');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied' | 'error'>('pending');
  const [careChecklist, setCareChecklist] = useState({
    watering: false,
    sunlight: false,
    nutrients: false
  });
  const [settings, setSettings] = useState({
    pushNotifications: true,
    darkMode: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const requestCameraPermission = useCallback(async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermission('error');
        return;
      }

      setCameraPermission('pending');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(mediaStream);
      setCameraPermission('granted');
      setCaptureMode('camera');
      
      // Set video source with a slight delay to ensure the video element is ready
      setTimeout(() => {
        if (videoRef.current && mediaStream) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(error => {
            console.error('Error playing video:', error);
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraPermission('denied');
        } else if (error.name === 'NotFoundError') {
          setCameraPermission('error');
        } else {
          setCameraPermission('error');
        }
      } else {
        setCameraPermission('error');
      }
    }
  }, []);

  const startCamera = useCallback(async () => {
    await requestCameraPermission();
  }, [requestCameraPermission]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        setCaptureMode('captured');
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleFileCapture = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        setCaptureMode('captured');
        stopCamera(); // Stop any active camera stream
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  }, [stopCamera]);

  const analyzeImage = useCallback(async () => {
    try {
      const result = await processImage(() => analyzePlantWithGemini(capturedImage));
      setAnalysis(result);
      setCaptureMode('analyzed');
    } catch (error) {
      console.error('Analysis failed:', error);
      setCaptureMode('captured');
    }
  }, [capturedImage, processImage]);

  const retakePhoto = useCallback(() => {
    setCaptureMode('permission');
    setCameraPermission('pending');
    setCapturedImage('');
    setAnalysis(null);
    stopCamera();
  }, [stopCamera]);

  const addPlantToCollection = useCallback(() => {
    if (analysis) {
      // Mock adding plant to collection
      console.log('Adding plant to collection:', analysis.name);
      
      // Navigate back to plants page
      router.push('/plants');
    }
  }, [analysis, router]);

  React.useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Handle video stream setup when stream changes
  React.useEffect(() => {
    if (stream && videoRef.current && captureMode === 'camera') {
      console.log('Setting up video stream:', stream);
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, [stream, captureMode]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PlantopiaHeader currentPage="capture" showBackButton={true} />
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="flex w-full max-w-md flex-col bg-card min-h-0">
            {/* Camera/Photo Section */}
            <div className="relative w-full">
              <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden">
                {/* Permission Screen */}
                {captureMode === 'permission' && (
                  <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-8 text-center">
                    <Camera className="w-16 h-16 text-white/70 mb-6" />
                    
                    {cameraPermission === 'pending' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-2">Camera Access Required</h3>
                        <p className="text-white/80 mb-6 text-sm">
                          We need access to your camera to identify plants and provide personalized care recommendations.
                        </p>
                        <button
                          onClick={startCamera}
                          className="px-6 py-3 rounded-full font-medium text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                          style={{ backgroundColor: colors.sage }}
                        >
                          Enable Camera
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-3 px-4 py-2 text-white/80 text-sm underline hover:text-white transition-colors"
                        >
                          Or upload from gallery
                        </button>
                      </>
                    )}

                    {cameraPermission === 'denied' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-2">Camera Permission Denied</h3>
                        <p className="text-white/80 mb-6 text-sm">
                          Please enable camera access in your browser settings to use this feature.
                        </p>
                        <div className="space-y-3">
                          <button
                            onClick={startCamera}
                            className="block w-full px-6 py-3 rounded-full font-medium text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                            style={{ backgroundColor: colors.sage }}
                          >
                            Try Again
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="block w-full px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                          >
                            Upload from Gallery Instead
                          </button>
                        </div>
                      </>
                    )}

                    {cameraPermission === 'error' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-2">Camera Not Available</h3>
                        <p className="text-white/80 mb-6 text-sm">
                          Camera is not available on this device. You can still upload photos from your gallery.
                        </p>
            <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-3 rounded-full font-medium text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                          style={{ backgroundColor: colors.sage }}
            >
                          Upload from Gallery
            </button>
                      </>
                    )}
                  </div>
                )}

                {captureMode === 'camera' && (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover bg-gray-900"
                      onLoadedMetadata={() => {
                        console.log('Video metadata loaded');
                      }}
                      onLoadedData={() => {
                        console.log('Video data loaded');
                      }}
                      onCanPlay={() => {
                        console.log('Video can play');
                      }}
                      onError={(e) => {
                        console.error('Video error:', e);
                      }}
                    />
                    {/* Loading state while video loads */}
                    {!stream && (
                      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-5">
                        <div className="text-center">
                          <LeafSpinner 
                            size="md" 
                            showText={true}
                            text="Starting camera..."
                            className="text-white"
                          />
          </div>
        </div>
                    )}
                  </div>
                )}
                
                {(captureMode === 'captured' || captureMode === 'analyzed') && capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Captured plant"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Plant outline overlay */}
                {showOverlay && (captureMode === 'camera' || captureMode === 'captured' || captureMode === 'analyzed') && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <svg className="size-full text-white/30 max-w-48 max-h-64" fill="none" viewBox="0 0 100 133.33" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M50 115C35 115 25 100 25 85C25 70 30 50 30 40C30 30 35 25 40 20C45 15 47.5 10 50 5C52.5 10 55 15 60 20C65 25 70 30 70 40C70 50 75 70 75 85C75 100 65 115 50 115ZM50 115C50 120 50 125 50 130" 
                      stroke="currentColor" 
                      strokeDasharray="4 4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2"
                    />
                    <path 
                      d="M40 75C35 70 32.5 65 30 60" 
                      stroke="currentColor" 
                      strokeDasharray="4 4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2"
                    />
                    <path 
                      d="M60 75C65 70 67.5 65 70 60" 
                      stroke="currentColor" 
                      strokeDasharray="4 4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2"
                    />
                  </svg>
                  </div>
                )}

                {/* Camera controls */}
                {captureMode === 'camera' && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-20">
                    <button
                      onClick={capturePhoto}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      disabled={!stream}
                    >
                      <Camera className="w-8 h-8 text-gray-800" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileCapture}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    >
                      <Leaf className="w-6 h-6 text-gray-800" />
                    </button>
                  </div>
                )}

                {/* Debug info for camera stream - hidden in production */}
                {false && captureMode === 'camera' && (
                  <div className="absolute top-4 left-4 bg-black/50 text-white text-xs p-2 rounded z-20 space-y-2">
                    <div>Stream: {stream ? 'Active' : 'None'}</div>
                    {stream && <div>Tracks: {stream?.getVideoTracks().length}</div>}
                    <button 
                      onClick={() => setShowOverlay(!showOverlay)}
                      className="block bg-white/20 px-2 py-1 rounded text-xs hover:bg-white/30"
                    >
                      {showOverlay ? 'Hide' : 'Show'} Overlay
                    </button>
                  </div>
                )}

                {/* Retake button */}
                {(captureMode === 'captured' || captureMode === 'analyzed') && (
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={retakePhoto}
                      className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    >
                      <RotateCcw className="w-5 h-5 text-gray-800" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area - Always Present */}
            <div className="relative flex flex-col bg-gradient-to-b from-white to-gray-50 flex-1">
              
              {/* Permission State Content */}
              {captureMode === 'permission' && (
                <div className="p-4 pb-24 flex flex-col justify-center">
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Plant Identification</h2>
                    <p className="text-gray-600 text-sm">
                      Get ready to discover and care for your plants with AI-powered analysis
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Camera className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800 text-sm">Instant Plant Recognition</p>
                        <p className="text-green-700 text-xs">Point, shoot, and discover what you're growing</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sun className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800 text-sm">Health Assessment</p>
                        <p className="text-blue-700 text-xs">AI analyzes your plant's condition and needs</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-purple-800 text-sm">Personalized Care Plan</p>
                        <p className="text-purple-700 text-xs">Custom watering, lighting, and feeding schedules</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="w-4 h-4 text-green-600" />
                      <p className="text-green-800 font-semibold text-sm">Powered by Gemini AI</p>
                    </div>
                    <p className="text-green-700 text-xs leading-relaxed">
                      Advanced machine learning identifies over 10,000 plant species with 95% accuracy.
                    </p>
                  </div>
                </div>
              )}

              {/* Camera Active Content */}
              {captureMode === 'camera' && (
                <div className="p-4 pb-24">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Take Your Plant Photo</h2>
                    <p className="text-gray-600 text-sm">
                      Position your plant within the guide and capture for AI analysis
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-sm font-bold">1</span>
                      </div>
                      <div>
                        <p className="text-green-800 font-medium text-sm">Position your plant</p>
                        <p className="text-green-700 text-xs">Center the plant within the dashed outline</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-bold">2</span>
                      </div>
                      <div>
                        <p className="text-blue-800 font-medium text-sm">Ensure good lighting</p>
                        <p className="text-blue-700 text-xs">Natural light works best for accuracy</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 text-sm font-bold">3</span>
                      </div>
                      <div>
                        <p className="text-purple-800 font-medium text-sm">Capture the photo</p>
                        <p className="text-purple-700 text-xs">Tap the camera button when ready</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-800">Plant ID</p>
                      <p className="text-xs text-gray-600">Species & Name</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Sun className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-800">Health Score</p>
                      <p className="text-xs text-gray-600">AI Analysis</p>
                    </div>
                  </div>
          </div>
              )}

              {/* Captured Photo Content */}
              {captureMode === 'captured' && (
                <div className="p-4 pb-24 flex flex-col justify-center">
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Perfect Shot!</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      Great photo! Ready for AI analysis
          </p>
          <button
                      onClick={analyzeImage}
                      className="px-6 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                      style={{ backgroundColor: colors.sage }}
                    >
                      Analyze with AI
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      This usually takes 2-3 seconds
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-green-800 text-sm">Photo captured successfully</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Info className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-blue-800 text-sm">AI analysis will identify your plant</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-purple-800 text-sm">You'll earn XP and coins for each scan</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Results */}
            {captureMode === 'analyzed' && (
              <div className="relative z-10 -mt-24 flex flex-col rounded-t-3xl bg-white p-4 pb-0">
                {/* Health Circle */}
                <div className="mx-auto -mt-16 mb-4 flex size-24 items-center justify-center rounded-full border-4 border-white bg-gray-100">
                  <div className="relative flex items-center justify-center">
                    {analysis ? (
                      <>
                        <svg className="size-20" viewBox="0 0 36 36">
                          <path 
                            className="text-gray-200" 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          />
                          <path 
                            className="transition-all duration-1000" 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" 
                            stroke={colors.sage}
                            strokeDasharray={`${analysis.health}, 100`}
                            strokeLinecap="round" 
                            strokeWidth="4"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-xl font-bold text-gray-800">{analysis.health}%</span>
                          <span className="text-xs text-gray-500">Health</span>
                        </div>
                      </>
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>





                {analysis && captureMode === 'analyzed' && (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-lg font-bold text-gray-900 mb-1">{analysis.name}</h2>
                      <p className="text-sm text-gray-500">
                        {analysis.confidence}% confidence • Powered by Gemini AI
                      </p>
                      {analysis.age && (
                        <p className="text-xs text-gray-400">Estimated age: {analysis.age}</p>
                      )}
                    </div>

                    {/* XP and Coins */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex flex-col items-center gap-2 rounded-2xl bg-green-50 p-4">
                        <span className="text-sm font-medium text-green-800">XP Earned</span>
                        <span className="text-3xl font-bold text-green-900">+100</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 rounded-2xl bg-blue-50 p-4">
                        <span className="text-sm font-medium text-blue-800">Coins Earned</span>
                        <span className="text-3xl font-bold text-blue-900">+50</span>
                      </div>
                    </div>

                    {/* Care Plan */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-4">Adaptive Care Plan</h3>
                      <div className="space-y-4">
                        <label className={`flex items-center gap-x-4 rounded-xl border p-4 transition-all cursor-pointer ${
                          careChecklist.watering ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                        }`}>
                          <Droplets className="w-5 h-5 text-blue-500" />
                          <span className="flex-1 text-base text-gray-800">{analysis.care.watering}</span>
                          <input 
                            type="checkbox" 
                            checked={careChecklist.watering}
                            onChange={(e) => setCareChecklist(prev => ({ ...prev, watering: e.target.checked }))}
                            className="h-5 w-5 rounded-md border-gray-300 focus:ring-green-500"
                            style={{ accentColor: colors.sage }}
                          />
                        </label>

                        <label className={`flex items-center gap-x-4 rounded-xl border p-4 transition-all cursor-pointer ${
                          careChecklist.sunlight ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                        }`}>
                          <Sun className="w-5 h-5 text-yellow-500" />
                          <span className="flex-1 text-base text-gray-800">{analysis.care.sunlight}</span>
                          <input 
                            type="checkbox" 
                            checked={careChecklist.sunlight}
                            onChange={(e) => setCareChecklist(prev => ({ ...prev, sunlight: e.target.checked }))}
                            className="h-5 w-5 rounded-md border-gray-300 focus:ring-green-500"
                            style={{ accentColor: colors.sage }}
                          />
                        </label>

                        <label className={`flex items-center gap-x-4 rounded-xl border p-4 transition-all cursor-pointer ${
                          careChecklist.nutrients ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                        }`}>
                          <Leaf className="w-5 h-5 text-amber-600" />
                          <span className="flex-1 text-base text-gray-800">{analysis.care.nutrients}</span>
                          <input 
                            type="checkbox" 
                            checked={careChecklist.nutrients}
                            onChange={(e) => setCareChecklist(prev => ({ ...prev, nutrients: e.target.checked }))}
                            className="h-5 w-5 rounded-md border-gray-300 focus:ring-green-500"
                            style={{ accentColor: colors.sage }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Care Tips */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Care Tips & Guidance</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
                          <Info className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                          <p className="flex-1 text-sm text-green-800">
                            <span className="font-semibold">Watering:</span> {analysis.tips.watering}
                          </p>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
                          <Lightbulb className="w-5 h-5 mt-1 text-blue-600 flex-shrink-0" />
                          <p className="flex-1 text-sm text-blue-800">
                            <span className="font-semibold">Sunlight:</span> {analysis.tips.sunlight}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* App Settings */}
                    <div className="mb-8 border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">App Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-x-3">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="text-base text-gray-800">Push Notifications</span>
                          </label>
                          <button
                            onClick={() => setSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-xl border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              settings.pushNotifications ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                            style={{ backgroundColor: settings.pushNotifications ? colors.sage : undefined }}
                          >
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-lg bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.pushNotifications ? 'translate-x-5' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-x-3">
                            <Moon className="w-5 h-5 text-gray-600" />
                            <span className="text-base text-gray-800">Dark Mode</span>
                          </label>
                          <button
                            onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-xl border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              settings.darkMode ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                            style={{ backgroundColor: settings.darkMode ? colors.sage : undefined }}
                          >
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-lg bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.darkMode ? 'translate-x-5' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Add Plant Button */}
                    <div className="sticky bottom-0 bg-white py-4">
                      <button
                        onClick={addPlantToCollection}
                        className="flex w-full cursor-pointer items-center justify-center rounded-full py-3 text-base font-bold text-white shadow-lg transition-all hover:scale-105"
            style={{ backgroundColor: colors.sage }}
          >
                        Add Plant to Collection
          </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}