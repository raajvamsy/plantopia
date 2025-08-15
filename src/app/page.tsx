'use client';

import React from 'react';
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
      "flex flex-col items-center text-center gap-4 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1",
      "bg-card border border-border",
      className
    )}>
      <div 
        className="p-4 rounded-full"
        style={{ backgroundColor: `${colors.sage}20` }}
      >
        <div style={{ color: colors.sage }}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground text-lg font-bold leading-tight">{title}</h3>
        <p className="text-muted-foreground text-sm font-normal leading-normal">{description}</p>
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
      "flex flex-col gap-4 rounded-2xl min-w-[280px] bg-card shadow-sm overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 border border-border",
      className
    )}>
      <div 
        className="w-full h-48 bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="p-4 pt-0">
        <p className="text-foreground text-base font-bold leading-normal">{title}</p>
        <p className="text-muted-foreground text-sm font-normal leading-normal mt-1">{description}</p>
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
          <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
            <div className="flex flex-col max-w-5xl flex-1">
              
              {/* Hero Section */}
              <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg mb-12 md:mb-16">
                <div 
                  className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                  style={{
                    backgroundImage: `url('https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 w-full p-6 md:p-10 text-center">
                  <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                    Grow plants, grow together
                  </h1>
                  <p className="text-white/90 text-lg md:text-xl mt-2 font-medium drop-shadow-sm">
                    with AI-powered care
                  </p>
                </div>
              </div>

              {/* Features Section */}
              <div className="py-12 md:py-16 px-4">
                <div className="text-center mb-10 md:mb-12">
                  <h2 className="text-foreground tracking-tight text-3xl md:text-4xl font-bold leading-tight">
                    Nurture your green thumb
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg mt-3 max-w-2xl mx-auto">
                    Our app makes plant care easy and fun, no matter your experience level.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <FeatureCard
                    icon={<Leaf size={32} strokeWidth={2.5} />}
                    title="Personalized Care"
                    description="Get tailored advice for your plants, from watering to sunlight."
                  />
                  <FeatureCard
                    icon={<Users size={32} strokeWidth={2.5} />}
                    title="Connect with Friends"
                    description="Share your plant journey and learn from others in our community."
                  />
                  <FeatureCard
                    icon={<TrendingUp size={32} strokeWidth={2.5} />}
                    title="Track Your Progress"
                    description="Watch your plants thrive and celebrate milestones along the way."
                  />
                </div>
              </div>

              {/* AI Care Plans Section */}
              <div className="py-12 md:py-16 px-4 bg-muted/30 rounded-3xl mb-12">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  <div className="w-full md:w-1/2">
                    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg">
                      <div 
                        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                        style={{
                          backgroundImage: `url('https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div 
                        className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                      >
                        AI Powered
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <h2 className="text-foreground tracking-tight text-3xl md:text-4xl font-bold leading-tight">
                      AI-Driven Custom Care Plans
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg mt-3">
                      Our intelligent system analyzes your plant's species, environment, and your care habits to generate a unique plan. As your plant grows and seasons change, the AI dynamically adjusts watering schedules, fertilizer recommendations, and light exposure, ensuring optimal health and vibrant growth.
                    </p>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-full"
                          style={{ backgroundColor: `${themeColors.sage}20` }}
                        >
                          <Heart size={24} style={{ color: themeColors.sage }} />
                        </div>
                        <p className="text-foreground font-semibold">Customized Plans</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-full"
                          style={{ backgroundColor: `${themeColors.sage}20` }}
                        >
                          <Sparkles size={24} style={{ color: themeColors.sage }} />
                        </div>
                        <p className="text-foreground font-semibold">Dynamic Adaptation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex justify-center pb-12 md:pb-16">
                <div className="flex flex-col sm:flex-row w-full max-w-md gap-4 px-4">
                  <button 
                    className="flex w-full items-center justify-center rounded-full h-12 px-6 text-base font-bold tracking-wide shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      backgroundColor: themeColors.sage, 
                      color: themeColors.primaryForeground 
                    }}
                  >
                    <span className="truncate">Register</span>
                  </button>
                  <button className="flex w-full items-center justify-center rounded-full h-12 px-6 bg-secondary text-secondary-foreground text-base font-bold tracking-wide shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 border border-border">
                    <span className="truncate">Log In</span>
                  </button>
                </div>
              </div>

              {/* Bottom Cards Section */}
              <div className="pb-12 md:pb-16">
                <ScrollArea.Root className="w-full overflow-hidden">
                  <ScrollArea.Viewport className="w-full overflow-x-auto">
                    <div className="flex items-stretch p-4 gap-6 w-max">
                      <ImageCard
                        title="Smart Care Reminders"
                        description="Never miss a watering or feeding again with our smart reminders."
                        imageUrl="https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=800"
                      />
                      <ImageCard
                        title="Plant Identification"
                        description="Identify your plants instantly with our AI-powered scanner."
                        imageUrl="https://images.pexels.com/photos/1131458/pexels-photo-1131458.jpeg?auto=compress&cs=tinysrgb&w=800"
                      />
                      <ImageCard
                        title="Community Support"
                        description="Connect with fellow plant lovers for tips and inspiration."
                        imageUrl="https://images.pexels.com/photos/1128797/pexels-photo-1128797.jpeg?auto=compress&cs=tinysrgb&w=800"
                      />
                    </div>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar
                    className="flex select-none touch-none p-0.5 bg-blackA3 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                    orientation="horizontal"
                  >
                    <ScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
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