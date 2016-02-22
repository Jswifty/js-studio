define(function (require) {

	return {

		createStorage : function (storageType, namespace) {
			window[storageType][namespace] = window[storageType][namespace] || "{}";
			return storagemanager.getStorage(storageType, namespace);
		},

		getStorage : function (storageType, namespace) {

			if (window[storageType][namespace] !== undefined) {
				
				return {

					getAll : function () {

						try {
							return JSON.parse(window[storageType][namespace]);
						} catch (exception) {
							return null;
						}
					},

					get : function (key) {

						var storedValue = null;
						
						try {

							var storage = JSON.parse(window[storageType][namespace]);
							
							if (storage[key] !== undefined) {
								storedValue = storage[key];
							}

						} catch (exception) {}

						return storedValue;
					},

					set : function (key, value) {
						
						try {

							var storage = JSON.parse(window[storageType][namespace]);
							storage[key] = value;

							window[storageType][namespace] = JSON.stringify(storage);

							return true;

						} catch (exception) {
							return false;
						}
					},

					remove : function (key) {

						try {
							
							var storage = JSON.parse(window[storageType][namespace]);
							
							if (storage[key] === undefined) {
								return true;
							}
							
							delete storage[key];

							window[storageType][namespace] = JSON.stringify(storage);

							return true;

						} catch (exception) {
							return false;
						}
					},

					clear : function () {
						window[storageType][namespace] = "{}";
					}

					dispose : function () {
						return window[storageType].removeItem(namespace);
					}
				}
			}
			
			else {
				return null;
			}
		};
	}
});
