'use strict';

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

  homebridge.registerPlatform(HuePlatform.pluginName, HuePlatform.platformName, Platform, true);
};

function Platform(log, config, api) {
  this.log = log;
  this.api = api;
  this.platform = new HuePlatform.HuePlatform(Accessory, Service, Characteristic, UUIDGen, log, config, api);
}

Platform.prototype.configureAccessory = function (accessory) {
  this.log.info(`Configuring accessory '${accessory.displayName}'...`);

  this.platform.configureAccessory(accessory);
};

Platform.prototype.configurationRequestHandler = function (context, request, callback) {
  this.log.info('Configuration request...');

  this.platform.handleConfigurationRequest(context, request, callback);
};
