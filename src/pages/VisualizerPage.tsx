import classnames from "classnames"
import { useEffect } from "react"
import Cell from "../components/Cell"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { initializeMaze, runAlgorithmLoop, setupAlgorithmLoop, setVisitedCell, toggleBlockCell } from "../slices/visualizerSlice"
import { createRowId, generateVisitedMaze, isValidCell } from "../utils"

const VisualizerPage = () => {
    const dispatch = useAppDispatch()
    const { maze, visitedMaze } = useAppSelector(state => state.visualizer)

    useEffect(() => {
        dispatch(initializeMaze())
    }, [])

    return <div className="flex flex-col items-center p-8">
        <section className="bg-white dark:bg-zinc-700 overflow-hidden shadow-xl dark:shadow-black/50">
            <div className="flex flex-col">
                {
                    maze.map((row, rowIdx) => <div
                        key={createRowId(row)}
                        className="flex">
                        {
                            row.map((cell, cellIdx) => <Cell
                                key={cell.id}
                                cell={cell}
                                cellRowIdx={rowIdx}
                                cellColIdx={cellIdx}
                                isVisited={visitedMaze[rowIdx][cellIdx]}
                            />)
                        }
                    </div>)
                }
            </div>

        </section>
        <button onClick={() => {
            dispatch(setupAlgorithmLoop())
            setInterval(() => dispatch(runAlgorithmLoop()))
        }}>BFS</button>
    </div>
}

export default VisualizerPage

// TODO: Loading state for maze
// TODO: Gracefully complete BFS/DFS
// TODO: Collect path as the BFS/DFS runs
// TODO: Mark the path once BFS/DFS is complete
// TODO: Reset maze
// TODO: Controls to place blocks, start and finish
// TODO: Controls to choose between BFS or DFS
// TODO: Control to randomly generate a maze
// TODO: Lock down the user interactions while BFS/DFS is running

// TODO: Experiment with async thunks instead of setInterval
// TODO: Controls or page to change the height and width of the maze
// TODO: Fancy styles
// TODO: Explore other algorithms
// TODO: Diagonal movements