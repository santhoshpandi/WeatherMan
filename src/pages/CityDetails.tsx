import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/store'
import { useEffect, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi'
import { fetchWeatherData } from '../features/weatherSlice'
import { IoMdArrowRoundBack } from "react-icons/io";

export const CityDetails = () => {
  const { cityName } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const cityKey = cityName?.toLowerCase() || ''

  // const favourites = useSelector((state: RootState) => state.favourites.cities)
  const cities = useSelector((state: RootState) => state.cities.list)
  const unit = useSelector((state: RootState) => state.settings.unit)
  const cityData = useSelector((state: RootState) => state.weather.cities[cityKey])

  const [range, setRange] = useState<24 | 48>(24)
  const [metric, setMetric] = useState<'temp' | 'wind'>('temp')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  
  useEffect(() => {
    if (!cityData) {
      const city = cities.find(c => c.name.toLowerCase() === cityKey)
      if (city) {
        dispatch(fetchWeatherData({ city: city.name, lat: city.lat, lon: city.lon }))
      }
    }
  }, [cityData, cityKey, cities, dispatch])



  const convertTemp = (t: number) =>
    unit === 'fahrenheit' ? (t * 9) / 5 + 32 : t

  const hourlyData = useMemo(() => {
    if (!cityData?.hourly) return []
    const { time = [], temperature = [], windSpeed = [], humidity = [] } = cityData.hourly
    return time.slice(0, range).map((t: string, i: number) => ({
      time: t?.split('T')[1] || '',
      temp: convertTemp(temperature[i] ?? 0),
      wind: windSpeed[i] ?? 0,
      humidity: humidity[i] ?? 0,
    }))
  }, [cityData, range, unit])


  const dailyData = useMemo(() => {
    if (!cityData?.daily) return []
    const { time = [], tempMax = [], tempMin = [], precipitationSum = [], uvIndex = [] } = cityData.daily
    return time.map((d: string, i: number) => ({
      day: d,
      tempMax: convertTemp(tempMax[i] ?? 0),
      tempMin: convertTemp(tempMin[i] ?? 0),
      rain: precipitationSum[i] ?? 0,
      uv: uvIndex[i] ?? 0,
    }))
  }, [cityData, unit])

  // SAFETY CHECK
  if (!cityData || !cityData.current) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading city weather...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white p-4 sm:p-6 space-y-6">

      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-blue-400 p-4 rounded-2xl shadow-lg text-white">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-3xl cursor-pointer hover:scale-115 transition"
        >
          <IoMdArrowRoundBack />
        </button>

        {/* City Name */}
        <h1 className="text-3xl font-extrabold drop-shadow-md capitalize tracking-wide">
          {cityName}
        </h1>

        {/* Placeholder for alignment */}
        <div className="w-16" />
      </div>


      <div className="bg-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
        {/* Temperature */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-extrabold text-indigo-600">
            {Math.round(convertTemp(cityData.current.temperature))}°
          </div>
          <div className="text-sm text-gray-500 mt-1">Current Temp</div>
        </div>

        {/* Weather Stats */}
        <div className="grid grid-cols-2 gap-5 text-gray-700">
          <div className="flex items-center gap-2">
            <WiStrongWind className="text-blue-400 text-2xl" />
            <span className="font-medium">{cityData.current.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-2">
            <WiHumidity className="text-teal-400 text-2xl" />
            <span className="font-medium">{cityData.hourly?.humidity?.[0] ?? '--'}%</span>
          </div>
          <div className="flex items-center gap-2">
            <WiBarometer className="text-orange-400 text-2xl" />
            <span className="font-medium">{cityData.hourly?.pressure?.[0] ?? '--'} hPa</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-lg font-semibold text-sm">
              UV: {cityData.daily?.uvIndex?.[0] ?? '--'}
            </span>
          </div>
        </div>
      </div>


      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setRange(24)} className="btn">24h</button>
        <button onClick={() => setRange(48)} className="btn">48h</button>
        <button onClick={() => setMetric('temp')} className="btn">Temp</button>
        <button onClick={() => setMetric('wind')} className="btn">Wind</button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow">
        <h3 className="font-semibold mb-3">Hourly Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hourlyData}>
            <XAxis dataKey="time" />
            <Tooltip />
            <Line type="monotone" dataKey={metric} stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow">
        <h3 className="font-semibold mb-3">7 Day Forecast</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={dailyData}>
            <XAxis dataKey="day" />
            <Tooltip />
            <Area type="monotone" dataKey="tempMax" stroke="#f97316" fill="#fbbf24" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow">
        <h3 className="font-semibold mb-3">Precipitation</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={dailyData}>
            <XAxis dataKey="day" />
            <Tooltip />
            <Area type="monotone" dataKey="rain" stroke="#06b6d4" fill="#22d3ee" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}