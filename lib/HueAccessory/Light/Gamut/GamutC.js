'use strict';

const AbstractGamut = require('./AbstractGamut');

/**
 * Gamut C.
 */
class GamutC extends AbstractGamut {
  /**
   * Constructor.
   */
  constructor() {
    super({
      r: [0.692, 0.308],
      g: [0.17, 0.7],
      b: [0.153, 0.048]
    });
  }
}

module.exports = GamutC;
