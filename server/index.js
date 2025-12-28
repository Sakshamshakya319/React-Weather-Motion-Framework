import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-app.vercel.app', 'https://weather-app-3d.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}))
app.use(express.json())

// Open-Meteo API configuration
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1'
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1'
const AQI_BASE_URL = 'https://air-quality-api.open-meteo.com/v1'

// Helper function to get coordinates from city name
const getCityCoordinates = async (cityName) => {
  try {
    const response = await axios.get(`${GEOCODING_URL}/search?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`)
    
    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0]
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        country: result.country,
        country_code: result.country_code,
        admin1: result.admin1,
        admin2: result.admin2,
        timezone: result.timezone
      }
    }
    
    throw new Error('City not found')
  } catch (error) {
    throw new Error('Failed to geocode city')
  }
}

// Helper function to search cities with suggestions
const searchCities = async (query, limit = 10) => {
  try {
    const response = await axios.get(`${GEOCODING_URL}/search?name=${encodeURIComponent(query)}&count=${limit * 2}&language=en&format=json`)
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results
        .filter(result => {
          // Filter out results with missing or invalid data
          return result.name && 
                 result.country && 
                 result.country !== 'Unknown' &&
                 result.name.toLowerCase() !== 'unknown' &&
                 result.latitude && 
                 result.longitude &&
                 result.name.length > 1
        })
        .slice(0, limit) // Limit results after filtering
        .map(result => ({
          id: `${result.latitude}_${result.longitude}`,
          name: result.name,
          country: result.country,
          country_code: result.country_code || 'XX',
          admin1: result.admin1,
          admin2: result.admin2,
          latitude: result.latitude,
          longitude: result.longitude,
          timezone: result.timezone,
          display_name: `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}, ${result.country}`,
          population: result.population || 0
        }))
    }
    
    return []
  } catch (error) {
    console.error('City search error:', error.message)
    return []
  }
}

// Helper function to get weather condition from WMO code
const getWeatherCondition = (wmoCode) => {
  const conditions = {
    0: { main: 'Clear', description: 'clear sky', icon: '☀️' },
    1: { main: 'Clear', description: 'mainly clear', icon: '🌤️' },
    2: { main: 'Clouds', description: 'partly cloudy', icon: '⛅' },
    3: { main: 'Clouds', description: 'overcast', icon: '☁️' },
    45: { main: 'Fog', description: 'fog', icon: '🌫️' },
    48: { main: 'Fog', description: 'depositing rime fog', icon: '🌫️' },
    51: { main: 'Drizzle', description: 'light drizzle', icon: '🌦️' },
    53: { main: 'Drizzle', description: 'moderate drizzle', icon: '🌦️' },
    55: { main: 'Drizzle', description: 'dense drizzle', icon: '🌧️' },
    61: { main: 'Rain', description: 'slight rain', icon: '🌧️' },
    63: { main: 'Rain', description: 'moderate rain', icon: '🌧️' },
    65: { main: 'Rain', description: 'heavy rain', icon: '⛈️' },
    71: { main: 'Snow', description: 'slight snow fall', icon: '❄️' },
    73: { main: 'Snow', description: 'moderate snow fall', icon: '❄️' },
    75: { main: 'Snow', description: 'heavy snow fall', icon: '🌨️' },
    95: { main: 'Thunderstorm', description: 'thunderstorm', icon: '⛈️' },
    96: { main: 'Thunderstorm', description: 'thunderstorm with hail', icon: '⛈️' },
    99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: '⛈️' }
  }
  
  return conditions[wmoCode] || { main: 'Unknown', description: 'unknown', icon: '🌤️' }
}

// Helper function to get AQI level description
const getAQIDescription = (aqi) => {
  if (aqi <= 50) return { level: 'Good', color: '#00E400' }
  if (aqi <= 100) return { level: 'Moderate', color: '#FFFF00' }
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#FF7E00' }
  if (aqi <= 200) return { level: 'Unhealthy', color: '#FF0000' }
  if (aqi <= 300) return { level: 'Very Unhealthy', color: '#8F3F97' }
  return { level: 'Hazardous', color: '#7E0023' }
}

// City search endpoint
app.get('/api/cities/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query

    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Query parameter "q" is required and must be at least 2 characters' })
    }

    const cities = await searchCities(q, parseInt(limit))
    res.json({ cities })
  } catch (error) {
    console.error('City search error:', error.message)
    res.status(500).json({ message: 'Failed to search cities' })
  }
})

// Weather Routes (No authentication required)
app.get('/api/weather/city', async (req, res) => {
  try {
    const { city, lat, lon } = req.query

    let location
    
    if (lat && lon) {
      // Use provided coordinates
      location = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        name: city || 'Selected Location',
        country: 'Unknown',
        country_code: 'XX'
      }
    } else if (city) {
      // Get coordinates for the city
      location = await getCityCoordinates(city)
    } else {
      return res.status(400).json({ message: 'Either city name or coordinates (lat, lon) are required' })
    }
    
    // Get comprehensive weather data
    const weatherResponse = await axios.get(
      `${WEATHER_BASE_URL}/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`
    )

    // Get AQI data
    let aqiData = null
    try {
      const aqiResponse = await axios.get(
        `${AQI_BASE_URL}/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`
      )
      aqiData = aqiResponse.data.current
    } catch (aqiError) {
      console.log('AQI data not available for this location')
    }

    const current = weatherResponse.data.current
    const daily = weatherResponse.data.daily
    const hourly = weatherResponse.data.hourly
    const condition = getWeatherCondition(current.weather_code)

    // Process hourly data for next 24 hours
    const next24Hours = hourly.time.slice(0, 24).map((time, index) => ({
      time: time,
      temperature: Math.round(hourly.temperature_2m[index]),
      weather_code: hourly.weather_code[index],
      condition: getWeatherCondition(hourly.weather_code[index]),
      humidity: hourly.relative_humidity_2m[index],
      wind_speed: hourly.wind_speed_10m[index]
    }))

    // Process daily forecast for 7 days
    const forecast7Days = daily.time.map((date, index) => ({
      date: date,
      temp_max: Math.round(daily.temperature_2m_max[index]),
      temp_min: Math.round(daily.temperature_2m_min[index]),
      weather_code: daily.weather_code[index],
      condition: getWeatherCondition(daily.weather_code[index]),
      sunrise: daily.sunrise[index],
      sunset: daily.sunset[index]
    }))

    // Format response
    const formattedResponse = {
      coord: {
        lon: location.longitude,
        lat: location.latitude
      },
      weather: [{
        id: current.weather_code,
        main: condition.main,
        description: condition.description,
        icon: condition.icon
      }],
      main: {
        temp: Math.round(current.temperature_2m * 10) / 10,
        feels_like: Math.round(current.apparent_temperature * 10) / 10,
        temp_min: Math.round(daily.temperature_2m_min[0] * 10) / 10,
        temp_max: Math.round(daily.temperature_2m_max[0] * 10) / 10,
        pressure: Math.round(current.surface_pressure),
        humidity: Math.round(current.relative_humidity_2m)
      },
      visibility: 10000,
      wind: {
        speed: Math.round(current.wind_speed_10m * 10) / 10,
        deg: current.wind_direction_10m
      },
      sys: {
        country: location.country_code || location.country,
        sunrise: new Date(daily.sunrise[0]).getTime() / 1000,
        sunset: new Date(daily.sunset[0]).getTime() / 1000
      },
      name: location.name,
      location: {
        full_name: `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}, ${location.country}`,
        country: location.country,
        country_code: location.country_code,
        admin1: location.admin1,
        admin2: location.admin2,
        timezone: location.timezone || weatherResponse.data.timezone
      },
      hourly_forecast: next24Hours,
      daily_forecast: forecast7Days,
      aqi: aqiData ? {
        us_aqi: aqiData.us_aqi,
        pm10: aqiData.pm10,
        pm2_5: aqiData.pm2_5,
        co: aqiData.carbon_monoxide,
        no2: aqiData.nitrogen_dioxide,
        so2: aqiData.sulphur_dioxide,
        o3: aqiData.ozone,
        description: aqiData.us_aqi ? getAQIDescription(aqiData.us_aqi) : null
      } : null
    }

    res.json(formattedResponse)
  } catch (error) {
    console.error('Weather API error:', error.message)
    
    if (error.message === 'City not found') {
      return res.status(404).json({ message: 'City not found' })
    }

    res.status(500).json({ message: 'Failed to fetch weather data' })
  }
})

app.get('/api/weather/coordinates', async (req, res) => {
  try {
    const { lat, lon } = req.query

    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude parameters are required' })
    }

    // Get weather data with hourly and daily forecasts
    const weatherResponse = await axios.get(
      `${WEATHER_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`
    )

    // Get AQI data
    let aqiData = null
    try {
      const aqiResponse = await axios.get(
        `${AQI_BASE_URL}/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`
      )
      aqiData = aqiResponse.data.current
    } catch (aqiError) {
      console.log('AQI data not available for this location')
    }

    // Enhanced location name resolution with multiple fallbacks
    let locationInfo = {
      name: 'Your Location',
      country: 'Unknown',
      country_code: 'XX',
      admin1: null,
      admin2: null,
      timezone: weatherResponse.data.timezone || null
    }
    
    try {
      // Primary: Try multiple geocoding services for better accuracy
      let locationFound = false
      
      // Method 1: BigDataCloud reverse geocoding (free, no API key needed)
      try {
        const altResponse = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`, {
          timeout: 5000 // 5 second timeout
        })
        if (altResponse.data && (altResponse.data.city || altResponse.data.locality)) {
          locationInfo = {
            name: altResponse.data.city || altResponse.data.locality || altResponse.data.principalSubdivision || 'Your Location',
            country: altResponse.data.countryName || 'Unknown',
            country_code: altResponse.data.countryCode || 'XX',
            admin1: altResponse.data.principalSubdivision, // State/Province
            admin2: altResponse.data.locality, // City/Town
            timezone: weatherResponse.data.timezone
          }
          locationFound = true
          console.log('Location found via BigDataCloud:', locationInfo.name)
        }
      } catch (error) {
        console.log('BigDataCloud geocoding failed:', error.message)
      }
      
      // Method 2: Nominatim reverse geocoding (OpenStreetMap) - if first method failed
      if (!locationFound) {
        try {
          const nominatimResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
            headers: {
              'User-Agent': 'WeatherApp/1.0'
            },
            timeout: 5000 // 5 second timeout
          })
          
          if (nominatimResponse.data && nominatimResponse.data.address) {
            const addr = nominatimResponse.data.address
            const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.county || 'Your Location'
            
            locationInfo = {
              name: cityName,
              country: addr.country || 'Unknown',
              country_code: addr.country_code?.toUpperCase() || 'XX',
              admin1: addr.state || addr.province || addr.region, // State/Province
              admin2: addr.county || addr.district, // County/District
              timezone: weatherResponse.data.timezone
            }
            locationFound = true
            console.log('Location found via Nominatim:', locationInfo.name)
          }
        } catch (error) {
          console.log('Nominatim geocoding failed:', error.message)
        }
      }
      
      // Method 3: Use timezone as fallback for location name
      if (!locationFound && weatherResponse.data.timezone) {
        const timezoneParts = weatherResponse.data.timezone.split('/')
        if (timezoneParts.length > 1) {
          locationInfo.name = timezoneParts[timezoneParts.length - 1].replace(/_/g, ' ')
          locationInfo.admin1 = timezoneParts[0].replace(/_/g, ' ')
          console.log('Location fallback to timezone:', locationInfo.name)
        }
      }
      
    } catch (geoError) {
      console.log('All geocoding methods failed:', geoError.message)
    }

    const current = weatherResponse.data.current
    const daily = weatherResponse.data.daily
    const hourly = weatherResponse.data.hourly
    const condition = getWeatherCondition(current.weather_code)

    // Process hourly data for next 24 hours
    const next24Hours = hourly.time.slice(0, 24).map((time, index) => ({
      time: time,
      temperature: Math.round(hourly.temperature_2m[index]),
      weather_code: hourly.weather_code[index],
      condition: getWeatherCondition(hourly.weather_code[index]),
      humidity: hourly.relative_humidity_2m[index],
      wind_speed: hourly.wind_speed_10m[index]
    }))

    // Process daily forecast for 7 days
    const forecast7Days = daily.time.map((date, index) => ({
      date: date,
      temp_max: Math.round(daily.temperature_2m_max[index]),
      temp_min: Math.round(daily.temperature_2m_min[index]),
      weather_code: daily.weather_code[index],
      condition: getWeatherCondition(daily.weather_code[index]),
      sunrise: daily.sunrise[index],
      sunset: daily.sunset[index]
    }))

    // Format response
    const formattedResponse = {
      coord: {
        lon: parseFloat(lon),
        lat: parseFloat(lat)
      },
      weather: [{
        id: current.weather_code,
        main: condition.main,
        description: condition.description,
        icon: condition.icon
      }],
      main: {
        temp: Math.round(current.temperature_2m * 10) / 10,
        feels_like: Math.round(current.apparent_temperature * 10) / 10,
        temp_min: Math.round(daily.temperature_2m_min[0] * 10) / 10,
        temp_max: Math.round(daily.temperature_2m_max[0] * 10) / 10,
        pressure: Math.round(current.surface_pressure),
        humidity: Math.round(current.relative_humidity_2m)
      },
      visibility: 10000,
      wind: {
        speed: Math.round(current.wind_speed_10m * 10) / 10,
        deg: current.wind_direction_10m
      },
      sys: {
        country: locationInfo.country_code,
        sunrise: new Date(daily.sunrise[0]).getTime() / 1000,
        sunset: new Date(daily.sunset[0]).getTime() / 1000
      },
      name: locationInfo.name,
      location: {
        full_name: `${locationInfo.name}${locationInfo.admin1 ? `, ${locationInfo.admin1}` : ''}, ${locationInfo.country}`,
        country: locationInfo.country,
        country_code: locationInfo.country_code,
        admin1: locationInfo.admin1,
        admin2: locationInfo.admin2,
        timezone: locationInfo.timezone
      },
      hourly_forecast: next24Hours,
      daily_forecast: forecast7Days,
      aqi: aqiData ? {
        us_aqi: aqiData.us_aqi,
        pm10: aqiData.pm10,
        pm2_5: aqiData.pm2_5,
        co: aqiData.carbon_monoxide,
        no2: aqiData.nitrogen_dioxide,
        so2: aqiData.sulphur_dioxide,
        o3: aqiData.ozone,
        description: aqiData.us_aqi ? getAQIDescription(aqiData.us_aqi) : null
      } : null
    }

    res.json(formattedResponse)
  } catch (error) {
    console.error('Weather API error:', error.message)
    res.status(500).json({ message: 'Failed to fetch weather data' })
  }
})

app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { city, lat, lon } = req.query

    let latitude, longitude
    
    if (city) {
      const location = await getCityCoordinates(city)
      latitude = location.latitude
      longitude = location.longitude
    } else if (lat && lon) {
      latitude = lat
      longitude = lon
    } else {
      return res.status(400).json({ message: 'Either city or coordinates are required' })
    }

    const response = await axios.get(
      `${WEATHER_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=5`
    )

    const daily = response.data.daily
    const forecast = {
      list: daily.time.map((date, index) => {
        const condition = getWeatherCondition(daily.weather_code[index])
        return {
          dt: new Date(date).getTime() / 1000,
          main: {
            temp_max: daily.temperature_2m_max[index],
            temp_min: daily.temperature_2m_min[index]
          },
          weather: [{
            main: condition.main,
            description: condition.description,
            icon: condition.icon
          }]
        }
      })
    }

    res.json(forecast)
  } catch (error) {
    console.error('Weather forecast API error:', error.message)
    
    if (error.message === 'City not found') {
      return res.status(404).json({ message: 'Location not found' })
    }

    res.status(500).json({ message: 'Failed to fetch forecast data' })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Weather API (Open-Meteo)',
    features: ['Weather Data', 'Air Quality Index', 'Geocoding', 'City Search']
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Weather API Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌤️ Using Open-Meteo API (no API key required)`)
  console.log(`🌬️ Air Quality Index (AQI) included`)
  console.log(`🔍 City search available at /api/cities/search`)
})