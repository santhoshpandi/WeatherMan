import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


export interface City {
  name: string
  lat: number
  lon: number
}

interface FavouritesState {
  cities: City[]
}


const loadFromStorage = (): City[] => {
  try {
    const data = localStorage.getItem('favourites')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveToStorage = (cities: City[]) => {
  localStorage.setItem('favourites', JSON.stringify(cities))
}



const initialState: FavouritesState = {
  cities: loadFromStorage(),
}



const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<City>) => {      
      const exists = state.cities.find(
        (c) => c.name.toLowerCase() === action.payload.name.toLowerCase()
      )

      if (!exists) {
        state.cities.push(action.payload)
        saveToStorage(state.cities)
      }
    },

    removeFavourite: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter(
        (c) => c.name.toLowerCase() !== action.payload.toLowerCase()
      )
      saveToStorage(state.cities)
    },
  },
})


export const { addFavourite, removeFavourite } = favouritesSlice.actions
export default favouritesSlice.reducer