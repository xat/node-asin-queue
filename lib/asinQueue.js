var async = require('async');
var OperationHelper = require('apac').OperationHelper;
var cheerio = require('cheerio');
var _ = require('underscore');

module.exports = function(options) {

  var apacHelper = new OperationHelper({
    awsId:     options.awsId,
    awsSecret: options.awsSecret,
    assocId:   options.assocId,
    endPoint:  options.endPoint
  });

  var queue = async.cargo(function(items, cb) {
    var asins = _.pluck(items, 'asin');
    var opts = {
      'ItemLookup.Shared.ItemType': 'ASIN',
      'ItemLookup.Shared.ResponseGroup': options.ResponseGroup,
      'ItemLookup.1.ItemId': asins.slice(0, 10).join(',')
    };

    if (items.length > 10) {
      opts['ItemLookup.2.ItemId'] = asins.slice(10, 20).join(',');
    }

    apacHelper.execute('ItemLookup', opts, function(err, response, body) {
      var $ = cheerio.load(body);

      $('item').each(function() {
        var $this = $(this);
        var asin = $this.find('asin').text();
        _.chain(items)
          .filter(function(item) { return (item.asin == asin && !item.processed) && (item.processed=true) })
          .invoke('cb', null, $this, $, response);
      });

      _.chain(items)
        .filter(function(item) { return !item.processed })
        .invoke('cb', new Error('Item not found'), null, $, response);

      setTimeout(cb, options.delay || 1000);
    });

  }, options.payload || 20);

  queue._push = queue.push;

  queue.push = function(asin, cb) {
    queue._push({
      asin: asin,
      cb: cb
    });
  };

  return queue;
};