let gameBoardFactory = function () {
    const board =
        ["", "", "",
            "", "", "",
            "", "", ""];
    return {
        clearBoard() {
            for (let i = 0; i < board.length; i++){
                board[i] = "";
            }
        },

        updateBoard(position, symbol) {
            if(board[position] === ""){
                board[position] = symbol;
            }
        },

        checkWinner() {
            let won = false;

            // Horizontal Wins
            if (board[0] === board[1] && board[1] === board[2] && board[0] === board[2]){
                won = true;
            }

            if (board[3] === board[4] && board[4] === board[5] && board[3] === board[5]){
                won = true;
            }

            if (board[6] === board[7] && board[7] === board[8] && board[6] === board[8]){
                won = true;
            }

            // Vertical Wins
            if (board[0] === board[3] && board[3] === board[6] && board[0] === board[6]){
                won = true;
            }

            if (board[1] === board[4] && board[4] === board[7] && board[1] === board[7]){
                won = true;
            }

            if (board[2] === board[5] && board[5] === board[8] && board[2] === board[8]){
                won = true;
            }

            // Diagonal Wins
            if (board[0] === board[4] && board[4] === board[8] && board[0] === board[8]){
                won = true;
            }

            if (board[6] === board[4] && board[4] === board[2] && board[6] === board[2]){
                won = true;
            }

            return won;
        }
    };
}();
