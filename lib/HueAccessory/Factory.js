'use strict';

const HueError = require('../HueError');

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

  createAccessory(hueClient, hueAccessory) {
    const uuid = UUIDGen.generate(hueAccessory.uniqueId);
    const accessory = new Accessory(hueAccessory.name, uuid);
    accessory.context.uniqueId = hueAccessory.uniqueId;

    return accessory;
  }

  addSensorServicesToAccessory(accessory, hueClient, hueSensor) {
    let Sensor = null;

    try {
      Sensor = require(`./Sensor/Type/${hueSensor.type}`);
    } catch (err) {
      throw new HueError(`Sensor type '${hueSensor.type}' is not supported (yet)!`);
    }

    const sensorAccessory = new Sensor(Service, Characteristic, hueClient, hueSensor);
    sensorAccessory.addServicesToAccessory(accessory);

    return accessory;
  }
}

module.exports = Factory;
