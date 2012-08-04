var pan = require('./');
var select = pan.select;
var order = require('./order');

var entities = order.entities.map(function(entity) {
  entity.rel = entity.rel.split(/\s/);
  return entity;
});

var customerInfo = 
select(entities)
  .where('rel')
    .contains('http://x.io/rels/customer')
  .and('class')
    .contains('info')
.map(function(customer) {
  return customer.properties;
})
.shift();

console.log(customerInfo);
