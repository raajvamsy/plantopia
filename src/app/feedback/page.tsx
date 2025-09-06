'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MobilePageWrapper } from '@/components/ui/mobile-page-wrapper';
import PlantopiaHeader from '@/components/ui/plantopia-header';
import { cn } from '@/lib/utils';

type FeedbackType = 'General Feedback' | 'Suggestion' | 'Bug Report' | 'Feature Request';

export default function FeedbackPage() {
  const router = useRouter();
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('General Feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!message.trim()) {
      setError('Please enter your feedback message.');
      return;
    }

    if (message.trim().length < 10) {
      setError('Please provide more detailed feedback (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would typically send the feedback to your backend
      // For now, we'll just simulate a successful submission
      const feedbackData = {
        type: feedbackType,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };
      
      console.log('Submitting feedback:', feedbackData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message or redirect
      alert('Thank you for your feedback! We appreciate your input and will review it carefully.');
      setMessage('');
      setFeedbackType('General Feedback');
      
      // Optionally redirect back to previous page after a short delay
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setError('Failed to submit feedback. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNeedHelp = () => {
    router.push('/help');
  };

  return (
    <MobilePageWrapper hasBottomNav={false} className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 sm:h-16 items-center justify-between whitespace-nowrap border-b border-secondary/30 bg-background/95 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd" />
              <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd" />
            </svg>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">Plantopia</h1>
              <span className="text-xs sm:text-sm text-muted-foreground">Feedback</span>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNeedHelp}
          className="rounded-full"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8">
          <Card className="rounded-2xl bg-secondary/40 backdrop-blur-sm shadow-2xl shadow-black/20 border-secondary/50">
            <CardContent className="p-6 sm:p-8 space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Share Your Thoughts
                </h2>
                <p className="text-lg text-muted-foreground">
                  We&apos;d love to hear from you! Help us make Plantopia better.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback Type */}
                <div className="space-y-2">
                  <Label htmlFor="feedback-type" className="text-sm font-semibold text-foreground">
                    Feedback Type
                  </Label>
                  <select
                    id="feedback-type"
                    name="feedback-type"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                    className={cn(
                      "w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground",
                      "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      "text-sm ring-offset-background"
                    )}
                  >
                    <option value="General Feedback">General Feedback</option>
                    <option value="Suggestion">Suggestion</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="feedback-message" className="text-sm font-semibold text-foreground">
                    Your Message
                  </Label>
                  <Textarea
                    id="feedback-message"
                    name="feedback-message"
                    placeholder="Tell us what's on your mind..."
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (error) setError(''); // Clear error when user starts typing
                    }}
                    className={cn(
                      "resize-none rounded-xl text-base min-h-[120px]",
                      error && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {error && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      {error}
                    </p>
                  )}
                </div>

                {/* Need Help Link */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={handleNeedHelp}
                      className="font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Need help?
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="sage"
                  size="lg"
                  disabled={isSubmitting || !message.trim()}
                  className={cn(
                    "w-full rounded-full text-base font-bold transition-all duration-200",
                    "hover:scale-105 hover:shadow-lg shadow-md",
                    "disabled:scale-100 disabled:shadow-sm",
                    "bg-primary text-white hover:bg-primary/90",
                    "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  )}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </MobilePageWrapper>
  );
}
