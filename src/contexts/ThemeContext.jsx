import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primary: '#60A5FA',
    secondary: '#A78BFA',
    accent: '#34D399',
    background: 'from-gray-900 via-blue-900 to-purple-900',
    text: '#F8FAFC',
    textSecondary: '#E2E8F0',
    textMuted: '#94A3B8',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    cardBorder: 'rgba(255, 255, 255, 0.2)'
  })

  const getTimeBasedTheme = () => {
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 8) {
      // Early Morning - Dawn colors
      return {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#45B7D1',
        background: 'from-pink-300 via-purple-300 to-indigo-400',
        text: '#2D3748',
        textSecondary: '#4A5568',
        textMuted: '#718096',
        cardBg: 'rgba(255, 255, 255, 0.25)',
        cardBorder: 'rgba(255, 255, 255, 0.4)'
      }
    } else if (hour >= 8 && hour < 12) {
      // Morning - Bright and energetic
      return {
        primary: '#F6AD55',
        secondary: '#68D391',
        accent: '#4FD1C7',
        background: 'from-yellow-300 via-orange-300 to-red-300',
        text: '#2D3748',
        textSecondary: '#4A5568',
        textMuted: '#718096',
        cardBg: 'rgba(255, 255, 255, 0.3)',
        cardBorder: 'rgba(255, 255, 255, 0.5)'
      }
    } else if (hour >= 12 && hour < 17) {
      // Afternoon - Clear blue sky
      return {
        primary: '#4299E1',
        secondary: '#38B2AC',
        accent: '#48BB78',
        background: 'from-blue-300 via-blue-400 to-cyan-400',
        text: '#2D3748',
        textSecondary: '#4A5568',
        textMuted: '#718096',
        cardBg: 'rgba(255, 255, 255, 0.25)',
        cardBorder: 'rgba(255, 255, 255, 0.4)'
      }
    } else if (hour >= 17 && hour < 20) {
      // Evening - Golden hour
      return {
        primary: '#ED8936',
        secondary: '#F56565',
        accent: '#D69E2E',
        background: 'from-orange-400 via-red-400 to-pink-400',
        text: '#FFFFFF',
        textSecondary: '#F7FAFC',
        textMuted: '#E2E8F0',
        cardBg: 'rgba(255, 255, 255, 0.15)',
        cardBorder: 'rgba(255, 255, 255, 0.25)'
      }
    } else if (hour >= 20 && hour < 23) {
      // Night - Deep twilight
      return {
        primary: '#805AD5',
        secondary: '#D53F8C',
        accent: '#667EEA',
        background: 'from-purple-600 via-purple-700 to-indigo-800',
        text: '#FFFFFF',
        textSecondary: '#F7FAFC',
        textMuted: '#E2E8F0',
        cardBg: 'rgba(255, 255, 255, 0.1)',
        cardBorder: 'rgba(255, 255, 255, 0.2)'
      }
    } else {
      // Late Night/Early Morning - Dark and calm
      return {
        primary: '#4C51BF',
        secondary: '#553C9A',
        accent: '#2B6CB0',
        background: 'from-gray-800 via-gray-900 to-black',
        text: '#FFFFFF',
        textSecondary: '#F7FAFC',
        textMuted: '#CBD5E0',
        cardBg: 'rgba(255, 255, 255, 0.08)',
        cardBorder: 'rgba(255, 255, 255, 0.15)'
      }
    }
  }

  useEffect(() => {
    const updateTheme = () => {
      setTheme(getTimeBasedTheme())
    }
    
    updateTheme()
    const interval = setInterval(updateTheme, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const value = {
    theme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      <div 
        className={`min-h-screen bg-gradient-to-br ${theme.background} transition-all duration-1000`}
        style={{ 
          color: theme.text,
          '--primary-color': theme.primary,
          '--secondary-color': theme.secondary,
          '--accent-color': theme.accent,
          '--text-color': theme.text,
          '--text-secondary': theme.textSecondary,
          '--text-muted': theme.textMuted,
          '--card-bg': theme.cardBg,
          '--card-border': theme.cardBorder
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider