define([
	"../gridconverter/gridconverter"
], function (GridConverter) {

	function writeCipher (grid, horizontally, forward) {
		
		var string = "";

		var numberOfRows = grid.length;
		var numberOfColumns = grid[0].length;

		if (horizontally !== true && horizontally !== false) {
			horizontally = true;
		}

		if (forward !== true && forward !== false) {
			forward = true;
		}

		if (horizontally === true) {

			for (var i = 0; i < numberOfRows; i++) {

				for (var j = 0; j < numberOfColumns; j++) {

					if (forward === true) {
						string += grid[i][j];
					}

					else if (forward === false) {
						string += grid[numberOfRows - i - 1][j];
					}
				}
			}
		}
		
		else if (horizontally === false) {

			for (var i = 0; i < numberOfColumns; i++) {

				for (var j = 0; j < numberOfRows; j++) {

					if (forward === true) {
						string += grid[j][i];
					}

					else if (forward === false) {
						string += grid[j][numberOfColumns - i - 1];
					}
				}
			}
		}
		
		return string;
	};

	function readCipher (string, numberOfRows, numberOfColumns, horizontally, forward, voidCharacter) {
	
		if (typeof string === "string") {

			if (typeof numberOfRows !== "number" || typeof numberOfColumns !== "number" || numberOfRows * numberOfColumns < string.length) {
				numberOfRows = Math.ceil(Math.sqrt(string.length));
				numberOfColumns = numberOfRows;
			}

			if (horizontally !== true && horizontally !== false) {
				horizontally = true;
			}

			if (forward !== true && forward !== false) {
				forward = true;
			}

			voidCharacter = voidCharacter || "█";

			var grid = [];

			for (var i = 0; i < numberOfRows; i++) {

				grid[i] = [];

				for (var j = 0; j < numberOfColumns; j++) {
				
					var charIndex;
					
					if (horizontally === false) {
						if (forward === true) {
							charIndex = i * numberOfColumns + j;
						}
						else if (forward === false) {
							charIndex = (numberOfRows - i - 1) * numberOfColumns + j;
						}
					}
					else if (horizontally === true) {						
						if (forward === true) {
							charIndex = j * numberOfRows + i;
						}
						else if (forward === false) {
							charIndex = (numberOfColumns - j - 1) * numberOfRows + i;
						}
					}

					grid[i][j] = (charIndex < string.length) ? string.charAt(charIndex) : voidCharacter;
				}
			}
			
			return GridConverter.convertGridToString(grid, horizontally, voidCharacter);
		}

		return "";
	};

	return {

		encipher: function (string, numberOfRows, numberOfColumns, horizontally, forward, voidCharacter) {
		
			if (typeof numberOfRows !== "number" || typeof numberOfColumns !== "number" || numberOfRows * numberOfColumns < string.length) {
				numberOfRows = Math.ceil(Math.sqrt(string.length));
				numberOfColumns = numberOfRows;
			}

			if (horizontally !== true && horizontally !== false) {
				horizontally = true;
			}

			if (forward !== true && forward !== false) {
				forward = true;
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
			var encipheredString = writeCipher(grid, horizontally === false, forward);

			encipheredString += "[";
			encipheredString += numberOfRows + ",";
			encipheredString += numberOfColumns + ",";
			encipheredString += (horizontally === true ? "↔" : "↕") + ",";
			encipheredString += (forward === true ? "→" : "←") + ",";
			encipheredString += voidCharacter;
			encipheredString += "]";

			return encipheredString;
		},

		decipher: function (string, numberOfRows, numberOfColumns, horizontally, forward, voidCharacter) {

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
						forward = params[3] === "→";
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

				if (forward !== true && forward !== false) {
					forward = true;
				}

				voidCharacter = voidCharacter || "█";

				return readCipher(string, numberOfRows, numberOfColumns, horizontally, forward, voidCharacter);
			}

			return "";
		}
	};
});
