'use strict';

const PLUGIN_NAME = 'homebridge-huejay';
const PLATFORM_NAME = 'HuePlatform';
const DEFAULT_CONFIG = {
  enableSensors: true,
  clients: [],
  ignoreAccessories: []
};

const OS = require('os');
const Huejay = require('huejay');
const AccessoryFactory = require('./HueAccessory/Factory');

/**
 * HuePlatform.
 */
class HuePlatform {
  constructor(Accessory, Service, Characteristic, UUIDGen, log, config, api) {
    this.log = log;
    this.config = Object.assign({}, DEFAULT_CONFIG, config);
    this.api = api;

    this.clients = {};
    this.cachedAccessories = [];
    this.accessories = [];
    this.services = [];

    this.accessoryFactory = new AccessoryFactory(Accessory, Service, Characteristic, UUIDGen, log);

    const version = require('../package.json').version;
    this.log.info('HuePlatform version: ' + version);

    this.api.on('didFinishLaunching', this.initialize.bind(this));
  }

  initialize() {
    this._removeUnusableCachedAccessories();

    this._parseConfiguration(this.config, () => {
      this._authenticateClients(() => {
        this._loadAccessories();
      });
    });
  }

  configureAccessory(accessory) {
    this.cachedAccessories.push(accessory);
  }

  handleConfigurationRequest(context, request, callback) {
    //
  }

  _removeUnusableCachedAccessories() {
    for (const accessory of this.cachedAccessories) {
      if (accessory.context.uniqueId === undefined) {
        this.log.debug(`Unregistering accessory '${accessory.displayName}'...`);
        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }

      if (this.config.ignoreAccessories.indexOf(accessory.context.uniqueId) !== -1) {
        this.log.info(`Ignoring accessory with ID ${accessory.context.uniqueId}...`);
        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }
  }

  _loadAccessories() {
    this.log.info('Loading accessories...');

    if (this.config.enableSensors) {
      this._loadSensors();
    }
  }

  _loadSensors() {
    for (const bridgeId in this.clients) {
      if (!Object.prototype.hasOwnProperty.call(this.clients, bridgeId)) {
        continue;
      }

      this.log.info(`Loading sensors of Bridge with ID ${bridgeId}...`);

      const client = this.clients[bridgeId];

      client.sensors.getAll()
        .then(sensors => {
          for (const sensor of sensors) {
            if (sensor.uniqueId === undefined) {
              continue;
            }

            const accessory = this._getPlatformAccessory(client, sensor);

            if (accessory === undefined) {
              continue;
            }

            try {
              this.accessoryFactory.addSensorServicesToAccessory(accessory, client, sensor);
              this._registerPlatformAccessory(accessory);
            } catch (err) {
              this.log.debug(err.message);
            }
          }
        })
      ;
    }
  }

  _getPlatformAccessory(client, hueAccessory) {
    let platformAccessory;

    for (const cachedAccessory of this.cachedAccessories) {
      if (cachedAccessory.context.uniqueId === hueAccessory.uniqueId) {
        platformAccessory = cachedAccessory;
      }
    }

    if (this.config.ignoreAccessories.indexOf(hueAccessory.uniqueId) !== -1) {
      this.log.info(`Ignoring accessory with ID ${hueAccessory.uniqueId}...`);

      if (platformAccessory !== null) {
        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [platformAccessory]);
      }

      return null;
    }

    if (platformAccessory === undefined) {
      platformAccessory = this.accessoryFactory.createAccessory(client, hueAccessory);
    }

    return platformAccessory;
  }

  _registerPlatformAccessory(accessory) {
    this.log.debug(`Registering accessory '${accessory.displayName}', updating reachability...`);

    accessory.updateReachability(true);

    try {
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    } catch (err) {
      this.log.debug(`Platform accessory '${accessory.displayName}' already registered...`);
    }
  }

  _authenticateClients(callback) {
    const promises = [];

    for (const bridgeId in this.clients) {
      if (!Object.prototype.hasOwnProperty.call(this.clients, bridgeId)) {
        continue;
      }

      const client = this.clients[bridgeId];

      promises.push(this._authenticateClient(client));
    }

    Promise.all(promises)
      .then(() => {
        callback();
      })
      .catch(() => {
        this.log.warn(`Could not authenticate one or more clients...`);

        callback();
      })
    ;
  }

  _authenticateClient(client) {
    return new Promise((resolve, reject) => {
      client.bridge.isAuthenticated()
        .then(() => {
          resolve();
        })
        .catch(() => {
          this._createUser(client, success => {
            return success ? resolve() : reject();
          });
        })
      ;
    });
  }

  _createUser(client, callback) {
    const user = new client.users.User();

    user.deviceType = `${PLUGIN_NAME}#${OS.hostname()}`;

    client.users.create(user)
      .then(user => {
        this.log.info(`New user created - Username: ${user.username}`);

        client.username = user.username;

        callback(true);
      })
      .catch(err => {
        if (err.type === 101) {
          this.log.info('Link button not pressed. Press the link button on your Bridge to authenticate...');

          setTimeout(() => {
            this._createUser(client, callback);
          }, 5000);

          return;
        }

        this.log.error(err);

        callback(false);
      })
    ;
  }

  _discover(callback) {
    this.log.info('Searching for Hue Bridges...');

    Huejay.discover()
      .then(bridges => {
        if (bridges.length === 0) {
          this.log.info('No Hue Bridges were found');

          callback(false);
          return;
        }

        for (const bridge of bridges) {
          this.log.info(`Found Hue Bridge with ID: ${bridge.id}, IP: ${bridge.ip}`);

          const client = new Huejay.Client({
            host: bridge.ip
          });

          this.clients[bridge.id] = client;
        }

        callback(true);
      })
      .catch(err => {
        this.log.error(err);

        callback(false);
      })
    ;
  }

  _parseConfiguration(config, callback) {
    if (this.config.clients.length > 0) {
      for (const clientConfig of this.config.clients) {
        if (clientConfig.id === undefined) {
          this.log.warn('Make sure every bridge in the configuration has an ID, skipping...');

          continue;
        }

        if (clientConfig.ip === undefined) {
          this.log.info(`No IP specified for Bridge with ID ${clientConfig.id}, searching Bridge...`);

          Huejay.discover()
            .then(bridges => {
              for (const bridge of bridges) {
                if (bridge.id === clientConfig.id) {
                  clientConfig.ip = bridge.ip;
                  this._createClient(clientConfig);

                  callback();
                  return;
                }

                this.log.error(`Could not find a Bridge with ID ${bridge.id} to connect with...`);
              }
            })
          ;
        } else {
          this._createClient(clientConfig);

          callback();
        }
      }
    } else {
      this._discover(callback);
    }
  }

  _createClient(clientConfig) {
    const config = {
      host: clientConfig.ip
    };

    if (clientConfig.port !== undefined) {
      config.port = clientConfig.port;
    }

    if (clientConfig.username !== undefined) {
      config.username = clientConfig.username;
    }

    if (clientConfig.timeout !== undefined) {
      config.timeout = clientConfig.timeout;
    }

    const client = new Huejay.Client(config);
    this.clients[clientConfig.id] = client;

    return client;
  }
}

module.exports = {
  pluginName: PLUGIN_NAME,
  platformName: PLATFORM_NAME,
  HuePlatform
};
