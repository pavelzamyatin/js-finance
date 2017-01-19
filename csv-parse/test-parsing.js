// dependencies
var parse   = require('csv-parse');
var fs      = require('fs');
var bb      = require('bluebird');
var win1251 = require('windows-1251');

// config
var FILENAME = '../tmp/operations Sun Jan 01 00_00_00 MSK 2017-Thu Jan 19 00_47_30 MSK 2017.csv'

// add bluebird promises for all fs methods
bb.promisifyAll(fs);

fs.readFileAsync(FILENAME, 'utf-8')
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
    console.log(data[0]);
})