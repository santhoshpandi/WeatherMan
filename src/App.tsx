import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { CityDetails } from './pages/CityDetails'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen  mx-auto max-w-[100rem]  bg-linear-to-br from-white via-blue-50 to-blue-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/city/:cityName" element={<CityDetails />} />
      </Routes>
    </div>
  )
}

export default App