'use strict';

const AbstractAccessory = require('../AbstractAccessory');

/**
 * AbstractLight.
 */
class AbstractLight extends AbstractAccessory {
  /**
   * Constructor.
   */
  constructor(HBService, HBCharacteristic, client, light) {
    super(HBService, HBCharacteristic, client);

    this.cachedLight = light;
    this.lastUpdated = new Date();
  }

  get light() {
    return new Promise(resolve => {
      if (new Date() - this.lastUpdated > 1000) {
        this.client.lights.getById(this.cachedLight.id)
          .then(light => {
            this.cachedLight = light;
            this.lastUpdated = new Date();

            resolve(light);
          })
          .catch(() => {
            resolve(this.cachedLight);
          })
        ;
      } else {
        resolve(this.cachedLight);
      }
    });
  }

  get uniqueId() {
    return this.cachedLight.uniqueId;
  }

  addServices() {
    for (const service of this.services) {
      try {
        this.accessory.addService(service, this.cachedLight.name);
      } catch (err) {
        // Service already added.
      }
    }
  }

  updateAccessoryInformation() {
    this.accessory
      .getService(this.Service.AccessoryInformation)
      .updateCharacteristic(this.Characteristic.Manufacturer, this.cachedLight.manufacturer)
      .updateCharacteristic(this.Characteristic.Model, this.cachedLight.modelId)
    ;

    if (this.cachedLight.uniqueId) {
      this.accessory
        .getService(this.Service.AccessoryInformation)
        .updateCharacteristic(this.Characteristic.SerialNumber, this.cachedLight.uniqueId)
      ;
    }

    if (this.cachedLight.softwareVersion) {
      this.accessory
        .getService(this.Service.AccessoryInformation)
        .updateCharacteristic(this.Characteristic.FirmwareRevision, this.cachedLight.softwareVersion)
      ;
    }
  }
}

module.exports = AbstractLight;
