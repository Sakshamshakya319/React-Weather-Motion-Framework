# Deployment Guide

This guide will help you deploy the 3D Weather App to Render (backend) and Vercel (frontend).

## 🚀 Backend Deployment (Render)

### 1. Prepare Your Repository
1. Push your code to GitHub
2. Make sure the `server/` folder contains all backend files

### 2. Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `weather-app-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

### 3. Set Environment Variables
In Render dashboard, go to Environment tab and add:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
WEATHER_API_KEY=903f96e4ad8945ba50f93842e726ae0c
```

### 4. Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Note your Render URL (e.g., `https://weather-app-backend-xyz.onrender.com`)

## 🌐 Frontend Deployment (Vercel)

### 1. Update API Configuration
1. Update `src/config/api.js` with your Render URL:
```javascript
production: {
  API_BASE_URL: 'https://your-render-app.onrender.com'
}
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Set Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:
```
VITE_API_BASE_URL=https://your-render-app.onrender.com
```

### 4. Update CORS Settings
Update your Render backend's CORS settings in `server/index.js`:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-vercel-app.vercel.app']
  : ['http://localhost:5173'],
```

### 5. Deploy
- Click "Deploy"
- Wait for deployment to complete
- Your app will be live at `https://your-project.vercel.app`

## 🔧 Post-Deployment Steps

### 1. Test the Application
1. Visit your Vercel URL
2. Register a new account
3. Test weather search functionality
4. Verify location-based weather works

### 2. Update URLs
Update the following files with your actual deployment URLs:

**Frontend (`src/config/api.js`):**
```javascript
production: {
  API_BASE_URL: 'https://weather-app-backend-xyz.onrender.com'
}
```

**Backend (`server/index.js`):**
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://weather-app-3d-xyz.vercel.app']
  : ['http://localhost:5173'],
```

### 3. Redeploy
After updating URLs:
1. Push changes to GitHub
2. Render and Vercel will auto-deploy
3. Test the live application

## 🛠 Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure backend CORS settings include your Vercel domain
- Check that environment variables are set correctly

**API Key Issues:**
- Verify `WEATHER_API_KEY` is set in Render environment variables
- Test API key at [OpenWeatherMap](https://openweathermap.org/api)

**Build Failures:**
- Check build logs in Render/Vercel dashboards
- Ensure all dependencies are in `package.json`

**Authentication Issues:**
- Verify `JWT_SECRET` is set in production
- Check that API URLs are correct in frontend config

### Logs and Debugging
- **Render**: View logs in the dashboard under "Logs" tab
- **Vercel**: Check function logs and build logs in dashboard
- **Browser**: Use developer tools to check network requests

## 📱 Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Render Custom Domain
1. Go to Render service settings
2. Click "Custom Domains"
3. Add your domain and configure DNS

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, unique secret in production
3. **API Keys**: Rotate API keys regularly
4. **CORS**: Only allow your frontend domain
5. **HTTPS**: Both services use HTTPS by default

## 📊 Monitoring

### Render Monitoring
- Built-in metrics and logs
- Health check endpoint: `/api/health`
- Email alerts for downtime

### Vercel Analytics
- Built-in analytics available
- Performance monitoring
- Error tracking

Your 3D Weather App is now live and ready for users! 🎉