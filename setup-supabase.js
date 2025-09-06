#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌱 Plantopia PWA - Supabase Setup');
console.log('=====================================\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Please update it manually with your Supabase credentials.\n');
  console.log('Required environment variables:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key\n');
} else {
  console.log('📝 Creating .env.local file...\n');
  
  const envContent = `# Supabase Configuration
# Replace these values with your actual Supabase project credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!\n');
  console.log('📋 Next steps:');
  console.log('1. Go to https://supabase.com and create a new project');
  console.log('2. Get your project URL and anon key from Settings > API');
  console.log('3. Update the values in .env.local');
  console.log('4. Run the SQL schema in your Supabase SQL Editor');
  console.log('5. Start your development server with: npm run dev\n');
}

console.log('🔗 Useful links:');
console.log('- Supabase Dashboard: https://supabase.com/dashboard');
console.log('- Supabase Documentation: https://supabase.com/docs');
console.log('- SQL Schema: supabase-schema.sql');
console.log('- Setup Guide: SUPABASE_SETUP.md\n');

console.log('🚀 Happy coding! Your Plantopia PWA will soon have a real backend! 🌱');
