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
                return false;
            }
            board[position] = symbol;
            return true;
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
    let gameStatus = "running";

    function nextTurn() {
        turn = turn === playerOne.getMarker() ? playerTwo.getMarker() : playerOne.getMarker();
    }

    return {
        newGame() {
            turn = playerOne.getMarker();
            board.clearBoard();
            gameStatus = "running";
        },
        getTurn() {
            return turn;
        },

        getGameStatus() {
            return gameStatus;
        },

        playTurn(position) {

            if (gameStatus === "won" || gameStatus === "tie") {
                console.log("Game is over. Start a new game.");
                return;
            }


            if (turn === playerOne.getMarker()) {
                if (board.updateBoard(position, playerOne.getMarker())) {
                    nextTurn();
                };
            }
            else if (turn === playerTwo.getMarker()) {

                if (board.updateBoard(position, playerTwo.getMarker())) {
                    nextTurn();
                };
            }

            board.getBoard();
            let currentPlayer = board.checkWinner();
            if (currentPlayer !== null) {
                console.log(`Player ${currentPlayer} wins!`);
                gameStatus = "won";
                return;
            }

            if (board.checkDraw()) {
                console.log("The game is a tie!");
                gameStatus = "tie";
                return;
            }
        }
    }
}();

let displayController = function () {
    // Logic on displaying Tic Tac Toe Grid
    const game = gameModule;
    let cellGrid = document.querySelector(".grid-container");
    let results = document.querySelector(".results");
    let reset = document.querySelector(".reset");

    // Displaying different sections of the web page
    let startButton = document.querySelector(".start");
    let startScreen = document.querySelector(".start-screen");
    let loadingScreen = document.querySelector(".loading-screen");
    let gameScreen = document.querySelector(".game-screen");

    // Player names
    let playerOneName = "";
    let playerTwoName = "";

    // Scores
    let playerOneWins = 0;
    let playerTwoWins = 0;
    let draws = 0;

    // Scoreboard
    let playerOneScoreboardName = document.querySelector(".p1-name");
    let playerOneScoreboardNumber = document.querySelector(".p1-score");
    let playerTwoScoreboardName = document.querySelector(".p2-name");
    let playerTwoScoreboardNumber = document.querySelector(".p2-score");
    let drawScoreboardNumber = document.querySelector(".draw-score");

    // Control
    let stopClickListener = false;


    function displayResults(currentPlayer, result) {
        stopClickListener = true;

        if (result === "tie") {
            results.innerHTML = "It's a tie!";
            draws++;
            drawScoreboardNumber.innerHTML = draws;
        }

        if (currentPlayer === "X" && result === "won") {
            results.innerHTML = "The winner is " + playerOneName;
            playerOneWins++;
            playerOneScoreboardNumber.innerHTML = playerOneWins;
        } else if (currentPlayer === "O" && result === "won") {
            results.innerHTML = "The winner is " + playerTwoName;
            playerTwoWins++;
            playerTwoScoreboardNumber.innerHTML = playerTwoWins;

        } else {
            console.log("invalid");
        }

        reset.style.display = "block";
        return;
    }

    return {
        startGame() {
            startButton.addEventListener("click", function () {
                event.preventDefault(startButton);

                playerOneName = document.getElementById('first-player-name').value;
                playerTwoName = document.getElementById('second-player-name').value;

                if (playerOneName === "" || playerTwoName === "") {
                    alert("Both players must enter their names!");
                    return;
                }

                playerOneScoreboardName.innerHTML = playerOneName;
                playerTwoScoreboardName.innerHTML = playerTwoName;

                startScreen.style.animation = "fade-out 1s ease-out forwards";
                setTimeout(() => {
                    startScreen.classList.remove("active");
                    loadingScreen.classList.add("active");
                }, 1000);

                function createFallingWord(text, delay) {
                    let h1 = document.createElement("h1");
                    h1.textContent = text;
                    h1.classList.add("falling-word");
                    h1.style.animation = `fall 0.5s ease-out ${delay}s forwards`;
                    loadingScreen.appendChild(h1);
                }

                createFallingWord("TIC", 0.7);
                createFallingWord("TAC", 1.4);
                createFallingWord("TOE!", 2.1);

                setTimeout(function () {
                    loadingScreen.classList.remove("active");
                    gameScreen.classList.add("active");
                }, 4500);
            });
        },
        markCell() {
            cellGrid.addEventListener("click", (event) => {
                if (event.target.tagName === 'BUTTON') {
                    let position = Array.from(cellGrid.children).indexOf(event.target);
                    let currentPlayer = game.getTurn();

                    if (stopClickListener) return;

                    if (game.getGameStatus() === "running" && event.target.textContent === "") {
                        game.playTurn(position);
                        event.target.innerHTML = currentPlayer;
                        if (currentPlayer === "X") {
                            event.target.classList.add("blue");
                        }

                        if (currentPlayer === "O") {
                            event.target.classList.add("red");
                        }

                        console.log(`button ${position} was clicked`);
                    }

                    if (game.getGameStatus() === "won" || game.getGameStatus() === "tie") {
                        displayResults(currentPlayer, game.getGameStatus());
                    }
                }

            })
        },

        clearBoard() {
            reset.addEventListener("click", function () {
                game.newGame();
                stopClickListener = false;
                let cells = Array.from(cellGrid.children);
                cells.forEach(cell => {
                    cell.textContent = "";
                    cell.classList.remove("blue");
                    cell.classList.remove("red");
                });
                results.innerHTML = "";
                reset.style.display = "none";
            });
        }
    }
}();

let UI = displayController;
UI.startGame();
UI.markCell();





