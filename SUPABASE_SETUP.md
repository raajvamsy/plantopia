# Supabase Integration Setup for Plantopia PWA

This guide will help you set up Supabase as the backend database for your Plantopia PWA application.

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `plantopia-pwa`
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

2. Replace the placeholder values with your actual Supabase credentials

### 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content of `supabase-schema.sql`
3. Paste it into the SQL editor and click "Run"
4. This will create all the necessary tables, indexes, and security policies

### 5. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`
   - **Enable email confirmations**: Optional (recommended for production)

## 🗄️ Database Schema Overview

The database includes the following main tables:

### Core Tables
- **`users`** - User profiles and authentication data
- **`plants`** - Plant information and health metrics
- **`tasks`** - Plant care tasks and reminders
- **`posts`** - Community posts and content
- **`comments`** - Comments on posts
- **`likes`** - Post likes and reactions
- **`followers`** - User following relationships
- **`messages`** - Direct messages between users
- **`achievements`** - Gamification achievements
- **`plant_care_logs`** - Plant care activity history

### Key Features
- **Row Level Security (RLS)** - Ensures users can only access their own data
- **Automatic timestamps** - Created/updated timestamps are automatically managed
- **Referential integrity** - Foreign key constraints maintain data consistency
- **Performance indexes** - Optimized queries for common operations

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only view/edit their own data
- Public read access for community posts
- Secure messaging between users
- Protected user profiles

### Authentication
- Supabase Auth handles user registration/login
- Secure password hashing
- JWT token management
- Session persistence

## 📱 Integration with Your App

### 1. Update Layout.tsx

Replace the existing `AuthProvider` with `SupabaseAuthProvider`:

```tsx
// src/app/layout.tsx
import { SupabaseAuthProvider } from '@/lib/auth/supabase-auth';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PlantopiaThemeProvider defaultMode="light">
          <LoadingProvider>
            <SupabaseAuthProvider>
              <NavigationLoader />
              {children}
            </SupabaseAuthProvider>
          </LoadingProvider>
        </PlantopiaThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Update Components

Replace mock data with Supabase service calls:

```tsx
// Example: Dashboard page
import { PlantService, TaskService } from '@/lib/supabase/services';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';

export default function Dashboard() {
  const { user } = useSupabaseAuth();
  const [plants, setPlants] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    const [plantsData, tasksData] = await Promise.all([
      PlantService.getUserPlants(user.id),
      TaskService.getUserTasks(user.id)
    ]);
    
    setPlants(plantsData);
    setTasks(tasksData);
  };

  // ... rest of component
}
```

### 3. Available Services

The following services are available for data operations:

- **`UserService`** - User management and profiles
- **`PlantService`** - Plant CRUD operations and care
- **`TaskService`** - Task management and scheduling
- **`CommunityService`** - Posts, comments, and social features
- **`MessageService`** - Direct messaging
- **`AchievementService`** - Gamification system

## 🧪 Testing the Integration

### 1. Start Your Development Server
```bash
npm run dev
```

### 2. Test Authentication
- Try signing up with a new account
- Test login/logout functionality
- Verify user profile creation

### 3. Test Data Operations
- Create a new plant
- Add tasks
- Create community posts
- Test messaging

### 4. Check Database
- Go to your Supabase dashboard
- Check **Table Editor** to see created data
- Verify RLS policies are working

## 🚨 Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: Ensure your `.env.local` file exists and contains the correct Supabase credentials.

### Issue: "RLS policy violation"
**Solution**: Check that you're authenticated and the user ID matches the data you're trying to access.

### Issue: "Database connection failed"
**Solution**: Verify your Supabase project is active and the credentials are correct.

### Issue: "Table doesn't exist"
**Solution**: Run the `supabase-schema.sql` script in your Supabase SQL editor.

## 🔄 Migration from Mock Data

### Step 1: Replace Auth Context
- Update imports from `@/lib/auth` to `@/lib/auth/supabase-auth`
- Replace `useAuth()` with `useSupabaseAuth()`

### Step 2: Replace Data Fetching
- Remove mock data arrays
- Add state for Supabase data
- Use `useEffect` to fetch data on component mount

### Step 3: Update Forms
- Replace mock form submissions with Supabase service calls
- Add proper error handling
- Implement loading states

### Step 4: Test Each Flow
- Dashboard
- Plant management
- Task management
- Community features
- Messaging
- Profile management

## 🚀 Production Deployment

### 1. Update Environment Variables
```bash
# Production environment
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

### 2. Update Supabase Settings
- Set production site URL
- Configure production redirect URLs
- Enable email confirmations
- Set up custom domains if needed

### 3. Database Backups
- Enable automatic backups in Supabase
- Set up point-in-time recovery
- Monitor database performance

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Design Best Practices](https://supabase.com/docs/guides/database/best-practices)

## 🆘 Need Help?

If you encounter issues:

1. Check the Supabase dashboard for error logs
2. Verify your environment variables
3. Ensure the database schema was created correctly
4. Check browser console for client-side errors
5. Review the Supabase documentation

---

**Happy coding! 🌱** Your Plantopia PWA is now powered by a robust, scalable backend!
