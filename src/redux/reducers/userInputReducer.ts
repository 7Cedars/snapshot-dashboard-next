import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInputState } from '../../../types'
import { standardDateRange } from '../../../constants'

const initialState: UserInputState = {
  // selectedSpaces: [], 
  // startDate: Date.now() - standardDateRange,
  // endDate: Date.now(),
  modal: 'none',
  stopFetching: false, 
  settings: {
    darkMode: false, 
    developerMode: false 
  }

}

// HERE needs to go through parsers... right?! 
export const selectedSpacesSlice = createSlice({
  name: 'userInput',
  initialState: initialState, 
  reducers: {
    // updateSelectedSpaces: (state, action: PayloadAction<string[]>) => {
    //  state.selectedSpaces = action.payload
    // },
    // updateStartDate: (state, action: PayloadAction<number>) => {
    //   state.startDate = action.payload
    // }, 
    // updateEndDate: (state, action: PayloadAction<number>) => {
    //   state.endDate = action.payload
    // },
    updateModal: (state, action: PayloadAction<'search' |'about' | 'settings' | 'savedSearches' | 'none'>) => {
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
  // updateSelectedSpaces, 
  // updateStartDate, 
  // updateEndDate, 
  updateModal,
  updateStopFetching, 
  setDarkMode,
  setDeveloperMode
 } = selectedSpacesSlice.actions

export default selectedSpacesSlice.reducer