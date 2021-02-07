// create matrix field
const createMatrix = (x, y) =>
	Array.from({ length: x }, () => Array.from({ length: y }, () => Math.round(Math.random())));

const matrix = createMatrix(5, 5);
console.log(matrix);

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

const cycle = (matrix, delay, steps) => {
	const timer = setTimeout(() => {
		const nextMatrix = changeMatrixState(matrix);
		const isSame = compare(matrix.flat(), nextMatrix.flat());
		if (isSame) {
			console.log("the Universe won't change anymore!");
			clearInterval(timer);
			return;
		}
		console.log(nextMatrix);
		if (steps > 1) cycle(nextMatrix, delay, steps - 1);
		clearInterval(timer);
	}, delay);
};

cycle(matrix, 1000, 20);
