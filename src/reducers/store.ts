import { configureStore } from '@reduxjs/toolkit'
import userInputReducer from './userInputReducer'
import proposalsReducer from './proposalsReducer'
import notificationReducer from  './notificationReducer'
import urlReducer from './urlReducer'

const store = configureStore({
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