/**
 * HueError.
 */
class HueError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HueError';
  }
}

module.exports = HueError;
