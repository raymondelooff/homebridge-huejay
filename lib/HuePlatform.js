'use strict';

let HueClient = require('./HueClient');
let Huejay = require('Huejay');

var Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
  // Accessory must be created from PlatformAccessory Constructor
  Accessory = homebridge.platformAccessory;

  // Service and Characteristic are from HAP-NodeJS
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

  homebridge.registerPlatform('homebridge-hue', 'HuePlatform', HuePlatform, false);
}

function HuePlatform(log, config, api) {
  this.log = log;
  this.config = config;
  this.api = api;

  this.clients = {};
  this.accessories = [];

  let version = require('../package.json').version;
  this.log.info('HuePlatform version: ' + version);

  this._parseConfiguration(config);
  this.initialize();
}

HuePlatform.prototype.initialize = function() {
  this.connect(() => {

  });
};

HuePlatform.prototype.connect = function(callback) {
  if (Object.keys(this.clients).length === 0) {
    this.discover((success) => {
      if (success) {
        this._authenticateClients(callback);
      } else {
        callback(false);
      }
    });
  } else {
    this._authenticateClients(callback);
  }
}

HuePlatform.prototype._authenticateClients = function(callback) {
  var promises = [];

  for (let clientId in this.clients) {
    let client = this.clients[clientId];

    promises.push(this._authenticateClient(client));
  }

  Promise.all(promises)
    .then(() => {
      callback()
    })
  ;
}

HuePlatform.prototype._authenticateClient = function(client) {
  return new Promise((resolve, reject) => {
    client.authenticate((success) => {
      if (success) {
        this.log.info(`Authenticated for Bridge with IP ${client.bridgeIp}`);

        resolve();
      } else {
        this.log.info(`Not authenticated for Bridge with IP ${client.bridgeIp}, press the link button on your Bridge to authenticate...`);

        this._createUser(client, (success) => {
          if (success) {
            resolve();
          } else {
            reject();
          }
        });
      }
    });
  });
}

HuePlatform.prototype._createUser = function(client, callback) {
  let user = new client.users.User();

  this.log.info(client.users);

  client.users.create(user)
    .then((user) => {
      this.log.info(`New user created - Username: ${user.username}`);

      callback(true);
    })
    .catch((error) => {
      if (error instanceof Huejay.Error && error.type === 101) {
        this.log.info(`Link button not pressed. Try again...`);
      } else {
        this.log.error(error);
      }

      callback(false);
    })
  ;
}

HuePlatform.prototype.discover = function(callback) {
  this.log.info('Searching for Hue Bridges...');

  Huejay.discover()
    .then((bridges) => {
      if (bridges.length > 0) {
        for (let bridge of bridges) {
          this.log.info(`Found Hue Bridge with ID: ${bridge.id}, IP: ${bridge.ip}`);

          for (let clientId in this.clients) {
            let client = this.clients[clientId];

            if (client.id === bridge.id) {
              this.log.debug(`Bridge with ID ${bridge.id} already exists, skipping...`);

              break;
            }
          }

          let client = new HueClient(bridge.ip);
          this.clients[bridge.id] = client;
        }

        callback(true);
      } else {
        this.log.info('No Hue Bridges were found');

        callback(false);
      }
    })
    .catch((error) => {
      this.log.error(error);

      callback(false);
    })
  ;
}

HuePlatform.prototype.configureAccessory = function(accessory) {
  this.log.info('Configuring accessories...');
}

HuePlatform.prototype._parseConfiguration = function(config) {
  this.config = config || {};
  this.config.clients = this.config.clients || [];

  for (let clientConfig of this.config.clients) {
    if (clientConfig.id === undefined) {
      this.log.warning('Make sure every bridge in the configuration has an ID, skipping...');

      break;
    }

    if (clientConfig.ip === undefined) {
      this.log.info(`No IP specified for Bridge with ID ${bridge.id}, searching Bridge...`);

      Huejay.discover()
        .then((bridges) => {
          for (let bridge of bridges) {
            if (bridge.id === clientConfig.id) {
              clientConfig.ip = bridge.ip;
              this._createHueClient(clientConfig);

              return;
            }

            this.log.warning(`No Bridge found with ID ${bridge.id}`);
          }
        })
      ;
    } else {
      this._createHueClient(clientConfig);
    }
  }
}

HuePlatform.prototype._createHueClient = function(config) {
  let client = HueClient.fromConfiguration(client);
  this.clients[client.id] = client;
}
