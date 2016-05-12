define([
	"../gridconverter/gridconverter"
], function (GridConverter) {

	function writeCipher (grid, clockwise, firstRow, lastRow, firstCol, lastCol) {
		
		var string = "";

		if (grid !== undefined && grid.length > 0 && grid[0].length > 0) {
			
			firstRow = firstRow || 0;
			lastRow = lastRow || grid.length - 1;
			firstCol = firstCol || 0;
			lastCol = lastCol || grid[0].length - 1;

			if (clockwise !== true && clockwise !== false) {
				clockwise = true;
			}
			
			if (clockwise === true) {

				for (var i = lastCol; i > firstCol; i--) {
					string += grid[lastRow][i];
				}

				for (var i = lastRow; i > firstRow; i--) {
					string += grid[i][firstCol];
				}

				if (firstRow === lastRow || firstCol === lastCol) {
					string += grid[firstRow][firstCol];
				}

				else {

					for (var i = firstCol; i < lastCol; i++) {
						string += grid[firstRow][i];
					}

					for (var i = firstRow; i < lastRow; i++) {
						string += grid[i][lastCol];
					}
				}
			}

			else if (clockwise === false) {

				for (var i = firstRow; i < lastRow; i++) {
					string += grid[i][firstCol];
				}

				for (var i = firstCol; i < lastCol; i++) {
					string += grid[lastRow][i];
				}
				
				if (firstRow === lastRow || firstCol === lastCol) {
					string += grid[lastRow][lastCol];
				}

				else {

					for (var i = lastRow; i > firstRow; i--) {
						string += grid[i][lastCol];
					}

					for (var i = lastCol; i > firstCol; i--) {
						string += grid[firstRow][i];
					}
				}
			}

			firstRow++;
			lastRow--;
			firstCol++;
			lastCol--;
			
			if (firstRow <= lastRow && firstCol <= lastCol) {
				string += writeCipher(grid, clockwise, firstRow, lastRow, firstCol, lastCol);
			}
		}

		return string;
	};

	function readCipher (string, numberOfRows, numberOfColumns, horizontally, clockwise, voidCharacter, grid, firstRow, lastRow, firstCol, lastCol) {
	
		if (typeof string === "string") {

			if (typeof numberOfRows !== "number" || typeof numberOfColumns !== "number" || numberOfRows * numberOfColumns < string.length) {
				numberOfRows = Math.ceil(Math.sqrt(string.length));
				numberOfColumns = numberOfRows;
			}

			if (horizontally !== true && horizontally !== false) {
				horizontally = true;
			}

			if (clockwise !== true && clockwise !== false) {
				clockwise = true;
			}

			voidCharacter = voidCharacter || "█";

			firstRow = firstRow || 0;
			lastRow = lastRow || numberOfRows - 1;
			firstCol = firstCol || 0;
			lastCol = lastCol || numberOfColumns - 1;

			if (grid === undefined) {
				
				grid = [];

				for (var i = 0; i < numberOfRows; i++) {
					grid[i] = [];
				}
			}

			if (clockwise === true) {

				for (var i = lastCol; i > firstCol; i--) {
					grid[lastRow][i] = string.charAt(0);
					string = string.substring(1);
				}

				for (var i = lastRow; i > firstRow; i--) {
					grid[i][firstCol] = string.charAt(0);
					string = string.substring(1);
				}
				
				if (firstRow === lastRow || firstCol === lastCol) {
					grid[firstRow][firstCol] = string.charAt(0);
					string = string.substring(1);
				}

				else {

					for (var i = firstCol; i < lastCol; i++) {
						grid[firstRow][i] = string.charAt(0);
						string = string.substring(1);
					}

					for (var i = firstRow; i < lastRow; i++) {
						grid[i][lastCol] = string.charAt(0);
						string = string.substring(1);
					}
				}
			}

			else if (clockwise === false) {

				for (var i = firstRow; i < lastRow; i++) {
					grid[i][firstCol] = string.charAt(0);
					string = string.substring(1);
				}

				for (var i = firstCol; i < lastCol; i++) {
					grid[lastRow][i] = string.charAt(0);
					string = string.substring(1);
				}
				
				if (firstRow === lastRow || firstCol === lastCol) {
					grid[lastRow][lastCol] = string.charAt(0);
					string = string.substring(1);
				}

				else {

					for (var i = lastRow; i > firstRow; i--) {
						grid[i][lastCol] = string.charAt(0);
						string = string.substring(1);
					}

					for (var i = lastCol; i > firstCol; i--) {
						grid[firstRow][i] = string.charAt(0);
						string = string.substring(1);
					}
				}
			}
			
			firstRow++;
			lastRow--;
			firstCol++;
			lastCol--;

			if (firstRow <= lastRow && firstCol <= lastCol) {
				readCipher(string, numberOfRows, numberOfColumns, horizontally, clockwise, voidCharacter, grid, firstRow, lastRow, firstCol, lastCol);
			}

			return GridConverter.convertGridToString(grid, horizontally, voidCharacter);
		}

		return "";
	};

	return {

		encipher: function (string, numberOfRows, numberOfColumns, horizontally, clockwise, voidCharacter) {
		
			if (typeof numberOfRows !== "number" || typeof numberOfColumns !== "number" || numberOfRows * numberOfColumns < string.length) {
				numberOfRows = Math.ceil(Math.sqrt(string.length));
				numberOfColumns = numberOfRows;
			}

			if (horizontally !== true && horizontally !== false) {
				horizontally = true;
			}

			if (clockwise !== true && clockwise !== false) {
				clockwise = true;
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
			var encipheredString = writeCipher(grid, clockwise);

			encipheredString += "[";
			encipheredString += numberOfRows + ",";
			encipheredString += numberOfColumns + ",";
			encipheredString += (horizontally === true ? "↔" : "↕") + ",";
			encipheredString += (clockwise === true ? "→" : "←") + ",";
			encipheredString += voidCharacter;
			encipheredString += "]";

			return encipheredString;
		},

		decipher: function (string, numberOfRows, numberOfColumns, horizontally, clockwise, voidCharacter) {

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

					if (params[3] === "→" || params[3] === "←") {
						clockwise = params[3] === "→";
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

				if (clockwise !== true && clockwise !== false) {
					clockwise = true;
				}

				voidCharacter = voidCharacter || "█";

				return readCipher(string, numberOfRows, numberOfColumns, horizontally, clockwise, voidCharacter);
			}

			return "";
		}
	};
});
