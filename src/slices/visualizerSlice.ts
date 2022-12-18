import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AppAsyncThunkConfig, RootState } from '../store'
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

// TODO: Better typing
const setupAlgorithmLoopAsync = createAsyncThunk<
    boolean,
    void,
    { state: RootState }
>(
    "visualizerSlice/setupAlgorithmLoopAsync",
    async (_, { getState, dispatch: AppDispatch }) => {
        return true
    }
)

const runAlgorithmLoopAsync = createAsyncThunk<
    boolean,
    void,
    AppAsyncThunkConfig
>(
    "visualizerSlice/runAlgorithmLoopAsync",
    async (_, { getState, dispatch: AppDispatch, rejectWithValue, fulfillWithValue }) => {
        // Guard statement to prevent redundant actions from setInterval
        if (getState().visualizer.algorithmStatus === "completed") {
            return rejectWithValue(false)
        }

        const currentCell = getState().visualizer.algorithm === "bfs"
            ? getState().visualizer.array.shift()
            : getState().visualizer.array.pop()

        // Array is empty and there are no more cells to search, meaning no path was found
        if (currentCell === undefined) {
            getState().visualizer.algorithmStatus = "completed"
            return rejectWithValue(false)
        }

        const [currentRow, currentCol, pathSoFar] = currentCell

        getState().visualizer.visitedMaze[currentRow][currentCol] = true

        // Path from start to finish was found
        if (currentRow === getState().visualizer.finishRowIdx
            && currentCol === getState().visualizer.finishColIdx) {
            getState().visualizer.algorithmStatus = "completed"
            getState().visualizer.validPath = pathSoFar
            return fulfillWithValue(true)
        }

        // Push next possible adjacent cells into the array
        for (const [offsetX, offsetY] of OFFSETS_SIMPLE) {
            const nextRow = currentRow + offsetX
            const nextCol = currentCol + offsetY

            if (isValidCell(getState().visualizer.mazeWidth, getState().visualizer.mazeHeight, nextRow, nextCol)
                && !getState().visualizer.visitedMaze[nextRow][nextCol]
                && getState().visualizer.maze[nextRow][nextCol].state !== "block") {

                getState().visualizer.array.push([nextRow, nextCol, [...pathSoFar, [nextRow, nextCol]]])
                getState().visualizer.visitedMaze[nextRow][nextCol] = true
            }
        }

        return rejectWithValue(false)
    }
)

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
    },
    extraReducers: (builder) => {
        builder.addCase(setupAlgorithmLoopAsync.pending, (state, action) => {

        }).addCase(setupAlgorithmLoopAsync.fulfilled, (state, action) => {
            state.array.push([state.startRowIdx, state.startColIdx, [[state.startRowIdx, state.startColIdx]]])
            state.visitedMaze[state.startRowIdx][state.startColIdx] = true

            state.algorithmStatus = "running"
        }).addCase(setupAlgorithmLoopAsync.rejected, (state, action) => {

        })

        builder.addCase(runAlgorithmLoopAsync.pending, (state, action) => {

        }).addCase(runAlgorithmLoopAsync.fulfilled, (state, action) => {
            console.log(state.algorithm)
        }).addCase(runAlgorithmLoopAsync.rejected, (state, action) => {

        })
    },
})

export const { initializeMaze, toggleBlockCell, setVisitedCell, setupAlgorithmLoop, runAlgorithmLoop } = visualizerSlice.actions

export default visualizerSlice.reducer