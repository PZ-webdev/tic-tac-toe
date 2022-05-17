import { useState } from "react";
import "./App.css";

interface MyProps {
  score: number;
  Route: string;
}

function App() {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const win = ["012", "345", "678", "036", "147", "258", "048", "246"];

  function checkWin(user: string, myBoard: string[]) {
    let isWin = false;

    win.map((win) => {
      if (
        myBoard[Number(win[0])] === myBoard[Number(win[1])] &&
        myBoard[Number(win[1])] === myBoard[Number(win[2])] &&
        myBoard[Number(win[1])] === user
      ) {
        isWin = true;
      }
    });

    return isWin;
  }

  function freeSpace(myBoard: string[]) {
    let free = 0;
    myBoard.map((filed) => {
      filed === "" && free++;
    });

    return free;
  }

  function score(myBoard: string[], user: string) {
    return checkWin(user, myBoard)
      ? user === "X"
        ? 3
        : -3
      : freeSpace(myBoard) === 0
      ? 0
      : null;
  }

  const minMax = (
    myBoard: string[],
    user: string,
    level: number,
    parentWay: number,
    Route: string
  ): MyProps => {
    level++;
    const board = new Array(...myBoard);

    const grant =
      score(myBoard, user) || score(myBoard, user === "X" ? "O" : "X");
    if (grant || grant === 0) {
      return { score: grant, Route: Route + parentWay + "-" + user };
    }

    if (user === "X") {
      let result: MyProps = { Route: "", score: -5 };
      let maxEva: MyProps = { Route: "", score: -Infinity };
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = user;
          result = minMax(
            board,
            user === "X" ? "O" : "X",
            level,
            i,
            Route + parentWay + "-" + user
          );

          if (maxEva.score < result.score) maxEva = result;
          board[i] = "";
        }
      }

      return maxEva;
    } else {
      let result: MyProps = { Route: "", score: -5 };
      let minEva: MyProps = { Route: "", score: Infinity };
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = user;
          result = minMax(
            board,
            user === "X" ? "O" : "X",
            level,
            i,
            Route + parentWay + "-" + user
          );

          if (minEva.score > result.score) minEva = result;
          board[i] = "";
        }
      }

      return minEva;
    }
  };

  const computer = () => {
    board[Number(minMax(board, "O", 0, 0, "").Route[3])] = "O";
    return setBoard([...board]);
  };

  const reset = () => {
    setBoard(["", "", "", "", "", "", "", "", ""])
  }

  return (
    <div className="container">
        <button className="btn-clear" onClick={() => reset() }
        >Clear</button>
      <div className="board">
        {board.map((square, index) => (
          <div
          key={index}
            onClick={() => {
              board[index] = "X";
              setBoard([...board]);
              computer();
            }}
            className="square"
          >
            {board[index]}
          </div>
        ))}
      </div>     
    </div>
  );
}

export default App;
