import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const SearchBar = ({ onSearch, loading }) => {
  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const { theme } = useTheme()
  const searchTimeoutRef = useRef(null)
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      onSearch(city.trim())
      setShowSuggestions(false)
    }
  }

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity.display_name)
    setShowSuggestions(false)
    onSearch(selectedCity.display_name, selectedCity.latitude, selectedCity.longitude)
  }

  const searchCities = async (query) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    setLoadingSuggestions(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cities/search?q=${encodeURIComponent(query)}&limit=8`)
      setSuggestions(response.data.cities || [])
    } catch (error) {
      console.error('City search error:', error)
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setCity(value)
    setShowSuggestions(true)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchCities(value)
    }, 300)
  }

  const handleInputFocus = () => {
    if (city.length >= 2) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const getCountryFlag = (countryCode) => {
    if (!countryCode || countryCode === 'XX') return '🌍'
    
    const flags = {
      'US': '🇺🇸', 'GB': '🇬🇧', 'IN': '🇮🇳', 'CN': '🇨🇳', 'JP': '🇯🇵',
      'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'CA': '🇨🇦',
      'AU': '🇦🇺', 'BR': '🇧🇷', 'RU': '🇷🇺', 'KR': '🇰🇷', 'MX': '🇲🇽',
      'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮',
      'CH': '🇨🇭', 'AT': '🇦🇹', 'BE': '🇧🇪', 'PL': '🇵🇱', 'CZ': '🇨🇿',
      'TR': '🇹🇷', 'GR': '🇬🇷', 'PT': '🇵🇹', 'IE': '🇮🇪', 'HU': '🇭🇺',
      'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SK': '🇸🇰', 'SI': '🇸🇮',
      'EE': '🇪🇪', 'LV': '🇱🇻', 'LT': '🇱🇹', 'LU': '🇱🇺', 'MT': '🇲🇹',
      'CY': '🇨🇾', 'IS': '🇮🇸', 'LI': '🇱🇮', 'MC': '🇲🇨', 'SM': '🇸🇲',
      'VA': '🇻🇦', 'AD': '🇦🇩', 'ZA': '🇿🇦', 'EG': '🇪🇬', 'MA': '🇲🇦',
      'TN': '🇹🇳', 'DZ': '🇩🇿', 'LY': '🇱🇾', 'SD': '🇸🇩', 'ET': '🇪🇹',
      'KE': '🇰🇪', 'UG': '🇺🇬', 'TZ': '🇹🇿', 'RW': '🇷🇼', 'BI': '🇧🇮',
      'DJ': '🇩🇯', 'SO': '🇸🇴', 'ER': '🇪🇷', 'SS': '🇸🇸', 'CF': '🇨🇫',
      'TD': '🇹🇩', 'CM': '🇨🇲', 'GQ': '🇬🇶', 'GA': '🇬🇦', 'CG': '🇨🇬',
      'CD': '🇨🇩', 'AO': '🇦🇴', 'ZM': '🇿🇲', 'ZW': '🇿🇼', 'BW': '🇧🇼',
      'NA': '🇳🇦', 'SZ': '🇸🇿', 'LS': '🇱🇸', 'MW': '🇲🇼', 'MZ': '🇲🇿',
      'MG': '🇲🇬', 'MU': '🇲🇺', 'SC': '🇸🇨', 'KM': '🇰🇲', 'YT': '🇾🇹'
    }
    
    return flags[countryCode.toUpperCase()] || '🌍'
  }

  return (
    <motion.div 
      className="glass-effect p-4 sm:p-8 relative"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h2 className="text-xl sm:text-2xl font-display font-bold mb-4 sm:mb-6 gradient-text text-center">
        🔍 Search Weather by City
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Enter city name (e.g., Mumbai, New York, London)"
            className="input-field text-lg w-full"
            disabled={loading}
            autoComplete="off"
          />
          
          {/* City Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 z-50 mt-2 glass-effect border border-white/30 rounded-lg max-h-80 overflow-y-auto"
              >
                {loadingSuggestions ? (
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-muted">Searching cities...</span>
                    </div>
                  </div>
                ) : (
                  suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.id}
                      type="button"
                      onClick={() => handleCitySelect(suggestion)}
                      className="w-full p-4 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 flex items-center gap-3"
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <span className="text-2xl">
                        {getCountryFlag(suggestion.country_code)}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-secondary">
                          {suggestion.name}
                        </div>
                        <div className="text-sm text-muted">
                          {suggestion.admin1 && `${suggestion.admin1}, `}
                          {suggestion.country}
                        </div>
                        {suggestion.population > 0 && (
                          <div className="text-xs text-muted">
                            Population: {suggestion.population.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.button
          type="submit"
          disabled={loading || !city.trim()}
          className="btn-primary w-full sm:w-auto sm:px-8 text-lg py-4 sm:py-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Searching...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>🔍</span>
              <span>Search Weather</span>
            </div>
          )}
        </motion.button>
      </form>
      
      <div className="text-center">
        <p className="text-muted mb-4 font-medium">Popular Cities:</p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-3">
          {[
            { name: 'Mumbai', country: 'India', flag: '🇮🇳' },
            { name: 'Delhi', country: 'India', flag: '🇮🇳' },
            { name: 'London', country: 'United Kingdom', flag: '🇬🇧' },
            { name: 'New York', country: 'United States', flag: '🇺🇸' },
            { name: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
            { name: 'Paris', country: 'France', flag: '🇫🇷' },
            { name: 'Sydney', country: 'Australia', flag: '🇦🇺' },
            { name: 'Dubai', country: 'UAE', flag: '🇦🇪' }
          ].map((suggestedCity) => (
            <motion.button
              key={suggestedCity.name}
              onClick={() => {
                setCity(`${suggestedCity.name}, ${suggestedCity.country}`)
                onSearch(`${suggestedCity.name}, ${suggestedCity.country}`)
              }}
              className="px-3 py-2 sm:px-4 text-sm rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 min-h-[40px]"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: theme.textSecondary
              }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <span className="text-base sm:text-lg">{suggestedCity.flag}</span>
              <span className="text-xs sm:text-sm font-medium">{suggestedCity.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default SearchBar