'use strict';

/**
 * Factory for Gamut.
 */
class Factory {
  static createGamut(colorGamut) {
    let Gamut = null;

    try {
      Gamut = require(`./Gamut${colorGamut}`);
    } catch (err) {
      Gamut = require('./Unknown');
    }

    return new Gamut();
  }
}

module.exports = Factory;
