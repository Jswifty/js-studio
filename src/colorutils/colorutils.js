define(function () {

	function valueToHex (value) {
    var hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
	};

	return {
		isValidColor: function (color) {
			return color !== undefined && typeof color.r === "number" && typeof color.g === "number" && typeof color.b === "number";
		},

		rgbToHex: function (red, green, blue) {
			return "#" + valueToHex(red) + valueToHex(green) + valueToHex(blue);
		},

		hexToRGB: function (hex) {
			hex = hex.charAt(0) === "#" ? hex.substring(1, 7) : hex;
			return { r: parseInt(hex.substring(0, 2), 16), g: parseInt(hex.substring(2, 4), 16), b: parseInt(hex.substring(4, 6), 16) };
		},

		rgbToString: function (red, green, blue, alpha) {
			return "rgb" + (alpha !== 1 ? "a" : "") + "(" + red + ", " + green + ", " + blue + (alpha !== 1 ? ", " + alpha : "") + ")";
		},

		stringToRGB: function (string) {
			var rgbArray = string.match(/\d+(\.)*\d+/g);
			return { r: parseInt(rgbArray[0]), g: parseInt(rgbArray[1]), b: parseInt(rgbArray[2]), a: parseInt(rgbArray[3]) };
		},

		rgbToHSV: function (red, green, blue) {
			var min = Math.min(Math.min(red, green), blue);
			var max = Math.max(Math.max(red, green), blue);
			var delta = max - min;

			var hue = 0;
			var saturation = 0;
			var value = max / 255;

			if (value !== 0) {
				saturation = delta / max;

				if (red === max) {
					/* between yellow & magenta. */
					hue = (green - blue) / delta;
				} else if (green === max) {
					/* between cyan & yellow */
					hue = 2 + (blue - red) / delta;
				} else {
					/* between magenta & cyan */
					hue = 4 + (red - green) / delta;
				}

				/* degrees */
				hue *= 60;

				if (hue < 0) {
					hue += 360;
				}
			}

			return { h: hue, s: saturation, v: value };
		},

		hsvToRGB: function (hue, saturation, value) {
			value = Math.round(value * 255);

			if (saturation === 0) {
				/* achromatic (grey) */
				return { r: value, g: value, b: value };
			}

			if (hue >= 360) {
				hue -= 360;
			}

			hue /= 60;

			/* sector 0 to 5 */
			var i = Math.floor(hue);
			var f = hue - i;
			var p = Math.round(value * (1 - saturation));
			var q = Math.round(value * (1 - saturation * f));
			var t = Math.round(value * (1 - saturation * (1 - f)));

			if (i === 0) {
				return { r: value, g: t, b: p };
			} else if (i === 1) {
				return { r: q, g: value, b: p };
			} else if (i === 2) {
				return { r: p, g: value, b: t };
			} else if (i === 3) {
				return { r: p, g: q, b: value };
			} else if (i === 4) {
				return { r: t, g: p, b: value };
			} else {
				return { r: value, g: p, b: q };
			}
		}
	};
});
