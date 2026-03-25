import { createSlice } from '@reduxjs/toolkit'

type Unit = 'celsius' | 'fahrenheit'

interface SettingsState {
  unit: Unit
}

const initialState: SettingsState = {
  unit: 'celsius',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleUnit: (state) => {
      state.unit =
        state.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})

export const { toggleUnit } = settingsSlice.actions
export default settingsSlice.reducer