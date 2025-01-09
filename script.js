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

    // Displaying different sections of the web page
    let startButton = document.querySelector(".start");
    let startScreen = document.querySelector(".start-screen");
    let loadingScreen = document.querySelector(".loading-screen");
    let gameScreen = document.querySelector(".game-screen");

    // Player names
    let playerOneName = "";
    let playerTwoName = "";

    // Control
    let stopClickListener = false;


    function displayResults(currentPlayer, result) {
        stopClickListener = true;

        if(result === "tie"){
            results.innerHTML = "It's a tie!";

        }

        if (currentPlayer === "X" && result === "won") {
            results.innerHTML = "The winner is " + playerOneName;
        } else if (currentPlayer === "O" && result === "won") {
            results.innerHTML = "The winner is " + playerTwoName;
        }else{
            console.log("invalid");
        }

        return;
    }

    return {
        startGame() {
            startButton.addEventListener("click", function () {
                playerOneName = document.getElementById('first-player-name').value;
                playerTwoName = document.getElementById('second-player-name').value;

                startScreen.classList.remove("active");
                loadingScreen.classList.add("active");

                setTimeout(function () {
                    let h1 = document.createElement("h1");
                    h1.textContent = "TIC";
                    h1.style.fontSize = "200px";
                    h1.style.marginBottom = "2px";
                    h1.style.wordSpacing = "30px";
                    loadingScreen.appendChild(h1);
                }, 700);

                setTimeout(function () {
                    let h1 = document.createElement("h1");
                    h1.textContent = "TAC";
                    h1.style.fontSize = "200px";
                    h1.style.marginBottom = "2px";
                    h1.style.wordSpacing = "30px";
                    loadingScreen.appendChild(h1);
                }, 1400);

                setTimeout(function () {
                    let h1 = document.createElement("h1");
                    h1.textContent = "TOE!";
                    h1.style.fontSize = "200px";
                    h1.style.marginBottom = "2px";
                    h1.style.wordSpacing = "30px";
                    loadingScreen.appendChild(h1);
                }, 2100);

                setTimeout(function () {
                    loadingScreen.classList.remove("active");
                    gameScreen.classList.add("active");
                    console.log(playerOneName);
                    console.log(playerTwoName);
                }, 2800);
            });
        },
        markCell() {
            //WORK ON THIS
            cellGrid.addEventListener("click", (event) => {
                if (event.target.tagName === 'BUTTON') {
                    let position = Array.from(cellGrid.children).indexOf(event.target);
                    let currentPlayer = game.getTurn();
                    
                    if(stopClickListener) return;

                    if (game.getGameStatus() === "running" && event.target.textContent === "") {
                        game.playTurn(position);
                        event.target.innerHTML = currentPlayer;
                        if(currentPlayer === "X"){
                            event.target.classList.add("blue");
                        }

                        if(currentPlayer === "O"){
                            event.target.classList.add("red");
                        }

                        console.log(`button ${position} was clicked`);
                    }

                    if(game.getGameStatus() === "won" || game.getGameStatus() === "tie"){
                        displayResults(currentPlayer, game.getGameStatus());
                    }
                }

            })
        },

        clearBoard() {
            game.newGame();
            stopClickListener = false;
            let cells = Array.from(cellGrid.children);
            cells.forEach(cell => {
                cell.textContent = "";
                cell.classList.remove("blue");
                cell.classList.remove("red");
            });
            results.innerHTML = "";
        }
    }
}();

let UI = displayController;
UI.startGame();
UI.markCell();





