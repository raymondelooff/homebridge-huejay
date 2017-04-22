'use strict';

const AbstractAccessory = require('../AbstractAccessory');

/**
 * AbstractSensor.
 */
class AbstractSensor extends AbstractAccessory {
  /**
   * Constructor.
   */
  constructor(HBService, HBCharacteristic, client, sensor) {
    super(HBService, HBCharacteristic, client);

    this.cachedSensor = sensor;
    this.lastUpdated = new Date();
  }

  get sensor() {
    return new Promise(resolve => {
      if (new Date() - this.lastUpdated > 1000) {
        this.client.sensors.getById(this.cachedSensor.id)
          .then(sensor => {
            this.cachedSensor = sensor;
            this.lastUpdated = new Date();

            resolve(sensor);
          })
          .catch(() => {
            resolve(this.cachedSensor);
          })
        ;
      } else {
        resolve(this.cachedSensor);
      }
    });
  }

  get uniqueId() {
    return this.cachedSensor.uniqueId;
  }

  addServices() {
    for (const service of this.services) {
      try {
        this.accessory.addService(service, this.cachedSensor.name);
      } catch (err) {
        // Service already added.
      }
    }
  }

  updateAccessoryInformation() {
    this.accessory
      .getService(this.Service.AccessoryInformation)
      .updateCharacteristic(this.Characteristic.Manufacturer, this.cachedSensor.manufacturer)
      .updateCharacteristic(this.Characteristic.Model, this.cachedSensor.modelId)
    ;

    if (this.cachedSensor.uniqueId) {
      this.accessory
        .getService(this.Service.AccessoryInformation)
        .updateCharacteristic(this.Characteristic.SerialNumber, this.cachedSensor.uniqueId)
      ;
    }

    if (this.cachedSensor.softwareVersion) {
      this.accessory
        .getService(this.Service.AccessoryInformation)
        .updateCharacteristic(this.Characteristic.FirmwareRevision, this.cachedSensor.softwareVersion)
      ;
    }
  }
}

module.exports = AbstractSensor;
