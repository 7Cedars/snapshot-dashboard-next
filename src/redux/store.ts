import { configureStore } from '@reduxjs/toolkit'
import userInputReducer from './reducers/userInputReducer'
import proposalsReducer from './reducers/proposalsReducer'
import notificationReducer from  './reducers/notificationReducer'
import urlReducer from './reducers/urlReducer'

export const store = configureStore({
  reducer: {
    urlData: urlReducer, 
    userInput: userInputReducer, 
    loadedProposals: proposalsReducer, 
    notification: notificationReducer
  }
})

// see redux website for these typescript examples. 
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store