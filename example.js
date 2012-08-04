var clarify = require('./');
var select = clarify.select;
var order = require('./order');

extend(clarify);

var customer =
  select(order.entities)
  .where('rel', split(/\s/))
  .contains('http://x.io/rels/customer')
  .shift();

var link = 
  select(customer.links)
  .where('rel', split(/\s/))
  .contains('self')
  .shift();

console.log(link);

function split(delimiter) {
  return function(s) { return s.split(delimiter); };
}

function extend(clarify) {
  clarify.Filter.prototype.contains = function(val) {
    var that = this;
    var query = that.satisfies(function(obj) { return obj[that.property].indexOf(val) > -1; });
    return query.run();
  };

  clarify.Filter.prototype.equals = function(val) {
    var that = this;
    var query = that.satisfies(function(obj) { return obj[that.property] === val; });
    return query.run();
  };
}
