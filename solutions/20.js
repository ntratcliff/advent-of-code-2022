const fs = require('fs');

function mod(v, r) {
	return ((v % r) + r) % r;
}

class LinkedList {
	constructor(items) {
		this.length = items.length;
		this.nodes = items.map((it) => { return { value: it }; });
		this.nodes.forEach((n, i) => {
			n.prev = this.nodes[mod(i - 1, this.length)];
			n.next = this.nodes[mod(i + 1, this.length)];
		});
		this.head = this.nodes[0];
	}

	from(i, n) {
		n ??= this.head;
		for (i = mod(i, this.length); i > 0; i--) {
			n = n.next;
		}

		return n;
	}

	remove(node) {
		node.prev.next = node.next;
		node.next.prev = node.prev;
		if (node === this.head) this.head = node.next;
		this.length--;
	}

	insert(node, prev) {
		node.next = prev.next;
		node.next.prev = node;
		prev.next = node;
		node.prev = prev;
		this.length++;
	}

	find(val) {
		for (let i = 0, c = this.head; i < this.length; i++) {
			if (c.value === val) return c;
			c = c.next;
		}
	}

	// debug
	join(sep) {
		let str = '';
		for (let i = 0, c = this.head; i < this.length; i++) {
			str += c.value;
			c = c.next;
			if (i < this.length - 1) str += sep;
		}
		return str;
	}
}

function mix(sequence, iter) {
	iter ??= 1;

	// console.log(sequence.join(', ')); // debug
	while (iter-- > 0) {
		for (let i = 0; i < sequence.length; i++) {
			const node = sequence.nodes[i];

			if (node.value === 0) continue;

			sequence.remove(node);
			sequence.insert(node, sequence.from(node.value - 1, node.next));

			// console.log(sequence.join(', ')); // debug
		}
	}

	// calculate result
	let grove = 0;
	const zn = sequence.find(0);
	for (let i = 1; i <= 3; i++) {
		const n = sequence.from(i * 1000, zn);
		grove += n.value;
	}

	return grove;
}

const sequence = fs.readFileSync('input/20.txt', 'utf-8').split('\n').map(n => parseInt(n));
console.log(`P1: ${mix(new LinkedList(sequence))}`);
console.log(`P2: ${mix(new LinkedList(sequence.map(v => v * 811589153)), 10)}`);