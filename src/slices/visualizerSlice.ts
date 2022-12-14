import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { generateMaze } from '../utils'

interface VisualizerState {
    mazeWidth: number
    mazeHeight: number
    maze: Array<Array<Cell>>
}

const initialState: VisualizerState = {
    mazeWidth: 30,
    mazeHeight: 30,
    maze: [],
}

export const visualizerSlice = createSlice({
    name: 'visualizer',
    initialState,
    reducers: {
        initializeMaze(state, action: PayloadAction<void>) {
            state.maze = generateMaze(state.mazeWidth, state.mazeHeight, 20, true, false)
        },
        toggleBlockCell(state, action: PayloadAction<[number, number]>) {
            const cellRowIdx = action.payload[0]
            const cellColIdx = action.payload[1]
            const currentCellState = state.maze[cellRowIdx][cellColIdx].state

            state.maze[cellRowIdx][cellColIdx].state = currentCellState === "block" ? "empty" : "block"
        }
    }
})

export const { initializeMaze, toggleBlockCell } = visualizerSlice.actions

export default visualizerSlice.reducer