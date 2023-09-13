import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {  UrlDataPayload } from '../../types'
import { standardDateRange } from '../../../constants'

interface Props {
  urlData: string
}

const initialState: Props = {
  urlData: `/?sps=&sd=${Date.now() - standardDateRange}&ed=${Date.now()}`, // I can shorten dates later.  
}

export const urlDataSlice = createSlice({
  name: 'urlData',
  initialState: initialState, 
  reducers: {
    updateUrl: (state, action: PayloadAction<UrlDataPayload>) => {    
      const splitUrl = state.urlData.split('&')

      switch (action.payload.type) {
        case 'space': {
          const isSelected = splitUrl[0].indexOf(action.payload.data)
          if (isSelected === -1) {
              splitUrl[0] = splitUrl[0] + `${action.payload.data};`
              state.urlData = splitUrl.join('&')
            } else {
              splitUrl[0] = splitUrl[0].replace(`${action.payload.data};`, '')
              state.urlData = splitUrl.join('&')
            }
          }
          break;
        case 'startDate':
          splitUrl[1] = `sd:${action.payload.data}`
          state.urlData = splitUrl.join('&&')
          break;
        case 'endDate':
          splitUrl[2] = `ed:${action.payload.data}`
          state.urlData = splitUrl.join('&&')
          break;
        default:
          console.log(`Non-existing type provided at updateUrl at userInputReducer.`);        
      }
    },
  }
})

export const { updateUrl } = urlDataSlice.actions

export default urlDataSlice.reducer