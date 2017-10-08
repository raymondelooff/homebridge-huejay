'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * ZLLLightLevel Sensor.
 */
class ZLLLightLevel extends AbstractSensor {
  get services() {
    return [
      this.Service.LightSensor,
      this.Service.BatteryService
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

    this.accessory
      .getService(this.Service.BatteryService)
      .updateCharacteristic(this.Characteristic.BatteryLevel, this.cachedSensor.config.battery)
      .updateCharacteristic(this.Characteristic.ChargingState, this.Characteristic.ChargingState.NOT_CHARGEABLE)
      .updateCharacteristic(this.Characteristic.StatusLowBattery, this.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL)
    ;
  }

  addEventListeners() {
    this.accessory
      .getService(this.Service.LightSensor)
      .getCharacteristic(this.Characteristic.CurrentAmbientLightLevel)
      .on('get', callback => {
        this.sensor.then(sensor => {
          callback(null, Math.pow(10, (sensor.state.lightLevel - 1) / 10000));
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

    this.accessory
      .getService(this.Service.BatteryService)
      .getCharacteristic(this.Characteristic.BatteryLevel)
      .on('get', callback => {
        this.sensor.then(sensor => {
          callback(null, sensor.config.battery);
        });
      })
    ;
  }
}

module.exports = ZLLLightLevel;
