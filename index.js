/*
Run without any arguments to try to run the solution for the current day (if in December).
Otherwise, provide a number between 1-31 to run that day's solution.
*/

const args = process.argv.slice(2);

let puzzle = 0;

if (args[0]) { // run a specific puzzle
	puzzle = parseInt(args[0]);
	if (puzzle === NaN) {
		console.error(`Expected number between 1-31, got ${args[0]}.`);
		process.exit(1);
	}
} else { // run the puzzle for today's date
	var today = new Date();
	if (today.getMonth() == 11) {
		puzzle = today.getDate();
	} else {
		console.error(`Select a puzzle to run by providing a number between 1-31.`);
		process.exit(1);
	}
}

try {
	require(`./solutions/${puzzle}.js`);
} catch (error) {
	if (error.code == 'MODULE_NOT_FOUND') {
		console.log(`No solution yet for puzzle ${puzzle}`)
		process.exit(1);
	} else {
		throw error;
	}
}