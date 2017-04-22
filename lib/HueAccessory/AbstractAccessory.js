'use strict';

/**
 * AbstractAccessory.
 */
class AbstractAccessory {
  /**
   * Constructor.
   */
  constructor(HBService, HBCharacteristic, client) {
    this.Service = HBService;
    this.Characteristic = HBCharacteristic;
    this.client = client;
  }

  addServicesToAccessory(accessory) {
    this.accessory = accessory;

    this.updateAccessoryInformation();
    this.addServices();
    this.updateCharacteristics();
    this.addEventListeners();
  }

  updateAccessoryInformation() {
    //
  }

  addServices() {
    for (const service of this.services) {
      try {
        this.accessory.addService(service, this.accessory.name);
      } catch (err) {
        // Service already added.
      }
    }
  }

  updateCharacteristics() {
    //
  }

  addEventListeners() {
    //
  }
}

module.exports = AbstractAccessory;
