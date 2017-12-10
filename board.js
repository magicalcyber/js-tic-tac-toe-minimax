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

    if (isOver()) {
        alert('Game over');
        return;
    }

    if (board[index] == ai || board[index] == human) {
        alert('Cannot place this position');
        return;
    }

    board[index] = currentTurn;

    var data = '<h3>' + currentTurn + '</h3>';
    document.getElementById(index).innerHTML = data;

    setTimeout(function () {
        if (winning(board, currentTurn)) {
            alert(currentTurn + ' is win');
        } else {
            changeTurn();
        }
    }, 100);
}

function isOver() {
    return winning(board, ai) || winning(board, human) || getAvailableMove(board).length == 0;
}

function changeTurn() {
    currentTurn = currentTurn == ai ? human : ai;

    if (currentTurn == ai) {
        console.log('computer move');

        var a = performance.now();
        var bestAiMove = minimax(cloneBoard(board), ai);
        var b = performance.now();
        //console.log(board);
        //console.log(bestAiMove);
        console.log('process time = ' + (b - a) + ' ms');
        place(bestAiMove.index);
        callCount = 0;
    }
}

function cloneBoard() {
    var tmpBoard = [];
    for (var i = 0; i < board.length; i++) {
        tmpBoard[i] = board[i];
    }
    return tmpBoard;
}

function minimax(tmpBoard, player) {
    callCount++;
    var availableMoves = getAvailableMove(tmpBoard);
    //console.log(tmpBoard);
    if (winning(tmpBoard, human)) {
        //console.log('human win');

        return {
            score: -10
        };
    } else if (winning(tmpBoard, ai)) {
        //console.log('ai win');
        return {
            score: 10
        };
    } else if (availableMoves.length === 0) {
        //console.log('end game');
        return {
            score: 0
        };
    } else {
        var moves = [];

        for (var i = 0; i < availableMoves.length; i++) {
            var move = {};
            move.index = availableMoves[i];

            tmpBoard[move.index] = player;

            if (player == ai) {
                var result = minimax(tmpBoard, human);
                move.score = result.score;
            } else {
                var result = minimax(tmpBoard, ai);
                move.score = result.score;
            }

            tmpBoard[move.index] = move.index;

            moves.push(move);
        }

        //console.log('-------------- find minimax for ' + player + ' -------------');

        //console.log(moves);
        //console.log(tmpBoard)

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
            var bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

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