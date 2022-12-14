export function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function generateMaze(mazeWidth: number, mazeHeight: number, blockChance: number = 25, defaultStart: boolean = true, defaultFinish: boolean = true) {
    const maze = new Array(mazeWidth).fill(null).map(e => {
        return new Array(mazeHeight).fill(null).map(e1 => {
            const cell: Cell = {
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

    return maze
}
