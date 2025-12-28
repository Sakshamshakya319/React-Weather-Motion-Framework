import Dashboard from './components/Dashboard'
import ThemeProvider from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Dashboard />
      </div>
    </ThemeProvider>
  )
}

export default App