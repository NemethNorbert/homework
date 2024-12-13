const parseCsvLine = (line: string, delimiter: string) => {
	const result = [];
	const commentRegex = /^[^'"]*?(#.*?)$/gm;
	let startPosition = 0;

	if (commentRegex.exec(line) !== null) return;

	for (let index = 0; index <= line.length; index++) {
		let currentPosition = line.indexOf(delimiter, startPosition);

		// If line does not end with delimiter reached end of line
		if (currentPosition === -1) currentPosition = line.length;

		const endPosition = currentPosition;

		result.push(line.substring(startPosition, endPosition));
		startPosition = currentPosition + 1;
		index = currentPosition;

		continue;
	}

	return result;
};

const parseCsvLines = ([keys, ...values]: string[][]) =>
	values.map((vs) =>
		Object.fromEntries(vs.map((v, i) => [keys[i].toLowerCase(), v]))
	);

export const csv = { parseCsvLine, parseCsvLines };
