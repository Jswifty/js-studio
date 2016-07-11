define(function () {
	var navigator = window.navigator || {};
	var userAgent = navigator.userAgent || "";
	var platform = navigator.platform || "";
	var cookieEnabled = navigator.cookieEnabled || false;

	var deviceType = "Unknown";

	if (/WOW64|IBIS|Macintosh|Linux i868|Linux Mint|Linux Next|Windows NT/i.test(userAgent)) {
		deviceType = "Computer";
	} else if (/iPad|Opera|Tab|TouchPad|Nexus 7|Nexus 10|GT-N|Pad|GT-P|IdeaTab|SM-T|HP Slate|Xoom|Aurora-II|ME301T|A1-810|A1-811|NookHD|PMP5880D|QUANTUM7|Kindle Fire|SGP3|Nook HD|Transformer|AT300|COBALT|MOMO|Sweet M|ARCHOS|NOOK|NABI2|MZ60|Vega|Slider|MID7|KFTT|Streak|LePanII|HTC_Flyer|JRO03H|BNTV400|A500|KFTT Build|M805|POM727MC|cm_tenderloin/i.test(userAgent)) {
		deviceType = "Tablet";
	} else if (/iPhone|iPod|iOS|Mobile|Opera Mobi/i.test(userAgent)) {
		deviceType = "Mobile";
	}

	var machine = "Unknown";

	if (/Mac/i.test(platform)) {
		machine = "Macintosh";
	} else if (/Win/i.test(platform)) {
		machine = "Windows";
	} else if (/Linux/i.test(platform)) {
		machine = "Linux";
	}

	var browser = "Unknown";

	if ((!!window.opr && !!opr.addons) || !!window.opera || userAgent.indexOf(' OPR/') >= 0) {
		browser = "Opera"; // Opera 8.0+
	} else if (typeof InstallTrigger !== 'undefined') {
		browser = "Firefox"; // Firefox 1.0+
	} else if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
		browser = "Safari"; // At least Safari 3+
	} else if (false || !!document.documentMode) {
		browser = "Internet Explorer"; // Internet Explorer 6-11
	} else if (!(false || !!document.documentMode) && !!window.StyleMedia) {
		browser = "Edge"; // Edge 20+
	} else if (!!window.chrome && !!window.chrome.webstore) {
		browser = "Chrome"; // Chrome 1+
	}

	var browserVersion = "Unknown";

	try {
		var agentString = userAgent.substring(userAgent.indexOf(browser) + browser.length + 1);
		agentString = agentString.substring(0, agentString.indexOf(" "));
		agentString = parseInt(agentString, 10);

		if (agentString === agentString) {
			browserVersion = agentString;
		}
	} catch (e) {}

	return {
		deviceType: deviceType,
		machine: machine,
		browser: browser,
		browserVersion: browserVersion,
		cookiesEnabled: cookieEnabled
	};
});
