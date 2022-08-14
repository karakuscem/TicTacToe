// Module for game board
const gameBoard = (() => {

    // Create Player
    const playerCreator = (name, mark, turn) => {
        return {name, mark, turn};
    };
    const player1 = playerCreator("Player 1", "X", false);
    const player2 = playerCreator("Player 2", "O", false);
    const ai = playerCreator("AI", "O", false);

    // Empty Array, gameMode, and turn counter variables.
    let boardArray = ["","","","","","","","",""];

    // Game mode, 1 for player vs player, 2 for player vs ai
    let gameMode = 0;
    let gameOver = false;
    let winner = "";

    // Check win conditions
    function checkRows() {
        let row1 = boardArray[0] === boardArray[1] && boardArray[0] === boardArray[2] && boardArray[0] !== "";
        let row2 = boardArray[3] === boardArray[4] && boardArray[3] === boardArray[5] && boardArray[3] !== "";
        let row3 = boardArray[6] === boardArray[7] && boardArray[6] === boardArray[8] && boardArray[6] !== "";
        if(row1 == true || row2 == true || row3 == true) {
            gameBoard.gameOver = true
        }
        if (row1) return gameBoard.winner = boardArray[0]
        if (row2) return gameBoard.winner = boardArray[3]
        if (row3) return gameBoard.winner = boardArray[6]
    }

    function checkColumns() {
        let column1 = boardArray[0] === boardArray[3] && boardArray[0] === boardArray[6] && boardArray[0] !== "";
        let column2 = boardArray[1] === boardArray[4] && boardArray[1] === boardArray[7] && boardArray[1] !== "";
        let column3 = boardArray[2] === boardArray[5] && boardArray[2] === boardArray[8] && boardArray[2] !== "";
        if(column1 == true || column2 == true || column3 == true) {
            gameBoard.gameOver = true
        }
        if (column1) return gameBoard.winner = boardArray[0]
        if (column2) return gameBoard.winner = boardArray[1]
        if (column3) return gameBoard.winner = boardArray[2]
    }

    function checkDiagonals() {
        let diagonal1 = boardArray[0] === boardArray[4] && boardArray[0] === boardArray[8] && boardArray[0] !== "";
        let diagonal2 = boardArray[2] === boardArray[4] && boardArray[2] === boardArray[6] && boardArray[2] !== "";
        if(diagonal1 == true || diagonal2 == true) {
            gameBoard.gameOver = true
        }
        if (diagonal1) return gameBoard.winner = boardArray[0]
        if (diagonal2) return gameBoard.winner = boardArray[2]
    }

    function checkTie() {
        for(let i = 0; i < boardArray.length; i++) {
            if(!boardArray.includes("") && gameBoard.gameOver == false) {
                gameBoard.gameOver = true;
                return gameBoard.winner = "Tie";
            }
        }
    }

    function checkWinCondition() {
        checkRows();
        checkColumns();
        checkDiagonals();
        checkTie();
        if(gameBoard.gameOver === true && gameBoard.winner !== "") {
            displayController.endGame()
            player1.turn = false;
            player2.turn = false;
            ai.turn = false;
            gameBoard.gameOver = false;
        }
    }

    // Create board, Add event listener, if click pass current player sign
    const boardCreate = (() => {
        // Select all divs.
        const selectAllDiv = document.querySelectorAll(".field")

        // Delete divs incase restart button pressed.
        selectAllDiv.forEach(box => {
            player1.turn = true;
            box.remove();
            displayController.headerText2.innerHTML = "";
            displayController.headerText.style.display = "flex"
            displayController.changeHeader();
        })

        //Create divs
        for (let i = 0; i < 9; i++) {
            const div = document.createElement("div");
            div.classList.add("field");
            div.dataset.index = `${i}`;
            const container = document.querySelector(".gameboard");
            container.appendChild(div);
        }

        // Player vs Player
        if (gameBoard.gameMode == 1) {
            selectAllDiv.forEach(div => {
                div.addEventListener("click", (e) => {
                    if (player1.turn == true && boardArray[div.dataset.index] == "") {
                        boardArray[div.dataset.index] = player1.mark;
                        div.innerHTML = player1.mark;
                        player1.turn = false;
                        player2.turn = true;
                        checkWinCondition();
                        displayController.changeHeader();
                    }
                    else if (player2.turn == true && boardArray[div.dataset.index] == "") {
                        boardArray[div.dataset.index] = player2.mark;
                        div.innerHTML = player2.mark;
                        player1.turn = true;
                        player2.turn = false;
                        checkWinCondition();
                        displayController.changeHeader();
                    }
                })
            })
        }

        // Function for AI Moves
        function aiMoves(boardArray) {
            let possibleMoves = [];
            for(let i = 0; i < boardArray.length; i++) {
                if(boardArray[i] == "") {
                    possibleMoves.push(i);
                }
            }
            let randomMove = Math.floor(Math.random() * possibleMoves.length);
            return possibleMoves[randomMove];
        }
        //Player vs AI
        if (gameBoard.gameMode == 2) {
            selectAllDiv.forEach(div => {
                div.addEventListener("click", (e) => {
                    if (player1.turn == true && boardArray[div.dataset.index] == "") {
                        boardArray[div.dataset.index] = player1.mark;
                        div.innerHTML = player1.mark;
                        player1.turn = false;
                        ai.turn = true;
                        checkWinCondition();
                        displayController.changeHeader();
                        if(ai.turn == true && boardArray.includes("")) {
                            setTimeout(() => {
                                let randomized = aiMoves(boardArray);
                                boardArray[randomized] = ai.mark;
                                aiDisplay = document.querySelector(`[data-index="${randomized}"]`);
                                aiDisplay.innerHTML = ai.mark;
                                ai.turn = false;
                                player1.turn = true;
                                checkWinCondition();
                                displayController.changeHeader();
                            }, 2000);
                        }
                    }
                })
            })
        }
    })

    return {playerCreator, boardCreate, boardArray, player1, player2, ai, gameOver, checkWinCondition, gameMode};
})();

// Module for display controller

const displayController = (() => {

    // Select necessary things
    const playWithAi = document.querySelector(".playWithAi");
    const playWithPlayer = document.querySelector(".playWithPlayer");
    const headerText = document.querySelector(".headerText");
    const headerText2 = document.querySelector(".headerText2")
    const mainMenu = document.querySelector("#mainMenu");
    const restart = document.querySelector(".restart");

    // Add event listener to play buttons
    playWithAi.addEventListener("click", (e) => {
        gameBoard.player1.turn = true;
        changeHeader()
        playWithAi.style.display = "none";
        playWithPlayer.style.display = "none";
        gameBoard.gameMode = 2;
        gameBoard.boardCreate()
    })
    playWithPlayer.addEventListener("click", (e) => {
        gameBoard.player1.turn = true;
        changeHeader()
        playWithAi.style.display = "none";
        playWithPlayer.style.display = "none";
        gameBoard.gameMode = 1;
        gameBoard.boardCreate()
    })

    // Function for changing header to which player's turn
    function changeHeader() {
        if(gameBoard.player1.turn === true) {
            headerText.innerHTML = "Player 1's Turn"
        }
        else if(gameBoard.player2.turn === true) {
            headerText.innerHTML = "Player 2's Turn"
        }
        else if(gameBoard.ai.turn === true) {
            headerText.innerHTML = "AI's Turn"
        }
    }

    // Function for finish the game.
    function endGame() {
        headerText.style.display = "none"
        headerText2.style.display = "flex"
        if(gameBoard.winner == "Tie") {
            headerText2.innerHTML = `${gameBoard.winner}`
        }
        else {
            headerText2.innerHTML = `Game Over! Winner is ${gameBoard.winner}`
        }
    }

    // If main menu button clicked reload the page.
    mainMenu.addEventListener("click", (e) => {
        window.location.reload();
    })

    // If restart button clicked reload the page with same game mode
    restart.addEventListener("click", (e) => {
        gameBoard.gameMode = gameBoard.gameMode;
        gameBoard.player1.turn = false;
        gameBoard.player2.turn = false;
        gameBoard.ai.turn = false;
        gameBoard.boardCreate();
        for(let i = 0; i < gameBoard.boardArray.length; i++) {
            gameBoard.boardArray[i] = "";
        }
    })
    return {changeHeader, endGame, headerText, headerText2};
})();
