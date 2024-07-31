chrome.runtime.onInstalled.addListener(function(){
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 只有打开微信才显示pageAction
					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'mp.weixin.qq.com'}})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});


// 桌面通知
function notification({ iconUrl, title, content }) {
	chrome.notifications.create(null, {
		type: 'basic',
		title,
		iconUrl: "/img/icon.png",
		// imageUrl: imgUrl,
		message: content,
		contextMessage: '洞见微信聚合'
	})
}

chrome.contextMenus.create({
	title: "_Doonsec贡献公众号",
	documentUrlPatterns: ['https://mp.weixin.qq.com/*' ]
});

chrome.contextMenus.create({
	title: '使用洞见搜索：%s', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: function(params)
	{
		// 注意不能使用location.href，因为location是属于background的window对象
		chrome.tabs.create({url: 'https://wechat.doonsec.com/elasticsearch/?keyword=' + encodeURI(params.selectionText)});
	}
});

function sendmsg_acount(tag_name) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: "btnAddAccount" }, function (response) {
			var win = chrome.extension.getBackgroundPage();
			win.data = response;
			if (response) {
				response['tag_name'] = tag_name;
				zlajax.post({
					"url": "https://wechat.doonsec.com/api/v1/community_account_add/",
					// "dataType":"jsonp",
					"data": response,
					"success": function (data) {
						if (data.code == 0) {
							notification({
								title: data.data,
								content: data.message
							})
						} else {
							notification({
								title: data.data,
								content: data.message
							})
						}

					},
					'fail': function () {
						notification({
							title: '网络错误',
							content: "网络错误"
						})
					}
				});


			}
		});

	})
}



var tag_list = [
	{ "title": "_0提交到-其他类", "id": 13 },
	{ "title": "_1提交到-媒体社区类", "id": 1 },
	{ "title": "_2提交到-安全公司类", "id": 2 },
	{ "title": "_3提交到-应急响应类", "id": 3 },
	{ "title": "_4提交到-安全团队类", "id": 4 },
	{ "title": "_5提交到-高校社团类", "id": 5 },
	{ "title": "_6提交到-CTF类", "id": 6 },
	{ "title": "_7提交到-个人类", "id": 7 },
	{ "title": "_8提交到-安全实验室类", "id": 8 },
	{ "title": "_9提交到-网络运维类", "id": 9 },
	{ "title": "_10提交到-安全研发类", "id": 10 },
	{ "title": "_11提交到-二进制安全类", "id": 11 },
	{ "title": "_12提交到-硬件安全类", "id": 12 },
	{ "title": "_14提交到-等级保护类", "id": 14 },
	{ "title": "_15提交到-威胁情报类", "id": 15 },
	{ "title": "_16提交到-安全建设类", "id": 16 },
	{ "title": "_17提交到-数据安全类", "id": 17 },
]
$.each(tag_list, function (index,value) {
	chrome.contextMenus.create({
		type: 'radio',
		title: value.title,
		parentId: 1,
		onclick: function () {
			sendmsg_acount(value.id)

		}
	});
});


