import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
    currentTheme: "light" | "dark"
}

const initialState: UiState = {
    currentTheme: "dark"
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentTheme(state, action: PayloadAction<"light" | "dark">) {
        state.currentTheme = action.payload
    }
  }
})

export const { setCurrentTheme } = uiSlice.actions

export default uiSlice.reducer