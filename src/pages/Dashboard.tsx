import { useEffect, useCallback, useMemo } from 'react'
import { SearchBar } from '../components/SearchBar'
import { CityCard } from '../components/CityCard'
import { SkeletonCard } from '../components/SkeletonCard'
import { ErrorState } from '../components/ErrorState'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { fetchWeatherData } from '../features/weatherSlice'

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>()

  const cities = useSelector((state: RootState) => state.cities.list)
  const weather = useSelector((state: RootState) => state.weather.cities)
  const favourites = useSelector(
    (state: RootState) => state.favourites.cities
  )


  const fetchAllCitiesWeather = useCallback(() => {
    cities.forEach((city) => {
      dispatch(
        fetchWeatherData({
          city: city.name,
          lat: city.lat,
          lon: city.lon,
        })
      )
    })
  }, [cities, dispatch])

  useEffect(() => {
    if (cities.length > 0) {
      fetchAllCitiesWeather()
    }
  }, [fetchAllCitiesWeather])

  /* ================= MEMOIZED LIST ================= */

  const cityCards = useMemo(() => {
    return cities.map((city, index) => {
      const data = weather[city.name.toLowerCase()]

      if (!data || data.loading) {
        return <SkeletonCard key={index} />
      }

      if (data.error) {
        return <ErrorState key={index} message={data.error} />
      }

      return (
        <CityCard
          key={index}
          city={city}
          data={data}
        />
      )
    })
  }, [cities, weather])

  const favouriteCards = useMemo(() => {
    return favourites.map((city, index) => {
      const data = weather[city.name.toLowerCase()]

      if (!data || data.loading) {
        return <SkeletonCard key={index} />
      }

      if (data.error) {
        return <ErrorState key={index} message={data.error} />
      }

      return (
        <CityCard
          key={index}
          city={city}
          data={data}
        />
      )
    })
  }, [favourites, weather])


  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 space-y-8 pb-10">
      <SearchBar />

      {/* MAIN CITIES */}
      <div>
        <h2 className="text-xl font-semibold  mb-3 bg-blue-500 px-2 py-1 text-white">
          Home
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cityCards}
        </div>
      </div>

      {/* FAVOURITES */}
      {favourites.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold  mb-3 bg-rose-500 px-2 py-1 text-white">
            Favourites
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favouriteCards}
          </div>
        </div>
      )}
    </div>
  )
}