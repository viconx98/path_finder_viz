import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { TbHome, TbFlag, TbDice5 } from "react-icons/tb"
import classNames from "classnames"
import React, { MouseEventHandler } from "react"
import { setControls } from "../slices/visualizerSlice"

// TODO: Clean up hard coded stuff
const Sidebar = () => {
    const dispatch = useAppDispatch()
    const { controls, algorithmStatus } = useAppSelector(state => state.visualizer)

    const handleSpecialBlockChange = (selectedBlock: "startBlock" | "finishBlock") => {
        dispatch(setControls({ ...controls, currentSpecialBlock: selectedBlock }))
    }

    const handleRandomNoiseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setControls({
            ...controls,
            randomMazeNoise: event.target.valueAsNumber
        }))
    }

    const handleStepDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setControls({
            ...controls,
            currentStepDelay: event.target.valueAsNumber
        }))
    }

    return <aside className="w-64 h-screen overflow-y-auto flex flex-col gap-4 p-2 bg-zinc-400 dark:bg-zinc-800 shadow-xl">
        <div>
            Heading of some sort
        </div>

        <div className="flex flex-col gap-2 rounded-md bg-blue-500/20 p-2">
            <p className="font-semibold mb-4">Place Start or Finish</p>
            <div className="flex gap-4">
                <label htmlFor="startBlock" id="startBlock" onClick={_ => handleSpecialBlockChange("startBlock")}>
                    <TbHome className={classNames(
                        "h-8 w-8 p-1 rounded-md",
                        controls.currentSpecialBlock === "startBlock" ? "bg-blue-500/70" : "bg-zinc-700"
                    )} />
                </label>
                <input
                    type="radio"
                    id="startBlock"
                    name="specialBlocks"
                    className="hidden"
                    checked={controls.currentSpecialBlock === "startBlock"}
                    readOnly
                />

                <label htmlFor="endBlock" id="finishBlock" onClick={_ => handleSpecialBlockChange("finishBlock")}>
                    <TbFlag className={classNames(
                        "h-8 w-8 p-1 rounded-md",
                        controls.currentSpecialBlock === "finishBlock" ? "bg-blue-500/70" : "bg-zinc-700"
                    )} />
                </label>
                <input
                    type="radio"
                    id="finishBlock"
                    name="specialBlocks"
                    className="hidden"
                    checked={controls.currentSpecialBlock === "finishBlock"}
                    readOnly
                />
            </div>
            <p className="text-zinc-400 text-sm">Right-click on any cell to place the currently selected block.</p>
            <p className="text-zinc-400 text-sm">Left-click on any cell to toggle between blocked and unblocked states.</p>
        </div>

        <div className="rounded-md bg-blue-500/20 p-2">
            <p className="font-semibold mb-4">Algorithm</p>
            <select name="algorithm" id="algorithm">
                <option value="bfs">Breadth-First Search (BFS)</option>
                <option value="dfs">Depth-First Search (DFS)</option>
            </select>
        </div>

        <div className="rounded-md bg-blue-500/20 p-2">
            <p className="font-semibold mb-4">Step Delay - <span className="text-blue-300">{controls.currentStepDelay} (ms)</span></p>
            <div className="flex flex-col items-center">
                <div className="w-full flex gap-2">
                    <p>100</p>
                    <input
                        className="w-full"
                        type="range"
                        value={controls.currentStepDelay}
                        max={10000}
                        min={100}
                        step={100}
                        onChange={handleStepDelayChange}
                    />
                    <p>10000</p>
                </div>
            </div>
            <p className="text-zinc-400 text-sm">Delay between the steps of search algorithms.</p>
        </div>

        <div className="rounded-md bg-blue-500/20 p-2">
            <p className="font-semibold mb-4">Random Maze - <span className="text-blue-300">{controls.randomMazeNoise} (Noise)</span></p>
            <div className="flex flex-col items-center">
                <div className="w-full flex gap-2">
                    <p>0</p>
                    <input
                        className="w-full"
                        type="range"
                        value={controls.randomMazeNoise}
                        max={100}
                        min={0}
                        step={1}
                        onChange={handleRandomNoiseChange}
                    />
                    <p>100</p>
                </div>
            </div>
            <p className="text-zinc-400 text-sm">Noise is the approximate percentage of cells that will turn into blocked cells.</p>
            <button className="w-full flex my-2 justify-center p-1 bg-blue-500 rounded-md">
                <TbDice5 className="rotate-12 w-6 h-6" />
            </button>
        </div>

        <div className="mt-auto">
            <button className="w-full flex my-2 justify-center p-1 bg-blue-500 rounded-md">
                Run
            </button>
            <button className="w-full flex my-2 justify-center p-1 bg-blue-500 rounded-md">
                Reset
            </button>
        </div>
    </aside>
}

export default Sidebar