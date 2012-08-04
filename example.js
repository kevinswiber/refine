var pan = require('./');
var select = pan.select;
var order = require('./order');

extend(pan);

var customer =
select(order.entities.map(splitMap))
  .where('rel')
    .contains('http://x.io/rels/customer')
  .and('class')
    .contains('info')
.shift();

var link = 
select(customer.links.map(splitMap))
  .where('rel')
    .contains('self')
.shift();

console.log(link);

var record = { name: 'Kevin', age: 30 };

var person =
select(record)
  .where('age')
  .equals(30)

console.log(person);

function splitMap(obj) {
  if (obj.rel) {
    obj.rel = obj.rel.split(/\s/);
  }

  if (obj.class) {
    obj.class = obj.class.split(/\s/);
  }

  return obj;
}

function extend(pan) {
  pan.Filter.prototype.contains = function(val) {
    var that = this;
    var query = that.satisfies(function(obj) { return obj[that.property].indexOf(val) > -1; });

    var arr = query.run();

    return pan.querify(arr);
  };

  pan.Filter.prototype.equals = function(val) {
    var that = this;
    var query = that.satisfies(function(obj) { return obj[that.property] === val; });
    return query.run();
  };
}
