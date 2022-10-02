
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

$(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getAccountInfo" }, function (response) {
            var win = chrome.extension.getBackgroundPage();
            win.data = response;

            if (response) {
                pattern = '__biz=(.*?)=='
                biz = response.match(pattern)[1]
                zlajax.get({
                    "url": "http://wechat.doonsec.com:7001/api/v1/account_tongji/?biz="+biz ,
                    // "dataType": "jsonp",
                    "success": function (data) {
                        if (data.code == 0) {
                            $("#is_check").text("检测完成✅");
                            $(".account_show").text(data.message);
                            $(".article_mounth_num").text(data.data.article_mounth_num);
                            $(".article_sum").text(data.data.article_sum);
                            $(".avg_read_num").text(data.data.avg_read_num);
                        } else {
                            $(".account_show").text(data.message);
                        }

                    },
                    'fail': function () {
                        $(".account_show").text("网络错误");
                    }
                });


            }

        });
    });
});

$(function () {
    $("#btnAddAccount").click(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "btnAddAccount" }, function (response) {
                var win = chrome.extension.getBackgroundPage();
                win.data = response;

                if (response) {
                    response['tag_name'] = 13;
                    zlajax.post({
                        "url": "http://wechat.doonsec.com:7001/api/v1/community_account_add/",
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
        });
    });
    $("#btnCheckAccount").click(function () {
        var win = chrome.extension.getBackgroundPage();
        if (win.data) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "btnCheckAccount", data: win.data }, function (response) {
                    console.log(response);
                });
            });
        }
    });
});
