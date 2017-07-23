'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * ZLLTemperature Sensor.
 */
class ZLLTemperature extends AbstractSensor {
  get services() {
    return [
      this.Service.TemperatureSensor,
      this.Service.BatteryService
    ];
  }

  updateCharacteristics() {
    this.accessory
      .getService(this.Service.TemperatureSensor)
      .updateCharacteristic(this.Characteristic.CurrentTemperature, this.cachedSensor.state.temperature)
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
      .getService(this.Service.TemperatureSensor)
      .getCharacteristic(this.Characteristic.CurrentTemperature)
      .on('get', callback => {
        this.sensor.then(sensor => {
          callback(null, sensor.state.temperature);
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

module.exports = ZLLTemperature;
