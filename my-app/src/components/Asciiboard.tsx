import { Chess } from "chess.js"
import { Accessor, Component, For } from "solid-js"
import './Asciiboard.css'
import { Store } from "solid-js/store"

interface AsciiboardProps {
  fen: string
}

const Asciiboard: Component<AsciiboardProps> = props => {
  const chess = new Chess()
  const gamestring = () => {chess.load(props.fen); return chess.ascii()}
  return (
    <div class='ascii-board'>
      <For each={gamestring().split('\n')}>
        {(row) => <span>{row}<br/></span>}
      </For>
    </div>
  )
}

export default Asciiboard
