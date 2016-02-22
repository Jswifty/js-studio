define(function (require) {

	return {

		hasClass : function (element, classname) {

			var classNames = element.className.split(" ");

			for (var i = 0; i < classNames.length; i++) {
				if (classNames[i] === classname) {
					return true;
				}
			}

			return false;
		},

		addClass : function (element, classname) {

			if (this.hasClass(element, classname) === false) {

				if (element.className.length > 0) {
					element.className += " ";
				}

				element.className += classname;
			}
		},
		
		removeClass : function (element, classname) {
			
			var newClassNames = [];
			var classNames = element.className.split(" ");
			
			for (var i = 0; i < classNames.length; i++) {
				if (classNames[i].length > 0 && classNames[i] !== classname) {
					newClassNames.push(classNames[i]);
				}
			}
			
			element.className = newClassNames.join(" ");
		},
		
		toggleClass : function (element, classname) {
			
			var oldClassName = element.className;

			this.removeClass(element, classname);

			if (oldClassName === element.className) {

				if (element.className.length > 0) {
					element.className += " ";
				}

				element.className += classname;
			}
		}
	};
});
