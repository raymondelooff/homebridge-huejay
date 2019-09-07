'use strict';

const AbstractLight = require('../AbstractLight');

/**
 * Generic Light.
 */
class Generic extends AbstractLight {
  get services() {
    return [
      this.Service.Lightbulb
    ];
  }

  updateCharacteristics() {
    this.accessory
      .getService(this.Service.Lightbulb)
      .updateCharacteristic(this.Characteristic.On, this.cachedLight.on)
    ;

    if (this.cachedLight.brightness !== undefined) {
      this.accessory
        .getService(this.Service.Lightbulb)
        .updateCharacteristic(this.Characteristic.Brightness, this.cachedLight.brightness)
      ;
    }
  }

  addEventListeners() {
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

    if (this.cachedLight.brightness !== undefined) {
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
    }
  }
}

module.exports = Generic;
