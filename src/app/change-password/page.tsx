'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BottomNavigation from '@/components/ui/bottom-navigation';

export default function ChangePasswordPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd" />
            <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd" />
          </svg>
          <h1 className="text-xl font-bold tracking-tight">Plantopia</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-md">
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
            <p className="mt-2 text-muted-foreground">Update your account password</p>
          </header>

          {/* Password Form */}
          <form className="space-y-6">
            <div>
              <label className="block text-base font-medium text-foreground mb-2" htmlFor="current-password">
                Current Password
              </label>
              <input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border-0 bg-secondary px-4 py-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-0"
                placeholder="Enter your current password"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-foreground mb-2" htmlFor="new-password">
                New Password
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border-0 bg-secondary px-4 py-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-0"
                placeholder="Enter your new password"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-foreground mb-2" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border-0 bg-secondary px-4 py-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-0"
                placeholder="Confirm your new password"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-4 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={(e) => {
                  e.preventDefault();
                  // Add password change logic here
                  router.back();
                }}
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
