// dependencies
var parse   = require('csv-parse');
var fs      = require('fs');
var bb      = require('bluebird');

// config
var FILENAME = 'data/operations-utf8.csv';

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
    console.log(data[0][8]);
})