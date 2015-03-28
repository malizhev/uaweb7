var GitterClient = require('./../lib/GitterClient');
var config = require('./../utils/config');

var noop = function() {};
var emptySubscriber = function() { return { send: noop, disconnect: noop }; };
var msgCall = function(msg) { return { model: { text: msg } } ;};

describe('GitterClient test', function() {

	beforeEach(function() {
		config.reset();
	});
	
	it('should rollback to defaults', function() {
		var bot = new GitterClient();

		expect(bot.room).to.equals(config.get("room"));
		expect(bot.key).to.equals(config.get("key"));
	});

	it('should correctly set room ID', function() {
		var room = "username/room";
		var bot = new GitterClient({room: room});

		expect(bot.room).to.equals(room);
	});

	it('should throw an error (no Gitter key)', function() {
		config.set("key", null);
		expect(GitterClient).to.throw(Error);
	});

	it('should throw an error (no room in config)', function() {
		config.set("room", null);
		expect(GitterClient).to.throw(Error);		
	});

	it('should skip un-calc messages', function() {
		var bot = new GitterClient();

		bot.subscriber = emptySubscriber();

		var result = bot.onMessages(msgCall("Hello!"));
		expect(result).to.not.exist;
	});

	it('should notify when empty expression is found', function() {
		var bot = new GitterClient();

		bot.subscriber = emptySubscriber();

		var result = bot.onMessages(msgCall("calc"));
		expect(result).to.equals(config.get("calcMessages").expressionEmpty);
	});

	it('should calculate simple expression', function() {
		var bot = new GitterClient();
		var expression = "calc (100 - 60) + 100/4 + (11 - 34)";

		bot.subscriber = emptySubscriber();

		var result = bot.onMessages(msgCall(expression));
		expect(result).to.equals(42);

	});


});