'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * Generic Sensor.
 */
class Unknown extends AbstractSensor {
  get services() {
    return [
      this.Service.Switch
    ];
  }

  updateCharacteristics() {
    this.accessory
      .getService(this.Service.Switch)
      .updateCharacteristic(this.Characteristic.On, this.cachedSensor.on)
    ;
  }

  addEventListeners() {
    this.accessory
      .getService(this.Service.Switch)
      .getCharacteristic(this.Characteristic.On)
      .on('get', callback => {
        this.sensor.then(sensor => {
          callback(null, sensor.config.on);
        });
      })
      .on('set', (value, callback) => {
        this.sensor.then(sensor => {
          sensor.config.on = value;

          return this.client.sensors.save(sensor);
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

module.exports = Unknown;
