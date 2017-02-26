'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * ZLLPresense Sensor.
 */
class ZLLPresense extends AbstractSensor {
  _addServices(platformAccessory) {
    platformAccessory
      .addService(this.Service.Switch, this.sensor.name)
      .updateCharacteristic(this.Characteristic.On, this.sensor.config.on)
    ;

    platformAccessory
      .addService(this.Service.MotionSensor, this.sensor.name)
      .updateCharacteristic(this.Characteristic.MotionDetected, this.sensor.state.presense)
      .updateCharacteristic(this.Characteristic.StatusActive, this.sensor.config.on)
    ;
  }
}

module.exports = ZLLPresense;
