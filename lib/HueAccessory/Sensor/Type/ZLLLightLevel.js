'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * ZLLLightLevel Sensor.
 */
class ZLLLightLevel extends AbstractSensor {
  get services() {
    return [
      this.Service.LightSensor
    ];
  }

  updateCharacteristics() {
    this.accessory
      .getService(this.Service.LightSensor)
      .updateCharacteristic(this.Characteristic.CurrentAmbientLightLevel, this.cachedSensor.state.lightLevel)
      .updateCharacteristic(this.Characteristic.StatusActive, this.cachedSensor.config.on)
    ;

    this.accessory
      .getService(this.Service.LightSensor)
      .getCharacteristic(this.Characteristic.CurrentAmbientLightLevel)
      .setProps({
        minValue: 0
      })
    ;
  }

  addEventListeners() {
    this.accessory
      .getService(this.Service.LightSensor)
      .getCharacteristic(this.Characteristic.CurrentAmbientLightLevel)
      .on('get', callback => {
        this.sensor.then(sensor => {
          callback(null, sensor.state.lightLevel);
        });
      })
    ;

    this.accessory
      .getService(this.Service.LightSensor)
      .getCharacteristic(this.Characteristic.StatusActive)
      .on('get', callback => {
        this.sensor.then(sensor => {
          callback(null, sensor.config.on);
        });
      })
    ;
  }
}

module.exports = ZLLLightLevel;
