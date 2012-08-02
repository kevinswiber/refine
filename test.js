var select = require('./select');
var order = require('./order');

extend(select);

var customers = 
  select(order.entities)
  .where()
  .rel('http://x.io/rels/customer')

if (customers && customers.length) {
  var customer = customers[0];
  var customerSelf = select(customer.links).where().rel('self');
  console.dir(customerSelf);
}

function extend(select) {
  select.Filter.prototype.rel = function(val) {
    return whitespaceListFilter.call(this, 'rel', val);
  };

  select.Filter.prototype.class = function(val) {
    return whitespaceListFilter.call(this, 'class', val);
  };
}

function whitespaceListFilter(prop, val) {
  var that = this;
  that.property = prop;
  return that.satisfies(function(obj) { return obj[that.property].split(/\s/).indexOf(val) > -1; });
};

