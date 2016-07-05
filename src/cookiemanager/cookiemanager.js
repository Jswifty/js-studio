define(function () {

	return {

		getCookie: function (name) {
			var nameKey = name + "=";
			var cookieArray = document.cookie.split(";");

			for (var i = 0; i < cookieArray.length; i++) {
				var cookie = cookieArray[i];

				while (cookie.charAt(0) === " ") {
					cookie = cookie.substring(1, cookie.length);
				}

				if (cookie.indexOf(nameKey) === 0) {
					return cookie.substring(nameKey.length, cookie.length);
				}
			}

			return null;
		},

		setCookie: function (name, value, days) {
			var expires = "";

			if (days) {
				expires = "; expires=" + new Date(new Date.getTime() + days * 24 * 60 * 60 * 1000).toGMTString();
			}

			document.cookie = name + "=" + value + expires + "; path=/";
		},

		removeCookie: function (name) {
			document.cookie = name + "=; expires=" + new Date().toGMTString() + "; path=/";
		}
	};
});
