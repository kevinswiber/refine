(function() {
  (function ensureCompatibility() { 
    // Array.prototype.filter compatibility taken from:
    //    https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
    if (!Array.prototype.filter) {
      Array.prototype.filter = function(fun /*, thisp */) {
        "use strict";

        if (this == null) {
          throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != 'function') {
          throw new TypeError();
        }

        var res = [];
        var thisp = arguments[1];

        for (var i = 0; i < len; i++) {
          if (i in t) {
            var val = t[i]; // in case fun mutates this
            if (fun.call(thisp, val, i, t)) {
              res.push(val);
            }
          }
        }
      };
    }
  })();

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
    this.action = function(obj) {
      if (Object.prototype.toString.call(obj) !== '[object Array]') {
        throw new TypeError();
      }
      
      var res = obj.filter(function(item) { 
        if (predicate(item)) {
          return item;
        }
      });
      
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

  if (typeof module !== 'undefined' && typeof require !== 'undefined') {
    module.exports = Clarify;
  } else {
    window.clarify = Clarify;
  }
})();
