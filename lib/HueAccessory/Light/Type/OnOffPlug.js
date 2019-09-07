'use strict';

const AbstractLight = require('../AbstractLight');

/**
 * On/Off plug-in unit.
 */
class OnOffPlug extends AbstractLight {
  get services() {
    return [
      this.Service.Switch
    ];
  }

  updateCharacteristics() {
    this.accessory
      .getService(this.Service.Switch)
      .updateCharacteristic(this.Characteristic.On, this.cachedLight.on)
    ;
  }

  addEventListeners() {
    this.accessory
      .getService(this.Service.Switch)
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
  }
}

module.exports = OnOffPlug;
