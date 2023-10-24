import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification, NotificationWithoutId, NotificationId, NotificationUpdate } from '../../types'
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
    updateNotification: (state, action: PayloadAction<NotificationUpdate>) => {
      let notificationToChange = state.notifications.find(
        notification => { notification.id !== action.payload.id }
      )

      if (notificationToChange !== undefined) {
        let updatedMessage = "test"
        let updatedColour: "red" | "yellow" | "green" | "gray" = "gray"
        let updatedProgress = 100

        action.payload.message ? 
          updatedMessage = action.payload.message : notificationToChange.message

        action.payload.colour ? 
          updatedColour = action.payload.colour : notificationToChange.colour

        action.payload.progress ? 
          updatedProgress = action.payload.progress : notificationToChange.progress

        notificationToChange = {
          id: notificationToChange?.id, 
          message: updatedMessage, 
          colour: updatedColour,
          progress: updatedProgress   
        }

        // IS there a find and replace function for arrays. CHECK! 
      }


    }, 
    removeNotification: (state, action: PayloadAction<NotificationId>) => {

      state.notifications.filter(
        notification => { notification.id !== action.payload.id } 
      )
    }
  }
})

export const { addNotification, removeNotification } = notificationsSlice.actions

export default notificationsSlice.reducer