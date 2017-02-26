'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * ZLLLightLevel Sensor.
 */
class ZLLLightLevel extends AbstractSensor {
  _addServices(platformAccessory) {
    platformAccessory
      .addService(this.Service.LightSensor, this.sensor.name)
      .updateCharacteristic(this.Characteristic.CurrentAmbientLightLevel, this.sensor.state.lightLevel)
    ;
  }
}

module.exports = ZLLLightLevel;
