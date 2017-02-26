'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * ZLLTemperature Sensor.
 */
class ZLLTemperature extends AbstractSensor {
  _addServices(platformAccessory) {
    platformAccessory
      .addService(this.Service.TemperatureSensor, this.sensor.name)
      .updateCharacteristic(this.Characteristic.CurrentTemperature, this.sensor.state.temperature)
    ;
  }
}

module.exports = ZLLTemperature;
