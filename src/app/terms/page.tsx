'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, FileText, Shield, Info, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobilePageWrapper } from '@/components/ui/mobile-page-wrapper';

export default function TermsPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <MobilePageWrapper hasBottomNav={false} className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-secondary/30 bg-background/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <svg className="h-8 w-8 text-primary flex-shrink-0" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd" />
            <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd" />
          </svg>
          <h1 className="text-xl font-bold tracking-tighter">Plantopia</h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="rounded-full bg-secondary/50 hover:bg-secondary/80"
        >
          <span className="sr-only">Close</span>
          <X className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-4">
              Terms of Service &amp; Privacy Policy
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Welcome to Plantopia! By using our app, you agree to these Terms of Service and our Privacy Policy. Please read them carefully.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {/* Terms of Service Section */}
            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-primary mb-4">
                <FileText className="h-7 w-7" />
                <span>Terms of Service</span>
              </h3>
              <div className="rounded-2xl bg-secondary/40 backdrop-blur-sm p-6 border border-secondary/50">
                <p className="text-base text-muted-foreground leading-relaxed">
                  These terms govern your use of Plantopia. You must be at least 13 years old to use our app. 
                  We grant you a limited, non-exclusive, non-transferable license to use the app for personal, 
                  non-commercial purposes. You agree not to misuse the app or its content. We reserve the right 
                  to modify or terminate the app or your access to it at any time.
                </p>
              </div>
            </section>

            {/* Privacy Policy Section */}
            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-primary mb-4">
                <Shield className="h-7 w-7" />
                <span>Privacy Policy</span>
              </h3>
              <div className="rounded-2xl bg-secondary/40 backdrop-blur-sm p-6 border border-secondary/50">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your 
                  information. We collect information you provide, such as your name and email, and usage data. 
                  We use this information to provide and improve the app, communicate with you, and personalize 
                  your experience. We do not share your personal information with third parties except as 
                  necessary to provide the app or as required by law. We take reasonable measures to protect 
                  your information, but no method of transmission over the internet is completely secure.
                </p>
              </div>
            </section>

            {/* Changes to Terms Section */}
            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-primary mb-4">
                <Info className="h-7 w-7" />
                <span>Changes to Terms and Policy</span>
              </h3>
              <div className="rounded-2xl bg-secondary/40 backdrop-blur-sm p-6 border border-secondary/50">
                <p className="text-base text-muted-foreground leading-relaxed">
                  We may update these terms and policies from time to time. We will notify you of any 
                  significant changes. Your continued use of the app after such changes constitutes your 
                  acceptance of the new terms and policies.
                </p>
              </div>
            </section>

            {/* Contact Us Section */}
            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-primary mb-4">
                <MessageCircle className="h-7 w-7" />
                <span>Contact Us</span>
              </h3>
              <div className="rounded-2xl bg-secondary/40 backdrop-blur-sm p-6 border border-secondary/50">
                <p className="text-base text-muted-foreground leading-relaxed">
                  If you have any questions about these terms or policies, please contact us at{' '}
                  <a 
                    className="font-semibold text-primary underline hover:text-primary/80 transition-colors" 
                    href="mailto:support@plantopia.app"
                  >
                    support@plantopia.app
                  </a>.
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </main>
    </MobilePageWrapper>
  );
}
