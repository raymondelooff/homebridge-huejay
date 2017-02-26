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

  createAccessoryFromSensor(hueClient, hueSensor) {
    if (hueSensor.uniqueId === undefined) {
      return;
    }

    let Sensor = null;

    try {
      Sensor = require(`./Sensor/Type/${hueSensor.type}`);
    } catch (err) {
      this.log.debug(`Sensor type '${hueSensor.type}' is not supported (yet)!`);
      return;
    }

    const uuid = UUIDGen.generate(hueSensor.uniqueId);
    const accessory = new Accessory(hueSensor.name, uuid);

    const sensorAccessory = new Sensor(Service, Characteristic, hueClient, hueSensor);
    sensorAccessory.addServicesToAccessory(accessory);

    return accessory;
  }
}

module.exports = Factory;
