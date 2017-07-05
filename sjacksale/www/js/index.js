(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var jFile = {
		
	/**
	 * contentF: body of the file
	 */
	contentF : null,
	
	/**
	 * nameF: name of the file
	 */
	nameF : null,
	
	/**
	 * formatF : format of the file
	 */
	formatF : null,
	
    initial: function (name, content, formatFile) {
    	this.nameF = name;
    	this.contentF = content;
    	this.formatF = formatFile;
    },

    /**
     * create a new file and save content to the file
     */
    createFile : function () {
    	var file = [];
    	file.push(this.nameF);
    	file.push(this.contentF);
    	file.push(this.formatF);
    	window.FileDatabase.file.createFile(file);
    },
    
    onErrorCreateFile : function (e) {
    	console.log("Create file fail...");
    },
    
    onErrorLoadFs : function (e) {
    	console.log("File system fail...");
    },
       
    isRights : function () {
    	return false;
    },
    
    grantRights : function () {
    	window.FileDatabase.file.grantRights();
    }
};

module.exports = jFile;

},{}],2:[function(require,module,exports){
var data = {
	
	/**
	 * 	order of items need to be guaranteed
	 */
	billing : [
		{'id' : 'name',
			'title' : 'Ten San Pham',
			'show' : true
		},
		{'id' : 'prize',
			'title' : 'Gia',
			'show' : true
		},
		{'id' : 'quantity',
			'title' : 'So Luong',
			'show' : true
		},
		{'id' : 'total',
			'title' : 'Thanh Tien',
			'show' : true
		}]	
}

var config = {
		
	getShowData	: function (page) {
		// TODO: make it only one instance
		var itms = data[page];
		
		var itemsId = [];
		for (var i = 0; i < itms.length; i++) {
			if (('show' in itms[i]) && (itms[i]['show'])) {
				itemsId.push(itms[i].id);
			}
			
		}
		return itemsId;
	},
	
	getFullShowData : function (page) {
		// TODO: make it only one instance
		var itms = data[page];
		
		var items = [];
		for (var i = 0; i < itms.length; i++) {
			if (('show' in itms[i]) && (itms[i]['show'])) {
				items.push(itms[i]);
			}
			
		}
		return items;
	}
}

module.exports = config;
},{}],3:[function(require,module,exports){
var jFile = require('./common/jfile');

configure = function () {
	// TODO: check that whether the database folder permission is granted, if it is not, request it
	if (!isDatabaseFolderRights()) {
		grantRights();
	} else {
		
	}
}

function isDatabaseFolderRights () {
	return jFile.isRights();
} 

function grantRights () {
	return jFile.grantRights();
}


module.exports = configure;
},{"./common/jfile":1}],4:[function(require,module,exports){
var CSV = {
		
	NEWLINE	 : "\r\n",
	SEPERATED : ",",
	CSV_FORMAT : 'text/csv'		
		
}

module.exports.CSV = CSV;
},{}],5:[function(require,module,exports){
var billPage = require('./pages/billpage/billpage');
var configure = require('./configuration');
var app = {
    // Application Constructor
    initialize : function() {
    	alert("initialize");
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady : function() {
        this.initial('deviceready');
    },
    
    initial : function () {
    	configure();
    	billPage.initial();
    }
};

app.initialize();
},{"./configuration":3,"./pages/billpage/billpage":8}],6:[function(require,module,exports){
var tableConfig = require('../../config');
var billInputHanlder = require('./billinputhandler'); 
var fileFormat = require('../../fileformat').CSV;

var billDataHandler = {
	
	TOTAL_NAME : 'Tong Cong',	
	
	/**
	 * return value in a row
	 * format {id:"id_1", name:"Name 1", prize:10000 , quantity:3, total:30000}
	 */
	getItem : function ($item) {
		var item = {};
		item.name = $item.find('#name').val();
		item.prize = parseInt($item.find('#price').val());
		item.quantity = parseInt($item.find('#quantity').val());
		item.total = parseInt($item.find('#total').val());
		return item;
	},
	
	/**
	 * format of the object returned:
	 * {title : {}, items:[], total: 8000}
	 * title: header of data
	 * item : {name:"San Pham A", prize: 20, quantity: 300, total: 6000}
	 * TODO: add product id into item
	 */
	getBill : function () {
		var thisO = this;
		
		var orderObject = {};
		orderObject.items = [];
		var total = 0;
		
		$('.item').each(function (idx) {
			var $this = $(this);
			var item = thisO.getItem($this);
			if (item.total) {
				orderObject.items.push(item);
				orderObject.total += item.total;				
			}
		});
		
		return orderObject;
	},
		
	getData : function (key, items) {
		for (var i = 0; i < items.length; i++) {
			if (items[i].id === key) {
				return items[i];
			}
		}
	
		return '';
	},
	
	getTitle : function (showIds, fullData) {
		var title = this.getData(showIds[0], fullData).title;
		
		for (var i = 1; i < showIds.length; i++) {
			data = this.getData(showIds[i], fullData);
			title += fileFormat.SEPERATED + data.title;
		}
		
		return title;
	},
	
	/**
	 * showData: 
	 */
	getBodyItem : function (showIds, contentItem) {
		var item = "";
		for (var i = 0; i < showIds.length; i++) {
			item += contentItem[showIds[i]] + fileFormat.SEPERATED;
		}
		
		item = item.substring(0, item.length - fileFormat.SEPERATED.length);
		
		return item;
	},
	
	getBody : function (showIds, content) {
		
		if (content.length == 0) {return "";}
		
		var body = this.getBodyItem(showIds, content[0]);
		
		for (var i = 1; i < content.length; i++) {
			body += fileFormat.NEWLINE + this.getBodyItem(showIds, content[i]);
		}
		
		return body;
	},
	
	getTotal : function (showIds, totalItem) {
		var total = "";
		
		for (var i = 1; i < showIds.length - 2; i++) {
			total += fileFormat.SEPERATED;
		}
		
		total += fileFormat.SEPERATED + this.TOTAL_NAME;
		total += fileFormat.SEPERATED + totalItem;
		
		return total;
	},
	
	/**
	 * convert bill object to string
	 * TODO: using iostream instead of
	 */
	convertToString : function (content) {
		var showIds = tableConfig.getShowData('billing');
		var data = this.getTitle(showIds, tableConfig.getFullShowData('billing'));
		data = data + fileFormat.NEWLINE + this.getBody(showIds,content.items);
		data = data + fileFormat.NEWLINE + this.getTotal(showIds, content.total);
		return data;
	},
	
	getFileName : function () {
		return 'testexportfile.csv';
	}

}

module.exports = billDataHandler;
},{"../../config":2,"../../fileformat":4,"./billinputhandler":7}],7:[function(require,module,exports){
(function ($, window) {
	
	function getNewRow () {
		var newRow = '<tr class="item">' +
					'<td><input class="subitem" type="text" id="name"></td>' +
	        		'<td><input class="subitem" type="text" id="price"></td>' +
	        		'<td><input class="subitem" type="text" id="quantity"></td>' +
	        		'<td><input class="subitem" type="text" id="total"></td>' +
	        		'</tr>';
		return newRow;
	}
	
	function addLastRow($el) {
		$el.after(getNewRow());
		var newRow = $el.next('.item');
		initialAddLastRow(newRow);
	}
	
	function isLastRow ($element) {
		var $nextItem = $element.next('.item');
		return $nextItem.length == 0;
	}
	
	function getRowParent ($element) {
		return $element.parents('.item');
	}
	
	function addLastRowEvent ($elements) {
		$elements.on("click", function () {
			var $parent = getRowParent($(this));
			if (isLastRow($parent)) {
				addLastRow($parent);
			}			
		})		
	}
	
	/**
	 * add event that if the last row is using, add new last row.
	 * @param $element. If a specified $element is defined, add the event for all its children ('.subitem'). 
	 * 			If not, add the event for all elements with class '.subitem'
	 * @returns
	 */
	function initialAddLastRow ($element) {
		
		if ($element) {
			$subitems = $element.find('.subitem')
		} else {
			$subitems = $('.subitem');
		}
		
		addLastRowEvent($subitems);
	}
	
	function initialEditSelectedRow () {
		
	}
	
	function initialSaveEdittedRow () {
		
	}
	
	var inputHanlder = {
		initial	: function () {
			initialEditSelectedRow();
			initialSaveEdittedRow();
			initialAddLastRow();			
		}
	}	
	
	module.exports = inputHanlder;

})($, window)
},{}],8:[function(require,module,exports){
var jFile = require('../../common/jfile');
var tableConfig = require('../../config');
var billInputHanlder = require('./billinputhandler'); 
var billDataHandler = require('./billdatahandler');
var fileFormat = require('../../fileformat').CSV;

var billPage = {
		
	initial	: function () {
		billInputHanlder.initial();
		$(".submit-bill").on("click", this.createBill);
	},
	
	createBill : function () {
		var bill = billDataHandler.convertToString(billDataHandler.getBill());
		jFile.initial(billDataHandler.getFileName(), bill, fileFormat.CSV_FORMAT); 
		jFile.createFile();
	}
}

module.exports = billPage;
},{"../../common/jfile":1,"../../config":2,"../../fileformat":4,"./billdatahandler":6,"./billinputhandler":7}]},{},[5]);
