'use strict';

const inherits = require('util').inherits;
const HuePlatform = require('./lib/HuePlatform');

let Accessory;
let Service;
let Characteristic;
let UUIDGen;

module.exports = function (homebridge) {
  Accessory = homebridge.platformAccessory;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

  homebridge.registerPlatform(HuePlatform.pluginName, HuePlatform.platformName, Platform, false);
};

function Platform(log, config, api) {
  this.log = log;
  this.api = api;
  this.platform = new HuePlatform.HuePlatform(Accessory, Service, Characteristic, UUIDGen, log, config, api);

  Characteristic.ColorTemperature = function () {
    Characteristic.call(this, 'Color Temperature', 'E887EF67-509A-552D-A138-3DA215050F46');
    this.setProps({
      format: Characteristic.Formats.INT,
      minValue: 153,
      maxValue: 500,
      minStep: 1,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };

  inherits(Characteristic.ColorTemperature, Characteristic);
}

Platform.prototype.configureAccessory = function (accessory) {
  this.log.info(`Configuring accessory '${accessory.displayName}'...`);

  this.platform.configureAccessory(accessory);
};

Platform.prototype.configurationRequestHandler = function (context, request, callback) {
  this.log.info('Configuration request...');

  this.platform.handleConfigurationRequest(context, request, callback);
};
