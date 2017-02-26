'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * ZLLPresense Sensor.
 */
class ZLLPresense extends AbstractSensor {
  _addServices(platformAccessory) {
    platformAccessory
      .addService(this.Service.MotionSensor, this.sensor.name)
      .updateCharacteristic(this.Characteristic.MotionDetected, true)
    ;
  }
}

module.exports = ZLLPresense;
