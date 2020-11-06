import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import $ from "jquery";

function Square(props) {
  return (
    <button className="square" onClick={(e) => props.onClick(e)} id={props.id}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={(e) => this.props.onClick(i, e)}
        id={i}
      />
    );
  }

  callRenDerSquare(i) {}

  // generateBoard() {
  //   let divResult = document.createElement("div");
  //   for (let i = 0; i < 3; i++) {
  //     const div = document.createElement("div");
  //     div.setAttribute("class", "board-row");
  //     for (let j = 0; j < 3; j++) {
  //       div.innerHTML = `${this.renderSquare(j + i * 3)}`;
  //     }
  //     divResult.appendChild(div);
  //   }
  //   // return result;
  // }

  render() {
    const resultDiv = [];

    for (let i = 0; i < 3; i++) {
      resultDiv.push(
        <div className="board-row">
          {[i * 3, i * 3 + 1, i * 3 + 2].map((index) => {
            return this.renderSquare(index);
          })}
        </div>
      );
    }

    return (
      <div>
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
        {resultDiv}
        {/* {this.generateBoard()} */}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          currentRowColumn: "",
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      moves: [],
      msg: "sort moves descending",
    };
  }

  removeCurrentSquareClass(target) {
    target.parent().parent().find(".square").removeClass("current-square");
  }

  handleClick(i, e) {
    // $(e.target).addClass("bold-square");

    const currentRowColumn = this.getRowColumn(i);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    const $target = $(e.target);
    this.removeCurrentSquareClass($target);
    $target.addClass("current-square");
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          currentRowColumn: currentRowColumn,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    this.updateMoves();
  }

  getRowColumn(i) {
    let rowColumn = "";
    if (i <= 2) rowColumn = "0 " + i;
    else if (i <= 5) rowColumn = "1 " + (i - 3);
    else if (i <= 8) rowColumn = "2 " + (i - 6);
    else rowColumn = "";
    return rowColumn;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
    this.updateMoves();
  }

  sort(moves) {
    moves = this.state.moves.reverse();
    const msg =
      this.state.msg.localeCompare("sort moves descending") === 0
        ? "sort moves ascending "
        : "sort moves descending";

    this.setState({ moves, msg });
  }

  updateMoves() {
    const history = this.state.history;

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move # " + move + " (" + step.currentRowColumn + ")"
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className="move">
            {desc}
          </button>
        </li>
      );
    });

    this.setState({ moves });
  }

  highlightSquares(squaresIndex) {
    const $squares = $(".square");
    for (let i = 0; i < 3; i++) {
      $($squares[squaresIndex[i + 1]]).addClass("current-square");
      // console.log();
    }
  }

  componentDidMount() {
    this.updateMoves();
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerWithABC = calculateWinner(current.squares);
    const winner = winnerWithABC[0];

    let status;
    if (winner) {
      this.highlightSquares(winnerWithABC);
      status = "Winner " + winner;
    } else {
      if (this.state.stepNumber > 8) {
        alert("Game is draw");
      }
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game-container">
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i, e) => this.handleClick(i, e)}
            />
          </div>
          <div className="game-info">
            <div className="game-status">{status}</div>
            <div>{this.state.moves}</div>
          </div>
          <div className="sort-btn-container">
            <button
              className="sort-btn"
              onClick={() => {
                this.sort(history);
              }}
            >
              {this.state.msg}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }
  return ["", 0, 0, 0];
}
