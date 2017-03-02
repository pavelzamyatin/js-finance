// dependencies
var fs      = require('fs');
var bb      = require('bluebird');
var parse   = require('csv-parse');
var utf8    = require('utf8');
var w1251   = require('windows-1251');

// config
var FILENAME = 'data/operations.csv';

// add bluebird promises for all fs methods
bb.promisifyAll(fs);

fs.readFileAsync(FILENAME, 'UTF-8')
.then(data => {
    return new Promise((resolve, reject) => {
        parse(data, {delimiter: ';'}, function(err, csv) {
        if(err) {
            reject('Error', err.message)
        }
        resolve(csv);
        });
    })
}).then(data => {
    var xui = utf8.encode(data[0][8]);
    var xren = w1251.decode(xui);
    console.log(xren);
})