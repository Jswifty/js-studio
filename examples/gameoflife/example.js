var style = document.createElement("style");
style.type = "text/css";
style.id = "mainStyle";
style.innerHTML = [
	"html, body {",
		"width: 100%;",
		"height: 100%;",
	"}",
	"body {",
		"margin: 0px;",
		"background: black;",
	"}"
].join(" ");

var head = document.getElementsByTagName("head")[0];
head.appendChild(style);

var body = document.getElementsByTagName("body")[0];

require(["gameoflife"], function(Gameoflife) {

	var gameoflife = new Gameoflife(body, 500, 500);

	for (var y = 10; y < 480; y += 2) {
		for (var x = 10; x < 480; x += 1) {
			gameoflife.lifeGrid.setCell(y, x, true);
		}
	}

	gameoflife.addMouseListener(body);
	gameoflife.start();
});
