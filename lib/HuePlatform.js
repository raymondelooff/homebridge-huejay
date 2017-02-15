var Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
  // Accessory must be created from PlatformAccessory Constructor
  Accessory = homebridge.platformAccessory;

  // Service and Characteristic are from HAP-NodeJS
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

  homebridge.registerPlatform('homebridge-hue', 'HuePlatform', HuePlatform, true);
}

function HuePlatform(log, config, api) {

}

HuePlatform.prototype.configureAccessory = function(accessory) {

}

HuePlatform.prototype.configurationRequestHandler = function(context, request, callback) {

}

HuePlatform.prototype.addAccessory = function(accessoryName) {

}

HuePlatform.prototype.updateAccessoriesReachability = function() {

}

HuePlatform.prototype.removeAccessory = function() {

}
