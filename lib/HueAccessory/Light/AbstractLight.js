'use strict';

const AbstractAccessory = require('../AbstractAccessory');
const GamutFactory = require('./Gamut/Factory');

let MIN_COLOR_TEMPERATURE = 153;
let MAX_COLOR_TEMPERATURE = 500;

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
    this.gamut = GamutFactory.createGamut(light.colorGamut);
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

  _updateAccessoryInformation() {
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
