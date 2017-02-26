'use strict';

/**
 * AbstractSensor.
 */
class AbstractSensor {
  /**
   * Constructor.
   */
  constructor(HBService, HBCharacteristic, sensor) {
    this.Service = HBService;
    this.Characteristic = HBCharacteristic;
    this.sensor = sensor;
  }

  addServicesToAccessory(platformAccessory) {
    this._updateAccessoryInformation(platformAccessory);
    this._addServices(platformAccessory);
  }

  _updateAccessoryInformation(platformAccessory) {
    platformAccessory
      .getService(this.Service.AccessoryInformation)
      .updateCharacteristic(this.Characteristic.Manufacturer, this.sensor.manufacturer)
      .updateCharacteristic(this.Characteristic.Model, this.sensor.modelId)
    ;

    if (this.sensor.uniqueId) {
      platformAccessory
        .getService(this.Service.AccessoryInformation)
        .updateCharacteristic(this.Characteristic.SerialNumber, this.sensor.uniqueId)
      ;
    }

    if (this.sensor.softwareVersion) {
      platformAccessory
        .getService(this.Service.AccessoryInformation)
        .updateCharacteristic(this.Characteristic.FirmwareRevision, this.sensor.softwareVersion)
      ;
    }
  }
}

module.exports = AbstractSensor;
