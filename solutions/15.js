const fs = require('fs');

const sensors = fs.readFileSync('input/15.txt').toString().match(/-?\d+/gm).reduce((a, v, i) => {
	const gi = Math.floor(i / 4);
	const ci = Math.floor(i % 4 / 2);

	if (!a[gi]) a[gi] = [];
	if (!a[gi][ci]) a[gi][ci] = [];

	a[gi][ci].push(parseInt(v));

	return a;
}, []);

function excludedRanges(row) {
	let ranges = [];

	function addRange(n) {
		for (let i = 0; i < ranges.length; i++) {
			const r = ranges[i];

			if (r[1] >= n[0] && n[1] >= r[0]) { // intersecting
				r[0] = Math.min(n[0], r[0]);
				
				if (n[1] > r[1]) { // find furthest range containing max
					let c = ranges.slice().reverse().findIndex(nr => n[1] >= nr[0]);
					c = c >= 0 ? ranges.length - c - 1 : ranges.length - 1;

					// join ranges (if any)
					r[1] = Math.max(ranges[c][1], n[1]);
					ranges.splice(i + 1, c - i);
				}

				return;
			}

			if (n[1] < r[0]) {
				ranges.splice(i, 0, n);
				return;
			}
		}

		ranges.push(n);
	}

	sensors.forEach(s => {
		const pd = s[0].reduce((a, p, i) => a + Math.abs(s[1][i] - p),  0);
		const rd = Math.abs(row - s[0][1]);
		const rsw = pd - rd;

		if (rsw < 0) return;

		const sx = s[0][0];
		addRange([sx - rsw, sx + rsw]);
	});

	return ranges;
}

console.log(`P1: ${excludedRanges(2000000).reduce((a, r) => a += r[1] - r[0], 0)}`);

const max = 4000000;
for (let y = 0; y <= max; y++) {
	const ranges = excludedRanges(y);
	const r = ranges.find((r,i) => r[0] > 0 || r[1] < max);
	if (r) {
		const x = r[0] > 0 ? r[0] - 1 : r[1] + 1;
		console.log(`P2: ${x * 4000000 + y}`)
		break;
	}
}