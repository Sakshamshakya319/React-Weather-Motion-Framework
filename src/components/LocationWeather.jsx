import { motion } from 'framer-motion'
import WeatherCard from './WeatherCard'

const LocationWeather = ({ data, loading = false }) => {
  if (!data && !loading) {
    return (
      <motion.div 
        className="glass-effect p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-2xl font-display font-bold mb-6 gradient-text text-center">
          📍 Your Location
        </h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-6 animate-pulse">📍</div>
          <p className="text-muted text-lg font-medium mb-4">
            Enable location access to see weather for your current location
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            🔄 Retry Location Access
          </button>
        </div>
      </motion.div>
    )
  }

  return <WeatherCard data={data} title="📍 Your Location" loading={loading} />
}

export default LocationWeather