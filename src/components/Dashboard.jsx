import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import WeatherCard from './WeatherCard'
import SearchBar from './SearchBar'
import LocationWeather from './LocationWeather'
import MotionBackground from './MotionBackground'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const Dashboard = () => {
  const { theme } = useTheme()
  const [weatherData, setWeatherData] = useState(null)
  const [locationWeather, setLocationWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get user's location weather on load
    getUserLocationWeather()
  }, [])

  const getUserLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const response = await axios.get(`${API_BASE_URL}/api/weather/coordinates?lat=${latitude}&lon=${longitude}`)
            setLocationWeather(response.data)
          } catch (error) {
            console.error('Error fetching location weather:', error)
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
        }
      )
    }
  }

  const searchWeather = async (city, lat = null, lon = null) => {
    setLoading(true)
    setError('')
    
    try {
      let url = `${API_BASE_URL}/api/weather/city?city=${encodeURIComponent(city)}`
      if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`
      }
      
      const response = await axios.get(url)
      setWeatherData(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Motion Background */}
      <MotionBackground />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          className="glass-effect m-6 p-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <motion.h1 
              className="text-5xl font-display font-bold gradient-text mb-3"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ⛅ Motion Weather App
            </motion.h1>
            <motion.p 
              className="text-xl text-secondary font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Real-time weather with smooth animations and air quality data
            </motion.p>
          </div>
        </motion.header>

        {/* Search Section */}
        <motion.div 
          className="mx-6 mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SearchBar onSearch={searchWeather} loading={loading} />
        </motion.div>

        {/* Weather Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mx-6 mb-6">
          {/* Current Location Weather */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <LocationWeather data={locationWeather} loading={!locationWeather} />
          </motion.div>

          {/* Search Results */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {error && (
              <motion.div 
                className="glass-effect p-6 mb-6 border-red-400/30"
                style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    ⚠️
                  </motion.span>
                  <p className="text-red-300 font-medium text-lg">{error}</p>
                </div>
              </motion.div>
            )}
            
            {loading && !weatherData ? (
              <WeatherCard data={null} title="🔍 Search Results" loading={true} />
            ) : weatherData ? (
              <WeatherCard data={weatherData} title="🔍 Search Results" loading={false} />
            ) : (
              <motion.div 
                className="glass-effect p-8 min-h-[600px] flex flex-col justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-2xl font-display font-bold mb-6 gradient-text text-center">
                  🔍 Search Results
                </h3>
                <div className="text-center py-12">
                  <motion.div 
                    className="text-6xl mb-6"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🌤️
                  </motion.div>
                  <p className="text-muted text-lg font-medium">
                    Search for a city to see detailed weather information
                  </p>
                  <p className="text-muted text-sm mt-2">
                    Including 24-hour forecast and 7-day outlook
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Time Display */}
        <motion.div 
          className="fixed bottom-6 right-6 glass-effect p-4 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-center">
            <p className="text-sm text-muted font-medium uppercase tracking-wide">Current Time</p>
            <motion.p 
              className="text-xl font-bold text-primary mt-1"
              key={new Date().toLocaleTimeString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {new Date().toLocaleTimeString()}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard