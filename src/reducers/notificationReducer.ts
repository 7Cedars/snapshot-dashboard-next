import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification, NotificationWithoutId } from '../types'
import { v4 as uuidv4 } from 'uuid';

interface NotificationState {
  notifications: Notification[]
}

const initialState: NotificationState = {
  notifications: []
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationWithoutId>) => {

      const notification = {
        id: uuidv4(), 
        ...action.payload
      } 
      
      console.log("notification: ", action.payload)
      state.notifications.push(notification)
    }, 
    removeNotification: (state, action: PayloadAction<Notification>) => {

      state.notifications.filter(
        notification => { notification.id !== action.payload.id } 
      )
    }
  }
})

export const { addNotification, removeNotification } = notificationsSlice.actions

export default notificationsSlice.reducer