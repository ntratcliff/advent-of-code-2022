const fs = require('fs');

class Blueprint {
	constructor(id, oc, cc, ooc, occ, goc, gobc) {
		this.id = id;
		this.costs = [[oc, 0, 0], [cc, 0, 0], [ooc, occ, 0], [goc, 0, gobc]];
	}

	getMaxGeodes (ts) {
		const costs = this.costs;
		const maxCosts = costs.reduce((a, c) => c.map((v, i) => Math.max(v, a[i]) ,[0,0,0]));
		const states = [{t: ts - 1, resources: new Array(4).fill(0), robots: [1, 0, 0, 0], toBuild: -1}];

		let max = -1;
		let bestOutput = new Array(4).fill(0);
		while (states.length > 0) {
			const state = states.pop();
			const {resources, robots} = state;

			state.t--;

			// build if we have enough resources
			let built = state.toBuild;
			if (state.toBuild >= 0) {
				for (let i = 0, l = costs[state.toBuild].length; i < l; i++) {
					if (resources[i] >= costs[state.toBuild][i]) continue;
					built = -1;
					break;
				}
			}

			// collect resources
			for (let i = 0, l = resources.length; i < l; i++) {
				resources[i] += robots[i];
			}

			// add built robots to count and remove resources
			if (built >= 0) {
				robots[built] += 1;

				for (let i = 0, l = costs[built].length; i < l; i++) {
					resources[i] -= costs[built][i];
				}

				state.toBuild = -1;
			}

			const output = resources.map((v, i) => v + robots[i] * Math.max(state.t, 0));

			// prune branches that can't possibly result in more geodes than the best so far
			if(resources[3] + robots[3] * state.t + state.t <= bestOutput) continue;

			if (state.t > 1 && state.toBuild == -1) { // push states for each possible new robot if we have time left
				let added = false;
				for (let i = 0; i < robots.length; i++) {
					// don't branch if we don't have the pre-req robot
					if (i > 0 && robots[i-1] === 0) break;

					// don't build more than we need of any type of robot
					if (i < 3 && robots[i] === maxCosts[i]) continue;

					// prune robots whose costs are higher than our potential output over t
					if (!costs[i].reduce((r, c, ci) => r && output[ci] >= c, true)) continue;

					const newState = structuredClone(state);
					newState.toBuild = i;
					states.push(newState);
					added = true;
				}

				if (!added) states.push(state);
			} else if (state.t < 0 && max < resources[3]) { // set max if we're out of time
				max = resources[3]
				bestOutput = output;
			} else if (state.t >= 0) { // push our state if we still have time
				states.push(state);
			}
		}

		return max;
	}

	getQualityLevel (ts) {
		return this.getMaxGeodes(ts) * this.id;
	}
}

const blueprints = fs.readFileSync('input/19.txt', 'utf8').split('\n').map(l => new Blueprint(...l.match(/\d+/g).map(d => parseInt(d))));

console.log(`P1: ${blueprints.reduce((a, b) => a += b.getQualityLevel(24), 0)}`);
console.log(`P2: ${blueprints.slice(0, 3).reduce((a, b) => a *= b.getMaxGeodes(32), 1)}`);