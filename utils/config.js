var clone = require('./clone');

var _defaults = require('./../config.json');

/**
 * Bind config object to defaults
 * @return {Object} Config object
 */
var reset = function() {
	_config = clone(_defaults);

	return _config;
};

/**
 * Return value from config object
 * @param  {String} item Alias of item to be returned
 * @return {*}
 */
var get = function(item) {
	return _config[item] || null;
};

/**
 * Set config object item
 * @param  {[type]} item  Item alias
 * @param  {[type]} value Value to be set   
 */
var set = function(item, value) {
	_config[item] = value;

	return value;
};

reset();

module.exports = {
	get: get,
	set: set,
	reset: reset
};