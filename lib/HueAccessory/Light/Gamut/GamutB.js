'use strict';

const AbstractGamut = require('./AbstractGamut');

/**
 * Gamut B.
 */
class GamutB extends AbstractGamut {
  /**
   * Constructor.
   */
  constructor() {
    super({
      r: [0.675, 0.322],
      g: [0.409, 0.518],
      b: [0.167, 0.04]
    });
  }
}

module.exports = GamutB;
