const fs = require('fs');

const monkeys = new Map(
	fs.readFileSync('input/21.txt', 'utf-8').split('\n')
	.map(l => l.match(/(.*)?: (.*)/)).map(m => [m[1], isNaN(parseInt(m[2])) ? m[2] : parseInt(m[2])])
);

// fun way to do p1 but removed for p2 in favor of equateArr/reduce
// function val (monkey) {
// 	const job = monkeys.get(monkey);
// 	return isNaN(job) ? eval(job.replace(/(\w+)/g, 'val("$1")')) : job;
// }

function reduce(arr) {
	if (!Array.isArray(arr)) return arr;
	arr[0] = reduce(arr[0]);
	arr[2] = reduce(arr[2]);
	if (!isNaN(arr[0]) && !isNaN(arr[2])) return eval(arr.join(''));
	return arr;
}

function equateArr(monkey, humnBlock) {
	if (humnBlock && monkey === 'humn') return monkey;
	const v = monkeys.get(monkey);

	if (!isNaN(v)) return v;
	const m = v.match(/(\w+) (.) (\w+)/);

	return reduce([equateArr(m[1], humnBlock), m[2], equateArr(m[3], humnBlock)]);
}

function p2() {
	const root = monkeys.get('root');
	const split = root.lastIndexOf('+');

	// rhs always reduces to an int
	let ans = equateArr(root.slice(split + 2, root.length));
	let eq = equateArr(root.slice(0, split - 1), true);

	// solve!
	while (eq !== 'humn') { 
		const i = isNaN(eq[0]) ? 2 : 0;

		switch (eq[1]) {
			case '+': ans -= eq[i];
				break;
			case '*': ans /= eq[i];
				break;
			case '-': 
				if (i === 0) { ans = eq[i] - ans; break; }
				ans += eq[i];
				break;
			case '/':
				if (i === 0) { ans = eq[i] / ans; break; }
				ans *= eq[i];
				break;
		}

		eq = isNaN(eq[0]) ? eq[0] : eq[2];
	}

	return ans;
}

console.log(`P1: ${equateArr(('root'))}`);
console.log(`P2: ${p2()}`);