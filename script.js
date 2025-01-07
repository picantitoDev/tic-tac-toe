const gameBoardFactory = function () {
    const board =
        ["", "", "",
            "", "", "",
            "", "", ""];

    const winningPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];

    const isAWin = function (a, b, c) {
        return board[a] !== "" && board[a] === board[b] && board[b] === board[c];
    };

    return {
        clearBoard() {
            for (let i = 0; i < board.length; i++) {
                board[i] = "";
            }
        },

        updateBoard(position, symbol) {
            if (position < 0 || position > 8 || board[position] !== "") {
                return;
            }
            board[position] = symbol;
        },

        checkWinner() {
            for (let [a, b, c] of winningPositions) {
                if (isAWin(a, b, c)) {
                    return board[a];
                }
            }
            return null;
        },

        getBoard() {
            const [a, b, c, d, e, f, g, h, i] = board;
            console.log(a + " " + b + " " + c);
            console.log(d + " " + e + " " + f);
            console.log(g + " " + h + " " + i);
        },

        checkDraw() {
            return board.every(cell => cell !== "") && !this.checkWinner();
        }
    };
}();

const playerFactory = function (marker) {
    return {
        getMarker() {
            return marker;
        }
    }
};

const gameModule = function () {
    let board = gameBoardFactory;
    let playerOne = playerFactory("X");
    let playerTwo = playerFactory("O");
    let turn = playerOne.getMarker();
    let gameOver = false;

    function nextTurn() {
        turn = turn === playerOne.getMarker() ? playerTwo.getMarker() : playerOne.getMarker();
    }

    return {
        newGame() {
            turn = playerOne.getMarker();
            board.clearBoard();
            gameOver = false;
        },
        getTurn() {
            return turn;
        },

        getGameStatus() {
            return gameOver;
        },

        playTurn(position) {

            if (gameOver) {
                console.log("Game is over. Start a new game.");
                return;
            }

            if (turn === playerOne.getMarker()) {
                board.updateBoard(position, playerOne.getMarker());
            }
            else if (turn === playerTwo.getMarker()) {
                board.updateBoard(position, playerTwo.getMarker());
            }

            board.getBoard();
            let currentPlayer = board.checkWinner();
            if (currentPlayer !== null) {
                console.log(`Player ${currentPlayer} wins!`);
                gameOver = true;
                return;
            }

            if (board.checkDraw()) {
                console.log("The game is a tie!");
                gameOver = true;
                return;
            }
            nextTurn();
        }
    }
}();

let displayController = function () {
    const game = gameModule;
    let cellGrid = document.querySelector(".grid-container");
    let results = document.querySelector(".results");

    function displayResults(winner) {
        results.innerHTML = "The winner is Player " + winner;
    }

    return {
        markCell() {
            cellGrid.addEventListener("click", (event) => {
                if (event.target.tagName === 'BUTTON') {
                    let currentPlayer = game.getTurn();
                    let position = Array.from(cellGrid.children).indexOf(event.target);

                    if (!game.getGameStatus() && position.textContent !== "") {
                        game.playTurn(position);
                        event.target.innerHTML = currentPlayer;
                        console.log(`button ${position} was clicked`);
                    }

                    if(game.getGameStatus()){
                        displayResults(currentPlayer);
                    }
                }
            })
        },

        clearBoard() {
            game.newGame();
            let cells = Array.from(cellGrid.children);
            cells.forEach(cell => {
                cell.textContent = "";
            });
            results.innerHTML = "";
        }
    }
}();

let UI = displayController;

UI.markCell();


