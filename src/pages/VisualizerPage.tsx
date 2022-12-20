import { useEffect } from "react"
import Cell from "../components/Cell/Cell"
import Loading from "../components/Loading/Loading"
import Sidebar from "../components/Sidebar"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { initializeMaze } from "../slices/visualizerSlice"
import { createRowId } from "../utils"

const VisualizerPage = () => {
    const dispatch = useAppDispatch()
    const { maze, visitedMaze, isInitializationComplete, algorithmStatus, validPath } = useAppSelector(state => state.visualizer)
    const { controls, array, totalStepDuration, averageStepDuration, stepCount } = useAppSelector(state => state.visualizer)

    useEffect(() => {
        setTimeout(() => dispatch(initializeMaze()))
    }, [])

    const checkIsPath = (path: [number, number][], cellRowIdx: number, cellColIdx: number) => {
        if (!path.length) return [false, -1] as [boolean, number]
        
        let pathIdx = -1
        let isPath = false

        for (let index = 0; index < path.length; index++) {
            const coord = path[index];
            if (coord[0] === cellRowIdx && coord[1] === cellColIdx) {
                pathIdx = index
                isPath = true
                break
            }
        }

        console.log([isPath, pathIdx])
        return [isPath, pathIdx] as [boolean, number]
    }

    return <div className="flex items-center">
        <Sidebar />

        <section className="relative flex-1 h-screen flex flex-col justify-center items-center">
                {
                    controls.showDebugView && <div className="absolute top-0 left-0 w-52 h-52 p-2 m-2 rounded-md bg-blue-500/50">
                        <p>Debug View</p>
                        <p>Array Length: {array.length}</p>
                        <p>Step Count: {stepCount}</p>
                        <p>Total Step Duration: {totalStepDuration}</p>
                        <p>Avg. Step Duration: {averageStepDuration}</p>
                    </div>
                }

                {
                    !isInitializationComplete && <Loading text="Building maze" />
                }

                {
                    isInitializationComplete && <div className="bg-white dark:bg-zinc-700 shadow-xl overflow-hidden dark:shadow-black/50">
                        <div className="flex flex-col">
                            {
                                maze.map((row, rowIdx) => <div
                                    key={createRowId(row)}
                                    className="flex">
                                    {
                                        row.map((cell, colIdx) => <Cell
                                            key={cell.id}
                                            cell={cell}
                                            cellRowIdx={rowIdx}
                                            cellColIdx={colIdx}
                                            isVisited={visitedMaze[rowIdx][colIdx]}
                                            path={checkIsPath(validPath, rowIdx, colIdx)}
                                        />)
                                    }
                                </div>)
                            }
                        </div>
                    </div>
                }

                {
                    algorithmStatus === "completed" && validPath.length === 0 && <p className="py-4 text-red-400 font-semibold">
                        Path from start to finish doesn't exist with current movements
                    </p>
                }
            </section>
    </div>
}

export default VisualizerPage

// TODO: Lock down the user interactions while BFS/DFS is running
// TODO: Diagonal movements
// TODO: Continuous cell toggle

// TODO: Optimize visited array
// TODO: Optimize isPath search
// TODO: Figure out why the loops slow down in the dev mode?
// TODO: Check BFS/DFS behaviour
// - If found, mark the finish right inside the offset loop instead of marking it after pop to stop the DFS from running redundantly
// - Check for duplicate pushes

// TODO: Random maze that actually looks like maze instead of randomly scattered blocks
// TODO: Experiment with async thunks instead of setInterval
// TODO: Controls or page to change the height and width of the maze
// TODO: Fancy styles
// TODO: Explore other algorithms
// TODO: Explore other movement rules
// TODO: Maybe animate the valid path