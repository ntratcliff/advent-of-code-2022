const fs = require('fs');

const walls = fs.readFileSync('input/14.txt').toString().split('\n').map(l => l.split(' -> ').map(p => p.split(',').map(n => parseInt(n))));

const scan = {};
const xBounds = [Infinity,-Infinity];
walls.forEach((path) => {
	for (let i = 0; i < path.length - 1; i++) {
		const cur = path[i];
		const next = path[i+1];
		const to = cur.map((p, j) => next[j] - p);

		scan[cur] = '#';

		if (xBounds[0] > cur[0]) xBounds[0] = cur[0];
		if (xBounds[1] < cur[0]) xBounds[1] = cur[0];

		while (to[0] !== 0) {
			let wall = [cur[0] + to[0], cur[1]];
			if (xBounds[0] > wall[0]) xBounds[0] = wall[0];
			if (xBounds[1] < wall[0]) xBounds[1] = wall[0];
			scan[wall] = '#';
			to[0] -= Math.sign(to[0]);
		}

		while (to[1] !== 0) {
			scan[[cur[0], cur[1] + to[1]]] = '#';
			to[1] -= Math.sign(to[1]);
		}
	}
});

const yMax = walls.flat(1).reduce((m, p) => m < p[1] ? p[1] : m, 0)

function print(cave) {
	console.log();
	for (y = 0; y <= yMax; y++) {
		let l = '';
		for (x = xBounds[0]; x <= xBounds[1]; x++) {
			l = l.concat(cave[[x,y]] ? cave[[x,y]] : '.');
		}
		console.log(l);
	}
}

print(scan);

function sim (board, floor) {
	const sandEmit = [500, 0];
	let cave = structuredClone(board);
	let sand;
	let count = 0;
	while (true) {
		if (!sand) sand = sandEmit.slice();

		if (!floor && sand[1] > yMax) break;

		let next = sand.slice();
		next[1] += 1;

		if (!floor || next[1] < floor + yMax) {
			if (!cave[next]) {
				sand = next;
				continue;
			}

			next[0] -= 1;
			if (!cave[next]) {
				sand = next;
				continue;
			}

			next[0] += 2;
			if (!cave[next]) {
				sand = next;
				continue;
			}
		}

		// can't fall anywhere, come to rest
		cave[sand] = 'o';
		count++;

		if (floor && sand.reduce((c, v, i) => c &= v === sandEmit[i], true)) break;

		sand = undefined;
	}
	
	print(cave);
	return count;
}


console.log(`P1: ${sim(scan)}`);
console.log(`P2: ${sim(scan, 2)}`);