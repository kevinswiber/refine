var select = require('./').select;
var order = require('./order');

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
