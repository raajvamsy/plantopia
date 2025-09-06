-- Fix RLS Policies for User Creation
-- Run this in your Supabase SQL Editor after the main schema

-- First, let's check what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users';

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Service role can select users" ON public.users;

-- Create a better policy that allows user creation during signup
CREATE POLICY "Allow user profile creation" ON public.users
    FOR INSERT WITH CHECK (
        -- Allow if the user is inserting their own profile (auth.uid() = id)
        auth.uid() = id
        OR
        -- Allow if no auth.uid() (during signup process)
        auth.uid() IS NULL
    );

-- Also allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Alternative approach: Temporarily disable RLS for users table during development
-- Uncomment the line below if you want to disable RLS temporarily
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS (uncomment when you want to re-enable security)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Test the policies
SELECT 'RLS Policies updated successfully!' as status;
