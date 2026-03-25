import type { Coordinates, WeatherResponse } from '../types/weather'

const GEO_URL = import.meta.env.VITE_GEO_URL
const WEATHER_URL = import.meta.env.VITE_WEATHER_URL

// 🧠 In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()

// Rate limiting control
let lastCallTime = 0
const MIN_DELAY = 1000

// 🔁 Rate limiter
const rateLimit = async () => {
  const now = Date.now()
  const diff = now - lastCallTime

  if (diff < MIN_DELAY) {
    await new Promise((res) => setTimeout(res, MIN_DELAY - diff))
  }

  lastCallTime = Date.now()
}

// 🧠 Cache helper
const getCachedData = (key: string) => {
  const cached = cache.get(key)
  if (!cached) return null

  const isValid = Date.now() - cached.timestamp < 60000 // 60 sec

  return isValid ? cached.data : null
}

const setCache = (key: string, data: any) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  })
}


export const searchCity = async (query: string): Promise<Coordinates[]> => {
  const cacheKey = `geo-${query}`
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  await rateLimit()

  const res = await fetch(`${GEO_URL}?name=${query}`)
  const data = await res.json()

  const results =
    data.results?.map((item: any) => ({
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.name,
      country: item.country,
    })) || []

  setCache(cacheKey, results)
  return results
}

export const fetchWeather = async (
  lat: number,
  lon: number
): Promise<WeatherResponse> => {
  if (isNaN(lat) || isNaN(lon)) throw new Error('Invalid coordinates')

  const cacheKey = `weather-${lat}-${lon}`

  // ✅ Cache check
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  // ✅ Rate limiting
  await rateLimit()

  // Build URL params
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),

    current_weather: 'true', // Open-Meteo requires this for current
    hourly: [
      'temperature_2m',
      'precipitation',
      'wind_speed_10m',
      'relativehumidity_2m',
      'pressure_msl',
    ].join(','),

    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'uv_index_max',
      'precipitation_sum',
    ].join(','),

    timezone: 'auto',
  })

  const url = `${WEATHER_URL}?${params.toString()}`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Weather API Error: ${res.status}`)

    const data = await res.json()

    // ❌ Safety checks
    if (!data.current_weather || !data.hourly || !data.daily) {
      throw new Error('Invalid weather data received')
    }

    // ✅ Format response
    const formatted: WeatherResponse = {
      current: {
        temperature: data.current_weather.temperature,
        windSpeed: data.current_weather.windspeed,
        weatherCode: data.current_weather.weathercode,
        pressure: data.current_weather.pressure, 
        time: data.current_weather.time,
      },
      hourly: {
        time: data.hourly.time,
        temperature: data.hourly.temperature_2m,
        precipitation: data.hourly.precipitation,
        windSpeed: data.hourly.wind_speed_10m,
        humidity: data.hourly.relativehumidity_2m,
        pressure: data.hourly.pressure_msl,
      },
      daily: {
        time: data.daily.time,
        tempMax: data.daily.temperature_2m_max,
        tempMin: data.daily.temperature_2m_min,
        uvIndex: data.daily.uv_index_max,
        precipitationSum: data.daily.precipitation_sum,
      },
    }

    // ✅ Cache result
    setCache(cacheKey, formatted)

    return formatted
  } catch (error) {
    console.error('Weather fetch failed:', error)
    throw error
  }
}