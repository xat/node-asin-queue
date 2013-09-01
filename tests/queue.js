var expect = require('chai').expect;
var asinQueue = require('asinQueue');
var async = require('async');

describe('queue', function() {

  var queue;

  before(function(done) {
    queue = asinQueue({
      awsId:     '',
      awsSecret: '',
      assocId:   '',
      endPoint: 'ecs.amazonaws.de',
      ResponseGroup: 'Images,Small,Offers',
      delay: 1000
    });

    done();
  });

  it('should lookup an asin', function(done) {
    queue.push('B002TVXXN4', function(err, $item) {
      expect($item.find('asin').text()).to.eq('B002TVXXN4');
      done();
    });
  });

  it('should lookup multiple asins', function(done) {

    async.parallel([
      function(cb) {
        queue.push('B002TVXXN4', function(err, $item) {
          expect($item.find('asin').text()).to.eq('B002TVXXN4');
          cb();
        });
      },
      function(cb) {
        queue.push('B002TVXXN4', function(err, $item) {
          expect($item.find('asin').text()).to.eq('B002TVXXN4');
          cb();
        });
      },
      function(cb) {
        queue.push('B0012PV0WY', function(err, $item) {
          expect($item.find('asin').text()).to.eq('B0012PV0WY');
          cb();
        });
      }
    ], function() {
      done();
    });

  });

  it('should return an error', function(done) {
    queue.push('INVALIDASIN!!', function(err, $item) {
      expect(err.message).to.be.eq('Item not found');
      done();
    });
  });

});