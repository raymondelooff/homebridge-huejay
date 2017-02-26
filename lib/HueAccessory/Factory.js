'use strict';

let Accessory;
let Service;
let Characteristic;
let UUIDGen;

/**
 * Factory for Accessories.
 */
class Factory {
  /**
   * Constructor.
   */
  constructor(HBAccessory, HBService, HBCharacteristic, HBUUIDGen, log) {
    Accessory = HBAccessory;
    Service = HBService;
    Characteristic = HBCharacteristic;
    UUIDGen = HBUUIDGen;

    this.log = log;
  }

  createAccessoryFromSensor(hueSensor) {
    let SensorType = null;

    try {
      SensorType = require(`./Sensor/Type/${hueSensor.type}`);
    } catch (err) {
      this.log.debug(`Sensor type '${hueSensor.type}' not supported (yet)!`);

      return;
    }

    if (hueSensor.uniqueId === undefined) {
      return;
    }

    const uuid = UUIDGen.generate(hueSensor.uniqueId);
    const accessory = new Accessory(hueSensor.name, uuid);

    const sensor = new SensorType(Service, Characteristic, hueSensor);
    sensor.addServicesToAccessory(accessory);

    return accessory;
  }
}

module.exports = Factory;
