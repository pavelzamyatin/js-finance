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

describe('API Tests', function() {

  // drop TEST collection
  Entry.collection.drop();

  beforeEach(function(done){
    var newEntry = new Entry({
      user      : "corw",
      date      : new Date(),
      sum       : 100.10,
      category  : ["shop", "cafe"],
      comment   : "New nice entry"
    });

    newEntry.save(function(err) {
      done();
    });
  });

  afterEach(function(done){
    Entry.collection.drop();
    done();
  });

  it('should list ALL entries on /api/entries GET', function(done) {
    chai.request(server)
      .get('/api/entries')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');

        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('user');
        res.body[0].should.have.property('date');
        res.body[0].should.have.property('sum');
        res.body[0].should.have.property('category');
        res.body[0].should.have.property('comment');

        res.body[0].user.should.equal('corw');
        res.body[0].sum.should.equal(100.1);
        res.body[0].comment.should.equal('New nice entry')
        done();
      });
  });

  it('show post a new entry on /api/entries POST', function(done) {
    chai.request(server)
      .post('/api/entries')
      .send({
        user      : "test user",
        date      : new Date(),
        sum       : 99.99,
        category  : ["nice", "shot"],
        comment   : "Post request simple test"
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('Object');

        res.body.SUCCESS.should.have.property('_id');
        res.body.SUCCESS.should.have.property('user');
        res.body.SUCCESS.should.have.property('date');
        res.body.SUCCESS.should.have.property('sum');
        res.body.SUCCESS.should.have.property('category');
        res.body.SUCCESS.should.have.property('comment');

        res.body.SUCCESS.user.should.equal('test user');
        res.body.SUCCESS.sum.should.equal(99.99);
        res.body.SUCCESS.comment.should.equal('Post request simple test');

        done();
      });
  });


});
