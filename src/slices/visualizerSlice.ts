import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { generateMaze, generateVisitedMaze, isValidCell, OFFSETS } from '../utils'

interface VisualizerState {
    mazeWidth: number
    mazeHeight: number
    maze: Array<Array<CellData>>
    visitedMaze: boolean[][]

    startRowIdx: number
    startColIdx: number
    finishRowIdx: number
    finishColIdx: number

    isInitializationComplete: boolean

    queue: Array<[number, number]>
    algorithmStatus: "stopped" | "running" | "completed"
}

const initialState: VisualizerState = {
    mazeWidth: 30,
    mazeHeight: 30,
    maze: [],
    visitedMaze: [],

    startRowIdx: -1,
    startColIdx: -1,
    finishRowIdx: -1,
    finishColIdx: -1,

    isInitializationComplete: false,

    queue: [],
    algorithmStatus: "stopped"
}

export const visualizerSlice = createSlice({
    name: 'visualizer',
    initialState,
    reducers: {
        initializeMaze(state, action: PayloadAction<void>) {
            const [maze, start, finish] = generateMaze(state.mazeWidth, state.mazeHeight, 20, true, false)
            state.maze = maze
            state.visitedMaze = generateVisitedMaze(state.mazeWidth, state.mazeHeight)

            state.startRowIdx = start[0]
            state.startColIdx = start[1]
            state.finishRowIdx = finish[0]
            state.finishColIdx = finish[1]

            state.isInitializationComplete = true
        },
        setIsInitializationComplete(state, action: PayloadAction<boolean>) {
            state.isInitializationComplete = action.payload
        },
        toggleBlockCell(state, action: PayloadAction<[number, number]>) {
            const cellRowIdx = action.payload[0]
            const cellColIdx = action.payload[1]
            const currentCellState = state.maze[cellRowIdx][cellColIdx].state

            state.maze[cellRowIdx][cellColIdx].state = currentCellState === "block" ? "empty" : "block"
        },
        setVisitedCell(state, action: PayloadAction<[number, number]>) {
            const cellRowIdx = action.payload[0]
            const cellColIdx = action.payload[1]

            state.visitedMaze[cellRowIdx][cellColIdx] = true
        },
        setupAlgorithmLoop(state, action: PayloadAction<void>) {
            state.queue.push([state.startRowIdx, state.startColIdx])
            state.visitedMaze[state.startRowIdx][state.startColIdx] = true
        },
        runAlgorithmLoop(state, action: PayloadAction<void>) {
            // TODO: undefined check
            const [currentRow, currentCol] = state.queue.shift()!

            state.visitedMaze[currentRow][currentCol] = true

            if (currentRow === state.finishRowIdx && currentCol === state.finishColIdx) {
                state.algorithmStatus = "completed"
                return
            }

            for (const [offsetX, offsetY] of OFFSETS) {
                const nextRow = currentRow + offsetX
                const nextCol = currentCol + offsetY

                if (isValidCell(state.mazeWidth, state.mazeHeight, nextRow, nextCol)
                    && !state.visitedMaze[nextRow][nextCol]
                    && state.maze[nextRow][nextCol].state !== "block") {

                    state.queue.push([nextRow, nextCol])
                    state.visitedMaze[nextRow][nextCol] = true
                }
            }
        }
    }
})

export const { initializeMaze, toggleBlockCell, setVisitedCell, setupAlgorithmLoop, runAlgorithmLoop } = visualizerSlice.actions

export default visualizerSlice.reducer