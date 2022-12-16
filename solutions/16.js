const fs = require('fs');

const graph = fs.readFileSync('input/16.txt').toString().split('\n').reduce((a, v) => {
	const valves = v.match(/[A-Z]{2}/g);
	a[valves[0]] = {
		rate: parseInt(v.match(/\d+/)),
		connections: valves.slice(1)
	};

	return a;
}, {});

console.log(graph);
const openableCount = Object.keys(graph).filter(v => graph[v].rate > 0).length;
console.log(openableCount);

// determine release rate of unopened valves
function traverse (graph, origin, t, rate, released, order) {
	order ??= [];
	rate ??= 0;
	released ??= 0;

	const targets = Object.keys(graph).filter(v => graph[v].rate > 0 && !graph[v].open);

	let mostReleased = released;
	let mostRate = rate;
	targets.forEach(n => {
		const search = {};
		const front = [origin];
		search[origin] = '';

		while (front.length > 0) {
			const cID = front.shift();

			if (cID === n) break;

			const cur = graph[cID];
			cur.connections.forEach(v => { 
				if (search[v]) return;
				front.push(v);
				search[v] = cID;
			})
		}

		let cID = n;
		let path = [];

		while (cID != origin) {
			path.push(cID);
			cID = search[cID];
		}

		let tt = t;
		let r = released;
		// console.log(`${origin} to ${n}: t=${tt}`);
		while (tt > t - path.length - 1) {
			r += rate;
			if (--tt === 0) {
				mostReleased = Math.max(mostReleased, r);
				return;
			}
		}

		// clone graph and update state
		const ng = structuredClone(graph);
		ng[n].open = true;

		// traverse from here
		let no = order.slice();
		no.push(n);
		r = traverse(ng, n, tt, rate + ng[n].rate, r, no); 
		if (r > mostReleased) {
			mostReleased = Math.max(mostReleased, r);
			mostRate = r;
		}
	})

	while (order.length === openableCount && t-- > 0) { mostReleased += mostRate}
	if (order.length > openableCount) {
		console.log(order.join(', '));
	}
	return mostReleased;
}

console.log(traverse(graph, 'AA', 30));

// starting at any point on the graph:
// console.log(Object.keys(graph).reduce((m, k) => Math.max(m, traverse(graph, k, 30)), 0));