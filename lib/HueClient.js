let HueError = require('./HueError');
let Huejay = require('huejay');

/**
 * HueClient.
 */
class HueClient {
  /**
   * Constructor.
   */
  constructor(bridgeIp, bridgePort, username, timeout) {
    this.bridgeIp = bridgeIp;
    this.bridgePort = bridgePort;
    this.username = username;
    this.timeout = timeout;

    if (this.bridgeIp === undefined) {
      throw new HueError('IP for Bridge not specified');
    }
  }

  /**
   * Creates a new Huejay Client.
   */
  authenticate(callback) {
    this.client = new Huejay.Client({
      host: this.bridgeIp,
      port: this.bridgePort,
      username: this.username,
      timeout: this.timeout
    });

    this.client.bridge.isAuthenticated()
      .then(() => {
        callback(true);
      })
      .catch((error) => {
        callback(false);
      })
    ;
  }

  /**
   * Creates a new Bridge using the given configuration.
   */
  static fromConfiguration(config) {
    return new HueClient(
      config.ip,
      config.port,
      config.username,
      config.timeout
    );
  }
}

module.exports = HueClient;
