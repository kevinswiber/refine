function Query(record) {
  this.record = record;
  this.filter = null;
  this.state = state.initialized;
}

Query.prototype.where = function(prop) {
  this.state = state.filterProperty;
  this.filter = new Filter(this);
  this.filter.property = prop;

  return this.filter;
};

function Filter(query) {
  this.query = query;
  this.property = '';
  this.action = function(obj) {};
}

Filter.prototype.satisfies = function(predicate) {
  var that = this;

  this.action = function(obj) {
    var res = [];

    if (Object.prototype.toString.call(obj) === '[object Array]') {
      for(var i = 0; i < obj.length; i++) {
        if (predicate(obj[i])) {
          res.push(obj[i]);
        }
      }
    }

    return res;
  };

  this.query.state = state.filterAction;

  var res = this.action(this.query.record);
  this.state = state.done;

  return res;
};

Filter.prototype.contains = function(val) {
  var that = this;
  return that.satisfies(function(obj) { return obj[that.property].indexOf(val) > -1; });
};

Filter.prototype.equals = function(val) {
  var that = this;
  return that.satisfies(function(obj) { return obj[that.property] === val; });
};

var state = {
  initialized: 0,
  filterProperty: 1,
  filterAction: 2,
  done: 3
}

function Clarify() { }

Clarify.select = function(record) { 
 return new Query(record) 
};

Clarify.Filter = Filter;
Clarify.Query = Query;

module.exports = Clarify;
