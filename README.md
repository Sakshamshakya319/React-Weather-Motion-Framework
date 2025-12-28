# 🌤️ Motion Weather App

A modern, full-stack weather application featuring smooth animations, real-time weather data, and beautiful UI design. Built with React.js, Node.js, and powered by Open-Meteo API for accurate weather forecasting.

![Weather App Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Latest-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🌍 **Weather Intelligence**
- **Real-time Weather Data** - Powered by Open-Meteo API (no API key required)
- **Current Location Detection** - Automatic weather for your precise location
- **Global City Search** - Search weather for any city worldwide with smart suggestions
- **Air Quality Index (AQI)** - Comprehensive air quality data including PM2.5, PM10, NO₂, O₃, SO₂, CO
- **24-Hour Forecast** - Detailed hourly temperature and conditions
- **7-Day Outlook** - Extended weather forecast with daily highs and lows

### 🎨 **Visual Experience**
- **Dynamic Theming** - Automatic theme changes based on time of day (6 different periods)
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Loading Animations** - Beautiful skeleton loading states and icon animations
- **Glass Morphism UI** - Modern frosted glass design elements
- **Responsive Design** - Seamless experience across all devices
- **Motion Background** - Animated particles and gradients

### 🚀 **Performance & UX**
- **Lightning Fast** - Vite-powered development and build process
- **Multiple Geocoding Fallbacks** - Reliable location detection with 3 backup services
- **Error Handling** - Graceful error states and user feedback
- **Accessibility** - Screen reader friendly and keyboard navigation
- **Progressive Enhancement** - Works without JavaScript for basic functionality

## 🛠 Tech Stack

### **Frontend**
- **React 18.2.0** - Modern React with hooks and concurrent features
- **Vite 4.5.0** - Next-generation frontend tooling
- **Framer Motion 10.16.5** - Production-ready motion library
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios 1.6.2** - Promise-based HTTP client

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js 4.18.2** - Fast, unopinionated web framework
- **Open-Meteo API** - Free weather API (no key required)
- **CORS 2.8.5** - Cross-origin resource sharing

### **Deployment**
- **Vercel** - Frontend hosting and deployment
- **Render** - Backend API hosting
- **GitHub Actions** - Continuous integration and deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Git installed
- Modern web browser

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/yourusername/motion-weather-app.git
cd motion-weather-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3001

# No API key required - using Open-Meteo free API
```

### 3. Development
```bash
# Start backend server (Terminal 1)
cd server
npm start

# Start frontend development server (Terminal 2)
npm run dev
```

**🎉 Your app is now running!**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health

## 📁 Project Structure

```
motion-weather-app/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── Dashboard.jsx          # Main application dashboard
│   │   ├── WeatherCard.jsx        # Weather display with animations
│   │   ├── SearchBar.jsx          # City search with suggestions
│   │   ├── LocationWeather.jsx    # Current location weather
│   │   └── MotionBackground.jsx   # Animated background effects
│   ├── 📂 contexts/
│   │   └── ThemeContext.jsx       # Dynamic theming system
│   ├── 📂 config/
│   │   └── api.js                 # API configuration
│   ├── App.jsx                    # Root application component
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles and animations
├── 📂 server/
│   ├── index.js                   # Express server with API routes
│   └── package.json               # Server dependencies
├── 📄 package.json                # Frontend dependencies and scripts
├── 📄 vite.config.js             # Vite configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 vercel.json                # Vercel deployment config
├── 📄 render.yaml                # Render deployment config
└── 📄 DEPLOYMENT.md              # Detailed deployment guide
```

## 🌈 Dynamic Theming

The app automatically adapts its visual theme based on the current time:

| Time Period | Theme | Colors |
|-------------|-------|---------|
| **Dawn** (5-7 AM) | Sunrise | Warm oranges and pinks |
| **Morning** (7-12 PM) | Bright | Light blues and whites |
| **Afternoon** (12-5 PM) | Vibrant | Clear blues and yellows |
| **Evening** (5-8 PM) | Sunset | Deep oranges and purples |
| **Night** (8-11 PM) | Twilight | Dark blues and purples |
| **Late Night** (11-5 AM) | Midnight | Deep blacks and blues |

## 🔌 API Endpoints

### Weather Data
```http
GET /api/weather/city?city=London&lat=51.5074&lon=-0.1278
GET /api/weather/coordinates?lat=40.7128&lon=-74.0060
GET /api/weather/forecast?city=Paris
```

### City Search
```http
GET /api/cities/search?q=New York&limit=10
```

### System
```http
GET /api/health
```

## 🎯 Key Features Deep Dive

### 🔍 **Smart City Search**
- Real-time search suggestions as you type
- Country flags and full location names
- Filters out invalid or "unknown" results
- Supports international cities and locations

### 📍 **Enhanced Location Detection**
- Multiple geocoding service fallbacks:
  1. BigDataCloud (primary)
  2. Nominatim/OpenStreetMap (secondary)
  3. Timezone-based fallback (tertiary)
- Displays city, state/province, and country
- Handles edge cases and API failures gracefully

### 🌡️ **Comprehensive Weather Data**
- Current conditions with "feels like" temperature
- Humidity, wind speed, atmospheric pressure
- Visibility and air quality metrics
- Sunrise and sunset times
- Weather condition icons and descriptions

### 🎭 **Animation System**
- Staggered loading animations for all elements
- Smooth icon transitions with loading states
- Hover effects and micro-interactions
- Progress indicators for data loading
- Skeleton screens during loading states

## 🚀 Deployment

### Quick Deploy Buttons
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/motion-weather-app)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yourusername/motion-weather-app)

### Manual Deployment
See our comprehensive [Deployment Guide](./DEPLOYMENT.md) for step-by-step instructions.

### Environment Variables

**Production Backend (Render):**
```env
NODE_ENV=production
PORT=3001
```

**Production Frontend (Vercel):**
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

## 🛠 Development Scripts

```bash
# Frontend Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend Development
cd server
npm start            # Start production server
npm run dev          # Start with auto-reload
```

## 🧪 Testing the Application

### Manual Testing Checklist
- [ ] Current location weather loads automatically
- [ ] City search returns relevant suggestions
- [ ] Weather data displays correctly for searched cities
- [ ] 24-hour forecast shows hourly data
- [ ] 7-day forecast displays daily summaries
- [ ] Air quality index appears when available
- [ ] Theme changes based on time of day
- [ ] Animations load smoothly
- [ ] Responsive design works on mobile
- [ ] Error states display appropriately

### API Testing
```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test weather by coordinates
curl "http://localhost:3001/api/weather/coordinates?lat=40.7128&lon=-74.0060"

# Test city search
curl "http://localhost:3001/api/cities/search?q=London"
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed
- Ensure responsive design compatibility

## 🐛 Troubleshooting

### Common Issues

**Location not detected:**
- Ensure browser location permissions are enabled
- Check if HTTPS is being used (required for geolocation)
- Verify network connectivity

**Weather data not loading:**
- Check browser console for error messages
- Verify backend server is running
- Ensure CORS settings allow your domain

**Build failures:**
- Clear node_modules and reinstall dependencies
- Check for Node.js version compatibility
- Verify all environment variables are set

### Getting Help
- 📖 Check the [Deployment Guide](./DEPLOYMENT.md)
- 🐛 [Open an issue](https://github.com/yourusername/motion-weather-app/issues)
- 💬 [Start a discussion](https://github.com/yourusername/motion-weather-app/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Open-Meteo](https://open-meteo.com/)** - Free weather API service
- **[BigDataCloud](https://www.bigdatacloud.com/)** - Reverse geocoding service
- **[Nominatim](https://nominatim.org/)** - OpenStreetMap geocoding
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Tailwind CSS](https://tailwindcss.com/)** - CSS framework
- **[Vercel](https://vercel.com/)** - Frontend hosting
- **[Render](https://render.com/)** - Backend hosting

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/motion-weather-app?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/motion-weather-app?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/motion-weather-app)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/motion-weather-app)

---

<div align="center">

**Made with ❤️ and lots of ☕**

[⭐ Star this repo](https://github.com/yourusername/motion-weather-app) • [🐛 Report Bug](https://github.com/yourusername/motion-weather-app/issues) • [✨ Request Feature](https://github.com/yourusername/motion-weather-app/issues)

</div>