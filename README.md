# clarify

Clarify is a lightweight, extensible object query tool for JavaScript.

Clarify offers:

* A fluent, easy-to-read API
* Custom-defined filters
* Simplicity

## Example

```javascript
var select = require('clarify').select;
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
```

## Installation

```bash
$ npm install clarify
```

## Usage

### clarify.select(collection)

```select``` takes an array as the ```collection``` parameter and returns a ```Query``` object for chaining.

### Query#where(property, [transformation])
```Query#where``` creates a ```Filter``` object, with ```property``` as the property name to use when running a filter on the query.  The optional ```transformation``` parameter is a function that takes a single parameter.  This parameter is the value of the ```property```.  The transformation takes place prior to executing the filter action.  This method returns the newly created ```Filter``` object.


### Filter#equals(val)

Executes an equality comparison filter using the provided ```val``` string.  Returns an Array.

### Filter#contains(val)

Executes a contains filter using the provided ```val``` string.  Returns an Array.

## Custom Filters

Custom filters can be assigned using ```clarify.Filter.prototype```.

Define ```this.action``` inside the filter to generate the filtered array.

Example of a custom filter:

```javascript
var clarify = require('clarify');

clarify.Filter.prototype.isInformational = function() {
  this.action = function(collection) {
    return collection.filter(function(item) {
      if (item.class && item.class.indexOf('info') > -1) {
        return item;
      }
    });
  };

  return this.run();
};
```

Custom filter in action:

```javascript
var select = require('clarify').select;

var informational = 
  select(order.entities)
  .where()
  .isInformational();

console.log(informational);

```


## License

MIT/X11