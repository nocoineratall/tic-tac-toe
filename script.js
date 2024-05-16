const gameboard = (function () {
  const board = [];
  const rows = 3;
  const columns = rows;

  function emptyBoard() {
    for (let i = 0; i < rows; i++) {
      board[i] = [];

      for (let j = 0; j < columns; j++) {
        board[i][j] = "";
      }
    }
  }

  emptyBoard();

  const getBoard = () => board;

  return { getBoard, emptyBoard };
})();

const players = (function () {
  let playerMarkerColor = "rgb(211, 76, 76)";
  let opponentMarkerColor = "rgb(79, 209, 111)";

  const player = {
    name: "Player",
    marker: "X",
    color: playerMarkerColor,
    score: 0,
  };

  const opponent = {
    name: "Opponent",
    marker: "O",
    color: opponentMarkerColor,
    score: 0,
  };

  const playersList = [player, opponent];

  // 0 for Player, 1 for Opponent
  const getPlayer = (playerIndex) => playersList[playerIndex];

  const setName = function (_player, newName) {
    _player.name = newName;
  };

  const setMarkerColor = function (playerIndex, newColor) {
    playersList[playerIndex].color = newColor;
  };

  const addScore = function () {
    game.getActivePlayer().score++;
  };

  return { setName, getPlayer, setMarkerColor, addScore };
})();

const game = (function () {
  let board = gameboard.getBoard();
  let activePlayer = players.getPlayer(0);
  let counter = 0;

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
      row < gameboard.getBoard().length &&
      column < gameboard.getBoard().length &&
      gameboard.getBoard()[row][column] == ""
    ) {
      return true;
    }
  };

  const playTurn = function (row, column) {
    if (!checkVictory().gameOver) {
      if (checkAvailability(row, column)) {
        gameboard.getBoard()[row][column] = activePlayer.marker;
        render.printMarker(row, column);
        checkTie();

        //prints victory message
        if (checkVictory().gameOver) {
          DOMcontroller.getMessageContainer().textContent = `${
            game.getActivePlayer().name
          } wins`;
          players.addScore();
          DOMcontroller.printScore();
          eventManager().assignEventReset();
        }
        if (checkTie()) {
          DOMcontroller.getMessageContainer().textContent = "It's a tie";
          eventManager().assignEventReset();
        }
        switchPlayer();
      } else {
        return console.log("Position not available - select another tile");
      }
    }
  };

  const checkVictory = function () {
    let gameOver = false;
    const board = gameboard.getBoard();
    const rows = board.length;
    const columns = rows;
    counter++;

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

    return { gameOver };
  };

  function checkTie() {
    if (
      board[0][0] != "" &&
      board[0][1] != "" &&
      board[0][2] != "" &&
      board[1][0] != "" &&
      board[1][1] != "" &&
      board[1][2] != "" &&
      board[2][0] != "" &&
      board[2][1] != "" &&
      board[2][2] != ""
    ) {
      return true;
    }
  }

  return { playTurn, getActivePlayer };
})();

const render = (function () {
  const printMarker = function (row, column) {
    let index = 3 * row + column;

    DOMcontroller.tiles[index].textContent = game.getActivePlayer().marker;

    if (game.getActivePlayer().color == players.getPlayer(0).color) {
      //tiles[index].classList.add(players.getPlayer(0).color);
      DOMcontroller.tiles[index].setAttribute(
        "style",
        `color: ${players.getPlayer(0).color}`
      );
    } else {
      //tiles[index].classList.add(players.getPlayer(1).color);
      DOMcontroller.tiles[index].setAttribute(
        "style",
        `color: ${players.getPlayer(1).color}`
      );
    }
  };

  const printBoard = function () {
    DOMcontroller.tiles.forEach((tile) => {
      tile.textContent = "";
    });
  };

  return { printMarker, printBoard };
})();

const DOMcontroller = (function () {
  const tiles = document.querySelectorAll(".tile");
  const messageContainer = document.querySelector(".message-container");
  const playerScore = document.querySelector(".player-score");
  const opponentScore = document.querySelector(".opponent-score");
  // const leftSide = document.querySelector(".left-side");
  // const rightSide = document.querySelector(".right-side");
  const playerNameBtn = document.querySelector(".set-player-name-btn");
  const opponentNameBtn = document.querySelector(".set-opponent-name-btn");

  const resetButton = document.createElement("button");

  const getMessageContainer = () => messageContainer;

  const printScore = function () {
    playerScore.textContent = players.getPlayer(0).score;
    opponentScore.textContent = players.getPlayer(1).score;
  };

  const setPlayersColor = function () {
    playerNameBtn.setAttribute(
      "style",
      "background-color: " + players.getPlayer(0).color
    );
    opponentNameBtn.setAttribute(
      "style",
      "background-color: " + players.getPlayer(1).color
    );
    printScore();
  };

  const setPlayerName = function () {
    let newName = prompt("Insert new name");
    players.getPlayer(0).name = newName;
    playerNameBtn.textContent = players.getPlayer(0).name;
  };

  const setOpponentName = function () {
    let newName = prompt("Insert new name");
    players.getPlayer(1).name = newName;
    opponentNameBtn.textContent = players.getPlayer(1).name;
  };

  setPlayersColor();

  // converts integer to two numbers between 0 and 2 representing the gameboard coordinates
  const indexToBoardPosition = function (index) {
    row = Math.floor(index / gameboard.getBoard().length);
    column = index % gameboard.getBoard().length;
    return { row, column };
  };

  return {
    tiles,
    resetButton,
    playerNameBtn,
    opponentNameBtn,
    indexToBoardPosition,
    getMessageContainer,
    setPlayersColor,
    setPlayerName,
    setOpponentName,
    printScore,
  };
})();

const eventManager = function () {
  const assignEventTiles = function () {
    DOMcontroller.tiles.forEach((tile) => {
      let tileIndex = tile.getAttribute("value");
      let tileRow = DOMcontroller.indexToBoardPosition(tileIndex).row;
      let tileColumn = DOMcontroller.indexToBoardPosition(tileIndex).column;

      tile.addEventListener("click", () => {
        game.playTurn(tileRow, tileColumn);
      });
    });
  };

  const assignEventReset = function () {
    DOMcontroller.resetButton.addEventListener("click", resetter);
    DOMcontroller.resetButton.textContent = "Play again";
    DOMcontroller.getMessageContainer().appendChild(DOMcontroller.resetButton);
  };

  const assignEventsChangeName = function () {
    DOMcontroller.playerNameBtn.addEventListener(
      "click",
      DOMcontroller.setPlayerName
    );
    DOMcontroller.opponentNameBtn.addEventListener(
      "click",
      DOMcontroller.setOpponentName
    );
  };

  return { assignEventTiles, assignEventReset, assignEventsChangeName };
};

const resetter = function () {
  gameboard.emptyBoard();
  render.printBoard();
  DOMcontroller.getMessageContainer().textContent = "";
};

eventManager().assignEventTiles();
eventManager().assignEventsChangeName();
