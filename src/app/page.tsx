'use client';

import React from 'react';
import Link from 'next/link';
import { usePlantColors, useThemeColors } from '@/lib/theme/hooks';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-separator';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { 
  Leaf, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Heart,
  Camera,
  MessageCircle,
  Bell,
  Search
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, className }) => {
  const colors = useThemeColors();
  
  return (
    <div className={cn(
      "flex flex-col items-center text-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1",
      "bg-card border border-border",
      className
    )}>
      <div 
        className="p-3 sm:p-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: `${colors.sage}20` }}
      >
        <div style={{ color: colors.sage }}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-1 sm:gap-2 w-full">
        <h3 className="text-foreground text-base sm:text-lg font-bold leading-tight break-words">{title}</h3>
        <p className="text-muted-foreground text-xs sm:text-sm font-normal leading-relaxed break-words">{description}</p>
      </div>
    </div>
  );
};

interface ImageCardProps {
  title: string;
  description: string;
  imageUrl: string;
  className?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ title, description, imageUrl, className }) => {
  return (
    <div className={cn(
      "flex flex-col gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-card shadow-sm overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 border border-border",
      className
    )}>
      <div 
        className="w-full h-40 sm:h-48 bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="p-3 sm:p-4 pt-0">
        <p className="text-foreground text-sm sm:text-base font-bold leading-normal">{title}</p>
        <p className="text-muted-foreground text-xs sm:text-sm font-normal leading-normal mt-1">{description}</p>
      </div>
    </div>
  );
};

export default function Home() {
  const plantColors = usePlantColors();
  const themeColors = useThemeColors();

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex size-full min-h-screen flex-col">
        <div className="flex h-full grow flex-col">
          <div className="px-3 sm:px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-4 sm:py-5 safe-area-inset">
            <div className="flex flex-col max-w-5xl flex-1 w-full">
              
              {/* Hero Section */}
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg mb-6 sm:mb-8 md:mb-12">
                <div 
                  className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                  style={{
                    backgroundImage: `url('https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 w-full p-4 sm:p-6 md:p-10 text-center">
                  <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md break-words">
                    Grow plants, grow together
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mt-1 sm:mt-2 font-medium drop-shadow-sm">
                    with AI-powered care
                  </p>
                </div>
              </div>

              {/* Features Section */}
              <div className="py-8 sm:py-12 md:py-16 px-2 sm:px-4">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                  <h2 className="text-foreground tracking-tight text-2xl sm:text-3xl md:text-4xl font-bold leading-tight px-2">
                    Nurture your green thumb
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg mt-2 sm:mt-3 max-w-2xl mx-auto px-4">
                    Our app makes plant care easy and fun, no matter your experience level.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
                  <FeatureCard
                    icon={<Leaf size={28} strokeWidth={2.5} />}
                    title="Personalized Care"
                    description="Get tailored advice for your plants, from watering to sunlight."
                  />
                  <FeatureCard
                    icon={<Users size={28} strokeWidth={2.5} />}
                    title="Connect with Friends"
                    description="Share your plant journey and learn from others in our community."
                  />
                  <FeatureCard
                    icon={<TrendingUp size={28} strokeWidth={2.5} />}
                    title="Track Your Progress"
                    description="Watch your plants thrive and celebrate milestones along the way."
                    className="sm:col-span-2 lg:col-span-1"
                  />
                </div>
              </div>

              {/* AI Care Plans Section */}
              <div className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 bg-muted/30 rounded-xl sm:rounded-2xl md:rounded-3xl mb-6 sm:mb-8 md:mb-12">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-12">
                  <div className="w-full md:w-1/2">
                    <div className="relative w-full h-60 sm:h-80 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                      <div 
                        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                        style={{
                          backgroundImage: `url('https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div 
                        className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                      >
                        AI Powered
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 text-center md:text-left px-2">
                    <h2 className="text-foreground tracking-tight text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                      AI-Driven Custom Care Plans
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg mt-3 leading-relaxed">
                      Our intelligent system analyzes your plant's species, environment, and your care habits to generate a unique plan. As your plant grows and seasons change, the AI dynamically adjusts watering schedules, fertilizer recommendations, and light exposure, ensuring optimal health and vibrant growth.
                    </p>
                    
                    <div className="mt-4 sm:mt-6 flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center md:justify-start flex-wrap">
                      <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
                        <div 
                          className="p-1.5 sm:p-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `${themeColors.sage}20` }}
                        >
                          <Heart size={16} className="sm:w-5 sm:h-5" style={{ color: themeColors.sage }} />
                        </div>
                        <p className="text-foreground font-semibold text-xs sm:text-sm md:text-base">Customized Plans</p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
                        <div 
                          className="p-1.5 sm:p-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `${themeColors.sage}20` }}
                        >
                          <Sparkles size={16} className="sm:w-5 sm:h-5" style={{ color: themeColors.sage }} />
                        </div>
                        <p className="text-foreground font-semibold text-xs sm:text-sm md:text-base">Dynamic Adaptation</p>
                      </div>
                    </div>
                  </div>
                </div>
        </div>

              {/* CTA Buttons */}
              <div className="flex justify-center pb-8 sm:pb-12 md:pb-16">
                <div className="flex flex-col sm:flex-row w-full max-w-sm sm:max-w-md gap-3 sm:gap-4 px-4 sm:px-6">
                  <Link 
                    href="/signup"
                    className="flex w-full items-center justify-center rounded-full h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-bold tracking-wide shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      backgroundColor: themeColors.sage, 
                      color: themeColors.primaryForeground 
                    }}
                  >
                    <span className="truncate">Register</span>
                  </Link>
                  <Link 
                    href="/login"
                    className="flex w-full items-center justify-center rounded-full h-11 sm:h-12 px-4 sm:px-6 bg-secondary text-secondary-foreground text-sm sm:text-base font-bold tracking-wide shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 border border-border"
                  >
                    <span className="truncate">Log In</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Cards Section */}
              <div className="pb-8 sm:pb-12 md:pb-16">
                <ScrollArea.Root className="w-full overflow-hidden">
                  <ScrollArea.Viewport className="w-full overflow-x-auto">
                    <div className="flex items-stretch p-2 sm:p-4 gap-4 sm:gap-6 w-max">
                      <ImageCard
                        title="Smart Care Reminders"
                        description="Never miss a watering or feeding again with our smart reminders."
                        imageUrl="https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=800"
                        className="w-56 sm:w-64 lg:w-72"
                      />
                      <ImageCard
                        title="Plant Identification"
                        description="Identify your plants instantly with our AI-powered scanner."
                        imageUrl="https://images.pexels.com/photos/1131458/pexels-photo-1131458.jpeg?auto=compress&cs=tinysrgb&w=800"
                        className="w-56 sm:w-64 lg:w-72"
                      />
                      <ImageCard
                        title="Community Support"
                        description="Connect with fellow plant lovers for tips and inspiration."
                        imageUrl="https://images.pexels.com/photos/1128797/pexels-photo-1128797.jpeg?auto=compress&cs=tinysrgb&w=800"
                        className="w-56 sm:w-64 lg:w-72"
                      />
                    </div>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar
                    className="flex select-none touch-none p-0.5 bg-muted transition-colors duration-[160ms] ease-out hover:bg-muted/80 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                    orientation="horizontal"
                  >
                    <ScrollArea.Thumb className="flex-1 bg-muted-foreground/30 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}