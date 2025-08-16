'use client';

import React from 'react';
import PlantopiaHeader from '@/components/ui/plantopia-header';
import { MobilePageWrapper } from '@/components/ui/mobile-page-wrapper';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqData = {
  gettingStarted: {
    title: 'Getting Started',
    color: 'text-sage',
    items: [
      {
        question: 'How do I create an account?',
        answer: 'To create an account, simply download the app from your app store and follow the on-screen instructions. You\'ll need to provide a valid email address and create a secure password.'
      },
      {
        question: 'How do I add my first plant?',
        answer: 'Adding a new plant is easy! Go to your garden, tap the \'+\' icon, and search for your plant species. You can also give your plant a unique nickname.'
      },
      {
        question: 'What are the different plant types?',
        answer: 'Our app supports a wide variety of plants, from common houseplants to exotic flowers. Each plant has a detailed profile with specific care instructions.'
      }
    ]
  },
  plantCare: {
    title: 'Plant Care',
    color: 'text-fern',
    items: [
      {
        question: 'How do I water my plants?',
        answer: 'Watering your plants is crucial for their health. The app will provide personalized watering schedules based on your plant\'s needs and your local weather conditions. You\'ll receive notifications when it\'s time to water your plants.'
      },
      {
        question: 'How do I fertilize my plants?',
        answer: 'Fertilizing provides essential nutrients. The app will suggest the right type of fertilizer and frequency for each of your plants to ensure they thrive.'
      },
      {
        question: 'How do I repot my plants?',
        answer: 'When your plant outgrows its pot, it\'s time for a new home. We\'ll guide you through the process, from choosing the right pot size to the best soil mix.'
      }
    ]
  },
  troubleshooting: {
    title: 'Troubleshooting',
    color: 'text-moss',
    items: [
      {
        question: 'My plant is not growing, what should I do?',
        answer: 'If your plant is not growing, there could be several reasons. Ensure it\'s receiving adequate sunlight, water, and nutrients. Check for any signs of pests or diseases. If the problem persists, consult a gardening expert or contact our support team.'
      },
      {
        question: 'I\'m having trouble with the app, what should I do?',
        answer: 'We\'re here to help! Try restarting the app first. If that doesn\'t work, check our status page for any known issues. You can also report a bug through the app\'s settings.'
      },
      {
        question: 'How do I contact support?',
        answer: 'You can reach our friendly support team by emailing support@plantopia.app or by using the \'Contact Support\' feature in the app. We aim to respond within 24 hours.'
      }
    ]
  }
};

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  return (
    <details className="group" {...(defaultOpen && { open: true })}>
      <summary className="flex cursor-pointer items-start justify-between gap-4 list-none p-4 sm:p-6 hover:bg-muted/50 transition-colors">
        <p className="text-foreground font-semibold text-sm sm:text-base text-left leading-snug pr-2">
          {question}
        </p>
        <div className="text-primary group-open:rotate-180 transition-transform duration-300 flex-shrink-0 mt-0.5">
          <ChevronDown className="h-5 w-5" />
        </div>
      </summary>
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed text-left">
          {answer}
        </p>
      </div>
    </details>
  );
}

interface FAQSectionProps {
  title: string;
  color: string;
  items: Array<{ question: string; answer: string }>;
  defaultOpenFirst?: boolean;
}

function FAQSection({ title, color, items, defaultOpenFirst = false }: FAQSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className={`text-xl sm:text-2xl font-bold leading-tight tracking-tight ${color} text-left`}>
        {title}
      </h3>
      <div className="flex flex-col bg-card/50 border border-border rounded-lg divide-y divide-border overflow-hidden">
        {items.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            defaultOpen={defaultOpenFirst && index === 0}
          />
        ))}
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <>
      <PlantopiaHeader 
        currentPage="settings" 
        customTitle="Help & FAQs"
      />
      
      <MobilePageWrapper className="max-w-4xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-8 sm:mb-10 pt-4 sm:pt-6">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground mb-4 px-4">
              Help & FAQs
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed px-4">
              Your guide to growing healthy and happy plants. Find answers, tips, and troubleshooting advice right here.
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8 sm:space-y-12 pb-8">
            <FAQSection
              title={faqData.gettingStarted.title}
              color={faqData.gettingStarted.color}
              items={faqData.gettingStarted.items}
              defaultOpenFirst={true}
            />
            
            <FAQSection
              title={faqData.plantCare.title}
              color={faqData.plantCare.color}
              items={faqData.plantCare.items}
            />
            
            <FAQSection
              title={faqData.troubleshooting.title}
              color={faqData.troubleshooting.color}
              items={faqData.troubleshooting.items}
            />
          </div>

          {/* Contact Section */}
          <div className="mt-12 mb-8 p-6 sm:p-8 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Need More Help?
            </h4>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <button 
              onClick={() => window.location.href = 'mailto:support@plantopia.app?subject=Help%20Request&body=Please%20describe%20your%20issue%20here...'}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-3 text-sm sm:text-base font-medium"
            >
              Contact Support
            </button>
          </div>
        </div>
      </MobilePageWrapper>
    </>
  );
}
