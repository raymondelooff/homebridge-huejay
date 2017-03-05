const DEFAULT_GAMUT_RED = [1.0, 0.0];
const DEFAULT_GAMUT_GREEN = [0.0, 1.0];
const DEFAULT_GAMUT_BLUE = [0.0, 0.0];

/**
 * AbstractGamut.
 */
class AbstractGamut {
  /**
   * Constructor.
   */
  constructor(gamut) {
    this.r = Object.assign({}, DEFAULT_GAMUT_RED, gamut.r);
    this.g = Object.assign({}, DEFAULT_GAMUT_GREEN, gamut.g);
    this.b = Object.assign({}, DEFAULT_GAMUT_BLUE, gamut.b);
  }
}

module.exports = AbstractGamut;
