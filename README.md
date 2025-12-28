# 3D Weather App

A modern weather application built with React.js, Vite, Node.js, Tailwind CSS, and Three.js for stunning 3D effects.

## 🌟 Live Demo
- **Frontend**: [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/weather-app-3d)
- **Backend**: [Deploy to Render](https://render.com/deploy?repo=https://github.com/yourusername/weather-app-3d)

## Features

- 🌍 **Live Weather Data** - Real-time weather information using OpenWeatherMap API
- 📍 **Location-based Weather** - Automatic weather detection for user's current location
- 🔍 **City Search** - Search weather for any city worldwide
- 🎨 **Dynamic Theming** - Theme colors change based on current time
- 🌟 **3D Effects** - Beautiful Three.js animations and particle systems
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Modern Fonts** - Inter and Poppins for clean typography
- 🎭 **Smooth Animations** - Framer Motion for fluid user interactions

## Tech Stack

### Frontend
- **React.js 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - 3D graphics and animations
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js
- **Framer Motion** - Animation library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/weather-app-3d.git
cd weather-app-3d
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup
1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Create `.env` file in root directory:
```env
PORT=3001
WEATHER_API_KEY=your-openweather-api-key-here
```

### 4. Run the Application
```bash
# Start the backend server (in one terminal)
npm run server

# Start the frontend development server (in another terminal)
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🌐 Deployment

### Quick Deploy
1. **Backend to Render**: [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
2. **Frontend to Vercel**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/weather-app-3d)

### Manual Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Environment Variables for Production

**Render (Backend):**
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
WEATHER_API_KEY=your-openweather-api-key
```

**Vercel (Frontend):**
```env
VITE_API_BASE_URL=https://your-render-app.onrender.com
```

## 📁 Project Structure

```
weather-app-3d/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── Login.jsx          # Authentication form
│   │   ├── Scene3D.jsx        # Three.js 3D scene
│   │   ├── WeatherCard.jsx    # Weather display component
│   │   ├── SearchBar.jsx      # City search component
│   │   └── LocationWeather.jsx # Location-based weather
│   ├── contexts/
│   │   ├── AuthContext.jsx    # Authentication state
│   │   └── ThemeContext.jsx   # Dynamic theming
│   ├── config/
│   │   └── api.js            # API configuration
│   ├── App.jsx               # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── server/
│   ├── index.js             # Express server
│   └── package.json         # Server dependencies
├── package.json             # Frontend dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── vercel.json             # Vercel deployment config
├── render.yaml             # Render deployment config
└── DEPLOYMENT.md           # Deployment guide
```

## 🎨 Features in Detail

### 🔐 Authentication System
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- Automatic token verification

### 🌍 Weather Integration
- Real-time weather data from OpenWeatherMap
- Current weather conditions
- Location-based weather detection
- City search functionality
- Comprehensive weather details (humidity, wind, pressure, etc.)

### 🎨 Dynamic Theming
The app automatically changes its color scheme based on the time of day:
- **Morning (6-12)**: Warm sunrise colors
- **Afternoon (12-18)**: Bright blue sky
- **Evening (18-21)**: Sunset colors
- **Night (21-6)**: Dark theme

### 🌟 3D Effects
- Animated particle systems
- Floating weather elements
- Interactive 3D background
- Smooth camera movements
- Auto-rotating scenes

### 📱 Responsive Design
- Mobile-first approach
- Glass morphism effects
- Smooth animations
- Touch-friendly interface

## 🛠 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run server       # Start backend server
npm run lint         # Run ESLint
```

### API Endpoints

#### Weather (Public - No Authentication Required)
- `GET /api/weather/city?city=London` - Get weather by city name
- `GET /api/weather/coordinates?lat=51.5074&lon=-0.1278` - Get weather by coordinates
- `GET /api/weather/forecast?city=London` - Get 5-day forecast
- `GET /api/health` - Health check endpoint

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Weather API Configuration
WEATHER_API_KEY=your-openweather-api-key-here
```

### API Configuration
Update `src/config/api.js` for different environments:
```javascript
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001'
  },
  production: {
    API_BASE_URL: 'https://your-render-app.onrender.com'
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. **Check Environment Variables**: Ensure all required environment variables are set
2. **API Key**: Verify your OpenWeatherMap API key is valid
3. **CORS Issues**: Check that your frontend URL is allowed in backend CORS settings
4. **Build Errors**: Check the console for specific error messages

For more help:
- Open an issue on GitHub
- Check the [Deployment Guide](./DEPLOYMENT.md)
- Review the API documentation above

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Three.js](https://threejs.org/) for 3D graphics
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

---

Made with ❤️ and lots of ☕