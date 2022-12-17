const fs = require('fs');

const rocks= `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`.split('\n\n').map(b => b.split('\n').map(l => l.split('').map(c => c === '#' ? 1 : 0)));

const directions = fs.readFileSync('input/17.txt', 'utf8').split('').map(c => c === '>' ? 1 : -1);

const width = 7;
function apply (shape, pos, board) {
	// resize board for shape
	while (board.length < pos[1] + 1) {
		board.push(new Array(width).fill(0));
	}

	// add shape to board for current position
	for(let r = 0; r < shape.length; r++) {
		for(let c = 0; c < shape[r].length; c++) {
			if (shape[r][c] === 0) continue;
			board[pos[1] - r][c + pos[0]] = 1;
		}
	}
}

function coll (shape, pos, board) {
	// check that shape does not collide with walls
	if (pos[0] < 0 || pos[0] + shape[0].length > 7) return true;

	// check that shape does not collide with floor
	if (pos[1] - (shape.length - 1) < 0) return true;
	
	if (board.length === 0) return false;

	// check that shape does not collide with other shapes
	for(let r = 0; r < shape.length; r++) {
		for(let c = 0; c < shape[r].length; c++) {
			let y = pos[1] - r;
			if (shape[r][c] === 0 || y >= board.length) continue;
			if (board[y][c + pos[0]] === 1) return true;
		}
	}
}

function sim (board, count, gasInd) {
	let dropped = 0;
	gasInd ??= 0;

	let len = 0;

	while (dropped < count) {
		// drop a new rock
		const rockInd = dropped % rocks.length;
		const rock = rocks[rockInd].slice();
		let pos = [2, board.length + rock.length + 2]

		// hacky way to find loop points
		// if (rockInd == 0) console.log(`${dropped}: ${rockInd} ${gasInd}`);

		// simulate
		while (true) {
			// get pushed
			let nPos = pos.slice();
			nPos[0] += directions[gasInd];
			// console.log(directions[gasInd] > 0 ? '>' : '<');
			gasInd = (gasInd + 1) % directions.length;
			if (!coll(rock, nPos, board)) pos = nPos;

			// fall
			nPos = pos.slice();
			nPos[1] -= 1;
			if (coll(rock, nPos, board)) break;
			pos = nPos;
		}

		apply(rock, pos, board);

		dropped++;
	}

	return board;
}

function renderLn (line) {
	return line.map(c => c > 0 ? '#' : '.').join('');
}

function draw (board) {
	console.log(board.slice().reverse().map(renderLn).join('\n').concat('\n'));
}

console.log(`P1 ${sim([], 2022).length}`)

// starting at 15
// loop every 35 with gi = 2
// const drops = 1000000000000;
// const init = 15;
// const ll = 35;
// const seed = 2;
// let start = sim([], init).length;
// let loop = sim([], ll, seed).length;
// console.log(`Remainder: ${(drops - init) % ll}`);
// let remain = sim([], (drops - init) % ll, rock, seed).length; // remainder of drops

// starting at 1705
// loop every 1695 with gi starting at 7
const drops = 1000000000000;
const init = 1705;
const ll = 1695;
const seed = 7;
let start = sim([], init).length;
let loop = sim([], ll, seed).length;
let remain = sim([], (drops - init) % ll, seed).length; // remainder of drops

console.log(`P2 ${Math.floor((drops - init) / ll) * loop + start + remain}`);