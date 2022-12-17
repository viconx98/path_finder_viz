import classnames from "classnames"
import { useAppDispatch } from "../hooks/redux"
import { toggleBlockCell } from "../slices/visualizerSlice"

type CellProps = {
    cell: CellData
    cellRowIdx: number
    cellColIdx: number
    isVisited?: boolean
    isPath?: boolean
}

const Cell = ({ cell, cellRowIdx, cellColIdx, isVisited = false, isPath = false }: CellProps) => {
    const dispatch = useAppDispatch()

    const handleCellClick = () => {
        if (cell.state === "start" || cell.state === "finish") return

        dispatch(toggleBlockCell([cellRowIdx, cellColIdx]))
    }
    
    return <div
        onClick={handleCellClick}
        className={classnames(
            "h-6 w-6 hover:bg-zinc-400 transition-all",
            cell.state === "block" ? "bg-zinc-500 shadow-[0px_6px_4px_0_#27272a]" : "",
            cell.state === "finish" ? "bg-green-500" : "",
            cell.state === "start" ? "bg-yellow-500" : "",
            isVisited && cell.state !== "start" && cell.state !== "finish" ? "bg-orange-500/50" : "",
            isPath && cell.state !== "start" && cell.state !== "finish" ? "bg-green-500/70" : ""
        )}>
    </div>
}

export default Cell