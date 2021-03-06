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

var securityToken = "";

request(
        {
        method:'post',
        url:'https://www.jamix.fi/ruokalistat/?anro=96127&k=6&mt=2',
        form: {
          "v-browserDetails": "1"
        },
        headers: headersOpt,
    }, function (error, response, body) {
        vJson = JSON.parse(body);
        vJson = JSON.parse(vJson.uidl);

        securityToken = vJson["Vaadin-Security-Key"];
});

function initialize() {
    // Setting URL and headers for request
    var options = {
        url: 'https://www.jamix.fi/ruokalistat/?anro=96127&k=6&mt=2',
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
                request.cookie = resp.headers["set-cookie"][0];
                fs.writeFile(path.resolve(__dirname, 'jamix_1.html'), JSON.stringify(body));
                resolve(resp);
            }
        })
    })
}

var initializePromise = initialize();
var menu = {}
menu["00"] = "" //today in Swedish
menu["01"] = "" //today in Finnish
menu["10"] = "" //tomorrow in Swedish
menu["11"] = "" //tomorrow in Finnish
menu["20"] = "" //day after tomorrow in Swedish
menu["21"] = "" //day after tomorrow in Finnish
var calls = 0;

async function nextStep(result) {
    uidl = JSON.parse((JSON.parse(result.body)).uidl);
    securityToken = uidl["Vaadin-Security-Key"];
    var rRaw1 = {"csrfToken":securityToken,"rpc":[["16","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":516,"clientY":953,"ctrlKey":false,"metaKey":false,"relativeX":49,"relativeY":19,"shiftKey":false,"type":1}]]],"syncId":0,"clientId":0,"wsver":"7.7.10"}
    var rBody1 = JSON.stringify(rRaw1);
    var rRaw1_fi = {"csrfToken":securityToken,"rpc":[["15","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":340,"clientY":938,"ctrlKey":false,"metaKey":false,"relativeX":29,"relativeY":11,"shiftKey":false,"type":1}]]],"syncId":1,"clientId":1}
    var rBody1_fi = JSON.stringify(rRaw1_fi);
    var rRaw2 = {"csrfToken":securityToken,"rpc":[["10","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":549,"clientY":197,"ctrlKey":false,"metaKey":false,"relativeX":30,"relativeY":18,"shiftKey":false,"type":1}]]],"syncId":2,"clientId":2};
    var rBody2 = JSON.stringify(rRaw2);
    var rRaw2_sv = {"csrfToken":securityToken,"rpc":[["16","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":516,"clientY":953,"ctrlKey":false,"metaKey":false,"relativeX":49,"relativeY":19,"shiftKey":false,"type":1}]]],"syncId":3,"clientId":3,"wsver":"7.7.10"}
    var rBody2_sv = JSON.stringify(rRaw2_sv);
    var rRaw3 = {"csrfToken":securityToken,"rpc":[["10","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":554,"clientY":191,"ctrlKey":false,"metaKey":false,"relativeX":27,"relativeY":13,"shiftKey":false,"type":1}]]],"syncId":4,"clientId":4}
    var rBody3 = JSON.stringify(rRaw3);
    var rRaw3_fi = {"csrfToken":securityToken,"rpc":[["15","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":340,"clientY":938,"ctrlKey":false,"metaKey":false,"relativeX":29,"relativeY":11,"shiftKey":false,"type":1}]]],"syncId":5,"clientId":5}
    var rBody3_fi = JSON.stringify(rRaw3_fi);
    var rRaw4 = {"csrfToken":securityToken,"rpc":[["10","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":554,"clientY":191,"ctrlKey":false,"metaKey":false,"relativeX":27,"relativeY":13,"shiftKey":false,"type":1}]]],"syncId":6,"clientId":6}
    var rBody4 = JSON.stringify(rRaw4);
    var rRaw4_sv = {"csrfToken":securityToken,"rpc":[["16","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":516,"clientY":953,"ctrlKey":false,"metaKey":false,"relativeX":49,"relativeY":19,"shiftKey":false,"type":1}]]],"syncId":7,"clientId":7,"wsver":"7.7.10"}
    var rBody4_sv = JSON.stringify(rRaw4_sv);
    var rRaw5 = {"csrfToken":securityToken,"rpc":[["10","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":554,"clientY":191,"ctrlKey":false,"metaKey":false,"relativeX":27,"relativeY":13,"shiftKey":false,"type":1}]]],"syncId":8,"clientId":8}
    var rBody5 = JSON.stringify(rRaw5)
    var rRaw5_fi = {"csrfToken":securityToken,"rpc":[["15","com.vaadin.shared.ui.button.ButtonServerRpc","click",[{"altKey":false,"button":"LEFT","clientX":357,"clientY":943,"ctrlKey":false,"metaKey":false,"relativeX":46,"relativeY":16,"shiftKey":false,"type":1}]]],"syncId":9,"clientId":9}
    var rBody5_fi = JSON.stringify(rRaw5_fi)

    await doRPCRequest(rBody1, 0, 0);
    await doRPCRequest(rBody1_fi, 0, 1)
    await doRPCRequest(rBody2, 1, 1);
    await doRPCRequest(rBody2_sv, 1, 0);
    await doRPCRequest(rBody3, 2, 0);
    await doRPCRequest(rBody3_fi, 2, 1)
    await doRPCRequest(rBody4, 3, 1)
    await doRPCRequest(rBody4_sv, 3, 0)
    await doRPCRequest(rBody5, 4, 0)
    await doRPCRequest(rBody5_fi, 4, 1)

    // if translations are missing they can be added here
    var menuTranslations = {};
    menuTranslations["Aasialainen kasvisvuoka"] = "Asiatisk grönsaksgratäng";
    menuTranslations["Jauheliha-perunasoselaatikko"] = "Potatismoslåda med köttfärs";
    menuTranslations["Ravintorasva"] = "Livsmedelsfett";
    menuTranslations["Juurespalat"] = "Rotfruktsbitar";
    menuTranslations["Sweet chili broiler"] = "Sweet chili broiler";
    menuTranslations["Uunimunakas; talon tapaan"] = "Ugnsomelett på husets vis";
    menuTranslations["Purjo-perunasosekeitto"] = "Purjo- och potatissoppa";
    menuTranslations["Levite"] = "Bredbart pålägg";
    menuTranslations["Marjarahkajälkiruoka"] = "Bärkvargsdessert";

    //some time date is identical when changing language, then pick the date from the other language
    for (var menuItem in menu) {
        // språk
        var language = menuItem.substr(menuItem.length - 1);
        var dayNr = menuItem.substr(menuItem.length - 2, 1);

        if (menu[menuItem].fDay == "") {
            if (language == "0") {
                menu[menuItem].fDay = menu[dayNr + "1"].fDay;
            } else
                menu[menuItem].fDay = menu[dayNr + "0"].fDay;
        }

        var swedishTmp = menu[menuItem].lunch_tmp.match(/<span class=\"item-name\">(.*?)<\/span>/g);
        var finnishTmp = menu[dayNr + "1"].lunch_tmp.match(/<span class=\"item-name\">(.*?)<\/span>/g);

        for (var swedishItem in swedishTmp) {
            if (swedishTmp[swedishItem] == "<span class=\"item-name\"></span>") {
                finnishItemText = finnishTmp[swedishItem].replace(/(<([^>]+)>)/ig,""); //remove html tags

                if (typeof menuTranslations[finnishItemText] != 'undefined')
                    menu[menuItem].lunch_tmp = menu[menuItem].lunch_tmp.replace("<span class=\"item-name\"></span>", "<span class=\"item-name\">" + menuTranslations[finnishItemText] + " *</span>");
                else
                    menu[menuItem].lunch_tmp = menu[menuItem].lunch_tmp.replace("<span class=\"item-name\"></span>","<span class=\"item-name\">(svenska saknas)</span>");
            }
        }
    }

    var menuContents = "<table border=0 cellpadding=5px>"
    menuContents += "<tr><td><b>" + menu["00"].fDay + "</b></td><td><b>" + menu["01"].fDay + "</b></td></tr>"
    menuContents += "<tr><td>" + menu["00"].lunch_tmp + "</td><td>" + menu["01"].lunch_tmp + "</td></tr>"
    menuContents += "<tr><td><b>" + menu["10"].fDay + "</b></td><td><b>" + menu["11"].fDay + "</b></td></tr>"
    menuContents += "<tr><td>" + menu["10"].lunch_tmp + "</td><td>" + menu["11"].lunch_tmp + "</td></tr>"
    menuContents += "<tr><td><b>" + menu["20"].fDay + "</b></td><td><b>" + menu["21"].fDay + "</b></td></tr>"
    menuContents += "<tr><td>" + menu["20"].lunch_tmp + "</td><td>" + menu["21"].lunch_tmp + "</td></tr>"
    menuContents += "<tr><td><b>" + menu["30"].fDay + "</b></td><td><b>" + menu["31"].fDay + "</b></td></tr>"
    menuContents += "<tr><td>" + menu["30"].lunch_tmp + "</td><td>" + menu["31"].lunch_tmp + "</td></tr>"
    menuContents += "<tr><td><b>" + menu["40"].fDay + "</b></td><td><b>" + menu["41"].fDay + "</b></td></tr>"
    menuContents += "<tr><td>" + menu["40"].lunch_tmp + "</td><td>" + menu["41"].lunch_tmp + "</td></tr>"
    menuContents += "</table>\n"

    menuContents += "* Översättning fanns inte i matlistan. Översattes här."

    fs.writeFile(path.resolve(__dirname, 'jamix.html'), menuContents)
}

function doRPCRequest(postContents, append, language) {
    return new Promise(function (resolve, reject) {
        request({
            method:'post',
            url:"https://www.jamix.fi/ruokalistat/UIDL/?v-uiId=0",
            referer:"https://www.jamix.fi/ruokalistat/?anro=96127&k=6&mt=2",
            headers: headersOpt,
            body: postContents,
            cookie: headersOpt["cookie"]
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (append == 0)
                    console.log(response.body)

                body = response.body.replace("for(;;);","");
                body = JSON.parse(body);

                let fDay = body[0]["state"]["5"] != null ? body[0]["state"]["5"].text : "";

                if (fDay == "")
                    fDay = body[0]["state"]["53"] != null ? body[0]["state"]["53"].text : "";

                if (append == 0) {
                   // console.log(body[0]["state"]);
                }

                let lunch_tmp = "";

                for (section in body[0]["state"]) {
                    if (typeof body[0]["state"][section] != 'undefined' && body[0]["state"][section] != null && body[0]["state"][section].caption != null && body[0]["state"][section].caption.startsWith("<span")) {
                        if (lunch_tmp.length > 0)
                            lunch_tmp += "<br/>"

                        lunch_tmp += body[0]["state"][section].caption;
                    }
                }

                if (fDay == "" && language == 1)
                    fDay = menu[append.toString() + "0"].fDay;

                menu[append.toString() + language.toString()] = {fDay, lunch_tmp}

               resolve(body);
            } else {
               reject(error);
            }
        });
    });
}

var swedish = initializePromise.then(nextStep);
