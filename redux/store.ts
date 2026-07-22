import { configureStore } from '@reduxjs/toolkit'
import navSlice from './slices/navSlice'

// Configure Redux store with navigation slice
export const store = configureStore({
  reducer: {
    navigation: navSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

