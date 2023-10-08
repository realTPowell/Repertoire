import { Chess } from 'chess.js'
import Asciiboard from "~/components/Asciiboard";
import { parse } from '@mliebelt/pgn-parser'
import { createStore } from "solid-js/store";
import { createEffect, createSignal } from 'solid-js';
import { makeMove, resetBoard } from "~/lib/moves.js";
import './index.css'



const pgn = [
  '[Event "Casual Game"]',
  '[Site "Berlin GER"]',
  '[Date "1852.??.??"]',
  '[EventDate "?"]',
  '[Round "?"]',
  '[Result "1-0"]',
  '[White "Adolf Anderssen"]',
  '[Black "Jean Dufresne"]',
  '[ECO "C52"]',
  '[WhiteElo "?"]',
  '[BlackElo "?"]',
  '[PlyCount "47"]',
  '',
  '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O',
  'd3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4',
  'Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6',
  'Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8',
  '23.Bd7+ Kf8 24.Bxe7# 1-0',
]

const pgn2 = ['[Event "White repertoire"]',
'[Site "Chesstempo.com opening repertoire"]',
'[Date "2023.9.30"]',
'[Round "?"]',
'[White "1. d4 Mixed"]',
'[Black "?"]',
'[Result "*"]',
'[ChesstempoRepertoireColour "White"]',
'',
'1.d4 e5 ( 1...d5 2.c4 Nf6 ( 2...Nc6 3.Nc3 dxc4 4.Nf3 Nf6',
'( 4...Bg4 $2 5.d5 Bxf3 6.exf3 Ne5 7.Bf4 Nd3+ ( 7...Ng6 8.Bxc4',
'Nxf4 $4 9.Bb5+ c6 10.dxc6 a6 11.c7+ axb5 12.cxd8=Q+ Rxd8 ) 8.Bxd3 cxd3',
'9.Nb5 Rc8 10.Nxa7 Rb8 11.Qxd3 ) 5.e4 Bg4 6.d5 Ne5 ) ( 2...dxc4 3.e4 e5',
'( 3...Nc6 4.Nf3 Bg4 5.d5 Ne5 6.Bf4 Ng6 ( 6...Nxf3+ $2 7.gxf3 Bd7 8.Bxc4 e6 9.Nc3 )',
'( 6...Bxf3 7.gxf3 Ng6 8.Qa4+ Qd7 9.Qxd7+ Kxd7 10.Be3 ) 7.Be3 Nf6 8.Nc3 e5 9.Bxc4 )',
'( 3...Nf6 4.e5 Nd5 5.Bxc4 Nb6 6.Bb3 Nc6 7.Nf3 Bg4 8.Ng5 Bxd1 9.Bxf7+ Kd7 )',
'( 3...c5 4.d5 ) 4.Nf3 exd4 ( 4...Bb4+ 5.Bd2 Bxd2+ 6.Nbxd2 exd4 ( 6...b5 7.a4 c6 8.axb5',
'cxb5 9.b3 c3 10.Bxb5+ Bd7 11.Bxd7+ Nxd7 12.Nc4 ) 7.Bxc4 Nc6 8.O-O Nf6 9.Nb3 ) 5.Bxc4',
'Nc6 6.O-O Be6 7.Bxe6 fxe6 8.Qb3 Qd7 9.Qxb7 Rb8 10.Qa6 Nf6 11.Nbd2 Bd6 12.Nb3 )',
'( 2...c6 3.Nf3 Nf6 ( 3...Bg4 $6 4.Ne5 Bh5 $2 ( 4...Bf5 5.cxd5 cxd5 6.e4 dxe4 )',
'5.Qb3 $1 ) ( 3...Bf5 4.cxd5 cxd5 5.Qb3 ) 4.Qc2 e6 ( 4...Bg4 5.Ne5 Bh5 $6 ( 5...e6 6.Nxg4',
'Nxg4 7.e3 ) 6.cxd5 cxd5 7.e4 dxe4 8.Bb5+ Nbd7 9.O-O ) ( 4...dxc4 5.Qxc4 Bf5 6.g3 e6',
'7.Bg2 Nbd7 8.O-O Be7 9.Nc3 ) 5.g3 Nbd7 6.Bg2 Bd6 7.O-O { transposes to Closed Catalan positions } )',
'3.cxd5 Nxd5 4.e4 ( 4.Nf3 Bf5 ( 4...Nc6 5.e4 Nf6 ( 5...Nb6 ) 6.Nc3 Bg4 7.d5 Bxf3 ( 7...Ne5 $4 8.Nxe5',
'$1 Bxd1 9.Bb5+ c6 10.dxc6 bxc6 11.Bxc6+ Qd7 ( 11...Nd7 12.Bxd7+ Qxd7 13.Nxd7 Kxd7 14.Kxd1 ) 12.Bxd7+ ) 8.gxf3 Ne5 )',
'( 4...e6 5.e4 Nf6 6.Nc3 Bb4 7.Bd3 O-O $4 8.e5 Nd5 9.Bxh7+ Kxh7 10.Ng5+ Kg8 11.Qh5 Re8 12.Qh7+',
'( 12.Qxf7+ Kh8 13.Qh5+ Kg8 14.Qh7+ Kf8 15.Qh8+ Ke7 16.Qxg7# ) 12...Kf8 ) 5.Nbd2 Bg6 ( 5...Nb6 )',
'6.h4 h6 7.Ne5 Bh7 8.e4 Nb6 9.Qf3 Bg8 10.Bc4 Nxc4 11.Ndxc4 ) 4...Nf6 ( 4...Nb6 ) ) ( 1...Nf6 2.c4 g6',
'( 2...e6 3.g3 d5 4.Bg2 b6 ( 4...c6 5.Nf3 Nbd7 6.O-O Be7 ( 6...Bd6 7.Nfd2 O-O 8.Nc3 Re8 9.e4 dxe4',
'10.Ndxe4 Nxe4 11.Nxe4 Be7 12.Bf4 Nf6 13.Qd3 ) 7.Qc2 O-O 8.Nbd2 b6 9.e4 Bb7 ( 9...dxe4 10.Nxe4 Nxe4',
'11.Qxe4 Bb7 12.Rd1 Nf6 13.Qc2 Qc8 14.c5 ) ) ( 4...Be7 5.Nf3 O-O 6.O-O dxc4 7.Qc2 ) 5.cxd5 exd5',
'6.Nf3 Bb7 7.O-O Be7 8.Nc3 O-O 9.Ne5 $1 Nbd7 $5 10.Qa4 h6 ( 10...Nxe5 11.dxe5 Ne4 12.Nxe4 dxe4',
'13.Bxe4 Bxe4 14.Qxe4 ) 11.Nxd7 Nxd7 ( 11...Qxd7 12.Qxd7 Nxd7 13.Nxd5 ) 12.Nxd5 ) 3.Nc3 Bg7 4.e4',
'd6 5.Be2 O-O 6.Bg5 h6 ( 6...c5 7.d5 h6 8.Bf4 e6 ( 8...a6 9.a4 Nbd7 10.Qc1 Kh7 11.Nf3 ) 9.dxe6 Bxe6',
'10.Bxd6 Re8 ) ( 6...Nbd7 7.Qd2 e5 8.d5 Nc5 9.f3 h6 10.Be3 ) ( 6...Nc6 $2 7.d5 Ne5 8.Nf3 ( 8.f4 Ned7 9.Nh3 )',
'8...Nxf3+ 9.Bxf3 h6 10.Be3 ) ( 6...e5 $2 7.dxe5 dxe5 8.Qxd8 Rxd8 9.Nd5 Nxd5 ( 9...Nbd7 10.Nxc7 Rb8 11.f3 )',
'10.Bxd8 Nf4 11.Bf1 ) 7.Be3 e5 8.d5 Nbd7 9.Qd2 Nc5 ( 9...Kh7 $6 10.h4 a5 11.O-O-O ) 10.f3 a5 11.O-O-O a4 12.g4 )',
'2.dxe5 Nc6 3.Nf3 Qe7 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Nc3 Bb4 ( 6...Nb4 7.Nd4 c5 8.Rb1 Qa3 9.Ndb5 ) 7.Rb1 Qa3 8.Nd5 Ba5',
'( 8...Bxd2+ 9.Qxd2 Kd8 10.e4 Nge7 ( 10...Qxa2 11.Rd1 Ke8 ) ) 9.Rb5']

export default function Home() {
  const chess = new Chess()
  const moveList = parse(pgn.join('\n'), {startRule: 'game'}).moves
  // chess.loadPgn(pgn2.join('\n'))
  // const [state, setState] = createStore({
  //   varTree: parse(pgn2.join('\n'), {startRule: 'game'}),
  //   boardState: chess
  // })

  const [position, setPosition] = createSignal(chess.fen())
  const [move, setMove] = createSignal(0)
  const [branch, setBranch] = createSignal(0)

  function advance() {
    setPosition((fen) => {
      const pos = makeMove(chess,fen, moveList[move()].notation.notation)
      setMove((move) => move+1)
      return pos
    })
  };

  function reset() {
    setMove(0)
    setPosition(resetBoard(chess))
  }

  return (
    <main>
      <Asciiboard fen={position()} />
      <button onClick={advance}>Move</button>
      <button onClick={reset}>Reset</button>
      <div>{move()}</div>
    </main>
  );
}
