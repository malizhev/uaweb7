/**
 * Clone given object
 * @param  {*} obj Object to be copied (or any other type actually)
 * @return {*}     Cloned object
 */
function clone(obj) {
	if (null === obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
    	if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

module.exports = clone;