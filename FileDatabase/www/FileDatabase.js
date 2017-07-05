var exec = require('cordova/exec');

var success = function () {
	console.log("success from file database sync");
}

var error = function () {
	console.log("error from file database sync");
}

var FileDatabase = {
		
	/**
	 * save a file to defined folder
	 * INPUT: content is an array with: 
	 *        [0] name (string): name of the file
	 *        [1] content (string): body of the file
	 *        [2] format (string): format of the file
	 */
	createFile : function (content) {
		exec(success, error, "FileDatabaseNative", "createFile", content);
	},
	
	grantRights : function () {
		exec(success, error, "FileDatabaseNative", "grantRights");
	}
}

module.exports = FileDatabase;