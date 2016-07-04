define(function () {

	return {

		voidCharacters: [ "█","▓", "▒", "░", "▬", "◙", "◘", "⌂", "æ", "Æ" ],

		convertStringToGrid: function (string, numberOfRows, numberOfColumns, horizontally, voidCharacter) {
			if (typeof numberOfRows !== "number" || typeof numberOfColumns !== "number" || numberOfRows * numberOfColumns < string.length) {
				numberOfRows = Math.ceil(Math.sqrt(string.length));
				numberOfColumns = numberOfRows;
			}

			if (horizontally !== true && horizontally !== false) {
				horizontally = true;
			}

			voidCharacter = voidCharacter || "█";

			var grid = [];

			for (var i = 0; i < numberOfRows; i++) {
				grid[i] = [];

				for (var j = 0; j < numberOfColumns; j++) {
					var charIndex;

					if (horizontally === true) {
						charIndex = i * numberOfColumns + j;
					} else if (horizontally === false) {
						charIndex = j * numberOfRows + i;
					}

					grid[i][j] = (charIndex < string.length) ? string.charAt(charIndex) : voidCharacter;
				}
			}

			return grid;
		},

		convertGridToString: function (grid, horizontally, voidCharacter) {
			var numberOfRows = grid.length;
			var numberOfColumns = grid[0].length;

			if (horizontally !== true && horizontally !== false) {
				horizontally = true;
			}

			voidCharacter = voidCharacter || "█";

			var string = "";

			if (horizontally === true) {
				for (var i = 0; i < numberOfRows; i++) {
					for (var j = 0; j < numberOfColumns; j++) {
						string += grid[i][j];
					}
				}
			}

			else if (horizontally === false) {
				for (var i = 0; i < numberOfColumns; i++) {
					for (var j = 0; j < numberOfRows; j++) {
						string += grid[j][i];
					}
				}
			}

			while (string.indexOf(voidCharacter) !== -1) {
				string = string.replace(voidCharacter, "");
			}

			return string;
		}
	};
});
