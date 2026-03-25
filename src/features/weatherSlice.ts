import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchWeather } from '../services/weatherAPI'
import { type WeatherResponse } from '../types/weather'

interface CityWeather {
  current?: WeatherResponse['current']
  hourly?: WeatherResponse['hourly']
  daily?: WeatherResponse['daily']
  lastFetched?: number
  loading: boolean
  error: string | null
}

interface WeatherState {
  cities: Record<string, CityWeather>
}


const initialState: WeatherState = {
  cities: {},
}


export const fetchWeatherData = createAsyncThunk<
  { city: string; data: WeatherResponse },
  { city: string; lat: number; lon: number },
  { state: any }
>(
  'weather/fetchWeatherData',
  async ({ city, lat, lon }) => {
    const data = await fetchWeather(lat, lon)
    return { city, data }
  },
  {
    condition: ({ city }, { getState }) => {
      const state = getState() as any

      const cityData =
        state?.weather?.cities?.[city.toLowerCase()]

      // ⛔ Skip if data is fresh (<60s)
      if (
        cityData?.lastFetched &&
        Date.now() - cityData.lastFetched < 60000
      ) {
        return false
      }

      return true
    },
  }
)


const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    removeCityWeather: (state, action: { payload: string }) => {
      delete state.cities[action.payload.toLowerCase()]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state, action) => {
        const key = action.meta.arg.city.toLowerCase()

        // preserve existing data
        state.cities[key] = {
          ...state.cities[key],
          loading: true,
          error: null,
        }
      })

      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        const { city, data } = action.payload
        const key = city.toLowerCase()

        state.cities[key] = {
          current: data.current,
          hourly: data.hourly,
          daily: data.daily,
          lastFetched: Date.now(),
          loading: false,
          error: null,
        }
      })

      .addCase(fetchWeatherData.rejected, (state, action) => {
        const key = action.meta.arg.city.toLowerCase()

        state.cities[key] = {
          ...state.cities[key],
          loading: false,
          error:
            action.error.message ||
            'Failed to fetch weather data',
        }
      })
  },
})


export const { removeCityWeather } = weatherSlice.actions

export default weatherSlice.reducer