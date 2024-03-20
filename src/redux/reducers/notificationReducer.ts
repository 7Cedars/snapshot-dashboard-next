import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '../../types'

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
    /** Note: 
     *  if id is not found, notification will add a new notification
     *  if there is a duplicate Id, notification will update info that is provided.
    */

    notification: (state, action: PayloadAction<Notification>) => {
      let notificationIds = state.notifications.map(notification => notification.id)
      let index = notificationIds.indexOf(action.payload.id)

      if (index === -1) { 
        const newNotification: Notification = {
          id: action.payload.id, 
          message: "",
          colour:  "gray",
          durationInMs: "noTimer",
          progressInPercent: "noProgress",
          visible: true
        }
        state.notifications.push(newNotification)
      }
      
      notificationIds = state.notifications.map(notification => notification.id)
      index = notificationIds.indexOf(action.payload.id) 

      action.payload.message ? 
        state.notifications[index].message = action.payload.message : null 

      action.payload.colour ? 
        state.notifications[index].colour = action.payload.colour : null

      // £todo Duration still has to be coded - tough one.  
      action.payload.durationInMs ? 
        state.notifications[index].durationInMs = action.payload.durationInMs : null

      action.payload.visible ? 
        state.notifications[index].visible = false : null

      action.payload.progressInPercent ? 
        state.notifications[index].progressInPercent = action.payload.progressInPercent : null

    }, 
    prioritizeNotification: (state, action: PayloadAction<string>) => {
      const notificationIds = state.notifications.map(notification => notification.id)
      const index = notificationIds.indexOf(action.payload) 

      if (index !== -1) {
        state.notifications.push(state.notifications[index])   
        state.notifications.splice(index, 1)
      }
    }, 
  }
})

export const { notification, prioritizeNotification } = notificationsSlice.actions

export default notificationsSlice.reducer