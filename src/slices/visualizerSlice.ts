import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { generateMaze, generateVisitedMaze, isValidCell, OFFSETS_SIMPLE } from '../utils'

type Controls = {
    currentMazeWidth: number
    currentMazeHeight: number
    currentSpecialBlock: "startBlock" | "finishBlock"
    currentAlgorithm: "bfs" | "dfs"
    currentStepDelay: number
    randomMazeNoise: number
}

interface VisualizerState {
    // Maze related state
    // mazeWidth: number
    // mazeHeight: number
    maze: Array<Array<CellData>>
    visitedMaze: boolean[][]
    startRowIdx: number
    startColIdx: number
    finishRowIdx: number
    finishColIdx: number

    // Controls and UI related state
    isInitializationComplete: boolean
    shouldDisableControls: boolean
    controls: Controls
    
    // Algorithm related state
    array: [number, number, [number, number][]][]
    validPath: [number, number][]
    algorithmStatus: "stopped" | "running" | "completed"
}

const initialState: VisualizerState = {
    maze: [],
    visitedMaze: [],

    startRowIdx: -1,
    startColIdx: -1,
    finishRowIdx: -1,
    finishColIdx: -1,

    isInitializationComplete: false,

    shouldDisableControls: false,
    controls: {
        currentMazeWidth: 30,
        currentMazeHeight: 30,
        currentAlgorithm: "bfs",
        currentSpecialBlock: "startBlock",
        currentStepDelay: 100,
        randomMazeNoise: 35
    },

    array: [],
    validPath: [],
    algorithmStatus: "stopped"
}

export const test: any = []

export const visualizerSlice = createSlice({
    name: 'visualizer',
    initialState,
    reducers: {
        initializeMaze(state, action: PayloadAction<void>) {
            const [maze, start, finish] = generateMaze(state.controls.currentMazeWidth, state.controls.currentMazeHeight, state.controls.randomMazeNoise, false, false)
            state.maze = maze
            state.visitedMaze = generateVisitedMaze(state.controls.currentMazeWidth, state.controls.currentMazeHeight)

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
        setStartOrFinishCell(state, action: PayloadAction<[number, number]>) {
            const cellRowIdx = action.payload[0]
            const cellColIdx = action.payload[1]

            if (state.controls.currentSpecialBlock === "startBlock") {
                state.maze[state.startRowIdx][state.startColIdx].state = "empty"
                state.maze[cellRowIdx][cellColIdx].state = "start"

                state.startRowIdx = cellRowIdx
                state.startColIdx = cellColIdx
            } else if (state.controls.currentSpecialBlock === "finishBlock") {
                state.maze[state.finishRowIdx][state.finishColIdx].state = "empty"
                state.maze[cellRowIdx][cellColIdx].state = "finish"

                state.finishRowIdx = cellRowIdx
                state.finishColIdx = cellColIdx
            }
        },
        setControls(state, action: PayloadAction<Controls>) {
            state.controls = action.payload
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

            const currentCell = state.controls.currentAlgorithm === "bfs" ? state.array.shift() : state.array.pop()

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

                if (isValidCell(state.controls.currentMazeWidth, state.controls.currentMazeHeight, nextRow, nextCol)
                    && !state.visitedMaze[nextRow][nextCol]
                    && state.maze[nextRow][nextCol].state !== "block") {

                    state.array.push([nextRow, nextCol, [...pathSoFar, [nextRow, nextCol]]])
                    state.visitedMaze[nextRow][nextCol] = true
                }
            }
        },
        performReset(state, action: PayloadAction<void>) {
            state.array = []
            state.validPath = []
            state.algorithmStatus = "stopped"
            state.visitedMaze = generateVisitedMaze(state.controls.currentMazeWidth, state.controls.currentMazeHeight)
            
            state.isInitializationComplete = true
        }
    }
})

export const {
    initializeMaze,
    toggleBlockCell,
    setupAlgorithmLoop,
    runAlgorithmLoop,
    setControls,
    setStartOrFinishCell,
    performReset,
    setIsInitializationComplete
} = visualizerSlice.actions

export default visualizerSlice.reducer