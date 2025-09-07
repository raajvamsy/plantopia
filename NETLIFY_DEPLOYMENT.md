# Netlify Deployment Guide for Plantopia PWA

## Prerequisites
- Netlify account
- GitHub repository (recommended for continuous deployment)
- Supabase project set up
- Gemini AI API key

## Environment Variables Setup

In your Netlify dashboard, go to **Site settings > Environment variables** and add:

### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Optional (for advanced server-side operations):
```
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Deployment Steps

### Option 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Netlify will automatically detect the `netlify.toml` configuration
4. Set up the environment variables in Netlify dashboard
5. Deploy!

### Option 2: Manual Deploy
1. Run `npm run build` locally
2. Drag and drop the `.next` folder to Netlify deploy interface
3. Set up environment variables
4. Configure custom domain if needed

## Build Settings
The `netlify.toml` file is already configured with:
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** 18
- **Redirects:** Configured for SPA routing
- **Headers:** PWA and security headers set up

## Post-Deployment Checklist
- [ ] Test all routes work correctly
- [ ] Verify PWA functionality (installability, offline support)
- [ ] Test Supabase authentication
- [ ] Verify AI features work with Gemini API
- [ ] Check mobile responsiveness
- [ ] Test service worker functionality

## Troubleshooting

### Common Issues:
1. **Build fails:** Check Node version compatibility
2. **Routes not working:** Verify `_redirects` file is in public folder
3. **Environment variables not working:** Ensure they're set in Netlify dashboard
4. **PWA not installing:** Check manifest.json and service worker paths

### Performance Optimization:
- Enable Netlify's asset optimization
- Consider enabling Netlify's image optimization
- Use Netlify Analytics for monitoring

## Custom Domain Setup
1. Go to **Site settings > Domain management**
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

## Continuous Deployment
With GitHub integration, every push to your main branch will trigger a new deployment automatically.
