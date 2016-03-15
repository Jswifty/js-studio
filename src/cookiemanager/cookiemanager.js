define(function (require) {

	return {

		getCookie : function (name) {

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

		setCookie : function (name, value, hours) {

			var expires = "";

			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
				expires = "; expires=" + date.toGMTString();
			}

			document.cookie = name + "=" + value + expires + "; path=/";
		},

		removeCookie: function (name) {
			this.setCookie(name, "", -1);
		}
	};
});
