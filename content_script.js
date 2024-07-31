


chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "btnAddAccount") {
            var profile_nickname = $(".wx_follow_nickname");
            var js_profile_qrcode_img = $("#js_pc_qr_code_img").attr("src");
            var data_dict = Object();

            if (profile_nickname.html().length > 0) {
                data_dict['profile_nickname'] = profile_nickname.html().replace(/\s+/g, '')
                data_dict['js_profile_qrcode_img'] = js_profile_qrcode_img
                console.log(data_dict)
                sendResponse(data_dict);

            } else {
                sendResponse(data_dict);
            }
        } else if (request.action === "btnCheckAccount") {
            var js_profile_qrcode_img = $("#js_pc_qr_code_img").attr("src");
            
            if (js_profile_qrcode_img.length > 0) {
              
                sendResponse("OK");
            } else {
                alert("No data");
            }
        }
         else if (request.action === "getAccountInfo") {
            var js_profile_qrcode_img = $("#js_pc_qr_code_img").attr("src");
            
            if (js_profile_qrcode_img.length > 0) {
              
                sendResponse(js_profile_qrcode_img);
            } else {
                alert("No data");
            }
        }

    }
);
