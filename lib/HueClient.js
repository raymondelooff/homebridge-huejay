let HueError = require('./HueError');
let Huejay = require('huejay');

/**
 * HueClient.
 */
class HueClient {
  /**
   * Constructor.
   */
  constructor(bridgeId, bridgeIp, bridgePort, username, timeout) {
    this.bridgeId = bridgeId;
    this.bridgeIp = bridgeIp;
    this.bridgeName = this.bridgeId;
    this.bridgePort = bridgePort;
    this.username = username;
    this.timeout = timeout;

    if (this.bridgeId === undefined) {
      throw new HueError('ID for Bridge not specified');
    }

    if (this.bridgeIp === undefined) {
      throw new HueError('IP for Bridge not specified');
    }

    this._createClient();
  }

  _createClient() {
    let config = {
      host: this.bridgeIp
    };

    if (this.bridgePort !== undefined) {
      config.port = this.bridgePort;
    }

    if (this.username !== undefined) {
      config.username = this.username;
    }

    if (this.timeout !== undefined) {
      config.timeout = this.timeout;
    }

    this.client = new Huejay.Client(config);
  }

  /**
   * Creates a new Huejay Client.
   */
  authenticate(callback) {
    this.client.bridge.isAuthenticated()
      .then(() => {
        this._refreshBridgeInformation(() => {
          callback(true);
        });
      })
      .catch((error) => {
        callback(false);
      })
    ;
  }

  /**
   * Creates a new User.
   */
  createUser() {
    let user = new this.client.users.User();

    return this.client.users.create(user);
  }

  /**
   * Retrieves information about the Hue Bridge and stores it.
   */
  _refreshBridgeInformation(callback) {
    this.client.bridge.get()
      .then((bridge) => {
        if (bridge.name !== undefined) {
          this.bridgeName = bridge.name;
        }

        callback();
      })
      .catch((error) => {
        callback();
      })
    ;
  }

  /**
   * Creates a new Bridge using the given configuration.
   */
  static fromConfiguration(config) {
    return new HueClient(
      config.id,
      config.ip,
      config.port,
      config.username,
      config.timeout
    );
  }
}

module.exports = HueClient;
