import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { TbHome, TbFlag, TbDice5, TbSun, TbMoon } from "react-icons/tb"
import classNames from "classnames"
import React, { useEffect, useRef } from "react"
import { initializeMaze, performReset, runAlgorithmLoop, setControls, setIsInitializationComplete, setShouldDisableControls, setupAlgorithmLoop } from "../slices/visualizerSlice"
import Button from "./Button"
import * as _ from "lodash"
import { setCurrentTheme } from "../slices/uiSlice"

// TODO: Major refactoring
const Sidebar = () => {
    const dispatch = useAppDispatch()
    const { controls, algorithmStatus, shouldDisableControls } = useAppSelector(state => state.visualizer)
    const { currentTheme } = useAppSelector(state => state.ui)
    const intervalRef = useRef<number | null>(null)

    useEffect(() => {
        if (algorithmStatus === "completed") {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [algorithmStatus])

    const handleRunClick = () => {
        if (algorithmStatus !== "stopped") return
        if (shouldDisableControls) return
        
        dispatch(setupAlgorithmLoop())
        
        intervalRef.current = setInterval(() => {
            dispatch(runAlgorithmLoop())
        }, controls.currentStepDelay)
    }
    
    const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (shouldDisableControls) return
        dispatch(setControls({ ...controls, currentAlgorithm: (event.target.value as any) }))
    }

    const handleSpecialBlockChange = (selectedBlock: "startBlock" | "finishBlock") => {
        if (shouldDisableControls) return
        dispatch(setControls({ ...controls, currentSpecialBlock: selectedBlock }))
    }

    const handleStepDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (shouldDisableControls) return
        dispatch(setControls({
            ...controls,
            currentStepDelay: event.target.valueAsNumber
        }))
    }

    const handleMazeWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (shouldDisableControls) return
        dispatch(setControls({
            ...controls,
            currentMazeWidth: event.target.valueAsNumber
        }))
    }

    const handleMazeHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (shouldDisableControls) return
        dispatch(setControls({
            ...controls,
            currentMazeHeight: event.target.valueAsNumber
        }))
    }

    const handleRandomNoiseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (shouldDisableControls) return
        dispatch(setControls({
            ...controls,
            randomMazeNoise: event.target.valueAsNumber
        }))
    }

    const handleRandomMazeClick = () => {
        if (shouldDisableControls) return

        dispatch(setShouldDisableControls(true))
        dispatch(setIsInitializationComplete(false))
        dispatch(initializeMaze())
    }

    const handleResetClick = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }

        dispatch(setIsInitializationComplete(false))
        dispatch(performReset())
    }

    const handleDebugViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        dispatch(setControls({
            ...controls,
            showDebugView: event.target.checked
        }))
    }

    return <aside className="w-64 min-w-[256px] h-screen overflow-y-auto overflow-x-hidden flex flex-col gap-4 p-2 bg-zinc-300 dark:bg-zinc-800 shadow-xl">
        <div>
            <p className="w-full py-4 text-xl font-semibold text-center">Pathfinding Visualizer</p>
        </div>

        <div className="flex gap-2">
            <button className={classNames(
                currentTheme === "dark" ? "bg-blue-500" : "",
                "flex flex-1 justify-center p-2 rounded-md transition-all"
            )}
                onClick={_ => dispatch(setCurrentTheme("dark"))}
            >
                <TbMoon className="h-6 w-6" />
            </button>
            <button className={classNames(
                currentTheme === "light" ? "bg-blue-500" : "",
                "flex flex-1 justify-center p-2  rounded-md transition-all"
            )}
                onClick={_ => dispatch(setCurrentTheme("light"))}
            >
                <TbSun className="h-6 w-6" />
            </button>
        </div>

        <div className="flex flex-col gap-2 rounded-md bg-blue-500/20 p-2">
            <p className="font-semibold mb-4">Place Start or Finish</p>
            <div className="flex gap-4">
                <label htmlFor="startBlock" id="startBlock" onClick={_ => handleSpecialBlockChange("startBlock")}>
                    <TbHome className={classNames(
                        "h-8 w-8 p-1 rounded-md",
                        controls.currentSpecialBlock === "startBlock" ? "bg-blue-500/70" : "bg-zinc-400 dark:bg-zinc-700"
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
                        controls.currentSpecialBlock === "finishBlock" ? "bg-blue-500/70" : "bg-zinc-400 dark:bg-zinc-700"
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
            <p className="text-zinc-800 dark:text-zinc-400 text-sm">Right-click on any cell to place the currently selected block.</p>
            <p className="text-zinc-800 dark:text-zinc-400 text-sm">Left-click on any cell to toggle between blocked and unblocked states.</p>
        </div>

        <div className="rounded-md bg-blue-500/20 p-2">
            <p className="font-semibold mb-4">Algorithm</p>
            <select
                className="w-full rounded-sm bg-blue-500/50"
                name="algorithm"
                id="algorithm"
                value={controls.currentAlgorithm}
                onChange={handleAlgorithmChange}>
                <option value="bfs" className="bg-blue-500">Breadth-First Search (BFS)</option>
                <option value="dfs" className="bg-blue-500">Depth-First Search (DFS)</option>
            </select>
        </div>

        <div className="rounded-md bg-blue-500/20 p-2">
            <p className="font-semibold mb-4">Step Delay - <span className="text-blue-600 dark:text-blue-300">{controls.currentStepDelay} (ms)</span></p>
            <div className="flex flex-col items-center">
                <div className="w-full flex gap-2">
                    <p>0</p>
                    <input
                        className="w-full"
                        type="range"
                        value={controls.currentStepDelay}
                        max={10000}
                        min={0}
                        step={10}
                        onChange={handleStepDelayChange}
                    />
                    <p>10000</p>
                </div>
            </div>
            <p className="text-zinc-800 dark:text-zinc-400 text-sm">Delay between the steps of search algorithms.</p>
        </div>

        <div className="rounded-md bg-blue-500/20 p-2">
            <p className="font-semibold mb-4">Random Maze</p>
            <div className="flex flex-col items-start">
                <span className="text-blue-600 dark:text-blue-300">Width: {controls.currentMazeWidth} </span>
                <div className="w-full flex gap-2">
                    <p>10</p>
                    <input
                        className="w-full"
                        type="range"
                        value={controls.currentMazeWidth}
                        max={100}
                        min={10}
                        step={1}
                        onChange={handleMazeWidthChange}
                    />
                    <p>100</p>
                </div>
            </div>

            <div className="flex flex-col items-start">
                <span className="text-blue-600 dark:text-blue-300">Height: {controls.currentMazeHeight} </span>
                <div className="w-full flex gap-2">
                    <p>10</p>
                    <input
                        className="w-full"
                        type="range"
                        value={controls.currentMazeHeight}
                        max={100}
                        min={10}
                        step={1}
                        onChange={handleMazeHeightChange}
                    />
                    <p>100</p>
                </div>
            </div>

            <div className="flex flex-col items-start">
                <span className="text-blue-600 dark:text-blue-300">Noise: {controls.randomMazeNoise} </span>
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


            <p className="text-zinc-800 dark:text-zinc-400 text-sm">Noise is the approximate percentage of cells that will turn into blocked cells.</p>
            <Button
                fullWidth
                onClick={handleRandomMazeClick}
            >
                <TbDice5 className="rotate-12 w-6 h-6" />
            </Button>
        </div>

        <div className="rounded-md bg-blue-500/20 p-2">
            <label htmlFor="debug" className="font-semibold mb-4 mr-4">Debug View</label>
            <input type="checkbox" name="debug" id="debug" onChange={handleDebugViewChange} checked={controls.showDebugView}/>
        </div>

        <div className="mt-auto">
            <Button
                fullWidth
                disabled={algorithmStatus === "running"}
                onClick={handleRunClick}
            >
                {
                    algorithmStatus === "running" ? "Running" : "Run"
                }
            </Button>
            <Button
                fullWidth
                onClick={handleResetClick}
            >
                Reset
            </Button>
        </div>
    </aside>
}

export default Sidebar