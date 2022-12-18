import classnames from "classnames"
import React from "react"
import { useAppDispatch } from "../hooks/redux"
import { setStartOrFinishCell, toggleBlockCell } from "../slices/visualizerSlice"
import { TbHome, TbFlag } from "react-icons/tb"

type CellProps = {
    cell: CellData
    cellRowIdx: number
    cellColIdx: number
    isVisited?: boolean
    isPath?: boolean
}

const Cell = ({ cell, cellRowIdx, cellColIdx, isVisited = false, isPath = false }: CellProps) => {
    const dispatch = useAppDispatch()

    const handleCellLeftClick = () => {
        if (cell.state === "start" || cell.state === "finish") return

        dispatch(toggleBlockCell([cellRowIdx, cellColIdx]))
    }

    const handleCellRightClick = (event: React.MouseEvent) => {
        if (cell.state === "start" || cell.state === "finish") return

        dispatch(setStartOrFinishCell([cellRowIdx, cellColIdx]))
        event.preventDefault()
    }
    
    return <div
        onClick={handleCellLeftClick}
        onContextMenu={handleCellRightClick}
        className={classnames(
            "flex items-center justify-center h-6 w-6 hover:bg-zinc-400 transition-all",
            cell.state === "block" ? "bg-zinc-500 shadow-[0px_6px_4px_0_#27272a]" : "",
            cell.state === "finish" ? "bg-green-500" : "",
            cell.state === "start" ? "bg-yellow-500" : "",
            (isVisited && cell.state !== "start" && cell.state !== "finish") ? "bg-orange-500/50" : "",
            (isPath && cell.state !== "start" && cell.state !== "finish") ? "bg-green-500/50 animate-pulse" : ""
        )}>
        {
            cell.state === "start" && <TbHome className="h-5 w-5 text-zinc-900"/>
        }
        {
            cell.state === "finish" && <TbFlag className="h-5 w-5 text-zinc-900"/>
        }
    </div>
}

export default Cell