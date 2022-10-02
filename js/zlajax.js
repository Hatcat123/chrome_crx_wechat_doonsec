

'use strict';
var zlajax = {
	'get': function (args) {
		args['method'] = 'get';
		this.ajax(args);
	},
	'post': function (args) {
		args['method'] = 'post';
		this.ajax(args);
	},
	'ajax': function (args) {
		// 设置csrftoken
		this._ajaxSetup();
		$.ajax(args);
	},
	'_ajaxSetup': function () {
		$.ajaxSetup({
			'beforeSend': function (xhr, settings) {
				xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
			}
		});
	}
};