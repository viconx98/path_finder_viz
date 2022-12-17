import classnames from "classnames"
import { useEffect, useRef } from "react"
import Cell from "../components/Cell"
import Loading from "../components/Loading/Loading"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { initializeMaze, runAlgorithmLoop, setupAlgorithmLoop, setVisitedCell, toggleBlockCell } from "../slices/visualizerSlice"
import { createRowId, generateVisitedMaze, isValidCell } from "../utils"

const VisualizerPage = () => {
    const dispatch = useAppDispatch()
    const intervalRef = useRef<number | null>(null)
    const { maze, visitedMaze, isInitializationComplete, algorithmStatus, validPath } = useAppSelector(state => state.visualizer)

    useEffect(() => {
        setTimeout(() => dispatch(initializeMaze()))
    }, [])

    useEffect(() => {
        console.log("useEffect", algorithmStatus)
        if (algorithmStatus === "completed") {
            if (intervalRef.current) {
                console.log("intervalRef.current", intervalRef.current)
                clearInterval(intervalRef.current)
            }
        }
    }, [algorithmStatus])

    const startPathFinding = () => {
        if (algorithmStatus !== "stopped") return 
        
        dispatch(setupAlgorithmLoop())    
        
        intervalRef.current = setInterval(() => {
            console.log("setInterval", algorithmStatus)
            dispatch(runAlgorithmLoop())
        })
    }

    return <div className="flex flex-col items-center p-8">
        {
            !isInitializationComplete && <Loading text="Building maze" />
        }

        {
            isInitializationComplete && <section className="bg-white dark:bg-zinc-700 overflow-hidden shadow-xl dark:shadow-black/50">
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
                                    // TODO: More efficient search
                                    isPath={validPath.some(coord => coord[0] === rowIdx && coord[1] === cellIdx)}
                                />)
                            }
                        </div>)
                    }
                </div>
            </section>
        }

        {
            algorithmStatus === "completed" && validPath.length === 0 && <p className="py-4 text-red-400 font-semibold">
                Path from start to finish doesn't exist with current movements
            </p>
        }


        <button onClick={startPathFinding}>BFS</button>
        <button onClick={() => {if (intervalRef.current) clearInterval(intervalRef.current)}}>Clear interval</button>
    </div>
}

export default VisualizerPage

// TODO: Loading state for maze - DONE
// TODO: Gracefully complete BFS/DFS - DONE
// TODO: Collect path as the BFS/DFS runs - DONE
// TODO: Mark the path once BFS/DFS is complete - DONE
// TODO: Reset maze
// TODO: Controls to place blocks, start and finish
// TODO: Controls to choose between BFS or DFS
// TODO: Control to randomly generate a maze
// TODO: Control to select time between steps
// TODO: Lock down the user interactions while BFS/DFS is running
// TODO: Diagonal movements
// TODO: Random maze that actually looks like maze instead of randomly scattered blocks

// TODO: Check BFS/DFS behaviour
// - If found, mark the finish right inside the offset loop instead of marking it after pop to stop the DFS from running redundantly 
// - Check for duplicate pushes 

// TODO: Experiment with async thunks instead of setInterval
// TODO: Controls or page to change the height and width of the maze
// TODO: Fancy styles
// TODO: Explore other algorithms
// TODO: Explore other movement rules