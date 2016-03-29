define(function () {
	
	window.navigator = window.navigator || {};
//http://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_nav_all
//http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
//https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
	var platform = "Unknown";
	var operatingSystem = "Unknown";
	var browser = "Unknown";

	if (navigator.platform) {
		switch (navigator.platform) {
			case "MacIntel":
				platform = "Macintosh";
				break;
		}
	}

	var userAgent = navigator.userAgent || "";

	if (userAgent.match("Chrome")) {
		browser = "Chrome";
	} else if (userAgent.match("Safari")) {
		browser = "Safari";
	} else if (userAgent.match("Opera")) {
		browser = "Opera";
	} else if (userAgent.match("Firefox")) {
		browser = "Firefox";
	} else if (userAgent.match("MSIE")) {
		browser = "Internet Explorer";
	}

	return {
		deviceType: null,
		platform: platform,
		operatingSystem: null,
		browser: browser,
		cookiesEnabled: null,
		language: null,
		online: null
	};
});
