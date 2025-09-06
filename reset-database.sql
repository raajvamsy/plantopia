-- Complete Database Reset for Plantopia
-- This script will clean up everything and recreate the database properly

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow user profile creation" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Service role can select users" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;

DROP POLICY IF EXISTS "Users can view their own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can update their own achievements" ON public.achievements;
DROP POLICY IF EXISTS "achievements_select_policy" ON public.achievements;
DROP POLICY IF EXISTS "achievements_insert_policy" ON public.achievements;
DROP POLICY IF EXISTS "achievements_update_policy" ON public.achievements;

-- Drop all other policies (add more if needed)
DROP POLICY IF EXISTS "Users can view their own plants" ON public.plants;
DROP POLICY IF EXISTS "Users can insert their own plants" ON public.plants;
DROP POLICY IF EXISTS "Users can update their own plants" ON public.plants;
DROP POLICY IF EXISTS "Users can delete their own plants" ON public.plants;

DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

DROP POLICY IF EXISTS "Anyone can view likes" ON public.likes;
DROP POLICY IF EXISTS "Authenticated users can create likes" ON public.likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.likes;

DROP POLICY IF EXISTS "Anyone can view followers" ON public.followers;
DROP POLICY IF EXISTS "Authenticated users can create follows" ON public.followers;
DROP POLICY IF EXISTS "Users can delete their own follows" ON public.followers;

DROP POLICY IF EXISTS "Users can view messages they sent or received" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages they sent" ON public.messages;

DROP POLICY IF EXISTS "Users can view their own plant care logs" ON public.plant_care_logs;
DROP POLICY IF EXISTS "Users can create their own plant care logs" ON public.plant_care_logs;

-- Temporarily disable RLS on all tables
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_care_logs DISABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies for development
-- Users table - allow all operations for now
CREATE POLICY "users_all_policy" ON public.users
    FOR ALL USING (true) WITH CHECK (true);

-- Achievements table - allow all operations for now
CREATE POLICY "achievements_all_policy" ON public.achievements
    FOR ALL USING (true) WITH CHECK (true);

-- Plants table - allow all operations for now
CREATE POLICY "plants_all_policy" ON public.plants
    FOR ALL USING (true) WITH CHECK (true);

-- Tasks table - allow all operations for now
CREATE POLICY "tasks_all_policy" ON public.tasks
    FOR ALL USING (true) WITH CHECK (true);

-- Posts table - allow all operations for now
CREATE POLICY "posts_all_policy" ON public.posts
    FOR ALL USING (true) WITH CHECK (true);

-- Comments table - allow all operations for now
CREATE POLICY "comments_all_policy" ON public.comments
    FOR ALL USING (true) WITH CHECK (true);

-- Likes table - allow all operations for now
CREATE POLICY "likes_all_policy" ON public.likes
    FOR ALL USING (true) WITH CHECK (true);

-- Followers table - allow all operations for now
CREATE POLICY "followers_all_policy" ON public.followers
    FOR ALL USING (true) WITH CHECK (true);

-- Messages table - allow all operations for now
CREATE POLICY "messages_all_policy" ON public.messages
    FOR ALL USING (true) WITH CHECK (true);

-- Plant care logs table - allow all operations for now
CREATE POLICY "plant_care_logs_all_policy" ON public.plant_care_logs
    FOR ALL USING (true) WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_care_logs ENABLE ROW LEVEL SECURITY;

-- Test the setup
SELECT 'Database reset and policies updated successfully!' as status;
SELECT 'RLS is enabled but policies are permissive for development' as note;
SELECT 'Remember to tighten security policies before production!' as warning;
