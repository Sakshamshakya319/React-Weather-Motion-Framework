import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'

const WeatherCard = ({ data, title, loading = false }) => {
  const { theme } = useTheme()
  const [iconsLoaded, setIconsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (data && !loading) {
      // Simulate icon loading with progress
      const loadIcons = async () => {
        setIconsLoaded(false)
        setLoadingProgress(0)
        
        // Simulate loading progress
        const intervals = [20, 40, 60, 80, 100]
        for (let i = 0; i < intervals.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setLoadingProgress(intervals[i])
        }
        
        setIconsLoaded(true)
      }
      
      loadIcons()
    }
  }, [data, loading])

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <motion.div 
      className="weather-card min-h-[600px] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex-shrink-0 mb-6">
        <motion.div 
          className="h-8 bg-white/10 rounded-lg mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div 
          className="h-4 bg-white/5 rounded w-2/3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
      </div>
      
      <div className="flex-1 space-y-6">
        <div className="text-center">
          <motion.div 
            className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-3 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-2xl">⏳</div>
          </motion.div>
          <motion.div 
            className="h-6 bg-white/10 rounded mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
          <motion.div 
            className="h-4 bg-white/5 rounded w-3/4 mx-auto mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
          <motion.div 
            className="h-10 bg-white/10 rounded w-1/2 mx-auto"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
          />
        </div>
        
        {/* Loading progress bar */}
        <motion.div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <motion.span 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              🔄
            </motion.span>
            <span className="text-sm text-secondary">Loading weather data...</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-xs text-muted mt-1">{loadingProgress}% complete</div>
        </motion.div>
      </div>
    </motion.div>
  )

  if (loading || !data) {
    return <LoadingSkeleton />
  }

  const getWeatherIcon = (condition) => {
    const icons = {
      'clear': '☀️',
      'clouds': '☁️',
      'rain': '🌧️',
      'drizzle': '🌦️',
      'thunderstorm': '⛈️',
      'snow': '❄️',
      'mist': '🌫️',
      'fog': '🌫️',
      'haze': '🌫️'
    }
    return icons[condition.toLowerCase()] || data.weather[0].icon || '🌤️'
  }

  // Animated weather icon component
  const AnimatedWeatherIcon = ({ icon, size = "text-6xl", delay = 0 }) => (
    <AnimatePresence mode="wait">
      {!iconsLoaded ? (
        <motion.div
          key="loading"
          className={`${size} flex items-center justify-center`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [0.8, 1.1, 0.8],
            rotate: [0, 180, 360]
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: delay
          }}
        >
          ⏳
        </motion.div>
      ) : (
        <motion.div
          key="loaded"
          className={size}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 0.6,
            delay: delay,
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, 10, -10, 0],
            transition: { duration: 0.3 }
          }}
        >
          {icon}
        </motion.div>
      )}
    </AnimatePresence>
  )

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatHourlyTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit',
      hour12: false
    })
  }

  const formatDayName = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString([], { weekday: 'short' })
    }
  }

  const getCurrentLocalTime = () => {
    if (data.location?.timezone) {
      return new Date().toLocaleString('en-US', {
        timeZone: data.location.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <motion.div 
      className="weather-card min-h-[600px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
    >
      {/* Header */}
      <motion.div
        className="flex-shrink-0 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-display font-bold gradient-text mb-2">
          {title}
        </h3>
        {data.location?.timezone && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>🕐</span>
            <span>Local Time: {getCurrentLocalTime()}</span>
          </div>
        )}
      </motion.div>
      
      <div className="flex-1 space-y-6">
        {/* Main Weather Info */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-3">
            <AnimatedWeatherIcon 
              icon={getWeatherIcon(data.weather[0].main)} 
              size="text-6xl"
              delay={0.3}
            />
          </div>
          <h4 className="text-2xl font-bold mb-1 text-main">
            {data.location?.full_name || `${data.name}, ${data.sys.country}`}
          </h4>
          <p className="text-lg text-secondary capitalize font-medium mb-2">
            {data.weather[0].description}
          </p>
          <motion.div 
            className="text-4xl font-bold text-primary mb-2"
            whileHover={{ scale: 1.05 }}
          >
            {Math.round(data.main.temp)}°C
          </motion.div>
          <div className="text-sm text-muted">
            Feels like {Math.round(data.main.feels_like)}°C
          </div>
        </motion.div>

        {/* 24-Hour Temperature Chart */}
        {data.hourly_forecast && (
          <motion.div
            className="bg-white/5 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h5 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
              <span>📊</span>
              24-Hour Temperature
            </h5>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {data.hourly_forecast.slice(0, 24).map((hour, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 text-center min-w-[50px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.02 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-xs text-muted mb-1">
                    {formatHourlyTime(hour.time)}
                  </div>
                  <div className="mb-1">
                    <AnimatedWeatherIcon 
                      icon={hour.condition.icon} 
                      size="text-lg"
                      delay={0.6 + index * 0.03}
                    />
                  </div>
                  <div className="text-sm font-semibold text-secondary">
                    {hour.temperature}°
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 7-Day Forecast */}
        {data.daily_forecast && (
          <motion.div
            className="bg-white/5 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h5 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
              <span>📅</span>
              7-Day Forecast
            </h5>
            <div className="space-y-2">
              {data.daily_forecast.slice(0, 7).map((day, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <AnimatedWeatherIcon 
                      icon={day.condition.icon} 
                      size="text-2xl"
                      delay={0.7 + index * 0.1}
                    />
                    <div>
                      <div className="font-medium text-secondary">
                        {formatDayName(day.date)}
                      </div>
                      <div className="text-xs text-muted capitalize">
                        {day.condition.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-secondary">{day.temp_max}°</span>
                    <span className="text-muted">{day.temp_min}°</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Air Quality Index */}
        {data.aqi && data.aqi.us_aqi && (
          <motion.div 
            className="weather-stat border-2"
            style={{ borderColor: data.aqi.description?.color || '#00E400' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🌬️
                </motion.span>
                <span className="font-semibold text-secondary">Air Quality</span>
              </div>
              <div className="text-right">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: data.aqi.description?.color || '#00E400' }}
                >
                  {data.aqi.us_aqi}
                </div>
                <div 
                  className="text-xs font-semibold"
                  style={{ color: data.aqi.description?.color || '#00E400' }}
                >
                  {data.aqi.description?.level || 'Good'}
                </div>
              </div>
            </div>
            {data.aqi.pm2_5 && (
              <div className="text-xs text-muted">
                PM2.5: {Math.round(data.aqi.pm2_5)} μg/m³
              </div>
            )}
          </motion.div>
        )}

        {/* Weather Details Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { icon: '💧', label: 'Humidity', value: `${data.main.humidity}%` },
            { icon: '🌪️', label: 'Wind', value: `${data.wind.speed} m/s` },
            { icon: '📊', label: 'Pressure', value: `${data.main.pressure} hPa` },
            { icon: '👁️', label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km` }
          ].map((item, index) => (
            <motion.div 
              key={item.label}
              className="weather-stat text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-1">
                <AnimatedWeatherIcon 
                  icon={item.icon} 
                  size="text-xl"
                  delay={0.9 + index * 0.1}
                />
              </div>
              <div className="text-xs text-muted mb-1">{item.label}</div>
              <div className="text-sm font-semibold text-secondary">{item.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sun Times */}
        <motion.div 
          className="flex justify-between items-center pt-4 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div 
            className="text-center flex-1"
            whileHover={{ scale: 1.05 }}
          >
            <div className="mb-1">
              <AnimatedWeatherIcon 
                icon="🌅" 
                size="text-2xl"
                delay={1.2}
              />
            </div>
            <div className="text-xs text-muted">Sunrise</div>
            <div className="text-sm font-semibold text-secondary">
              {formatTime(data.sys.sunrise)}
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center flex-1"
            whileHover={{ scale: 1.05 }}
          >
            <div className="mb-1">
              <AnimatedWeatherIcon 
                icon="🌇" 
                size="text-2xl"
                delay={1.3}
              />
            </div>
            <div className="text-xs text-muted">Sunset</div>
            <div className="text-sm font-semibold text-secondary">
              {formatTime(data.sys.sunset)}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WeatherCard