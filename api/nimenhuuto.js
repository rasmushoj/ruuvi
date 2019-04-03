var request = require('request');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

//Custom Header pass
var headersOpt = {
   "Cookie" : "",
   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134"
};

var j = request.jar();
request = request.defaults({jar:j});

function initialize() {
    // Setting URL and headers for request
    var options = {
        url: 'https://nimenhuuto.com/users/sessions',
        headers: headersOpt,
        form: {
              "login_name": "rasmus.johansson@iki.fi",
              "password" : "jcbpfsqy"
        }
    };

    // Return new promise
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.post(options, function(err, resp, body) {
            if (err) {
                reject(err);
                console.log("ERROR: " + err);
            } else {
                // headersOpt["cookie"] = resp.headers["set-cookie"][0];
                // request.cookie = resp.headers["set-cookie"][0];
                // console.log(request.cookie);
                console.log(resp);
                resolve(resp);
            }
        })
    })
}

var initializePromise = initialize();

async function nextStep(result) {
    request.get({url:'https://nimenhuuto.com/users/sessions',}, function(err, resp, body) {
        if (err) {
            console.log("ERROR: " + err);
        } else {
            const $ = cheerio.load(body);
            // $('a').remove();
            var anchors = [];
            $("a").each(function(i, link){
                anchors[i] = $(link).attr("href");
                console.log($(link));
            });

            fs.writeFile(path.resolve(__dirname, 'nimenhuuto.html'),  $('div[id="content-body"]').first().html());
        }
    })
}

var page1 = initializePromise.then(nextStep);
