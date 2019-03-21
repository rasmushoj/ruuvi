const request = require('request');
const fs = require('fs');

//Custom Header pass
var headersOpt = {
   "Cookie" : "",
   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134"
};

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

        var html = "<p>";
        if (vJson.state["6"])
            html += vJson.state["6"].text;
        html += "</p><p>";
        if (vJson.state["9"] && vJson.state["9"].text)
            html += vJson.state["9"].text;
        html += "</p><p>";
        if (vJson.state["16"] && vJson.state["16"].caption)
            html += vJson.state["16"].caption;
        html += "</p><p>";
        if (vJson.state["17"])
            html += vJson.state["17"].caption;
        html += "</p><p>";
        if (vJson.state["20"])
            html += vJson.state["20"].text;
        html += "</p><p>";
        if (vJson.state["27"])
            html += vJson.state["27"].text;
        html += "</p>";

        console.log(html);
        fs.writeFile("/home/pi/ruuvi/api/jamix.html", html, function(err) {});
        fs.writeFile("/home/pi/ruuvi/api/jamix.json", JSON.stringify(vJson), function(err) {});

        console.log(securityToken);
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
            } else {
                headersOpt["cookie"] = resp.headers["set-cookie"][0];
                console.log(headersOpt);
                resolve(resp);
            }
        })
    })
}

var initializePromise = initialize();

initializePromise.then(function(result) {
    uidl = JSON.parse((JSON.parse(result.body)).uidl);

    securityToken = uidl["Vaadin-Security-Key"];
    // console.log("Initialized user details");
    // console.log(userDetails);
    // changes = JSON.parse(uidl["changes"]);
    // console.log(uidl);
    fs.writeFile("/home/pi/ruuvi/api/jamix.html", uidl.state["19"].caption, function(err) {});
    console.log(uidl.state["19"].caption);
    console.log(securityToken);
    var rRaw = {csrfToken:securityToken,rpc:[["16","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":531,"clientY":941,"ctrlKey":false,"metaKey":false,"relativeX":64,"relativeY":14,"shiftKey":false,"type":1}]]],syncId:0,clientId:0,wsver:"7.7.10"};
    var rBody = JSON.stringify(rRaw);
    // console.log(JSON.parse(rBody));
    // console.log(result.headers);

    request({
        method:'post',
        url:"https://www.jamix.fi/ruokalistat/UIDL/?v-uiId=0",
        referer:"https://www.jamix.fi/ruokalistat/?anro=96127&k=6&mt=1",
        form: {
          "v-browserDetails": "1"
        },
        headers: headersOpt,
        body: rBody,
        cookie: headersOpt["cookie"]
    }, function (error, response, body) {
           console.log(body);
    });
}, function(err) {
    console.log(err);
})
