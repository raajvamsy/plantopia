'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useThemeColors } from '@/lib/theme/hooks';
import { PasswordStrength } from '@/components/ui/password-strength';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function PasswordDemoPage() {
  const themeColors = useThemeColors();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const testPasswords = [
    'weak',
    'password123',
    'MyPassword123',
    'MyStr0ngP@ssw0rd!',
    'ExtremelySecure123!@#',
    'Perfect100%Score456!@#$'
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Password Strength Demo</h1>
          <p className="text-muted-foreground">
            Test the password strength component with different password examples
          </p>
        </div>

        {/* Interactive Password Input */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Try Your Own Password</h2>
          
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "block w-full rounded-full border-2 px-5 py-4 pr-12 text-lg transition duration-300 relative z-10",
                "bg-muted/50 text-foreground placeholder-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                "border-transparent focus:border-primary focus:ring-primary",
              )}
              placeholder="Enter a password to test..."
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-4 z-20"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <EyeIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
          
          <PasswordStrength password={password} className="mt-2" />
        </div>

        {/* Example Passwords */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Example Passwords</h2>
          <p className="text-muted-foreground mb-6">Click any example to test it:</p>
          
          <div className="space-y-4">
            {testPasswords.map((testPassword, index) => (
              <div key={index} className="space-y-2">
                <button
                  onClick={() => setPassword(testPassword)}
                  className="w-full text-left p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono text-foreground">
                      {testPassword}
                    </code>
                    <span className="text-xs text-muted-foreground">
                      Click to test
                    </span>
                  </div>
                  <PasswordStrength password={testPassword} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Password Strength Criteria</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Scoring System:</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Base Points:</h4>
                  <ul className="space-y-1 ml-2">
                    <li className="flex justify-between">
                      <span>8+ characters</span>
                      <span className="font-mono">+25 points</span>
                    </li>
                    <li className="flex justify-between">
                      <span>6-7 characters</span>
                      <span className="font-mono">+5 points</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Lowercase letters</span>
                      <span className="font-mono">+15 points</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Uppercase letters</span>
                      <span className="font-mono">+15 points</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Numbers</span>
                      <span className="font-mono">+15 points</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Special characters</span>
                      <span className="font-mono">+20 points</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Bonus Points:</h4>
                  <ul className="space-y-1 ml-2">
                    <li className="flex justify-between">
                      <span>16+ characters</span>
                      <span className="font-mono">+10 bonus</span>
                    </li>
                    <li className="flex justify-between">
                      <span>All 4 char types</span>
                      <span className="font-mono">+15 bonus</span>
                    </li>
                    <li className="flex justify-between">
                      <span>3 char types</span>
                      <span className="font-mono">+10 bonus</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Complex patterns</span>
                      <span className="font-mono">+5 bonus</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">Strength Levels:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">0-19: Very Weak</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">20-39: Weak</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">40-59: Fair</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">60-79: Good</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">80-100: Strong</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Main */}
        <div className="text-center">
          <Link
            href="/"
            className={cn(
              "inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105",
              "text-white shadow-lg"
            )}
            style={{ backgroundColor: themeColors.sage }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
