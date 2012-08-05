(function() {
  var state = {
    initialized: 0,
    filterProperty: 1,
    filterAction: 2,
    done: 3
  }


  /* Query
   */
  function Query(record) {
    this.record = record;
    this.filter = null;
    this._transition(state.initialized);
  }

  Query.querify = function(obj) {
    obj.record = obj;
    obj.where = Query.prototype.where;
    obj.and = Query.prototype.where;
    obj._transition = Query.prototype._transition;
    obj.run = Query.prototype.run;

    return obj;
  }

  Query.prototype.where = function(prop) {
    this._transition(state.filterProperty);

    this.filter = new Filter(this);
    this.filter.property = prop;

    return this.filter;
  };

  Query.prototype._transition = function(state) {
    //console.log('moving from %s to %s', this.state, state);
    this.state = state;
  };

  /* Filter
   */
  function Filter(query) {
    this.query = query;
    this.property = '';
    this.action = function(obj) {};
  }

  Query.prototype.run = function() {
    this._transition(state.filterAction);
    var res = this.filter.action(this.record);

    this._transition(state.done);

    return res;
  }

  Filter.prototype.satisfies = function(predicate) {
    if (typeof predicate !== 'function') {
      throw new TypeError();
    }

    this.action = function(obj) {
      var res = [];
      if (Object.prototype.toString.call(obj) === '[object Array]') {
        var len = obj.length >>> 0;

        for(var i = 0; i < len; i++) {
          if (predicate(obj[i])) {
            res.push(obj[i]);
          }
        }
      } else if (typeof obj === 'object') {
        if (predicate(obj)) {
          res.push(obj);
        }
      }

      return res;
    };

    return this.query;
  };

  Filter.prototype.contains = function(val) {
    var that = this;
    var query = that.satisfies(function(obj) { return obj[that.property].indexOf(val) > -1; });

    return Query.querify(query.run());
  };

  Filter.prototype.equals = function(val) {
    var that = this;
    var query = that.satisfies(function(obj) { return obj[that.property] == val; });

    return Query.querify(query.run());
  };

  /* Refine
   */
  function Refine() { }

  Refine.select = function(record) { 
   return new Query(record) 
  };
  
  Refine.querify = function(obj) {
    return Query.querify(obj);
  };

  Refine.Filter = Filter;
  Refine.Query = Query;

  if (typeof module !== 'undefined' && typeof require !== 'undefined') {
    module.exports = Refine;
  } else {
    window.Refine = Refine;
  }
})();
