import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { generateMaze, generateVisitedMaze, isValidCell, OFFSETS_SIMPLE } from '../utils'

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

    array: [number, number, [number, number][]][]
    validPath: [number, number][]
    algorithm: "bfs" | "dfs",
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

    array: [],
    validPath: [],
    algorithm: "dfs",
    algorithmStatus: "stopped"
}

export const visualizerSlice = createSlice({
    name: 'visualizer',
    initialState,
    reducers: {
        initializeMaze(state, action: PayloadAction<void>) {
            const [maze, start, finish] = generateMaze(state.mazeWidth, state.mazeHeight, 20, false, false)
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
            state.array.push([state.startRowIdx, state.startColIdx, [[state.startRowIdx, state.startColIdx]]])
            state.visitedMaze[state.startRowIdx][state.startColIdx] = true

            state.algorithmStatus = "running"
        },
        runAlgorithmLoop(state, action: PayloadAction<void>) {
            // Guard statement to prevent redundant actions from setInterval
            // TODO: Refactor so this statement is not required
            if (state.algorithmStatus === "completed") {
                return
            }
            
            const currentCell = state.algorithm === "bfs" ? state.array.shift() : state.array.pop()

            // Array is empty and there are no more cells to search, meaning no path was found
            if (currentCell === undefined) {
                state.algorithmStatus = "completed"
                return
            }

            const [currentRow, currentCol, pathSoFar] = currentCell

            state.visitedMaze[currentRow][currentCol] = true

            // Path from start to finish was found
            if (currentRow === state.finishRowIdx && currentCol === state.finishColIdx) {
                state.algorithmStatus = "completed"
                state.validPath = pathSoFar
                return
            }

            // Push next possible adjacent cells into the array
            for (const [offsetX, offsetY] of OFFSETS_SIMPLE) {
                const nextRow = currentRow + offsetX
                const nextCol = currentCol + offsetY

                if (isValidCell(state.mazeWidth, state.mazeHeight, nextRow, nextCol)
                    && !state.visitedMaze[nextRow][nextCol]
                    && state.maze[nextRow][nextCol].state !== "block") {

                    state.array.push([nextRow, nextCol, [...pathSoFar, [nextRow, nextCol]]])
                    state.visitedMaze[nextRow][nextCol] = true
                }
            }
        }
    }
})

export const { initializeMaze, toggleBlockCell, setVisitedCell, setupAlgorithmLoop, runAlgorithmLoop } = visualizerSlice.actions

export default visualizerSlice.reducer