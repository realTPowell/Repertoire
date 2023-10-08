import { createStore } from "solid-js/store";

interface treeStep {
    steps: Number,
    branch: Number
}

type moveLoc = Array<treeStep>

export function createVariations(agent, actions, state, setState) {
    const [variations, setVariations] = createStore({
        repName: "default",
        currentMove: [{move: 0, branch: 0}],
        boardPos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", 
        tree: []
    })

    Object.assign(actions, {
        stepForward: () => {
            // plays the next move, updates boardPos, currentMove accordingly
        },
        stepBack: () => {
            // moves back to the previous move, updates boardPos, currentMove accordingly
        },
        incrementBranch: () => {
            const end = state.variations.currentMove.length
            const branches = 1 //FIXME: this should check for how many branches there are at the current move
            setVariations("currentMove", end - 1, "branch", (branch) => (branch + 1) % branches)
        },
        playMove: (move) => {
            // takes in a move, plays it (updating boardPos), and if it's new merges it into the varTree
        },
        deletefromPoint(treePos: moveLoc)
    })
}