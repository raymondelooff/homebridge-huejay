'use strict';

const AbstractSensor = require('../AbstractSensor');

/**
 * ZLLPresence Sensor.
 */
class ZLLPresence extends AbstractSensor {
  _addServices() {
    this.accessory
      .addService(this.Service.Switch, this.cachedSensor.name)
      .updateCharacteristic(this.Characteristic.On, this.cachedSensor.config.on)
    ;

    this.accessory
      .addService(this.Service.MotionSensor, this.cachedSensor.name)
      .updateCharacteristic(this.Characteristic.MotionDetected, this.cachedSensor.state.presence)
      .updateCharacteristic(this.Characteristic.StatusActive, this.cachedSensor.config.on)
    ;
  }

  _addEventListeners() {
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

    this.accessory
      .getService(this.Service.MotionSensor)
      .getCharacteristic(this.Characteristic.MotionDetected)
      .on('get', callback => {
        this.sensor.then(sensor => {
          callback(null, sensor.state.presence);
        });
      })
    ;

    this.accessory
      .getService(this.Service.MotionSensor)
      .getCharacteristic(this.Characteristic.StatusActive)
      .on('get', callback => {
        this.sensor.then(sensor => {
          callback(null, sensor.config.on);
        });
      })
    ;
  }
}

module.exports = ZLLPresence;
