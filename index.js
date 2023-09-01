document.addEventListener('DOMContentLoaded', () => {
const cells = document.querySelectorAll('.cell'); 
const playerOneScore = document.querySelector('.playerScore');
const computerScore = document.querySelector('.computerScore');
  
let currentPlayer = 'X'; // playerOne Symbol
  
//gameState
const spaces = ['', '', '', '', '', '', '', '', ''];
  
//eventListeners for Board
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
    if (!cell.textContent && !checkWin() && !checkDraw()) {
        cell.textContent = currentPlayer;
        spaces[index] = currentPlayer;
        if (checkWin()) {
            if (currentPlayer === 'X') {
                const playerOneWins = +playerOneScore.textContent.split(' ')[0] + 1;
                playerOneScore.textContent = `${playerOneWins} Wins`;
                alert('Player 1 (X) wins!');
            } else {
                const computerWins = +computerScore.textContent.split(' ')[0] + 1;
                computerScore.textContent = `${computerWins} Wins`;
                alert('Player 2 (O) wins!');
            }
        resetGame();
        } else if (checkDraw()) {
        alert('It\'s a draw!');
        resetGame();
        } else {
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
            if (currentPlayer === 'O') {
                setTimeout(() => {
                    makeAIMoveMinimax();
                    const winner = checkWinner(spaces);
                    if (winner === 'O') {
                        computerScore.textContent = parseInt(computerScore.textContent) + 1;
                        alert('Player 2 (O) wins!');
                        resetGame();
                        }
                    }, 1000);
                }
            }
        }
    });
});
  
function checkWin() {
    //check rows
  for (let i = 0; i < 3; i++) {
  if (
    spaces [i*3]!==''&&
    spaces[i*3]===spaces[i*3+1]&&
    spaces[i*3]===spaces[i*3+2]
    ){
      return true;
    }
  }
  //check columns
  for (let i = 0; i < 3; i++){
    if (
    spaces[i]!==''&&
    spaces[i]===spaces[i+3]&&
    spaces[i]===spaces[i+6]
    ){
    return true;
    }
  }
  //check diagonals
  if (
    spaces[0]!==''&&
    spaces[0]===spaces[4]&&
    spaces[0]===spaces[8]
  ){
    return true;
  }
  if (
    spaces[2]!==''&&
    spaces[2]===spaces[4]&&
    spaces[2]===spaces[6]
    ){
      return true;
    }
      return false; //no win condition
  }
  //Check draw
  function checkDraw(){
    return spaces.every(cell => cell !=='');
  }
  // reset board
  function resetGame(){
    cells.forEach(cell => {
      cell.textContent='';
    });
    spaces.fill('');
  }
  //start new game
  function newGame() {
    resetGame();
    playerOneScore.textContent = '0'; // Reset scores
    computerScore.textContent = '0';
  }
  
  function makeAIMoveMinimax() {
      const bestMove = findBestMove(spaces, currentPlayer);
      if (bestMove !== -1) {
        spaces[bestMove] = currentPlayer;
        cells[bestMove].textContent = currentPlayer;
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
      }
    }
  
    function findBestMove(board, player) {
      let bestScore = -Infinity;
      let bestMove = -1;
  
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = player;
          let score = minimax(board, 0, false);
          board[i] = ''; // Undo the move
  
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
  
      return bestMove;
    }
  
    const scores = {
      X: -10,
      O: 10,
      draw: 0
    };
  
    function minimax(board, depth, isMaximizing) {
      const winner = checkWinner(board);
      if (winner !== null) {
        return scores[winner];
      }
  
      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, depth + 1, false);
            board[i] = ''; // Undo the move
            bestScore = Math.max(bestScore, score);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === '') {
            board[i] = 'X';
            let score = minimax(board, depth + 1, true);
            board[i] = ''; // Undo the move
            bestScore = Math.min(bestScore, score);
          }
        }
        return bestScore;
      }
    }
  
    function checkWinner(board) {
      const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
      ];
  
      for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
          return board[a];
        }
      }
  
      if (board.every(cell => cell !== '')) {
        return 'draw';
      }
  
      return null;
    }
  
    // EventListeners for Buttons
    document.querySelector('.reset').addEventListener('click', resetGame);
    document.querySelector('.newGame').addEventListener('click', newGame);
  });
  