# refine

Refine is a lightweight, extensible object query tool for JavaScript.

Refine offers:

* A fluent, easy-to-read API
* Custom-defined filters
* Simplicity

## Example

```javascript
var refine = require('refine');
var select = refine.select;
var order = require('./order');

var entities = order.entities.map(function(entity) {
  entity.rel = entity.rel.split(/\s/);
  entity.class = entity.class.split(/\s/);
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
// { customerId: 'pj123', name: 'Peter Joseph' }
```

## Installation

```bash
$ npm install refine
```

## Usage

### refine.select(collection)

```select``` takes an array as the ```collection``` parameter and returns a ```Query``` object for chaining.

### Query#where(property)
```Query#where``` creates a ```Filter``` object, with ```property``` as the property name to use when running a filter on the query. This method returns the newly created ```Filter``` object.


### Filter#equals(val)

Executes an equality comparison filter using the provided ```val``` string.  Returns an Array.

### Filter#contains(val)

Executes a contains filter using the provided ```val``` string.  Returns an Array.

## Custom Filters

Custom filters can be assigned using ```refine.Filter.prototype```.

Define ```this.action``` inside the filter to generate the filtered array.

Example of a custom filter:

```javascript
var refine = require('refine');

refine.Filter.prototype.isInformational = function() {
  this.action = function(collection) {
    return collection.filter(function(item) {
      if (item.class && item.class.indexOf('info') > -1) {
        return item;
      }
    });
  };

  return refine.Query.querify(this.query.run());
};
```

Custom filter in action:

```javascript
var select = require('refine').select;

var informational = 
  select(order.entities)
  .where()
  .isInformational()
  .shift();

console.log(informational);

/*
{ class: 'info customer',
  rel: 'http://x.io/rels/customer',
  properties: 
   { customerId: 'pj123',
     name: 'Peter Joseph' },
  links: 
   [ { rel: 'self',
       href: 'http://api.x.io/customers/pj123' } ] }
*/

```


## License

MIT/X11