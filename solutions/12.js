const fs = require('fs');

const map = fs.readFileSync('input/12.txt').toString().split('\n');

function heightOf(c) {
	switch(c) {
		case 'S': return 0;
		case 'E': return heightOf('z');
		default: return c.charCodeAt(0) - 'a'.charCodeAt(0);
	}
}

function path(start, end) {
	const search = {};
	const cost = {};
	const front = [start];
	const priority = [0];
	cost[start] = 0;

	while (front.length > 0) {
		const cur = front.shift();
		priority.shift();

		if (cur === end) break; // we're done!

		const vh = heightOf(map[cur[0]][cur[1]]);

		function test(p) {
			let c = cost[cur] + 1;

			if (search[p] !== undefined && c > cost[cur]) { // already visited
				return;
			}

			if (heightOf(map[p[0]][p[1]]) - vh > 1) { // too high!
				return;
			}

			let dist = cur.reduce((m, v, i) => m += (v - end[i])*(v - end[i]), 0); // sq dist to end point
			let i = priority.reduce((r, v, i) => r = v > dist ? i : r, 0);

			priority.splice(i, 0, dist + c);
			front.splice(i, 0, p);

			search[p] = cur;
			cost[p] = c;
		}


		// test neighbors
		if (cur[0] > 0) test([cur[0] - 1, cur[1]]);
		if (cur[0] < map.length - 1) test([cur[0] + 1, cur[1]]);
		if (cur[1] > 0) test([cur[0], cur[1] - 1]);
		if (cur[1] < map[0].length - 1) test([cur[0], cur[1] + 1])
	}

	// count steps
	let count = 0;
	let cur = end;
	while (cur != start) {
		cur = search[cur];
		if(cur === undefined) {
			count = Infinity;
			break;
		}
		count++;
	}
	

	return count;
}

let start;
let end;
let lowest = [];

// find the important nodes
for (let i = 0; i < map.length; i++) {
	for (let j = 0; j < map[i].length; j++) {
		switch(map[i][j]) {
			case 'S':
				start = [i,j];
			case 'a':
				lowest.push([i,j]);
				break;
			case 'E':
				end = [i,j];
				break;
		}
	}
}

console.log(`P1: ${path(start, end)}`);
console.log(`P2: ${lowest.map(p => path(p, end)).reduce((m, v) => m = v < m ? v : m)}`);