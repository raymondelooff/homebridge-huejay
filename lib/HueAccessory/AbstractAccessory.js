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

    this._updateAccessoryInformation();
    this._addServices();
    this._addEventListeners();
  }

  _updateAccessoryInformation() {
    //
  }

  _addServices() {
    //
  }

  _addEventListeners() {
    //
  }
}

module.exports = AbstractAccessory;
