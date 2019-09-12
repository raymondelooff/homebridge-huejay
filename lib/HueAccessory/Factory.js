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
    accessory.context.cached = false;
    accessory.context.generic = false;

    return accessory;
  }

  addLightServicesToAccessory(accessory, hueClient, hueLight) {
    let Light = null;

    try {
      switch (hueLight.type) {
        case 'On/Off plug-in unit':
            Light = require(`./Light/Type/OnOffPlug`);
            break;

        default:
          Light = require(`./Light/Type/${hueLight.type}`);
          break;
      }
    } catch (err) {
      Light = require(`./Light/Type/Generic`);
      accessory.context.generic = true;
    }

    const sensorAccessory = new Light(Service, Characteristic, hueClient, hueLight);
    sensorAccessory.addServicesToAccessory(accessory);

    return accessory;
  }

  addSensorServicesToAccessory(accessory, hueClient, hueSensor) {
    let Sensor = null;

    try {
      Sensor = require(`./Sensor/Type/${hueSensor.type}`);
    } catch (err) {
      Sensor = require(`./Sensor/Type/Generic`);
      accessory.context.generic = true;
    }

    const sensorAccessory = new Sensor(Service, Characteristic, hueClient, hueSensor);
    sensorAccessory.addServicesToAccessory(accessory);

    return accessory;
  }
}

module.exports = Factory;
