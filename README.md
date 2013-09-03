# node-asin-queue

Lookup multiple Amazon ASINs within a queue.
This module allows to lookup up to 20 ASINs in one second
without exceeding the 1-request-per-second rule from the
Amazon Product API.

## Usage

```javascript
var asinQueue = require('asin-queue');

var queue = asinQueue({
    awsId:     '[YOUR AWS ID HERE]',
    awsSecret: '[YOUR AWS SECRET HERE]',
    assocId:   '[YOUR ASSOCIATE TAG HERE]',
    endPoint:  'ecs.amazonaws.com',
    ResponseGroup: 'Images,Small,Offers'
});

queue.push('B0012PV0WY', function(err, $item) {

    console.log($item.find('asin').text());

});

```