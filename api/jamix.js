var request = require('request');
const fs = require('fs');
const path = require('path');

//Custom Header pass
var headersOpt = {
   "Cookie" : "",
   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134"
};

var j = request.jar();
request = request.defaults({jar:j});

var securityToken = "";

request(
        {
        method:'post',
        url:'https://www.jamix.fi/ruokalistat/?anro=96127&k=6&mt=1',
        form: {
          "v-browserDetails": "1"
        },
        headers: headersOpt,
    }, function (error, response, body) {
        vJson = JSON.parse(body);
        vJson = JSON.parse(vJson.uidl);

        securityToken = vJson["Vaadin-Security-Key"];
        // console.log(securityToken);
});

function initialize() {
    // Setting URL and headers for request
    var options = {
        url: 'https://www.jamix.fi/ruokalistat/?anro=96127&k=6&mt=1',
        headers: headersOpt,
        form: { "v-browserDetails": "1" }
    };

    // Return new promise
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.post(options, function(err, resp, body) {
            if (err) {
                reject(err);
                console.log("ERROR: " + err);
            } else {
                headersOpt["cookie"] = resp.headers["set-cookie"][0];
                request.cookie = resp.headers["set-cookie"][0];
                console.log(request.cookie);
                resolve(resp);
            }
        })
    })
}

var initializePromise = initialize();

async function nextStep(result) {
    uidl = JSON.parse((JSON.parse(result.body)).uidl);
    securityToken = uidl["Vaadin-Security-Key"];

    var rRaw1 = {"csrfToken":securityToken,"rpc":[["16","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":516,"clientY":953,"ctrlKey":false,"metaKey":false,"relativeX":49,"relativeY":19,"shiftKey":false,"type":1}]]],"syncId":0,"clientId":0,"wsver":"7.7.10"}
    var rBody1 = JSON.stringify(rRaw1);
    var rRaw2 = {"csrfToken":securityToken,"rpc":[["10","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":556,"clientY":196,"ctrlKey":false,"metaKey":false,"relativeX":38,"relativeY":18,"shiftKey":false,"type":1}]]],"syncId":1,"clientId":1};
    var rBody2 = JSON.stringify(rRaw2);
    var rRaw3 = {"csrfToken":securityToken,"rpc":[["70","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":554,"clientY":191,"ctrlKey":false,"metaKey":false,"relativeX":27,"relativeY":13,"shiftKey":false,"type":1}]]],"syncId":2,"clientId":2}
    var rBody3 = JSON.stringify(rRaw3);

    console.log(1);
    await doRPCRequest(rBody1, 0);
    console.log(2);
    await doRPCRequest(rBody2, 1);
    console.log(3);
    await doRPCRequest(rBody3, 2);

    fs.readFile(path.resolve(__dirname, 'jamix.html'), 'utf8', function(err, contents) {
        console.log(contents);
    });
}

function doRPCRequest(postContents, append) {
    return new Promise(function (resolve, reject) {
        request({
            method:'post',
            url:"https://www.jamix.fi/ruokalistat/UIDL/?v-uiId=0",
            referer:"https://www.jamix.fi/ruokalistat/?anro=96127&k=6&mt=1",
            headers: headersOpt,
            body: postContents,
            cookie: headersOpt["cookie"]
        }, function (error, response, body) {
            console.log("doRPCRequest1");
            if (!error && response.statusCode == 200) {
                body = body.replace("for(;;);","");
                body = JSON.parse(body);
                console.log(postContents);
                console.log(headersOpt);

//                console.log(body);

                let fDay = body[0]["state"]["5"] != null ? body[0]["state"]["5"].text : "";

                let lunch1 = "";
                let lunch2 = "";

                if (append == 0) {
                    lunch1 = body[0]["state"]["19"] != null ? body[0]["state"]["19"].caption : "";
                    lunch2 = body[0]["state"]["20"] != null ? body[0]["state"]["20"].caption : "";
                } else if (append == 1) {
                    lunch1 = body[0]["state"]["25"] != null ? body[0]["state"]["25"].caption : "";
                    lunch2 = body[0]["state"]["26"] != null ? body[0]["state"]["26"].caption : "";
                } else if (append == 2) {
                    lunch1 = body[0]["state"]["29"] != null ? body[0]["state"]["29"].caption : "";
                    lunch2 = body[0]["state"]["30"] != null ? body[0]["state"]["30"].caption : "";
                    
                    for (var menu in body[0]["state"]) {
                        if (menu != null)
                            lunch1 = lunch1 + menu.caption;
                    }
                }

                console.log(fDay);
                console.log(lunch1);
                console.log(lunch2);

                if (append > 0)
                    fs.appendFile(path.resolve(__dirname, 'jamix.html'), "<p>" + fDay  + "</p><p>" + lunch1 + "</p><p>" + lunch2 + "</p>\n", function(err) {});
                else
                    fs.writeFile(path.resolve(__dirname, 'jamix.html'), "<p>" + fDay  + "</p><p>" + lunch1 + "</p><p>" + lunch2 + "</p>\n", function(err) {});

               resolve(body);
            } else {
               reject(error);
            }
            console.log("doRPCRequest2");
        });
    });
}

var swedish = initializePromise.then(nextStep);
