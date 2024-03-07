import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInputState } from '../../types'

const initialState: UserInputState = {
  modal: 'none',
  stopFetching: false, 
  settings: {
    darkMode: false, 
    developerMode: false 
  }
}

export const selectedSpacesSlice = createSlice({
  name: 'userInput',
  initialState: initialState, 
  reducers: {
    updateModal: (state, action: PayloadAction< string | 'search' |'about' | 'settings' | 'savedSearches' | 'none'>) => {
      state.modal = action.payload
    },
    updateStopFetching: (state, action: PayloadAction<boolean>) => {
      state.stopFetching = action.payload
    },
    setDarkMode: (state, action: PayloadAction<boolean | undefined>) => {
      state.settings.darkMode = action.payload
    },
    setDeveloperMode: (state, action: PayloadAction<boolean | undefined>) => {
      state.settings.developerMode = action.payload
  },
  }
})

export const { 
  updateModal,
  updateStopFetching, 
  setDarkMode,
  setDeveloperMode
 } = selectedSpacesSlice.actions

export default selectedSpacesSlice.reducer