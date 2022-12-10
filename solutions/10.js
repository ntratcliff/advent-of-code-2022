const fs = require('fs');
const readline = require('readline');

let input = readline.createInterface({
	input: fs.createReadStream('input/10.txt')
});

let x = [1];
input.on('line', line => {
	var ins = line.split(' ');

	const cur = x[x.length -1];
	x.push(cur);
	if (ins[0] === 'addx') {
		x.push(cur + parseInt(ins[1]));
	}
}).on('close', () => {
	let sum = 0;
	let crt = '';
	for (let i = 1; i < x.length; i++) {
		// p1
		const cur = x[i-1];
		if (i <= 220 && i % 40 === 20) {
			console.log(i);
			sum += i * cur;
		}

		// p2
		const lp = (i - 1) % 40;
		crt += cur - 1 <= lp && cur + 1 >= lp ? '#' : '.';
		if (lp === 39) {
			crt += '\n';
		}
	}
	console.log('P1: ' + sum);
	console.log('P2: \n' + crt);
});