process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var server = require('../server/app');
var Entry = require("../server/models/entry");

var should = chai.should();
chai.use(chaiHttp);

// describe() is used for grouping tests in a logical manner.
// it() statements contain each individual test case
describe('General Tests', function() {

  it('should show main page', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
});
