# 🚀 Deployment Guide

This comprehensive guide will help you deploy the Motion Weather App with the frontend on Vercel and the backend on Render.

## � Quickq Fix for Vercel Environment Variable Error

If you're getting the error: `Environment Variable "VITE_API_BASE_URL" references Secret "vite_api_base_url", which does not exist`

**Solution:**
1. The `vercel.json` file has been updated to remove the problematic reference
2. Set environment variables through Vercel Dashboard instead (instructions below)
3. Redeploy your application after setting the environment variable

## 📋 Prerequisites

- GitHub account with your project repository
- Vercel account (free tier available)
- Render account (free tier available)
- Project pushed to GitHub

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Your Repository
Ensure your project structure looks like this:
```
motion-weather-app/
├── server/
│   ├── index.js
│   └── package.json
├── src/
├── package.json
└── render.yaml
```

### Step 2: Deploy to Render

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign up or log in with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your weather app repository

3. **Configure Service Settings**
   ```
   Name: motion-weather-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main (or your default branch)
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Instance Type**
   - Plan: Free (for development/testing)
   - Or Starter ($7/month) for production

### Step 3: Configure Environment Variables

In the Render dashboard, go to the "Environment" tab and add:

```env
NODE_ENV=production
PORT=10000
```

**Note:** No API key needed as we use the free Open-Meteo API!

### Step 4: Deploy and Verify

1. Click "Create Web Service"
2. Wait for the build and deployment (usually 2-5 minutes)
3. Once deployed, note your Render URL: `https://motion-weather-backend-xyz.onrender.com`

4. **Test your backend endpoints:**

   **Root endpoint (should show API info):**
   ```
   https://your-render-url.onrender.com/
   ```
   
   **Health check:**
   ```
   https://your-render-url.onrender.com/api/health
   ```

Expected responses:

**Root endpoint (`/`):**
```json
{
  "message": "Motion Weather API",
  "version": "1.0.0",
  "status": "Running",
  "endpoints": {
    "health": "/api/health",
    "weather": {
      "city": "/api/weather/city?city=London",
      "coordinates": "/api/weather/coordinates?lat=40.7128&lon=-74.0060",
      "forecast": "/api/weather/forecast?city=Paris"
    },
    "search": "/api/cities/search?q=New York"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Health endpoint (`/api/health`):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "Weather API (Open-Meteo)",
  "features": ["Weather Data", "Air Quality Index", "Geocoding", "City Search"]
}
```

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update API Configuration

Before deploying, update your API configuration to use the Render backend URL.

**Edit `src/config/api.js`:**
```javascript
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001'
  },
  production: {
    API_BASE_URL: 'https://your-render-backend-url.onrender.com'
  }
}

export const API_BASE_URL = config[import.meta.env.MODE] || config.development
```

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the weather app repository

3. **Configure Project Settings**
   ```
   Framework Preset: Vite
   Root Directory: ./ (leave as root)
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Set Environment Variables (IMPORTANT)**
   
   **Before deploying**, you need to set up environment variables:
   
   a) In the import screen, scroll down to "Environment Variables"
   b) Click "Add Environment Variable"
   c) Add the following:
   
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-render-backend-url.onrender.com
   ```
   
   **OR after deployment:**
   - Go to your project Settings → Environment Variables
   - Click "Add New"
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-render-backend-url.onrender.com`
   - Environment: Production, Preview, Development (select all)
   - Click "Save"

   **⚠️ Important:** Replace `your-render-backend-url` with your actual Render service URL from Step 1!

### Step 3: Deploy

1. Click "Deploy"
2. Wait for the build process (usually 1-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

## 🔄 Post-Deployment Configuration

### Update CORS Settings

After both deployments are complete, update the backend CORS configuration:

**Edit `server/index.js`:**
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-vercel-app.vercel.app',
        /\.vercel\.app$/,  // Allow any vercel.app subdomain
        'https://your-custom-domain.com' // if you have one
      ]
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}))
```

### Redeploy Backend

1. Commit and push the CORS changes to GitHub
2. Render will automatically redeploy your backend
3. Wait for the deployment to complete

## ✅ Testing Your Deployment

### 1. Backend API Tests

Test these endpoints with your Render URL:

```bash
# Health check
curl https://your-render-url.onrender.com/api/health

# Weather by coordinates (New York)
curl "https://your-render-url.onrender.com/api/weather/coordinates?lat=40.7128&lon=-74.0060"

# City search
curl "https://your-render-url.onrender.com/api/cities/search?q=London&limit=5"

# Weather by city
curl "https://your-render-url.onrender.com/api/weather/city?city=Paris"
```

### 2. Frontend Application Tests

Visit your Vercel URL and test:

- [ ] **Page loads** without errors
- [ ] **Current location** weather detection works
- [ ] **City search** returns suggestions
- [ ] **Weather data** displays correctly
- [ ] **24-hour forecast** shows hourly data
- [ ] **7-day forecast** displays daily summaries
- [ ] **Air quality** data appears (when available)
- [ ] **Animations** load smoothly
- [ ] **Responsive design** works on mobile
- [ ] **Theme changes** based on time of day

### 3. Network Tab Verification

Open browser DevTools → Network tab and verify:
- API calls go to your Render backend URL
- No CORS errors in console
- All requests return 200 status codes
- Weather data loads successfully

## 🛠 Troubleshooting

### Common Issues and Solutions

#### 🚫 Backend "Cannot GET /" Error

**Problem:** Getting "Cannot GET /" when visiting your Render backend URL

**Solutions:**

1. **Check if the server is running:**
   - Go to your Render dashboard
   - Check if the service status is "Live" (green)
   - If it shows "Build failed" or "Deploy failed", check the logs

2. **Verify the root endpoint:**
   - The server now has a root route that shows API information
   - Visit: `https://your-render-url.onrender.com/`
   - You should see JSON with API endpoints and status

3. **Test specific API endpoints:**
   ```bash
   # Health check
   curl https://your-render-url.onrender.com/api/health
   
   # Weather test
   curl "https://your-render-url.onrender.com/api/weather/coordinates?lat=40.7128&lon=-74.0060"
   ```

4. **Check Render logs:**
   - Go to Render dashboard → Your service → Logs tab
   - Look for error messages or startup issues
   - Common issues:
     - Port binding errors
     - Missing dependencies
     - Environment variable issues

5. **Verify build configuration:**
   ```
   Build Command: npm install
   Start Command: npm start
   Root Directory: server
   ```

6. **Check package.json in server folder:**
   ```json
   {
     "scripts": {
       "start": "node index.js"
     },
     "type": "module"
   }
   ```

#### 🚫 CORS Errors
**Problem:** `Access to fetch at 'https://render-url' from origin 'https://vercel-url' has been blocked by CORS policy`

**Solution:**
1. Update CORS settings in `server/index.js` with your Vercel URL
2. Redeploy backend to Render
3. Clear browser cache and test again

#### � VPercel Environment Variable Issues

**Problem:** `Environment Variable "VITE_API_BASE_URL" references Secret "vite_api_base_url", which does not exist`

**Solution:**
1. **Remove the problematic vercel.json env reference** (already fixed in the repo)
2. **Set environment variables through Vercel Dashboard:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Click "Add New"
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-render-url.onrender.com`
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

3. **Redeploy your application:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

**Alternative Method - Using Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variable
vercel env add VITE_API_BASE_URL production
# Enter your Render URL when prompted

# Redeploy
vercel --prod
```

#### 🔌 API Connection Issues
**Problem:** Frontend can't connect to backend

**Solutions:**
1. Verify `VITE_API_BASE_URL` environment variable in Vercel
2. Check that Render service is running (green status)
3. Test backend endpoints directly with curl
4. Ensure no typos in URLs

#### 🏗️ Build Failures

**Render Backend Build Issues:**
```bash
# Check these in your server/package.json
{
  "scripts": {
    "start": "node index.js",
    "build": "echo 'No build step required'"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

**Vercel Frontend Build Issues:**
```bash
# Ensure these scripts exist in package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### 🌍 Location Detection Issues
**Problem:** Current location not working

**Solutions:**
1. Ensure HTTPS is enabled (both Vercel and Render use HTTPS by default)
2. Check browser location permissions
3. Test with different browsers
4. Verify geocoding APIs are responding

#### 📱 Mobile Issues
**Problem:** App not working properly on mobile

**Solutions:**
1. Test responsive design in browser DevTools
2. Check for console errors on mobile browsers
3. Verify touch interactions work
4. Test on different mobile devices

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files to Git
- ✅ Use different values for development and production
- ✅ Regularly rotate any API keys (though Open-Meteo doesn't require keys)

### CORS Configuration
- ✅ Only allow your specific frontend domains
- ✅ Don't use wildcard (`*`) in production
- ✅ Update CORS settings when changing domains

### HTTPS
- ✅ Both Vercel and Render provide HTTPS by default
- ✅ Ensure all API calls use HTTPS URLs
- ✅ Test that geolocation works (requires HTTPS)

## 🚀 Performance Optimization

### Backend (Render)
- Use Render's built-in caching
- Enable gzip compression
- Monitor response times in Render dashboard
- Consider upgrading to paid plan for better performance

### Frontend (Vercel)
- Vercel automatically optimizes builds
- Use Vercel Analytics for performance monitoring
- Enable Edge Functions if needed
- Consider using Vercel's Image Optimization

## 📊 Monitoring and Maintenance

### Render Monitoring
- **Dashboard:** Monitor CPU, memory, and response times
- **Logs:** Check application logs for errors
- **Health Checks:** Automatic monitoring of `/api/health` endpoint
- **Alerts:** Set up email notifications for downtime

### Vercel Analytics
- **Performance:** Monitor Core Web Vitals
- **Usage:** Track page views and user interactions
- **Errors:** Monitor client-side errors
- **Deployment:** Track deployment success/failure

### Regular Maintenance
- **Dependencies:** Update npm packages monthly
- **Security:** Monitor for security vulnerabilities
- **Performance:** Review and optimize slow endpoints
- **Logs:** Regularly check application logs

## 🌐 Custom Domains (Optional)

### Vercel Custom Domain
1. Go to your Vercel project settings
2. Click "Domains" tab
3. Add your custom domain
4. Configure DNS records as instructed
5. Wait for SSL certificate provisioning

### Render Custom Domain
1. Go to your Render service settings
2. Click "Custom Domains" tab
3. Add your domain
4. Configure DNS CNAME record
5. Wait for SSL certificate provisioning

### Update CORS After Custom Domain
Remember to update your backend CORS settings to include the new custom domain!

## 🎉 Deployment Complete!

Your Motion Weather App is now live and accessible worldwide! 

**Frontend:** `https://your-project.vercel.app`  
**Backend:** `https://your-backend.onrender.com`

### Next Steps
1. 📱 Test on various devices and browsers
2. 📊 Set up monitoring and analytics
3. 🔄 Configure automatic deployments
4. 🌐 Consider adding a custom domain
5. 📈 Monitor performance and user feedback

### Sharing Your App
- Share the Vercel URL with users
- Add the GitHub repository link to your portfolio
- Consider submitting to app directories
- Write a blog post about your development process

---

**Need Help?** 
- 📖 Check the main [README.md](./README.md)
- 🐛 [Open an issue](https://github.com/yourusername/motion-weather-app/issues)
- 💬 [Start a discussion](https://github.com/yourusername/motion-weather-app/discussions)

**Happy Deploying! 🚀**