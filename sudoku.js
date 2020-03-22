let arr = [[], [], [], [], [], [], [], [], []];
let temp = [[], [], [], [], [], [], [], [], []];
let board = [[], [], [], [], [], [], [], [], []];

let button = document.getElementById("generate-sudoku");
let solve = document.getElementById("solve");

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    arr[i][j] = document.getElementById(i * 9 + j);
  }
}

function initializeTemp(temp) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      temp[i][j] = false;
    }
  }
}

function setTemp(board, temp) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] != 0) {
        temp[i][j] = true;
      }
    }
  }
}

function setColor(temp) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (temp[i][j] == true) {
        arr[i][j].style.color = "#DC3545";
      }
    }
  }
}

function resetColor() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      arr[i][j].style.color = "green";
    }
  }
}

function changeBoard(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] != 0) {
        arr[i][j].innerText = board[i][j];
      } else arr[i][j].innerText = "";
    }
  }
}

button.addEventListener("click", function() {
  let xhrRequest = new XMLHttpRequest();
  xhrRequest.onload = function() {
    let response = JSON.parse(xhrRequest.response);
    console.log("XHR response", response);
    initializeTemp(temp);
    resetColor();

    board = response.board;
    setTemp(board, temp);
    setColor(temp);
    changeBoard(board);
  };
  xhrRequest.open("get", "https://sugoku.herokuapp.com/board?difficulty=easy");
  xhrRequest.send();
});

function isSafe(board, r, c, no) {
  //not repeating in the same row or column
  for (let i = 0; i < 9; i++) {
    if (board[i][c] == no || board[r][i] == no) {
      return false;
    }
  }
  //subgrid
  let sx = r - (r % 3);
  let sy = c - (c % 3);

  for (let x = sx; x < sx + 3; x++) {
    for (let y = sy; y < sy + 3; y++) {
      if (board[x][y] == no) {
        return false;
      }
    }
  }
  return true;
}

function solveSudokuHelper(board, r, c) {
  if (r == 9) {
    changeBoard(board);
    return true;
  }
  if (c == 9) {
    return solveSudokuHelper(board, r + 1, 0);
  }
  if (board[r][c] != 0) {
    return solveSudokuHelper(board, r, c + 1);
  }
  for (let i = 1; i <= 9; i++) {
    if (isSafe(board, r, c, i)) {
      board[r][c] = i;
      let success = solveSudokuHelper(board, r, c + 1);
      if (success == true) {
        return true;
      }
      board[r][c] = 0;
    }
  }
  return false;
}

function solveSudoku(board) {
  solveSudokuHelper(board, 0, 0);
}

solve.addEventListener("click", function() {
  solveSudoku(board);
});
