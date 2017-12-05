var human = 'X';
var ai = 'O';

var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

var currentTurn = human;
var callCount = 0;

function renderBoard() {
    var count = 0;
    var table = '<table border="1">';

    for (var i = 0; i < 3; i++) {
        table += '<tr>';
        for (var j = 0; j < 3; j++) {
            table += '<td id="' + count + '" onclick="place(' + count + ')"></td>';
            count++;
        }
        table += '</tr>';
    }
    table += '</table>';

    document.getElementById("board").innerHTML = table;
}

function place(index) {

    if(isOver()){
        alert('Game over');
        return;
    }

    board[index] = currentTurn;

    var data = '<h3>' + currentTurn + '</h3>';
    document.getElementById(index).innerHTML = data;

    setTimeout(function(){
        if(winning(board, currentTurn)){
            alert(currentTurn + ' is win');
        }else {
            changeTurn();   
        }
    }, 100);
}

function isOver(){
    return winning(board, ai) || winning(board, human) || getAvailableMove(board).length == 0;
}

function changeTurn() {
    currentTurn = currentTurn == ai ? human : ai;
    console.log('turn :' + currentTurn);

    if (currentTurn == ai) {
        console.log('computer move');
        var bestAiMove = minimax(cloneBoard(board), ai);
        console.log(board);
        console.log(bestAiMove);

        place(bestAiMove.index);
    }
}

function cloneBoard(){
    var tmpBoard = [];
    for(var i = 0; i < board.length; i++){
        tmpBoard[i] = board[i];
    }
    return tmpBoard;
}

function minimax(tmpBoard, player) {
    callCount++;
    var availableMoves = getAvailableMove(tmpBoard);

    // checks for the terminal states such as win, lose, and tie and returning a value accordingly
    if (winning(tmpBoard, human)) {
        return {
            score: -10
        };
    } else if (winning(tmpBoard, ai)) {
        return {
            score: 10
        };
    } else if (availableMoves.length === 0) {
        return {
            score: 0
        };
    }

    // an array to collect all the objects
    var moves = [];

    // loop through available spots
    for (var i = 0; i < availableMoves.length; i++) {
        //create an object for each and store the index of that spot that was stored as a number in the object's index key
        var move = {};
        move.index = tmpBoard[availableMoves[i]];

        // set the empty spot to the current player
        tmpBoard[availableMoves[i]] = player;

        //if collect the score resulted from calling minimax on the opponent of the current player
        if (player == ai) {
            var result = minimax(tmpBoard, human);
            move.score = result.score;
        } else {
            var result = minimax(tmpBoard, ai);
            move.score = result.score;
        }

        //reset the spot to empty
        tmpBoard[availableMoves[i]] = move.index;

        // push the object to the array
        moves.push(move);
    }

    // if it is the computer's turn loop over the moves and choose the move with the highest score
    var bestMove;
    if (player === ai) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {

        // else loop over the moves and choose the move with the lowest score
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    // return the chosen move (object) from the array to the higher depth
    return moves[bestMove];


}

function winning(tmpBoard, player) {
    if (
        (tmpBoard[0] == player && tmpBoard[1] == player && tmpBoard[2] == player) ||
        (tmpBoard[3] == player && tmpBoard[4] == player && tmpBoard[5] == player) ||
        (tmpBoard[6] == player && tmpBoard[7] == player && tmpBoard[8] == player) ||
        (tmpBoard[0] == player && tmpBoard[3] == player && tmpBoard[6] == player) ||
        (tmpBoard[1] == player && tmpBoard[4] == player && tmpBoard[7] == player) ||
        (tmpBoard[2] == player && tmpBoard[5] == player && tmpBoard[8] == player) ||
        (tmpBoard[0] == player && tmpBoard[4] == player && tmpBoard[8] == player) ||
        (tmpBoard[2] == player && tmpBoard[4] == player && tmpBoard[6] == player)
    ) {
        return true;
    } else {
        return false;
    }
}

function getAvailableMove(tmpBoard) {
    return tmpBoard.filter(s => s != human && s != ai);
}

renderBoard();

/*
board[0] = human;

var bestAiMove = minimax(board, ai);
board[bestAiMove.index] = ai;

console.log(board);
board[3] = human;

bestAiMove = minimax(board, ai);
board[bestAiMove.index] = ai;
console.log(board);
*/