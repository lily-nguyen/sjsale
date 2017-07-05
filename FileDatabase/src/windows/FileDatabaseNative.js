var folderDatabase = require('./FolderDatabase');
cordova.commandProxy.add("FileDatabaseNative",{
	
	
	/**
	 * grant permission for the folder containing report files
	 */
	grantRights : function (successCallback, errorCallback) {
	
		var folderPicker = new Windows.Storage.Pickers.FolderPicker();
		folderPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.desktop;
		folderPicker.fileTypeFilter.replaceAll(["*"]);
		
		folderPicker.pickSingleFolderAsync().then( function (folder) { 
			Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList.addOrReplace("PickedFolderToken", folder);
			console.log(folder.name); 
		});	
	},
	
	
	/**
	 * create a file in defined folder
	 * INPUT: content is an array with: 
	 *        [0] name (string): name of the file
	 *        [1] content (string): body of the file
	 *        [2] format (string): format of the file
	 */
	createFile : function (successCallback, errorCallback, content) {
		folderDatabase.getfolder()
		.then (function (folder) {
			console.log(folder.name);
			return folder.createFileAsync(content[0]);})
		.done (function (file) {
			//TODO: write content in a transaction
			Windows.Storage.FileIO.writeTextAsync(file, content[1]).done( function () {
				console.log('write successful');
			});
		});
	}

});