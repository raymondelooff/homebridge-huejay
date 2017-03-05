'use strict';

const AbstractGamut = require('./AbstractGamut');

/**
 * Unknown Gamut.
 */
class Unknown extends AbstractGamut {
  /**
   * Constructor.
   */
  constructor() {
    super({
      r: [1.0, 0.0],
      g: [0.0, 1.0],
      b: [0.0, 0.0]
    });
  }
}

module.exports = Unknown;
