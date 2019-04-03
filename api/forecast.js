const fs = require('fs');
const request = require('request');
let cheerio = require('cheerio-req');
var url = 'https://www.iltalehti.fi/saa/Suomi/Kirkkonummi/48tuntia';

cheerio(url, function (error, $) {
    fs.writeFile("/home/pi/ruuvi/api/48tuntia.html", $('div[class="weather"]').first().html(), function(err) {
    });

    //$('div[class="weather"]').each(function(i, element) {
    //    console.log($(this).html());
    //});
});

