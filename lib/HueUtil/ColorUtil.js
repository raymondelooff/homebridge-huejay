const ClosestEdge = require('polyk').ClosestEdge;
const ContainsPoint = require('polyk').ContainsPoint;
const tinycolor = require('tinycolor2');

/**
 * ColorUtil.
 */
class ColorUtil {
  static sRGBToLinearColor(color) {
    return color <= 0.0031308 ? 12.92 * color : (1.055 * Math.pow(color, (1.0 / 2.4))) - 0.055;
  }

  static linearColorToSRGB(color) {
    return color > 0.04045 ? Math.pow((color + 0.055) / 1.055, 2.4) : color / 12.92;
  }

  static pivotHsvColor(hue, saturation, value, gamut) {
    const color = tinycolor({h: hue, s: saturation, v: value});
    const rgbColor = color.toRgb();

    let red = ColorUtil.sRGBToLinearColor(rgbColor.r);
    let green = ColorUtil.sRGBToLinearColor(rgbColor.g);
    let blue = ColorUtil.sRGBToLinearColor(rgbColor.b);

    // Convert to XYZ
    // https://developers.meethue.com/documentation/color-conversions-rgb-xy
    const X = (red * 0.664511) + (green * 0.154324) + (blue * 0.162028);
    const Y = (red * 0.283881) + (green * 0.668433) + (blue * 0.047685);
    const Z = (red * 0.000088) + (green * 0.072310) + (blue * 0.986039);

    let x = X / (X + Y + Z);
    let y = Y / (X + Y + Z);

    const containsPoint = new ContainsPoint([
      gamut.r[0],
      gamut.r[1],
      gamut.g[0],
      gamut.g[1],
      gamut.b[0],
      gamut.b[1]
    ], x, y);

    if (containsPoint === false) {
      const closestPoint = new ClosestEdge([
        gamut.r[0],
        gamut.r[1],
        gamut.g[0],
        gamut.g[1],
        gamut.b[0],
        gamut.b[1]
      ], x, y);

      if (closestPoint !== undefined) {
        x = closestPoint.point.x;
        y = closestPoint.point.y;
      }
    }

    return tinycolor(rgbColor).toHsv();
  }
}

module.exports = ColorUtil;
