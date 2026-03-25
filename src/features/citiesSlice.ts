import { createSlice,type PayloadAction } from '@reduxjs/toolkit'

interface City {
  name: string
  lat: number
  lon: number
}

interface CitiesState {
  list: City[]
}

const initialState: CitiesState = {
  list: [
    { name: 'Chennai', lat: 13.0878, lon: 80.2785 },
    { name: 'Delhi', lat: 28.6139, lon: 77.209 },
    { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  ],
}

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<City>) => {
      const exists = state.list.find(
        (c) => c.name.toLowerCase() === action.payload.name.toLowerCase()
      )

      if (!exists) {
        state.list.unshift(action.payload)
      }
    },
  },
})

export const { addCity } = citiesSlice.actions
export default citiesSlice.reducer