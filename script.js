//PLayer object
const player = (name, sign) => {
  const getName = name;
  const getSign = sign;
  return { getName, getSign };
};

//Gameboard iife
const gameBoard = (() => {
  const _board = ["", "", "", "", "", "", "", "", ""];

  const setField = (playerSign, position) => {
    _board[position] = playerSign;
  };

  const getField = (position) => {
    return _board[position];
  };

  const reset = () => {
    for (let i = 0; i < 9; i++) {
      _board[i] = "";
    }
  };

  return { setField, getField, reset };
})();

//Display controller iife
const displayController = (() => {
  const fieldElements = document.querySelectorAll(".field");
  const message = document.querySelector(".message");
  const reset = document.getElementById("reset");

  fieldElements.forEach((field) => {
    field.addEventListener("click", (e) => {
      const field = e.target;
      gameController.playRound(field.id);
      field.disabled = true;
    });
  });

  const setMessage = (text) => {
    message.innerHTML = text;
  };

  const updateBoard = () => {
    for (let i = 0; i < 9; i++) {
      const field = document.getElementById(i);
      field.innerText = gameBoard.getField(i);
    }
  };

  const enableButtons = () => {
    for (let i = 0; i < 9; i++) {
      const field = document.getElementById(i);
      field.disabled = false;
    }
  };

  const disableButtons = () => {
    for (let i = 0; i < 9; i++) {
      const field = document.getElementById(i);
      field.disabled = true;
    }
  };

  reset.onclick = () => {
    gameController.restart();
  };

  return { setMessage, updateBoard, disableButtons, enableButtons };
})();

//Game Controller iife
const gameController = (() => {
  const _playerX = player("player X", "X");
  const _playerY = player("player Y", "Y");
  let _round = 0;

  const _playerTurn = () => {
    return _round % 2 === 0 ? _playerX.getSign : _playerY.getSign;
  };

  const playRound = (fieldID) => {
    gameBoard.setField(_playerTurn(), fieldID);
    displayController.updateBoard();

    _round++;
    displayController.setMessage(`Player ${_playerTurn()}'s Turn`);
    if (_round === 9) {
      displayController.setMessage(`TIE`);
      _round = 0;
      displayController.disableButtons();
    }
    checkWinner();
  };

  const checkWinner = () => {
    if (_checkRow() !== false) {
      displayController.setMessage(`Player ${_checkRow()} has won!`);
      _round = 0;
      displayController.disableButtons();
    }

    if (_checkColumn() !== false) {
      displayController.setMessage(`Player ${_checkColumn()} has won!`);
      _round = 0;
      displayController.disableButtons();
    }

    if (_checkDiagonal() !== false) {
      displayController.setMessage(`Player ${_checkDiagonal()} has won!`);
      _round = 0;
      displayController.disableButtons();
    }
  };

  const restart = () => {
    gameBoard.reset();
    displayController.updateBoard();
    displayController.enableButtons();
    displayController.setMessage("Player X's Turn");
    _round = 0;
  };

  const _checkRow = () => {
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = i * 3; j < i * 3 + 3; j++) {
        row.push(gameBoard.getField(j));
      }
      if (row.every((field) => field === "X")) {
        return "X";
      } else if (row.every((field) => field === "Y")) {
        return "Y";
      }
    }
    return false;
  };

  const _checkColumn = () => {
    for (let i = 0; i < 3; i++) {
      let column = [];

      for (let j = 0; j < 3; j++) {
        column.push(gameBoard.getField(i + 3 * j));
      }

      if (column.every((field) => field === "X")) {
        return "X";
      } else if (column.every((field) => field === "Y")) {
        return "Y";
      }
    }
    return false;
  };

  const _checkDiagonal = () => {
    const firstDiagonal = [
      gameBoard.getField(0),
      gameBoard.getField(4),
      gameBoard.getField(8),
    ];

    const secondDiagonal = [
      gameBoard.getField(2),
      gameBoard.getField(4),
      gameBoard.getField(6),
    ];

    if (firstDiagonal.every((field) => field === "X")) {
      return "X";
    } else if (firstDiagonal.every((field) => field === "Y")) {
      return "Y";
    }

    if (secondDiagonal.every((field) => field === "X")) {
      return "X";
    } else if (secondDiagonal.every((field) => field === "Y")) {
      return "Y";
    }
    return false;
  };
  return { playRound, checkWinner, restart };
})();
