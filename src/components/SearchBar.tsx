import { useState, useEffect } from 'react'
import { searchCity } from '../services/weatherAPI'
import { fetchWeatherData } from '../features/weatherSlice'
import { addCity } from '../features/citiesSlice'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store/store'

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      try {
        setLoading(true)
        const res = await searchCity(query)
        setResults(res)
      } catch (err) {
        console.error('Search error:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(debounce)
  }, [query])


  const handleSelect = (cityData: any) => {
    const city = cityData.name

    const cityObj = {
      name: city,
      lat: cityData.latitude,
      lon: cityData.longitude,
    }

    // ✅ 1. Add to dashboard cities list
    dispatch(addCity(cityObj))

    // ✅ 2. Fetch weather data
    dispatch(
      fetchWeatherData({
        city,
        lat: cityObj.lat,
        lon: cityObj.lon,
      })
    )

    // cleanup UI
    setQuery('')
    setResults([])
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city..."
        className="
          w-full px-4 py-3 
          text-sm sm:text-base
          rounded-full 
          bg-white 
          border-2 border-blue-500
          text-gray-700 
          placeholder-gray-500
          outline-none
          focus:ring-2 focus:ring-blue-400
        "
      />

      {query && (
        <div
          className="
            absolute w-full mt-2 
            bg-white z-10
            border border-blue-100
            rounded-xl shadow-lg 
            max-h-60 overflow-y-auto
          "
        >
          {loading && (
            <div className="p-3 text-blue-700 text-sm">
              Searching...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-3 text-slate-900 text-sm">
              No results
            </div>
          )}

          {results.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSelect(item)} // ✅ updated
              className="p-3 cursor-pointer hover:bg-blue-50 text-blue-900"
            >
              {item.name}, {item.country}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}