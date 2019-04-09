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
              "password" : "8d6bxb5v"
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
                // console.log(resp);
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
            // console.log($('div[class="borders team team-partial"]'))

            /* $("div").each(function(i, div){
                console.log($(div));
            });*/

            /*$('div[class="borders team team-partial"]').contents().map(function() {
                console.log($(this))
            }).get()*/
            $('div[class="span1 logo"]').remove()
            $('div[class="shortcut_menu_wrapper"]').remove()
//            $('div[class="team-event-header event_type_1"]').remove()
            $('div[class="event-gradient event_gradient_1"]').remove()
            $('div[class="event-image-overlay enroll-in"]').remove()
            $('div[class="enrollment-counter-circle-container"]').remove()
            $('div[class="enroll-buttons"]').remove()
            $('div[class="event-gradient event_gradient_3"]').remove()
//            $('span[class="event-name-information"]').remove()
//            $('div[class="span4 event-information-container"]').remove()
            $('div[class="message_preview_wrapper"]').remove()
            $('div[class="last-comment"]').remove()
            $('div[class="event-gradient event_gradient_2"]').remove()
            $('div[class="span8 event-border"]').remove()
            
            // remove links
            $('div[class="row event-simple-container section-inner-margin "]').each(function(i, item) {
                //console.log($(item).text());
                if ($(item).find('a').length) {
                    // console.log($(item).find('a').text())
                    $(item).find('a').first().parent().append("<p>" + $(item).find('a').text() + "</p>")
                    $(item).find('a').remove()
                }
            })

            // remove more links
            $('h3').each(function(i, item) {
                //console.log($(item).text());
                if ($(item).find('a').length) {
                    // console.log($(item).find('a').text())
                    $(item).find('a').first().parent().append($(item).find('a').text())
                    $(item).find('a').remove()
                }
            })

            // order by oldest team
            var ordered = ["Kyif FT07","KyIF FT 09","Kyif FT 2011","KyIF P11"]
            $('div[class="borders team team-partial"]').each(function(i, item) {
                if ($(item).text().search("Kyif FT07") > -1)
                    ordered[0] = $(item).html()
                else if ($(item).text().search("KyIF FT 09") > -1)
                    ordered[1] = $(item).html()
                else if ($(item).text().search("Kyif FT 2011") > -1)
                    ordered[2] = $(item).html()
                else if ($(item).text().search("KyIF P11") > -1)
                    ordered[3] = $(item).html()
            })

            fs.writeFile(path.resolve(__dirname, 'nimenhuuto.html'),  "");

            ordered.forEach(function(arrayitem, index, array) {
                console.log(arrayitem, index)
                fs.appendFile(path.resolve(__dirname, 'nimenhuuto.html'),  arrayitem);
            })
        }
    })
}

var page1 = initializePromise.then(nextStep);
