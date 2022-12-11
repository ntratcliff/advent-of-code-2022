const fs = require('fs');

const input = fs.readFileSync('input/11.txt').toString();

function calcBusiness(rounds, relief) {
	let monkeys = input.split('\n\n').map(m => {
		const lines = m.split('\n');
		return {
			items: lines[1].match(/\d+/g).map(i => parseInt(i)),
			op: lines[2].match(/= (.*?) (.) (.*)/).splice(1),
			test: parseInt(lines[3].match(/\d+/)),
			result: lines.splice(4).map(l => parseInt(l.match(/\d+/))),
			inspections: 0
		}
	});

	const mod = monkeys.reduce((a, m) => a *= m.test, 1);

	for (let round = 0; round < rounds; round++) {
		monkeys.forEach((monkey) => {
			while (monkey.items.length > 0) {
				let item = monkey.items.splice(0, 1)[0];
				monkey.inspections++;

				function val(str) {
					if (str === 'old') return item;
					return parseInt(str);
				}

				let lhs = val(monkey.op[0]);
				let rhs = val(monkey.op[2]);

				item = monkey.op[1] === '*' ? lhs * rhs : lhs + rhs;
				item = Math.floor(item / relief) % mod;

				monkeys[Math.floor(item % monkey.test) === 0 ? monkey.result[0] : monkey.result[1]].items.push(item);
			}
		});
	}

	return monkeys.map(m => m.inspections).sort((a, b) => b - a).splice(0, 2).reduce((a, v) => a * v);
}

console.log(`P1: ${calcBusiness(20, 3)}`);
console.log(`P2: ${calcBusiness(10000, 1)}`);
