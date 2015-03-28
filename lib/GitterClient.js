var Gitter = require('node-gitter');
var math = require('mathjs');

var config = require('./../utils/config');
var notify = require('./../utils/notifier');

/**
 * GitterClient constuctor. Creates a new GitterClient instance
 * @param {Object} opts GitterClient init options. Accepted: room, key 
 * @class
 */
function GitterClient(opts) {

	var options = opts || {};

	this.room = options.room || config.get("room");
	this.key  = options.key  || config.get("key");

	if (!this.room) { throw new Error("Specify the room to listen"); }
	if (!this.key)  { throw new Error("Specify the Gitter API key"); }

	this.calcPattern = /^calc(.*)/i;

	// Current room subscriber
	this.subscriber = {};
	// Gitter instance
	this.gitter = {};
}

/* ******************** */
/* GitterClient methods */
/* ******************** */

/**
 * Connect to the specific room using Gitter API token
 * @return {Object} Gitter connection instance
 */
GitterClient.prototype.connect = function() {

	this.gitter = new Gitter(this.key);
	this.gitter.rooms.join(this.room, this.onJoin.bind(this));

	return this.gitter;
};

/**
 * Stop listening to room
 * @return {Boolean} Whether disconnected or not
 */
GitterClient.prototype.disconnect = function() {
	// Skip if not connected
	if (!this.gitter || 
		!this.subscriber ||
		!this.subscriber.streaming) return false;
	
	this.subscriber.streaming().disconnect();

	this.subscriber = null;
	this.gitter = null;

	return true;
};

/**
 * onJoin callback (invoked by gitter.room.join). Listens for upcoming messages
 * @param  {Object} err  Error object passed
 * @param  {Object} room Room subscriber
 * @return {Object}      Room subscriber
 */
GitterClient.prototype.onJoin = function (err, room) {

	if (err) return notify.error("An error ocurred: " + err);

	this.subscriber = room;
	notify.success("Connected to " + this.room);

	// NOTE:
	// Subscribe on room events using streaming() method.
	// Though it's deprecated (https://github.com/gitterHQ/node-gitter/blob/master/lib/rooms.js#L99)
	// 		only this method correctly returns object with disconnect() method.
	// WTF guys? Seriuosly  
	this.subscriber
		.streaming()
		.chatMessages()
		.on("chatMessages", this.onMessages.bind(this));

	this.sendMessage(config.get("calcMessages").greetings, true);

	return this.subscriber;
};

/**
 * onMessages callback. Checks message for calc expression and passes to parseExpression if needed
 * @param  {Object} msg 		  Message object
 * @return {undefined|String}     Either undefined (if no calc expression) or result of calculation
 */
GitterClient.prototype.onMessages = function(msg) {

	var parsedMsg = this.parseExpression(msg);
	var expression;

	if (!parsedMsg) return;

	// Get first RegExp match
	expression = parsedMsg[1];
	// If user enters just calc expression, e.g "calc"
	if (!expression) { 
		return this.sendMessage(config.get("calcMessages").expressionEmpty);
	}

	return this.calculate(expression);
		
};

/**
 * Parse each upcoming message for calc expression
 * @param  {Object} msg 	   Message object passed by onMessage
 * @return {Boolean|Array}     Array of RegExp matches. false in case of no calc expression or any error
 */
GitterClient.prototype.parseExpression = function(msg) {
	try {
		parsedMsg = this.calcPattern.exec(msg.model.text) || false;
		return parsedMsg;
	}
	catch(ex) {
		this.sendMessage(config.get("calcMessages").expressionError);
		return false;
	}
};

/**
 * Calculate given expression using mathjs
 * @param  {String} expression       Math expression to calculate
 * @return {Number|String|Boolen}    Calculations result. false in case of wrong expression
 */
GitterClient.prototype.calculate = function(expression) {
	try {
		result = math.eval(expression);
		this.sendMessage("# " + expression + " = " + result);

		return result;
	}
	catch(ex) {
		this.sendMessage(config.get("calcMessages").expressionError);
		return false;
	}
};

/**
 * Send a message to the current room 
 * @param  {String} message Message to send
 * @return {String}         Message that was send
 */
GitterClient.prototype.sendMessage = function(message) {
	this.subscriber.send(message);

	return message;
};

module.exports = GitterClient;
