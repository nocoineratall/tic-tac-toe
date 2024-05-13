const gameboard = (function () {
  const board = [];
  const rows = 3;
  const columns = rows;

  for (let i = 0; i < rows; i++) {
    board[i] = [];

    for (let j = 0; j < columns; j++) {
      board[i][j] = "";
    }
  }

  const getBoard = () => board;
  const getRows = () => rows;

  return { getBoard, getRows };
})();

const players = (function () {
  let playerMarkerColor = "red";
  let opponentMarkerColor = "blue";

  const player = {
    name: "Player",
    marker: "X",
    color: playerMarkerColor,
  };

  const opponent = {
    name: "Opponent",
    marker: "O",
    color: opponentMarkerColor,
  };

  const playersList = [player, opponent];

  // 0 for Player, 1 for Opponent
  const getPlayer = (playerIndex) => playersList[playerIndex];

  const setName = function (_player, newName) {
    return (_player.name = newName);
  };

  const setMarkerColor = function (playerIndex, newColor) {
    playersList[playerIndex].color = newColor;
  };

  return { setName, getPlayer, setMarkerColor };
})();

const game = (function () {
  let activePlayer = players.getPlayer(0);

  const switchPlayer = function () {
    // is it possible to compare objects instead?
    activePlayer =
      activePlayer.name === players.getPlayer(0).name
        ? players.getPlayer(1)
        : players.getPlayer(0);
  };

  const getActivePlayer = () => activePlayer;

  const checkAvailability = function (row, column) {
    if (
      row < gameboard.getRows() &&
      column < gameboard.getRows() &&
      gameboard.getBoard()[row][column] == ""
    ) {
      return true;
    }
  };

  const playTurn = function (row, column) {
    if (checkAvailability(row, column)) {
      gameboard.getBoard()[row][column] = activePlayer.marker;
    } else {
      return console.log("Position not available - select another tile");
    }

    render.printMarker(row, column);

    checkVictory();
    switchPlayer();
    return gameboard.getBoard();
  };

  const checkVictory = function () {
    let gameOver = false;
    const board = gameboard.getBoard();
    const rows = gameboard.getRows();
    const columns = rows;

    //Check for Player's victory ("X")
    for (let i = 0; i < rows; i++) {
      if (board[i][0] == "X" && board[i][1] == "X" && board[i][2] == "X") {
        gameOver = true;
      }
    }

    for (let j = 0; j < columns; j++) {
      if (board[0][j] == "X" && board[1][j] == "X" && board[2][j] == "X") {
        gameOver = true;
      }
    }

    if (board[0][0] == "X" && board[1][1] == "X" && board[2][2] == "X") {
      gameOver = true;
    }

    if (board[0][2] == "X" && board[1][1] == "X" && board[2][0] == "X") {
      gameOver = true;
    }

    //Check for Opponent's victory ("O")
    for (let i = 0; i < rows; i++) {
      if (board[i][0] == "O" && board[i][1] == "O" && board[i][2] == "O") {
        gameOver = true;
      }
    }

    for (let j = 0; j < columns; j++) {
      if (board[0][j] == "O" && board[1][j] == "O" && board[2][j] == "O") {
        gameOver = true;
      }
    }

    if (board[0][0] == "O" && board[1][1] == "O" && board[2][2] == "O") {
      gameOver = true;
    }

    if (board[0][2] == "O" && board[1][1] == "O" && board[2][0] == "O") {
      gameOver = true;
    }

    //Prints winner
    if (gameOver) {
      console.log(`${activePlayer.name} Wins`);
    }
  };

  return { playTurn, getActivePlayer };
})();

const render = (function () {
  const tiles = document.querySelectorAll(".tile");
  let index;

  const printMarker = function (row, column) {
    index = 3 * row + column;
    tiles[index].textContent = game.getActivePlayer().marker;

    if (game.getActivePlayer().color == players.getPlayer(0).color) {
      //tiles[index].classList.add(players.getPlayer(0).color);
      tiles[index].setAttribute(
        "style",
        `color: ${players.getPlayer(0).color}`
      );
    } else {
      //tiles[index].classList.add(players.getPlayer(1).color);
      tiles[index].setAttribute(
        "style",
        `color: ${players.getPlayer(1).color}`
      );
    }
  };
  return { printMarker };
})();
