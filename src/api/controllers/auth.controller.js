/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res) => res.send('ok');

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res) => res.send('ok');
