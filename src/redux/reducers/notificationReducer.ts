import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification, NotificationId, NotificationUpdate } from '../../types'

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
    // Note: addNotification can also be used to completely replace a notification. 
    addNotification: (state, action: PayloadAction<Notification>) => {
      console.log(`addNotification called. Action Payload: ${action.payload.id} `)
      const notificationIds = state.notifications.map(notification => notification.id)
      const index = notificationIds.indexOf(action.payload.id) 
      console.log(`Notification index: ${index}`)

      if (index === -1) {
        state.notifications.push(action.payload)
      } else {
        state.notifications[index] = action.payload
      }      
    },
    updateNotification: (state, action: PayloadAction<NotificationUpdate>) => {
      console.log("updateNotification called")
      const notificationIds = state.notifications.map(notification => notification.id)
      const index = notificationIds.indexOf(action.payload.id) 

      if (index !== -1) {
        action.payload.message ? 
          state.notifications[index].message = action.payload.message : null 

        action.payload.colour ? 
          state.notifications[index].colour = action.payload.colour : null

        action.payload.progress ? 
          state.notifications[index].progress = action.payload.progress : null
      }
    }, 
    removeNotification: (state, action: PayloadAction<NotificationId>) => {
      console.log("removeNotification called")
      state.notifications.filter(
        notification => { notification.id !== action.payload.id } 
      )
    }
  }
})

export const { addNotification, removeNotification } = notificationsSlice.actions

export default notificationsSlice.reducer