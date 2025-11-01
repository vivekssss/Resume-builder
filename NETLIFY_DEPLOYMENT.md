# Netlify Deployment Guide

## 🚀 Deploy AI Resume Builder to Netlify

### Prerequisites
- Netlify account
- Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Build for Static Export
```bash
npm run build
```

This will create an `out` folder with your static files.

### Step 2: Deploy via Git (Recommended)

#### Option A: Connect Repository to Netlify
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com) and click "New site from Git"
3. Connect your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `18`

#### Option B: Drag and Drop
1. Run `npm run build` locally
2. Drag the `out` folder to the Netlify deploy page

### Step 3: Environment Variables (Optional)
Add these in Netlify dashboard under Site settings > Build & deploy > Environment:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (if using Google OAuth)

### Step 4: Custom Domain (Optional)
1. Go to Site settings > Domain management
2. Add your custom domain
3. Update DNS settings as provided by Netlify

## 📁 Build Output Structure
```
out/
├── _next/
│   ├── static/
│   │   ├── chunks/
│   │   ├── css/
│   │   └── media/
├── index.html
└── ...other static files
```

## 🔧 Configuration Files

### netlify.toml
- Handles build settings
- Sets up redirects for SPA routing
- Adds security headers

### next.config.js
- Configured for static export
- Unoptimized images for static hosting
- Trailing slash support

## 🌐 Features After Deployment

✅ **Fully Functional Resume Builder**
- Resume upload and parsing
- Multiple templates
- PDF export
- Form editing

✅ **Static Performance**
- Fast loading times
- CDN distribution
- No server costs

✅ **SEO Optimized**
- Meta tags
- Semantic HTML
- Fast Core Web Vitals

## 🐛 Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (18+ recommended)

### Runtime Issues
- Check browser console for errors
- Verify environment variables are set
- Test resume upload functionality

### 404 Errors
- Check `netlify.toml` redirect rules
- Ensure `trailingSlash: true` in `next.config.js`

## 📈 Performance Optimization

The build is optimized for:
- **First Load JS**: ~350KB
- **Static Generation**: All pages pre-rendered
- **Image Optimization**: Disabled for static hosting
- **Bundle Splitting**: Automatic code splitting

## 🔄 Continuous Deployment

Netlify automatically:
- Builds on every push to main branch
- Deploys preview sites for pull requests
- Rollbacks on failed deployments

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify build settings match this guide
3. Test locally with `npm run build && npm run start`

---

**Ready to deploy! 🎉** Your AI Resume Builder is now configured for Netlify static hosting.
