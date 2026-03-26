import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiHumidity,
  WiStrongWind,
} from 'react-icons/wi'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { useState, useMemo, useCallback } from 'react'
import {
  addFavourite,
  removeFavourite,
} from '../features/favouritesSlice'
import { useNavigate } from 'react-router-dom'

const getIcon = (code: number) => {
  if (code === 0) return <WiDaySunny size={42} />
  if (code <= 3) return <WiCloud size={42} />
  return <WiRain size={42} />
}

export const CityCard = ({ city, data }: any) => {
  const dispatch = useDispatch<AppDispatch>()
  const unit = useSelector((state: RootState) => state.settings.unit)
  const favourites = useSelector(
    (state: RootState) => state.favourites.cities
  )

  const navigate = useNavigate();

  const [hovered, setHovered] = useState(false)


  const isFavourite = useMemo(() => {
    return favourites.some(
      (c) => c.name.toLowerCase() === city.name.toLowerCase()
    )
  }, [favourites, city.name])


  const convertTemp = useCallback(
    (temp: number) => {
      return unit === 'fahrenheit'
        ? (temp * 9) / 5 + 32
        : temp
    },
    [unit]
  )


  const handleToggleFav = useCallback(() => {

    if (isFavourite) {
      dispatch(removeFavourite(city.name))
    } else {
      dispatch(addFavourite(city))
    }
  }, [dispatch, isFavourite, city])

  return (
    <div
     onClick={() => navigate(`/city/${city.name}?lat=${city.lat}&lng=${city.lon}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="
    relative
    rounded-2xl
    p-5
    backdrop-blur-lg
    bg-white/70
    border border-white/40
    shadow-lg
    transition-all duration-300
    cursor-pointer
    hover:shadow-2xl
    hover:-translate-y-1
    active:scale-95
  "
    >
      <div
        className={`
      absolute inset-0 rounded-2xl 
      bg-linear-to-br from-blue-100/30 to-transparent
      pointer-events-none   /* ✅ IMPORTANT */
      z-0                   /* ✅ ensure behind */
      transition-opacity duration-300
      ${hovered ? 'opacity-100' : 'opacity-60'}
    `}
      />

      <button
        onClick={(e) => {
          e.stopPropagation()
          handleToggleFav()
        }}
        className={`
      absolute top-3 right-3 z-20   /* ✅ IMPORTANT */
      text-xl transition
      ${isFavourite ? 'text-red-500' : 'text-gray-400'}
      hover:scale-110
    `}
      >
        {isFavourite ? '❤️' : '🤍'}
      </button>

      <h2 className="text-lg font-semibold text-gray-800 relative z-10">
        {city.name}
      </h2>

      <div className="flex items-center justify-between mt-3 relative z-10">
        <div className="text-4xl font-bold text-gray-900">
          {data?.current
            ? Math.round(convertTemp(data.current.temperature))
            : '--'}
          °
        </div>

        <div className="text-blue-600">
          {data?.current && getIcon(data.current.weatherCode)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600 relative z-10">
        <div className="flex items-center gap-2">
          <WiStrongWind className="text-blue-500 text-xl" />
          {data?.current?.windSpeed ?? '--'} km/h
        </div>

        {data?.hourly?.humidity && (
          <div className="flex items-center gap-2">
            <WiHumidity className="text-blue-500 text-xl" />
            {data.hourly.humidity[0]}%
          </div>
        )}
      </div>
    </div>
  )
}