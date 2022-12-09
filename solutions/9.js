const fs = require('fs');
const readline = require('readline');


function part1() {
	let input = readline.createInterface({
		input: fs.createReadStream('input/9.txt')
	});

	let hp = [0,0];
	let tps = [hp.slice()];

	input.on('line', line => {
		const move = line.split(' ');
		let amt = parseInt(move[1]);
		let lhp;

		while (amt > 0) {
			lhp = hp.slice();
			switch (move[0]) {
				case 'U': hp[1] += 1;
					break;
				case 'D': hp[1] -= 1;
					break;
				case 'R': hp[0] += 1;
					break;
				case 'L': hp[0] -= 1;
					break;
			}

			if (tps[tps.length - 1].some((v, i) => Math.abs(hp[i] - v) > 1)) {
				tps.push(lhp);
			}

			amt--;
		}
	}).on('close', () => console.log('P1: ' + new Set(tps.map(v => v.join())).size));
}

function part2() {
	let input = readline.createInterface({
		input: fs.createReadStream('input/9.txt')
	});

	let knots = [...Array(10)].map(() => [0,0].slice());
	let tps = [[0,0].slice()];

	input.on('line', line => {
		const move = line.split(' ');
		let amt = parseInt(move[1]);
		let lhp;

		while (amt > 0) {
			lhp = knots[0].slice();
			switch (move[0]) {
				case 'U': knots[0][1] += 1;
					break;
				case 'D': knots[0][1] -= 1;
					break;
				case 'R': knots[0][0] += 1;
					break;
				case 'L': knots[0][0] -= 1;
					break;
			}

			for (let i = 1; i < knots.length; i++) {
				let d = knots[i].map((v, p) => knots[i - 1][p] - v);
				if (d.some(v => Math.abs(v) > 1)) {
					if (i == knots.length - 1) tps.push(knots[i].slice());
					knots[i] = knots[i].map((v, p) => v + Math.sign(d[p]));
				}
			}

			amt--;
		}
	}).on('close', () => console.log('P2: ' + new Set(tps.map(v => v.join())).size));
}

part1();
part2();