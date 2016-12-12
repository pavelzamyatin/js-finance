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
describe('General Tests: ', function() {

  it('should show main page', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
});

describe('API Tests: ', function() {

  // drop TEST collection
  Entry.collection.drop();

  beforeEach(function(done){
    var newEntry = new Entry({
      user      : "corw",
      date      : new Date(),
      sum       : 100.10,
      category  : ["shop", "cafe"],
      comment   : "New nice entry specially for testing reasons"
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
        res.body.should.be.a('Object');

        res.body.should.have.property('STATUS');
        res.body.should.have.property('ERROR');
        res.body.should.have.property('ITEMS');

        res.body.STATUS.should.equal('SUCCESS');
        res.body.ERROR.should.equal('');
        res.body.ITEMS.should.be.a('Array');

        res.body.ITEMS[0].should.have.property('user');
        res.body.ITEMS[0].should.have.property('date');
        res.body.ITEMS[0].should.have.property('sum');
        res.body.ITEMS[0].should.have.property('category');
        res.body.ITEMS[0].should.have.property('comment');

        res.body.ITEMS[0].user.should.equal('corw');
        res.body.ITEMS[0].sum.should.equal(100.1);
        res.body.ITEMS[0].comment.should.equal('New nice entry specially for testing reasons')
        done();
      });
  });

  it('should get entry by ID on /api/entry/:id GET', function(done) {
    // grabbing all entries to show the first element
    chai.request(server)
      .get('/api/entries')
      .end(function(err, get_res) {
        chai.request(server)
          .get('/api/entry/' + get_res.body.ITEMS[0]._id)
          .end(function(error, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('Object');

            res.body.should.have.property('STATUS');
            res.body.should.have.property('ERROR');
            res.body.should.have.property('ITEMS');

            res.body.STATUS.should.equal('SUCCESS');
            res.body.ERROR.should.equal('');
            res.body.ITEMS.should.be.a('Array');

            res.body.ITEMS[0].should.have.property('user');
            res.body.ITEMS[0].should.have.property('date');
            res.body.ITEMS[0].should.have.property('sum');
            res.body.ITEMS[0].should.have.property('category');
            res.body.ITEMS[0].should.have.property('comment');

            res.body.ITEMS[0]._id.should.equal(get_res.body.ITEMS[0]._id);
            res.body.ITEMS[0].user.should.equal('corw');
            res.body.ITEMS[0].sum.should.equal(100.1);
            res.body.ITEMS[0].comment.should.equal('New nice entry specially for testing reasons')
            done();
          });
      });
  });

  it('should post a new entry on /api/entries POST', function(done) {
    chai.request(server)
      .post('/api/entries')
      .send({
        user      : "test",
        date      : new Date(),
        sum       : 99.99,
        category  : "Home",
        comment   : "POST request simple test"
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('Object');

        res.body.should.have.property('STATUS');
        res.body.should.have.property('ERROR');
        res.body.should.have.property('ITEMS');

        res.body.STATUS.should.equal('SUCCESS');
        res.body.ERROR.should.equal('');
        res.body.ITEMS.should.be.a('Array');

        res.body.ITEMS[0].should.have.property('_id');
        res.body.ITEMS[0].should.have.property('user');
        res.body.ITEMS[0].should.have.property('date');
        res.body.ITEMS[0].should.have.property('sum');
        res.body.ITEMS[0].should.have.property('category');
        res.body.ITEMS[0].should.have.property('comment');

        res.body.ITEMS[0].user.should.equal('test');
        res.body.ITEMS[0].sum.should.equal(99.99);
        res.body.ITEMS[0].comment.should.equal('POST request simple test');

        done();
      });
  });

  it('should change an entry on /api/entry/:id PUT', function(done) {
    // grabbing all entries to show the first element
    chai.request(server)
      .get('/api/entries')
      .end(function(err, get_res) {
        chai.request(server)
          .put('/api/entry/' + get_res.body.ITEMS[0]._id)
          .send({
            date      : new Date(),
            sum       : 200.20,
            category  : "Gardening",
            comment   : "PUT request simple test passed"
          })
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('Object');

            res.body.should.have.property('STATUS');
            res.body.should.have.property('ERROR');
            res.body.should.have.property('ITEMS');

            res.body.STATUS.should.equal('SUCCESS');
            res.body.ERROR.should.equal('');
            res.body.ITEMS.should.be.a('Array');

            res.body.ITEMS[0].should.have.property('_id');
            res.body.ITEMS[0].should.have.property('user');
            res.body.ITEMS[0].should.have.property('date');
            res.body.ITEMS[0].should.have.property('sum');
            res.body.ITEMS[0].should.have.property('category');
            res.body.ITEMS[0].should.have.property('comment');

            res.body.ITEMS[0]._id.should.equal(get_res.body.ITEMS[0]._id);
            res.body.ITEMS[0].sum.should.equal(200.20);
            res.body.ITEMS[0].category.should.equal('Gardening');
            res.body.ITEMS[0].comment.should.equal('PUT request simple test passed');

            done();
          });
      });
  });

  it('should delete a SINGLE entry on /entry/<id> DELETE', function(done) {
    // grabbing all entries to delere first element
    chai.request(server)
      .get('/api/entries')
      .end(function(err, get_res) {
        // removing first element of the table
        chai.request(server)
          .delete('/api/entry/' + get_res.body.ITEMS[0]._id)
          .end(function(error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('Object');

            res.body.should.have.property('STATUS');
            res.body.should.have.property('ERROR');
            res.body.should.have.property('ITEMS');

            res.body.STATUS.should.equal('SUCCESS');
            res.body.ERROR.should.equal('');
            res.body.ITEMS.should.be.a('Array');

            res.body.ITEMS[0].should.have.property('_id');
            res.body.ITEMS[0]._id.should.equal(get_res.body.ITEMS[0]._id);

            done();
          });
      });
  });

});
