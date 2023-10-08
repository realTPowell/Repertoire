export function makeMove(chess, fen, move) {
    chess.load(fen);
    chess.move(move); 
    return chess.fen()
}

export function resetBoard(chess) {
    chess.reset()
    return chess.fen()
}