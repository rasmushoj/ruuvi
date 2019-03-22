var request = require('request');
const fs = require('fs');

//Custom Header pass
var headersOpt = {
   "Cookie" : "",
   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134"
};

var j = request.jar();
request = request.defaults({jar:j});

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

initializePromise.then(function(result) {
    uidl = JSON.parse((JSON.parse(result.body)).uidl);

    securityToken = uidl["Vaadin-Security-Key"];
    fs.writeFile("/home/pi/ruuvi/api/jamix.html", uidl.state["19"].caption, function(err) {});

    var rRaw = {"csrfToken":securityToken,"rpc":[["0","com.vaadin.shared.ui.ui.UIServerRpc","resize",[969,877,877,969]],["16","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":516,"clientY":953,"ctrlKey":false,"metaKey":false,"relativeX":49,"relativeY":19,"shiftKey":false,"type":1}]]],"syncId":0,"clientId":0,"wsver":"7.7.10"}
    var rBody = JSON.stringify(rRaw);
    console.log(rBody);

    request({
        method:'post',
        url:"https://www.jamix.fi/ruokalistat/UIDL/?v-uiId=0",
        referer:"https://www.jamix.fi/ruokalistat/?anro=96127&k=6&mt=1",
        headers: headersOpt,
        body: rBody,
        cookie: headersOpt["cookie"]
    }, function (error, response, body) {
          console.log("ERROR RPC: " + error);
          console.log("COOKIE: " + request.cookie);
          body = body.replace("for(;;);","");
          console.log("BODY: " + body);
          body = JSON.parse(body);
          console.log(body);
	  var lunch1 = body[0]["state"]["19"].caption;
          var lunch2 = body[0]["state"]["20"].caption;
          console.log(lunch1 + "\n" + lunch2);
          fs.writeFile("/home/pi/ruuvi/api/jamix.html", "<p>" + lunch1 + "</p><p>" + lunch2 + "</p>", function(err) {});
    });
}, function(err) {
    console.log("ERROR: " + err);
})
