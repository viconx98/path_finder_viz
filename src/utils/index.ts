import { nanoid } from "@reduxjs/toolkit";

export function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function generateMaze(
    mazeWidth: number,
    mazeHeight: number,
    blockChance: number = 25,
    defaultStart: boolean = true,
    defaultFinish: boolean = true): [CellData[][], [number, number], [number, number]] {

    const maze = new Array(mazeWidth).fill(null).map(e => {
        return new Array(mazeHeight).fill(null).map(e1 => {
            const cell: CellData = {
                id: nanoid(16),
                state: "empty"
            }

            const shouldBlock = getRandomIntInclusive(1, 100)

            if (shouldBlock <= blockChance) {
                cell.state = "block"
            }

            return cell
        })
    })
    // TODO: Handle edge case where the randomly generated start and finish are same
    const startRowIdx = defaultStart ? 0 : getRandomIntInclusive(0, mazeWidth - 1)
    const startColIdx = defaultStart ? 0 : getRandomIntInclusive(0, mazeHeight - 1)

    maze[startRowIdx][startColIdx].state = "start"

    const finishRowIdx = defaultFinish ? mazeWidth - 1 : getRandomIntInclusive(0, mazeWidth - 1)
    const finishColIdx = defaultFinish ? mazeHeight - 1 : getRandomIntInclusive(0, mazeHeight - 1)

    maze[finishRowIdx][finishColIdx].state = "finish"

    return [maze, [startRowIdx, startColIdx], [finishRowIdx, finishColIdx]]
}

export function generateVisitedMaze(mazeWidth: number, mazeHeight: number) {
    const visitedMaze = new Array(mazeWidth).fill(null).map(e => {
        return new Array(mazeHeight).fill(false)
    })

    return visitedMaze as boolean[][]
}

// TODO: Better row id scheme
export function createRowId(cells: CellData[]) {
    return cells.map(cell => cell.id.substring(0, 4)).join("")
}

// TODO: Maybe also check visited here for clarity
export function isValidCell(mazeWidth: number, mazeHeight: number, cellRowIdx: number, cellColIdx: number) {
    if (cellRowIdx < 0 || cellRowIdx >= mazeWidth) return false
    if (cellColIdx < 0 || cellColIdx >= mazeHeight) return false

    return true
}

export const OFFSETS = [
    [-1, 0], // Up
    [0, 1], // Right
    [1, 0], // Down
    [0, -1] // Right
]