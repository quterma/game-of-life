// create matrix field
const createRandomMatrix = (x, y) =>
	Array.from({ length: x }, () => Array.from({ length: y }, () => Math.round(Math.random())));

// find all neighbors
const findNeighbors = (matrix, coordinates) => {
	const x = coordinates[0];
	const y = coordinates[1];
	const filteredX = matrix.filter((arr, i) => {
		if (i === x - 1 || i === x + 1 || i === x) {
			return true;
		}
	});
	const filteredY = filteredX.map(arr =>
		arr.filter((el, i) => {
			if (i === y - 1 || i === y + 1 || i === y) {
				return true;
			}
		})
	);
	const flatted = filteredY.flat();
	const selfIndex = flatted.indexOf(matrix[x][y]);
	flatted.splice(selfIndex, 1);
	return flatted;
};

// sum amount of alive cells
const calculateAliveCellsSum = neighbors => neighbors.reduce((a, b) => a + b);

// change cell state
const changeCellState = (matrix, coordinates) => {
	const aroundSum = calculateAliveCellsSum(findNeighbors(matrix, coordinates));
	const x = coordinates[0];
	const y = coordinates[1];
	const self = matrix[x][y];
	switch (true) {
		case self === 1 && (aroundSum === 2 || aroundSum === 3):
		case self === 0 && aroundSum === 3:
			return 1;
			break;
		case self === 1 && (aroundSum < 2 || aroundSum > 3):
		case self === 0 && aroundSum !== 3:
			return 0;
	}
};

// change matrix state
const changeMatrixState = matrix => {
	const newMatrix = matrix.map((arr, i) => arr.map((cell, j) => changeCellState(matrix, [i, j])));
	return newMatrix;
};

// compare 2 matrix
const compare = (first, second) => first.every((value, index) => value === second[index]);

const cycle = (matrix, steps) => {
	const timer = setTimeout(() => {
		const nextMatrix = changeMatrixState(matrix);
		const isSame = compare(matrix.flat(), nextMatrix.flat());
		if (isSame) {
			console.log("the Universe won't change anymore!");
			clearInterval(timer);
			return;
		}
		console.log(nextMatrix);
		if (steps > 1) cycle(nextMatrix, steps - 1);
		if (!steps) cycle(nextMatrix);
		clearInterval(timer);
	}, 1000);
};

// ======  работа с node аргументами =====

// transform txt file into 2d array
function getArguments() {
	if (process.argv.length < 3) return;

	const tryPositiveInt = arg => (Number.isInteger(Number(arg)) ? Number(arg) : false);

	const x = tryPositiveInt(process.argv[2]);
	const y = x && process.argv[3] && tryPositiveInt(process.argv[3]);

	return x ? { type: "numbers", body: y ? [x, y] : [x, x] } : { type: "file", body: readFile(process.argv[2]) };
}

// transform txt file into 2d array
function readFile(file) {
	const fs = require("fs");
	try {
		const output = fs.readFileSync(file, "utf8").split("\r\n");
		// const result = JSON.stringify(output);
		return output;
	} catch (err) {
		return undefined;
	}
}

// get matrix from 2d array
function getMatrixFromArray(arr) {
	if (!Array.isArray(arr) || !Number.isInteger(Number(arr.reduce((a, b) => a + b)))) {
		return undefined;
	}

	const maxLength = Math.max.apply(
		null,
		arr.map(x => x.length)
	);

	return arr.map(x => {
		return x
			.padEnd(maxLength, "0")
			.split("")
			.map(y => (Number(y) ? 1 : 0));
	});
}

function createArgsMatrix(args) {
	if (!args) return createRandomMatrix(5, 5);
	const { type, body } = args;
	switch (type) {
		case "numbers":
			return createRandomMatrix(body[0], body[1]);
		case "file":
			return getMatrixFromArray(body) ? getMatrixFromArray(body) : createRandomMatrix(5, 5);
	}
}

const args = getArguments();
const matrix = createArgsMatrix(args);

console.log("start matrix: ", matrix);

cycle(matrix);
