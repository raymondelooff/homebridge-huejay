'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * ZLLTemperature Sensor.
 */
class ZLLTemperature extends AbstractSensor {
  _addServices() {
    this.accessory
      .addService(this.Service.TemperatureSensor, this.cachedSensor.name)
      .updateCharacteristic(this.Characteristic.CurrentTemperature, this.cachedSensor.state.temperature)
    ;
  }

  _addEventListeners() {
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
