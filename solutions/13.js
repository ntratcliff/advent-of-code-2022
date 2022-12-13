const fs = require('fs');

const pairs = fs.readFileSync('input/13.txt').toString().split('\n\n').map(p => p.split('\n').map(s => JSON.parse(s)));

function test (lhs, rhs) {
	if (!Array.isArray(lhs) && Array.isArray(rhs)) return test([lhs], rhs);
	if (!Array.isArray(rhs) && Array.isArray(lhs)) return test(lhs, [rhs]);
	if (!Array.isArray(lhs) && !Array.isArray(rhs)) return rhs - lhs;

	for (let i = 0; i < lhs.length; i++) {
		if (i >= rhs.length) return 1;

		if (Array.isArray(lhs[i]) || Array.isArray(rhs[i])) {
			let t = test(lhs[i], rhs[i]);
			if (t !== 0) return t;
			continue;
		}

		let c = lhs[i] - rhs[i];
		if (c !== 0) return c;
	}

	return lhs.length - rhs.length;
}

console.log(`P1: ${pairs.reduce((sum, pair, i) => sum += test(...pair) < 0 ? i + 1 : 0, 0)}`);
const dividers = [[[2]], [[6]]];
console.log(`P2: ${pairs.flat().concat(dividers).sort(test).reduce((a, v, i) => a *= dividers.includes(v) ? i + 1 : 1, 1)}`);