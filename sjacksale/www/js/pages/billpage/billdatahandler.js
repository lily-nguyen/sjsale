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
		orderObject.total = 0;
		
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