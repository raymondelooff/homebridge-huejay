/**
 * MiredUtil.
 */
class MiredUtil {
  static kelvinToMired(kelvin, min = 153, max = 500) {
    return Math.max(min, Math.min(Math.round(1000000 / kelvin), max));
  }

  static miredToKelvin(mired) {
    return Math.round(1000000 / mired);
  }
}

module.exports = MiredUtil;
