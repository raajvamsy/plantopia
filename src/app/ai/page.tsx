'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/common/page-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TabNavigation from '@/components/ui/tab-navigation';
import LeafSpinner from '@/components/ui/leaf-spinner';
import { 
  AIChatInterface,
  PlantIdentificationCard,
  DiseaseDetectionCard,
  CareAdviceCard,
  AIInteractionsHistory
} from '@/components/ai';
import { 
  Bot, 
  Leaf, 
  AlertTriangle, 
  Lightbulb, 
  History,
  Zap,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';
import { useSupabaseAuth } from '@/lib/auth';
import { checkAIServiceStatus, initializeAIServices, testAIServices } from '@/lib/ai';
import { PlantService } from '@/lib/supabase/services/plants';
import { TaskService } from '@/lib/supabase/services/tasks';
import type { 
  AIInteraction,
  Plant,
  Task,
  PlantIdentificationResponse,
  DiseaseDetectionResponse,
  CareAdviceResponse
} from '@/types/api';

interface AIServiceStatus {
  gemini: {
    initialized: boolean;
    apiKeyPresent: boolean;
    ready: boolean;
  };
  overall: boolean;
  message: string;
}

export default function AIPage() {
  const { user } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [serviceStatus, setServiceStatus] = useState<AIServiceStatus | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<boolean | null>(null);
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentInteractions, setRecentInteractions] = useState<AIInteraction[]>([]);

  useEffect(() => {
    checkStatus();
    if (user) {
      loadUserData();
    }
  }, [user]);

  const checkStatus = async () => {
    const status = await checkAIServiceStatus();
    setServiceStatus(status);
  };

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load user plants and recent tasks for context
      const [plants, allTasks] = await Promise.all([
        PlantService.getUserPlants(user.id),
        TaskService.getUserTasks(user.id, 'pending')
      ]);

      // Get only the first 5 tasks
      const tasks = allTasks.slice(0, 5);

      setUserPlants(plants);
      setRecentTasks(tasks);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleInitializeServices = async () => {
    const success = await initializeAIServices();
    if (success) {
      await checkStatus();
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await testAIServices();
      setConnectionTestResult(result.overall);
    } catch (error) {
      setConnectionTestResult(false);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleNewInteraction = (result: { 
    interaction: AIInteraction; 
    response: PlantIdentificationResponse | DiseaseDetectionResponse | CareAdviceResponse 
  }) => {
    setRecentInteractions(prev => [result.interaction, ...prev.slice(0, 9)]);
  };

  const handleChatInteraction = (interaction: AIInteraction) => {
    setRecentInteractions(prev => [interaction, ...prev.slice(0, 9)]);
  };

  const tabs = [
    { id: 'chat', label: 'AI Chat', isActive: activeTab === 'chat' },
    { id: 'identify', label: 'Plant ID', isActive: activeTab === 'identify' },
    { id: 'disease', label: 'Disease Check', isActive: activeTab === 'disease' },
    { id: 'advice', label: 'Care Advice', isActive: activeTab === 'advice' },
    { id: 'history', label: 'History', isActive: activeTab === 'history' },
  ];

  if (!user) {
    return (
      <PageLayout currentPage="dashboard" customTitle="AI Assistant">
        <div className="text-center py-12">
          <Bot className="h-16 w-16 text-sage-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-sage-900 mb-2">Sign In Required</h2>
          <p className="text-sage-600">Please sign in to access AI features.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout currentPage="dashboard" customTitle="AI Plant Assistant">
      <div className="space-y-6">
        {/* Service Status Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sage-100 rounded-lg">
                <Settings className="h-5 w-5 text-sage-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sage-900">AI Service Status</h3>
                <p className="text-sm text-sage-600">Gemini 2.5 Flash Lite Integration</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {serviceStatus?.overall ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                serviceStatus?.overall ? 'text-green-700' : 'text-red-700'
              }`}>
                {serviceStatus?.overall ? 'Ready' : 'Not Ready'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-sage-700">{serviceStatus?.message}</p>
            
            <div className="flex gap-2">
              {!serviceStatus?.overall && (
                <Button
                  onClick={handleInitializeServices}
                  size="sm"
                  variant="outline"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Initialize Services
                </Button>
              )}
              
              <Button
                onClick={handleTestConnection}
                size="sm"
                variant="outline"
                disabled={isTestingConnection || !serviceStatus?.overall}
              >
                {isTestingConnection ? (
                  <LeafSpinner size="sm" className="mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Test Connection
              </Button>
            </div>

            {connectionTestResult !== null && (
              <div className={`text-sm ${
                connectionTestResult ? 'text-green-700' : 'text-red-700'
              }`}>
                Connection test: {connectionTestResult ? 'Success' : 'Failed'}
              </div>
            )}
          </div>
        </Card>

        {/* Main AI Interface */}
        {serviceStatus?.overall ? (
          <>
            {/* Tab Navigation */}
            <TabNavigation
              tabs={tabs}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'chat' && (
                <AIChatInterface
                  userPlants={userPlants}
                  recentTasks={recentTasks}
                  onNewInteraction={handleChatInteraction}
                  className="h-[600px]"
                />
              )}

              {activeTab === 'identify' && (
                <PlantIdentificationCard
                  onIdentificationComplete={handleNewInteraction}
                />
              )}

              {activeTab === 'disease' && (
                <DiseaseDetectionCard
                  onDetectionComplete={handleNewInteraction}
                />
              )}

              {activeTab === 'advice' && (
                <CareAdviceCard
                  onAdviceComplete={handleNewInteraction}
                />
              )}

              {activeTab === 'history' && (
                <AIInteractionsHistory
                  limit={50}
                  showSearch={true}
                  showFilters={true}
                />
              )}
            </div>
          </>
        ) : (
          <Card className="p-12 text-center">
            <Bot className="h-16 w-16 text-sage-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-sage-900 mb-2">AI Services Not Available</h3>
            <p className="text-sage-600 mb-4">
              Please configure your Gemini API key to use AI features.
            </p>
            <div className="text-sm text-sage-500 bg-sage-50 p-4 rounded-lg">
              <p className="mb-2">To enable AI features:</p>
              <ol className="list-decimal list-inside space-y-1 text-left">
                <li>Get a Gemini API key from Google AI Studio</li>
                <li>Add GEMINI_API_KEY to your environment variables</li>
                <li>Restart the application</li>
                <li>Click &quot;Initialize Services&quot; above</li>
              </ol>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        {serviceStatus?.overall && recentInteractions.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold text-sage-900 mb-4">Recent Activity</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-sage-900">{recentInteractions.length}</div>
                <div className="text-sm text-sage-600">Recent Interactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sage-900">{userPlants.length}</div>
                <div className="text-sm text-sage-600">Your Plants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sage-900">{recentTasks.length}</div>
                <div className="text-sm text-sage-600">Pending Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sage-900">
                  {Math.round(
                    recentInteractions.reduce((acc, i) => acc + (i.confidence_score || 0), 0) / 
                    recentInteractions.length * 100
                  )}%
                </div>
                <div className="text-sm text-sage-600">Avg Confidence</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
