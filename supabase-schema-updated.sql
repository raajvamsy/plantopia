-- Updated Supabase Schema for Plantopia PWA
-- This schema fixes inconsistencies with TypeScript interfaces and adds AI endpoints preparation

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS public.ai_interactions CASCADE;
DROP TABLE IF EXISTS public.plant_care_logs CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.plants CASCADE;
DROP TABLE IF EXISTS public.followers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS task_type CASCADE;
DROP TYPE IF EXISTS plant_category CASCADE;
DROP TYPE IF EXISTS ai_interaction_type CASCADE;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_post_counts() CASCADE;
DROP FUNCTION IF EXISTS create_user_achievements() CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom ENUM types (FIXED: Added pest_control to task_type)
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_type AS ENUM ('watering', 'fertilizing', 'pruning', 'repotting', 'pest_control', 'other');
CREATE TYPE plant_category AS ENUM ('indoor', 'outdoor', 'succulent', 'herb', 'flower', 'vegetable', 'tree', 'other');
CREATE TYPE ai_interaction_type AS ENUM ('plant_identification', 'care_advice', 'disease_diagnosis', 'general_chat');

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_online BOOLEAN DEFAULT FALSE,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    water_droplets INTEGER DEFAULT 100
);

-- Plants table
CREATE TABLE IF NOT EXISTS public.plants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species TEXT,
    category plant_category NOT NULL,
    image_url TEXT,
    health INTEGER DEFAULT 100 CHECK (health >= 0 AND health <= 100),
    moisture INTEGER DEFAULT 50 CHECK (moisture >= 0 AND moisture <= 100),
    sunlight INTEGER DEFAULT 50 CHECK (sunlight >= 0 AND sunlight <= 100),
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    planted_date DATE,
    last_watered TIMESTAMP WITH TIME ZONE,
    last_fertilized TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table (FIXED: Updated task_type enum)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plant_id UUID REFERENCES public.plants(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    type task_type NOT NULL,
    status task_status DEFAULT 'pending',
    priority task_priority DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Followers table
CREATE TABLE IF NOT EXISTS public.followers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Messages table (FIXED: Added updated_at column)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plant care logs table
CREATE TABLE IF NOT EXISTS public.plant_care_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NEW: AI Interactions table (for future Gemini 2.5 Flash Lite integration)
CREATE TABLE IF NOT EXISTS public.ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plant_id UUID REFERENCES public.plants(id) ON DELETE SET NULL,
    interaction_type ai_interaction_type NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    image_url TEXT, -- For plant identification with images
    metadata JSONB, -- Additional data like plant species detected, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_plants_user_id ON public.plants(user_id);
CREATE INDEX IF NOT EXISTS idx_plants_category ON public.plants(category);
CREATE INDEX IF NOT EXISTS idx_plants_archived ON public.plants(is_archived);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_plant_id ON public.tasks(plant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON public.followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON public.followers(following_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON public.achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_plant_care_logs_plant_id ON public.plant_care_logs(plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_care_logs_user_id ON public.plant_care_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_type ON public.ai_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON public.ai_interactions(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (FIXED: Added messages table)
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON public.plants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update post counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'likes' THEN
            UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_TABLE_NAME = 'comments' THEN
            UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF TG_TABLE_NAME = 'likes' THEN
            UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        ELSIF TG_TABLE_NAME = 'comments' THEN
            UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers for post counts
CREATE TRIGGER update_likes_count AFTER INSERT OR DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION update_post_counts();
CREATE TRIGGER update_comments_count AFTER INSERT OR DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Create trigger for default achievements
CREATE OR REPLACE FUNCTION create_user_achievements()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.achievements (user_id, achievement_type, title, description, icon, color) VALUES
    (NEW.id, 'first_plant', 'First Plant', 'Added your first plant to your garden', '🌱', '#4ade80'),
    (NEW.id, 'plant_care', 'Plant Care', 'Completed your first plant care task', '💧', '#60a5fa'),
    (NEW.id, 'community', 'Community Member', 'Joined the plant lovers community', '👥', '#f59e0b'),
    (NEW.id, 'hydration_hero', 'Hydration Hero', 'Watered plants for 30 consecutive days', '💧', '#7DB8E8'),
    (NEW.id, 'sun_worshipper', 'Sun Worshipper', 'Optimized sunlight for 10 plants', '☀️', '#FFD700'),
    (NEW.id, 'pest_pro', 'Pest Pro', 'Successfully treated pest issues', '🛡️', '#9CB86F'),
    (NEW.id, 'growth_spurt', 'Growth Spurt', 'Achieved rapid plant growth', '📈', '#B8E6B8'),
    (NEW.id, 'collector', 'Collector', 'Collect 50+ different plant species', '🏆', '#FFB84D');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_user_achievements_trigger AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION create_user_achievements();

-- Enable Row Level Security (RLS)
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
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users (FIXED: More permissive for auth)
-- Note: These will be replaced by fix-rls-policies.sql for proper auth flow
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- TEMPORARY: Allow user creation (will be replaced by fix script)
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (true);

-- Allow service role operations
CREATE POLICY "Service role can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can select users" ON public.users
    FOR SELECT USING (true);

-- Create RLS policies for plants
CREATE POLICY "Users can view their own plants" ON public.plants
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plants" ON public.plants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plants" ON public.plants
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plants" ON public.plants
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for posts (public read, authenticated write)
CREATE POLICY "Anyone can view posts" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for comments
CREATE POLICY "Anyone can view comments" ON public.comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for likes
CREATE POLICY "Anyone can view likes" ON public.likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create likes" ON public.likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON public.likes
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for followers
CREATE POLICY "Anyone can view followers" ON public.followers
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create follows" ON public.followers
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" ON public.followers
    FOR DELETE USING (auth.uid() = follower_id);

-- Create RLS policies for messages
CREATE POLICY "Users can view messages they sent or received" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they sent" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Create RLS policies for achievements (FIXED: Added INSERT policy)
CREATE POLICY "Users can view their own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" ON public.achievements
    FOR UPDATE USING (auth.uid() = user_id);

-- CRITICAL: Allow achievement creation for trigger function
CREATE POLICY "Enable achievement creation" ON public.achievements
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for plant care logs
CREATE POLICY "Users can view their own plant care logs" ON public.plant_care_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own plant care logs" ON public.plant_care_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for AI interactions
CREATE POLICY "Users can view their own AI interactions" ON public.ai_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI interactions" ON public.ai_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI interactions" ON public.ai_interactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create views for common queries
CREATE OR REPLACE VIEW public.user_plant_stats AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(p.id) as total_plants,
    COUNT(CASE WHEN p.health >= 80 THEN 1 END) as healthy_plants,
    COUNT(CASE WHEN p.moisture < 30 THEN 1 END) as plants_needing_water,
    COUNT(CASE WHEN p.health < 70 THEN 1 END) as plants_needing_attention,
    COALESCE(AVG(p.health), 0) as average_health
FROM public.users u
LEFT JOIN public.plants p ON u.id = p.user_id AND p.is_archived = false
GROUP BY u.id, u.username;

CREATE OR REPLACE VIEW public.user_task_stats AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_tasks,
    COUNT(CASE WHEN t.status = 'pending' AND t.due_date < NOW() THEN 1 END) as overdue_tasks
FROM public.users u
LEFT JOIN public.tasks t ON u.id = t.user_id
GROUP BY u.id, u.username;

-- Insert sample AI interaction types for future reference
COMMENT ON TYPE ai_interaction_type IS 'Types of AI interactions: plant_identification, care_advice, disease_diagnosis, general_chat';
COMMENT ON TABLE public.ai_interactions IS 'Stores AI interactions for Gemini 2.5 Flash Lite integration';
COMMENT ON COLUMN public.ai_interactions.confidence_score IS 'AI confidence score from 0.00 to 1.00';
COMMENT ON COLUMN public.ai_interactions.metadata IS 'Additional JSON data like detected species, care recommendations, etc.';
