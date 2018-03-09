const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res) => errorHandler(new Error('failed'), req, res);

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.send('ok');

/**
 * List users
 * @public
 */
exports.list = (req, res) => res.send('ok');

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.send('ok');

/**
 * Create new user
 * @public
 */
exports.create = async (req, res) => res.send('ok');
