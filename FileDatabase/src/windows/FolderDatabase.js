var FolderDatabase = {
		
	/**
	 * get pre-defined folder
	 * after loading the folder object, the method doAction is executed
	 */	
	getfolder : function (doAction) {
		var folderPromise = Windows.Storage.StorageFolder.getFolderFromPathAsync('D:\\work\\sjs_database');
		return folderPromise;	
	}

}

module.exports = FolderDatabase;