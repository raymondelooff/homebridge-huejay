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
    //
  }

  updateCharacteristics() {
    //
  }

  addEventListeners() {
    //
  }
}

module.exports = AbstractAccessory;
