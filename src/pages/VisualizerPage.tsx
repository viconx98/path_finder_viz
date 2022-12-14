import classnames from "classnames"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { initializeMaze, toggleBlockCell } from "../slices/visualizerSlice"

const VisualizerPage = () => {
    const dispatch = useAppDispatch()
    const { maze } = useAppSelector(state => state.visualizer)

    useEffect(() => {
        dispatch(initializeMaze())
    }, [])

    return <div className="flex flex-col items-center p-8">
        <section className="bg-white dark:bg-zinc-700 overflow-hidden shadow-xl dark:shadow-black/50">
            <div className="flex flex-col">
                {
                    maze.map((row, rowIdx) => <div className="flex">
                        {
                            row.map((cell, cellIdx) => <div 
                                onClick={() => dispatch(toggleBlockCell([rowIdx, cellIdx]))}
                            className={classnames(
                                "h-6 w-6 hover:bg-zinc-400 transition-all",
                                cell.state === "block" ? "bg-zinc-500 shadow-[0px_6px_4px_0_#27272a]" : "",
                                cell.state === "finish" ? "bg-green-500" : "",
                                cell.state === "start" ? "bg-yellow-500" : ""
                            )}> 
                            </div>)
                        }                        
                    </div>)
                }
            </div>
        </section>
    </div>
}

export default VisualizerPage