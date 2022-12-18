const fs = require('fs');

const cubes = new Set(fs.readFileSync('input/18.txt', 'utf-8').split('\n'));
const adjMap = new Map();
const surf = new Set();
let minExt;
let minMag = Infinity;

function forAdj (p, f) {
	for (let c = 0; c < p.length; c++) {
		const t = p.slice();
		t[c] += 1; 
		f(t.slice());
		t[c] -= 2; 
		f(t);
	}
}

cubes.forEach(cube => {
	const adj = [];
	const p = cube.split(',').map(c => parseInt(c));
	forAdj(p, a => {
		const str = a.join(',');
		if (cubes.has(str)) adj.push(a);
		else surf.add(str);

		let mag = a.reduce((a, c) => a += c, 0);
		if (mag < minMag) {
			minExt = a;
			minMag = mag;
		}
	})
	adjMap.set(cube, adj);
});

console.log(`P1: ${[...cubes].reduce((a, p) => a += 6 - adjMap.get(p).length, 0)}`);

// generate extended surface points for bfs
const surfExt = new Set();
surf.forEach(str => {
	surfExt.add(str);
	let p = str.split(',').map(c => parseInt(c));
	forAdj(p, a => {
		let str = a.join(',');
		if (cubes.has(str)) return;
		surfExt.add(str);
	})
})

// bfs from known exterior point to find all exterior points
const front = [minExt];
const ext = new Set();
const visited = new Set();
while (front.length > 0) {
	const cur = front.shift();
	const str = cur.join(',');

	if (visited.has(str)) continue;

	if (surf.has(str)) ext.add(cur.join(','));
	visited.add(str);

	forAdj(cur, a => {
		const str = a.join(',');
		if (!surfExt.has(str) || ext.has(str)) return;
		front.push(a);
	});
}

// count surfaces touching the exterior points
let surfs = 0;
cubes.forEach(p => {
	forAdj(p.split(',').map(c => parseInt(c)), a => {
		const str = a.join(',');
		if (ext.has(str)) surfs++;
	})
});

console.log(`P2: ${surfs}`)