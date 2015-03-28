/**
 * Log to console with special color. Straightforward. Mostly for fun :)
 * @param  {String} msg   Message to be printed
 * @param  {[type]} color Color
 * @return {undefined}    Just undefined
 * @private
 */
function _logger(msg, color) {
	return console.log(msg[color]);
}

var success = function(msg) {
	return _logger(msg, "green");
};

var info = function(msg) {
	return _logger(msg, "yellow");
};

var error = function(msg) {
	return _logger(msg, "red");
};

module.exports = {
	success: success,
	info: info,
	error: error
};