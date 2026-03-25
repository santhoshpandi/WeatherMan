import { configureStore } from '@reduxjs/toolkit'
import weatherReducer from '../features/weatherSlice'
import favouritesReducer from '../features/favouritesSlice'
import settingsReducer from '../features/settingsSlice'
import citiesReducer from '../features/citiesSlice'

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favourites: favouritesReducer,
    settings: settingsReducer,
    cities: citiesReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch