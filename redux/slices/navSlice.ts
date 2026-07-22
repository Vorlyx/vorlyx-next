import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NavState {
  activeSection: string | null
  isMenuOpen: boolean
}

const initialState: NavState = {
  activeSection: null,
  isMenuOpen: false,
}

// Navigation slice for managing navigation state
const navSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<string | null>) => {
      state.activeSection = action.payload
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen
    },
  },
})

export const { setActiveSection, toggleMenu } = navSlice.actions
export default navSlice.reducer

