'use strict';

const AbstractGamut = require('./AbstractGamut');

/**
 * Gamut A.
 */
class GamutA extends AbstractGamut {
  /**
   * Constructor.
   */
  constructor() {
    super({
      r: [0.704, 0.296],
      g: [0.2151, 0.7106],
      b: [0.138, 0.08]
    });
  }
}

module.exports = GamutA;
