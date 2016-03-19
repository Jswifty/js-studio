define(function (require) {
	
	var style = document.createElement("style");
	style.type = "text/css";
	style.id = "fontsStyle";
	
	style.innerHTML = [
		"@font-face {font-family: 'Arcon';src: url('fonts/arcon/arcon.otf') format('opentype');}"
	].join(" ");
	
	return style;
});
