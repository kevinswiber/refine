(function() {
  var state = {
    initialized: 0,
    filterProperty: 1,
    propertyTransformation: 2,
    filterAction: 3,
    done: 4
  }

  /* Query
   */
  function Query(record) {
    if (Object.prototype.toString.call(record) !== '[object Array]') {
      throw new TypeError();
    }

    this.record = record;
    this.filter = null;
    this._transition(state.initialized);
  }

  Query.prototype.where = function(prop, transformation) {
    this._transition(state.filterProperty);

    this.filter = new Filter(this);
    this.filter.property = prop;

    if (transformation) {
      this.filter.transformation = transformation;
    }

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
    this.transformation = function(obj) {};
    this.action = function(obj) {};
  }

  Query.prototype.run = function() {
    var record = this.record;

    if (this.filter.transformation) {
      this._transition(state.propertyTransformation);
      record = record.map(this.filter._applyTransformation);
    }

    this._transition(state.filterAction);
    var res = this.filter.action(record);

    this._transition(state.done);

    return res;
  }

  Filter.prototype.satisfies = function(predicate) {
    if (typeof predicate !== 'function') {
      throw new TypeError();
    }

    this.action = function(obj) {
      var res = [];
      var len = obj.length >>> 0;

      for(var i = 0; i < len; i++) {
        if (predicate(obj[i])) {
          res.push(obj[i]);
        }
      }

      return res;
    };

    return this.query;
  };

  Filter.prototype._applyTransformation = function(item) {
    if (this.property in item && item[this.property] && this.transformation) {
      item[this.property] = this.transformation(item[this.property]);
    }

    return item;
  };

  /* Clarify
   */
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
