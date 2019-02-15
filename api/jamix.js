const request = require('request');
const fs = require('fs');

//Custom Header pass
var headersOpt = {  
   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134"
};
request(
        {
        method:'post',
        url:'https://www.jamix.fi/ruokalistat/?anro=96127&k=6&mt=1',
        form: {
          "v-browserDetails": "1"
        },
        headers: headersOpt
    }, function (error, response, body) {  
        var vJson = JSON.parse(body);
        vJson = JSON.parse(vJson.uidl);

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
        html += "</p>";

        console.log(html);
        fs.writeFile("/home/pi/ruuvi/api/jamix.html", html, function(err) {
        });
}); 
