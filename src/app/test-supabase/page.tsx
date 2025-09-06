'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { PlantService, UserService } from '@/lib/supabase/services';
import { supabase } from '@/lib/supabase/config';

export default function TestSupabasePage() {
  const { user, isAuthenticated, login, signup } = useSupabaseAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Basic connection
      addResult('Testing Supabase connection...');
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        addResult(`❌ Connection failed: ${error.message}`);
      } else {
        addResult('✅ Supabase connection successful');
      }

      // Test 2: Auth status
      addResult('Testing authentication status...');
      if (isAuthenticated) {
        addResult(`✅ User authenticated: ${user?.username}`);
      } else {
        addResult('ℹ️ User not authenticated');
      }

      // Test 3: Service layer
      addResult('Testing service layer...');
      if (user) {
        try {
          const plants = await PlantService.getUserPlants(user.id);
          addResult(`✅ PlantService working: ${plants.length} plants found`);
        } catch (err) {
          addResult(`❌ PlantService error: ${err}`);
        }
      } else {
        addResult('ℹ️ Skipping service tests - no user');
      }

    } catch (error) {
      addResult(`❌ Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAuth = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing authentication...');
      
      // Test signup
      addResult('Testing signup...');
      const signupResult = await signup('test@example.com', 'testpassword123', 'testuser', 'Test User');
      if (signupResult.success) {
        addResult('✅ Signup successful');
      } else {
        addResult(`ℹ️ Signup result: ${signupResult.error}`);
      }

      // Test login
      addResult('Testing login...');
      const loginResult = await login('test@example.com', 'testpassword123');
      if (loginResult.success) {
        addResult('✅ Login successful');
      } else {
        addResult(`ℹ️ Login result: ${loginResult.error}`);
      }

    } catch (error) {
      addResult(`❌ Auth test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Supabase Integration Test</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex gap-4">
            <button
              onClick={testSupabaseConnection}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            
            <button
              onClick={testAuth}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Authentication'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-gray-100 rounded-lg p-4 min-h-[200px]">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click a test button above to start.</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Authentication:</span>
              <span className={`px-2 py-1 rounded text-sm ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
            
            {user && (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-medium">User ID:</span>
                  <span className="text-sm text-gray-600">{user.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Username:</span>
                  <span className="text-sm text-gray-600">{user.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Update your <code className="bg-blue-100 px-1 rounded">.env.local</code> file with Supabase credentials</li>
            <li>Run the SQL schema in your Supabase project</li>
            <li>Test the connection using the button above</li>
            <li>Start building real features with your database!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
