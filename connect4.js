/* Starting with some shorthand const's */
const h1 = document.querySelector('h1');
const turnSpan = document.getElementById('turn');
const turnDiv = document.getElementById('turn-notifier');
let win = false;

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1;
const board = []; // empty array game board

// STEP ONE: makeBoard()
// It should set the global board variable to be an array of 6 arrays (height),
// each containing 7 items (width)
function makeBoard() {
	for (let i = 0; i < HEIGHT; i++) {
		const innerArr = [];
		for (let i = 0; i < WIDTH; i++) {
			innerArr.push(null);
		}
		board.push(innerArr);
	}
}

// STEP TWO: makeHTMLBoard
// This function is missing the first line, that sets the board variable to the HTML board DOM node. Fix this.
// Add comments to the code that dynamically creates the HTML table.
function makeHtmlBoard() {
	const htmlBoard = document.querySelector('#board');
	// creates top row that is used to place pieces
	let top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// creates board, creating new boxes according to height and width of board
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

// STEP THREE: placeInTable & Piece CSS
// This function should add a div inside the correct td cell in the HTML game board.
// This div should have the piece class on it, and should have a class for whether the current player is 1 or 2, like p1 or p2.
//Update the CSS file to:
// make the piece div round, not square
// be different colors depending on whether it’s a player #1 or #2 piece

function placeInTable(y, x) {
	const newPiece = document.createElement('div');
	newPiece.className = 'piece';
	currPlayer === 1 ? newPiece.classList.add('player1') : newPiece.classList.add('player2');
	const piecePlace = document.getElementById(`${y}-${x}`);
	if (piecePlace.childElementCount === 0) piecePlace.append(newPiece);
}

// STEP FOUR: handleClick
// There are several pieces to write/fix here:
// this never updates the board variable with the player #. Fix.
// add a check for “is the entire board filled” [hint: the JS every method on arrays would be especially nice here!]
// add code to switch currPlayer between 1 and 2. This would be a great place for a ternary function.

function handleClick(evt) {
	if (win) return; // Stops allowing clicks after someone wins
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// Using the found y array and x value of array, change x value to number of current player
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		onWin();
	}

	// check for tie
	// check if every array has every value !== null, if so (there are no more
	// null values), end the game in a tie using endGame();
	if (checkForTie()) {
		h1.innerText = 'Tie!';
	}

	// switch players
	// if current player is 1, switch to 2, otherwise current player must
	// be 2, so switch to 1
	currPlayer = currPlayer === 1 ? 2 : 1;
	turnChecker();
}

function checkForTie() {
	return board.every((arr) => {
		return arr.every((space) => {
			return space !== null;
		});
	});
}

// // STEP FIVE findSpotForCol and endGame
// Right now, the game drops always drops a piece to the top of the column, even if a piece is already there.
//Fix this function so that it finds the lowest empty spot in the game board and returns the y coordinate (or null if the column is filled).
// Once you have this working, make sure that when a game has ended, the endGame function runs and alerts which user has won!

function findSpotForCol(x) {
	// Create an array of the picked x column, check through the array from the
	// bottom up to check if each spot is null or not. If null, return that array.
	const yArr = [];
	for (let i = 0; i < board.length; i++) {
		yArr[i] = board[i][x];
	}
	for (let i = yArr.length - 1; i >= 0; i--) {
		if (yArr[i] === null) {
			return i;
		}
	}
	return null;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// Defining what a win is....
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

// Restart button reloads the page
const restarter = document.getElementById('restart-button');
restarter.addEventListener('click', () => location.reload());

// Checks what color's turn it currently is and updates HTML
function turnChecker() {
	if (currPlayer === 1) {
		turnSpan.innerText = "Red's";
		turnDiv.style.backgroundColor = 'red';
	} else {
		turnSpan.innerText = "Blue's";
		turnDiv.style.backgroundColor = 'blue';
	}
}

// Do some fun stuff
function onWin() {
	win = true;
	alert(`Player ${currPlayer} Wins!`);
	window.location.href = 'https://www.youtube.com/watch?v=04854XqcfCY&feature=youtu.be&t=39';
}

makeBoard();
makeHtmlBoard();
initializeScoreboard();
turnChecker();
