define([
	"../gridconverter/gridconverter"
], function (GridConverter) {

	function writeCipher (grid, horizontally, columnarOrder) {
		var string = "";

		var numberOfRows = grid.length;
		var numberOfColumns = grid[0].length;

		if (horizontally !== true && horizontally !== false) {
			horizontally = true;
		}

		if (typeof columnarOrder !== "object" || columnarOrder.length !== numberOfColumns) {
			columnarOrder = [];

			for (var i = 0; i < numberOfColumns; i++) {
				columnarOrder[i] = i;
			}

			for (var i = numberOfColumns - 1; i > 0; i--) {
				var index = Math.floor(Math.random() * numberOfColumns);
				var value = columnarOrder[index];

				columnarOrder[index] = columnarOrder[i];
				columnarOrder[i] = value;
			}
		}

		if (horizontally === true) {
			for (var i = 0; i < numberOfRows; i++) {
				for (var j = 0; j < numberOfColumns; j++) {
					string += grid[i][columnarOrder[j]];
				}
			}
		}

		else if (horizontally === false) {
			for (var i = 0; i < numberOfColumns; i++) {
				for (var j = 0; j < numberOfRows; j++) {
					string += grid[j][columnarOrder[i]];
				}
			}
		}

		return string;
	};

	function readCipher (string, numberOfRows, numberOfColumns, horizontally, columnarOrder, voidCharacter) {
		if (typeof string === "string") {
			if (typeof numberOfRows !== "number" || typeof numberOfColumns !== "number" || numberOfRows * numberOfColumns < string.length) {
				numberOfRows = Math.ceil(Math.sqrt(string.length));
				numberOfColumns = numberOfRows;
			}

			if (horizontally !== true && horizontally !== false) {
				horizontally = true;
			}

			if (typeof columnarOrder !== "object" || columnarOrder.length !== numberOfColumns) {
				columnarOrder = [];

				for (var i = 0; i < numberOfColumns; i++) {
					columnarOrder[i] = i;
				}
			}

			var inverseConlumnarOrder = [];

			for (var i = 0; i < columnarOrder.length; i++) {
				inverseConlumnarOrder[columnarOrder[i]] = i;
			}

			voidCharacter = voidCharacter || "█";

			var grid = [];

			for (var i = 0; i < numberOfRows; i++) {
				grid[i] = [];

				for (var j = 0; j < numberOfColumns; j++) {
					var charIndex;

					if (horizontally === false) {
						charIndex = i * numberOfColumns + inverseConlumnarOrder[j];
					} else if (horizontally === true) {
						charIndex = inverseConlumnarOrder[j] * numberOfRows + i;
					}

					grid[i][j] = (charIndex < string.length) ? string.charAt(charIndex) : voidCharacter;
				}
			}

			return GridConverter.convertGridToString(grid, horizontally, voidCharacter);
		}

		return "";
	};

	return {

		encipher: function (string, numberOfRows, numberOfColumns, horizontally, columnarOrder, voidCharacter) {
			if (typeof numberOfRows !== "number" || typeof numberOfColumns !== "number" || numberOfRows * numberOfColumns < string.length) {
				numberOfRows = Math.ceil(Math.sqrt(string.length));
				numberOfColumns = numberOfRows;
			}

			if (horizontally !== true && horizontally !== false) {
				horizontally = true;
			}

			if (typeof columnarOrder !== "object" || columnarOrder.length !== numberOfColumns) {
				columnarOrder = [];

				for (var i = 0; i < numberOfColumns; i++) {
					columnarOrder[i] = i;
				}

				for (var i = numberOfColumns - 1; i > 0; i--) {
					var index = Math.floor(Math.random() * numberOfColumns);
					var value = columnarOrder[index];

					columnarOrder[index] = columnarOrder[i];
					columnarOrder[i] = value;
				}
			}

			if (typeof voidCharacter !== "string" || voidCharacter.length === 0) {
				var index = 0;
				var voidCharacters = GridConverter.voidCharacters;

				while (string.indexOf(voidCharacters[index]) !== -1) {
					index++;
				}

				voidCharacter = voidCharacters[index];
			}

			var grid = GridConverter.convertStringToGrid(string, numberOfRows, numberOfColumns, horizontally, voidCharacter);
			var encipheredString = writeCipher(grid, horizontally === false, columnarOrder);

			encipheredString += "[";
			encipheredString += numberOfRows + ",";
			encipheredString += numberOfColumns + ",";
			encipheredString += (horizontally === true ? "↔" : "↕") + ",";
			encipheredString += "{";

			for (var i = 0; i < columnarOrder.length; i++) {
				encipheredString += columnarOrder[i];

				if (i < columnarOrder.length - 1) {
					encipheredString += "|";
				}
			}

			encipheredString += "},";
			encipheredString += voidCharacter;
			encipheredString += "]";

			return encipheredString;
		},

		decipher: function (string, numberOfRows, numberOfColumns, horizontally, columnarOrder, voidCharacter) {
			if (typeof string === "string" && string.length > 0) {
				var settingsParams = string.substring(string.lastIndexOf("[") + 1, string.lastIndexOf("]"));

				if (settingsParams.length > 0) {
					var params = settingsParams.split(",");

					if (params[0] !== undefined) {
						numberOfRows = parseInt(params[0], 10) || 0;
					}

					if (params[1] !== undefined) {
						numberOfColumns = parseInt(params[1], 10) || 0;
					}

					if (params[2] === "↔" || params[2] === "↕") {
						horizontally = params[2] === "↔";
					}

					if (typeof params[3] === "string" && params[3].indexOf("{") === 0 && params[3].indexOf("}") === params[3].length - 1) {
						columnarOrder = params[3].substring(1, params[3].length - 1).split("|");
					}

					if (params[4] !== undefined) {
						voidCharacter = params[4];
					}
				}

				string = string.substring(0, string.lastIndexOf("["));

				if (typeof numberOfRows !== "number" || typeof numberOfColumns !== "number" || numberOfRows * numberOfColumns < string.length) {
					numberOfRows = Math.ceil(Math.sqrt(string.length));
					numberOfColumns = numberOfRows;
				}

				if (horizontally !== true && horizontally !== false) {
					horizontally = true;
				}

				if (typeof columnarOrder !== "object" || columnarOrder.length !== numberOfColumns) {
					columnarOrder = [];

					for (var i = 0; i < numberOfColumns; i++) {
						columnarOrder[i] = i;
					}
				}

				voidCharacter = voidCharacter || "█";

				return readCipher(string, numberOfRows, numberOfColumns, horizontally, columnarOrder, voidCharacter);
			}

			return "";
		}
	};
});
