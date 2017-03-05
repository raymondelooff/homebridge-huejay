'use strict';

const AbstractLight = require('../AbstractLight');
const ColorUtil = require('../../../HueUtil/ColorUtil');

/**
 * Light Model LCT007.
 */
class LCT007 extends AbstractLight {
  _addServices() {
    this.accessory
      .addService(this.Service.Lightbulb, this.cachedLight.name)
      .addOptionalCharacteristic(this.Characteristic.ColorTemperature)
    ;

    this.accessory
      .getService(this.Service.Lightbulb)
      .updateCharacteristic(this.Characteristic.On, this.cachedLight.on)
      .updateCharacteristic(this.Characteristic.Brightness, Math.round((this.cachedLight.brightness * 100) / 254))
      .updateCharacteristic(this.Characteristic.Hue, ((this.cachedLight.hue / 65535) * 360))
      .updateCharacteristic(this.Characteristic.Saturation, ((this.cachedLight.saturation * 100) / 254))
      // .updateCharacteristic(this.Characteristic.ColorTemperature, this.cachedLight.colorTemp)
    ;
  }

  _addEventListeners() {
    this.accessory
      .getService(this.Service.Lightbulb)
      .getCharacteristic(this.Characteristic.On)
      .on('get', callback => {
        this.light.then(light => {
          callback(null, light.on);
        });
      })
      .on('set', (value, callback) => {
        this.light.then(light => {
          light.on = value;

          return this.client.lights.save(light);
        })
        .then(() => {
          callback(null);
        })
        .catch(err => {
          callback(err);
        });
      })
    ;

    this.accessory
      .getService(this.Service.Lightbulb)
      .getCharacteristic(this.Characteristic.Brightness)
      .on('get', callback => {
        this.light.then(light => {
          callback(null, (light.brightness * 100) / 254);
        });
      })
      .on('set', (value, callback) => {
        this.light.then(light => {
          light.brightness = Math.round((value / 100) * 254);

          return this.client.lights.save(light);
        })
        .then(() => {
          callback(null);
        })
        .catch(err => {
          callback(err);
        });
      })
    ;

    this.accessory
      .getService(this.Service.Lightbulb)
      .getCharacteristic(this.Characteristic.Hue)
      .on('get', callback => {
        this.light.then(light => {
          const hue = (light.hue / 65535) * 360;
          const saturation = (light.saturation * 100) / 254;
          const value = (light.brightness * 100) / 254;

          console.log(this.gamut);

          const hsvColor = ColorUtil.pivotHsvColor(hue, saturation, value, this.gamut);

          callback(null, hsvColor.h);
        });
      })
      .on('set', (value, callback) => {
        this.light.then(light => {
          light.hue = Math.round(value * (65535 / 360));

          return this.client.lights.save(light);
        })
        .then(() => {
          callback(null);
        })
        .catch(err => {
          callback(err);
        });
      })
    ;

    // this.accessory
    //   .getService(this.Service.Lightbulb)
    //   .getCharacteristic(this.Characteristic.Saturation)
    //   .on('get', callback => {
    //     this.light.then(light => {
    //       const hue = (light.hue / 65535) * 360;
    //       const saturation = (light.saturation * 100) / 254;
    //       const value = (light.brightness * 100) / 254;
    //
    //       const hsvColor = ColorUtil.pivotHsvColor(hue, saturation, value, this.gamut);
    //
    //       callback(null, hsvColor.s * 100);
    //     });
    //   })
    //   .on('set', (value, callback) => {
    //     this.light.then(light => {
    //       light.saturation = Math.round((value / 100) * 254);
    //
    //       return this.client.lights.save(light);
    //     })
    //     .then(() => {
    //       callback(null);
    //     })
    //     .catch(err => {
    //       callback(err);
    //     });
    //   })
    // ;

    // this.accessory
    //   .getService(this.Service.Lightbulb)
    //   .getCharacteristic(this.Characteristic.ColorTemperature)
    //   .on('get', callback => {
    //     this.light.then(light => {
    //       callback(null, MiredUtil.miredToKelvin(light.colorTemp));
    //     });
    //   })
    //   .on('set', (value, callback) => {
    //     this.light.then(light => {
    //       light.colorTemp = value;
    //
    //       return this.client.lights.save(light);
    //     })
    //     .then(() => {
    //       callback(null);
    //     })
    //     .catch(err => {
    //       callback(err);
    //     });
    //   })
    // ;
  }
}

module.exports = LCT007;
