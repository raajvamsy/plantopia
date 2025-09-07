-- Fix RLS Policies for User Creation and Authentication
-- Run this in your Supabase SQL Editor after the main schema

-- First, let's check what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users';

-- Drop ALL existing user policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Service role can select users" ON public.users;
DROP POLICY IF EXISTS "Allow user profile creation" ON public.users;

-- CRITICAL: Allow public user creation for Supabase Auth
-- This is essential for signup to work properly
CREATE POLICY "Enable public user creation" ON public.users
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Allow public read access for community features (usernames, avatars, etc.)
-- This is needed for displaying user info in posts, comments, etc.
CREATE POLICY "Enable public user read access" ON public.users
    FOR SELECT USING (true);

-- COMPREHENSIVE FIX: Add missing policies for all tables

-- ===== ACHIEVEMENTS TABLE =====
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can update their own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Enable achievement creation" ON public.achievements;

-- Allow achievement creation (needed for trigger function)
CREATE POLICY "Enable achievement creation" ON public.achievements
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own achievements
CREATE POLICY "Users can view their own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own achievements (mark as completed)
CREATE POLICY "Users can update their own achievements" ON public.achievements
    FOR UPDATE USING (auth.uid() = user_id);

-- ===== PLANT CARE LOGS TABLE =====
-- Missing UPDATE and DELETE policies
DROP POLICY IF EXISTS "Users can view their own plant care logs" ON public.plant_care_logs;
DROP POLICY IF EXISTS "Users can create their own plant care logs" ON public.plant_care_logs;

CREATE POLICY "Users can view their own plant care logs" ON public.plant_care_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own plant care logs" ON public.plant_care_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- MISSING: Allow users to update their plant care logs
CREATE POLICY "Users can update their own plant care logs" ON public.plant_care_logs
    FOR UPDATE USING (auth.uid() = user_id);

-- MISSING: Allow users to delete their plant care logs
CREATE POLICY "Users can delete their own plant care logs" ON public.plant_care_logs
    FOR DELETE USING (auth.uid() = user_id);

-- ===== AI INTERACTIONS TABLE =====
-- Missing DELETE policy
DROP POLICY IF EXISTS "Users can view their own AI interactions" ON public.ai_interactions;
DROP POLICY IF EXISTS "Users can create their own AI interactions" ON public.ai_interactions;
DROP POLICY IF EXISTS "Users can update their own AI interactions" ON public.ai_interactions;

CREATE POLICY "Users can view their own AI interactions" ON public.ai_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI interactions" ON public.ai_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI interactions" ON public.ai_interactions
    FOR UPDATE USING (auth.uid() = user_id);

-- MISSING: Allow users to delete their AI interactions
CREATE POLICY "Users can delete their own AI interactions" ON public.ai_interactions
    FOR DELETE USING (auth.uid() = user_id);

-- ===== LIKES TABLE =====
-- Missing UPDATE policy (though rarely needed for likes)
DROP POLICY IF EXISTS "Anyone can view likes" ON public.likes;
DROP POLICY IF EXISTS "Authenticated users can create likes" ON public.likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.likes;

CREATE POLICY "Anyone can view likes" ON public.likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create likes" ON public.likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON public.likes
    FOR DELETE USING (auth.uid() = user_id);

-- ===== FOLLOWERS TABLE =====
-- Missing UPDATE policy (though rarely needed for follows)
DROP POLICY IF EXISTS "Anyone can view followers" ON public.followers;
DROP POLICY IF EXISTS "Authenticated users can create follows" ON public.followers;
DROP POLICY IF EXISTS "Users can delete their own follows" ON public.followers;

CREATE POLICY "Anyone can view followers" ON public.followers
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create follows" ON public.followers
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" ON public.followers
    FOR DELETE USING (auth.uid() = follower_id);

-- ===== MESSAGES TABLE =====
-- Missing DELETE policy
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages they sent" ON public.messages;

CREATE POLICY "Users can view messages they sent or received" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they sent" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- MISSING: Allow users to delete messages they sent
CREATE POLICY "Users can delete messages they sent" ON public.messages
    FOR DELETE USING (auth.uid() = sender_id);

-- Alternative: If you want stricter security, comment out the public policies above
-- and uncomment the lines below to temporarily disable RLS during development
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.plant_care_logs DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.ai_interactions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Test the policies
SELECT 'RLS Policies updated successfully for all tables!' as status;

-- Verify the new policies for all tables
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('users', 'achievements', 'plant_care_logs', 'ai_interactions', 'messages', 'likes', 'followers')
ORDER BY tablename, policyname;

-- Summary of what was fixed:
SELECT 'SUMMARY: Added missing policies:' as summary
UNION ALL SELECT '- plant_care_logs: UPDATE, DELETE policies'
UNION ALL SELECT '- ai_interactions: DELETE policy'  
UNION ALL SELECT '- messages: DELETE policy'
UNION ALL SELECT '- achievements: Fixed INSERT policy for triggers'
UNION ALL SELECT '- users: Fixed INSERT policy for signup';
