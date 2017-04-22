'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * ZLLTemperature Sensor.
 */
class ZLLTemperature extends AbstractSensor {
  get services() {
    return [
      this.Service.TemperatureSensor
    ];
  }

  updateCharacteristics() {
    this.accessory
      .getService(this.Service.TemperatureSensor)
      .updateCharacteristic(this.Characteristic.CurrentTemperature, this.cachedSensor.state.temperature)
    ;
  }

  addEventListeners() {
    this.accessory
      .getService(this.Service.TemperatureSensor)
      .getCharacteristic(this.Characteristic.CurrentTemperature)
      .on('get', callback => {
        this.sensor.then(sensor => {
          callback(null, sensor.state.temperature);
        });
      })
    ;
  }
}

module.exports = ZLLTemperature;
