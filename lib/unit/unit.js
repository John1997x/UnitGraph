module.exports = (function() {

  'use strict';

  let __uniqid__ = Number.MAX_SAFE_INTEGER;

  class Unit {

    constructor(entity, properties) {

      this.entity = entity + '';
      this.__uniqid__ = (__uniqid__--).toString(16);

      this.load(properties || {});

    }

    load(properties) {

      let p = Object.create(null);

      Object.keys(properties).forEach(function(v) {

        p[v] = properties[v];

      });

      this.properties = p;

    }

    set(property, value) {

      this.properties[property] = value;

    }

    unset(property) {

      delete this.properties[property];

    }

    has(property) {

      return Object.prototype.hasOwnProperty.call(this.properties, property);

    }

    get(property) {

      return this.properties[property];

    }

    toString() {

      return [this.constructor.name, ' (', this.entity, ' ', JSON.stringify(this.properties) ,')'].join('');

    }

    valueOf() {

      return this.toString();

    }

  }

  return Unit;

})();
