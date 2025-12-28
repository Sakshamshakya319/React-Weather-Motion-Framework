// API configuration for different environments
const config = {
  development: {
    API_BASE_URL: ''  // Use proxy in development
  },
  production: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://your-render-app.onrender.com'
  }
}

const environment = import.meta.env.MODE || 'development'
export const API_BASE_URL = config[environment].API_BASE_URL

export default {
  API_BASE_URL
}