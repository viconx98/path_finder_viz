import { useEffect } from "react"
import Cell from "../components/Cell"
import Loading from "../components/Loading/Loading"
import Sidebar from "../components/Sidebar"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { initializeMaze } from "../slices/visualizerSlice"
import { createRowId } from "../utils"

const VisualizerPage = () => {
    const dispatch = useAppDispatch()
    const { maze, visitedMaze, isInitializationComplete, algorithmStatus, validPath } = useAppSelector(state => state.visualizer)

    useEffect(() => {
        setTimeout(() => dispatch(initializeMaze()))
    }, [])

    return <div className="flex items-center">
        <Sidebar />

        <section className="flex-1 flex flex-col justify-center items-center">
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
                                            isPath={validPath.some(coord => coord[0] === rowIdx && coord[1] === colIdx)}
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
// TODO: Random maze that actually looks like maze instead of randomly scattered blocks

// TODO: Optimize visited array
// TODO: Optimize isPath search
// TODO: Figure out why the loops slow down in the dev mode?
// TODO: Check BFS/DFS behaviour
// - If found, mark the finish right inside the offset loop instead of marking it after pop to stop the DFS from running redundantly
// - Check for duplicate pushes

// TODO: Experiment with async thunks instead of setInterval
// TODO: Controls or page to change the height and width of the maze
// TODO: Fancy styles
// TODO: Explore other algorithms
// TODO: Explore other movement rules
// TODO: Maybe animate the valid path