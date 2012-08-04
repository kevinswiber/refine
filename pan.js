(function() {
  var state = {
    initialized: 0,
    filterProperty: 1,
    propertyTransformation: 2,
    filterAction: 3,
    done: 4
  }

  function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      var out = [], i = 0, len = obj.length;
      
      for ( ; i < len; i++ ) {
        out[i] = arguments.callee(obj[i]);
      }
      
      return out;
    }

    if (typeof obj === 'object') {
      var out = {}, i;
      for ( i in obj ) {
        out[i] = arguments.callee(obj[i]);
      }

      return out;
    }

    return obj;
  }

  /* Query
   */
  function Query(record) {
    /*if (Object.prototype.toString.call(record) !== '[object Array]') {
      throw new TypeError();
    }*/

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
    var actionRecord;

    if (this.filter.transformation) {
      this._transition(state.propertyTransformation);

      if (Object.prototype.toString.call(record) === '[object Array]') {
        actionRecord = record.map(this.filter._applyTransformation);
      } else {
        var recordCopy = deepCopy(record);
        actionRecord = this.filter._applyTransformation(recordCopy);
      }
    }

    this._transition(state.filterAction);
    var res = this.filter.action(actionRecord);

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
      } else {
        if (predicate(obj)) {
          res.push(obj);
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

  /* Pan
   */
  function Pan() { }

  Pan.select = function(record) { 
   return new Query(record) 
  };
  
  Pan.querify = function(obj) {
    obj.record = obj;
    obj.where = Query.prototype.where;
    obj.and = Query.prototype.where;
    obj._transition = Query.prototype._transition;
    obj.run = Query.prototype.run;

    return obj;
  };

  Pan.Filter = Filter;
  Pan.Query = Query;

  if (typeof module !== 'undefined' && typeof require !== 'undefined') {
    module.exports = Pan;
  } else {
    window.pan = Pan;
  }
})();
