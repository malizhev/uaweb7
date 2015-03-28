var colors = require('colors');

var GitterClient = require('./lib/GitterClient');
var config = require('./utils/config');
var notify = require('./utils/notifier');


function main() {

	var gitterBot = new GitterClient({
		room: process.argv[2]
	});

	if (!process.argv[2]) {
		notify.info([
			"No room is specified. Rolling back to " + config.get("room"),
			"To subscribe to specific room run 'node gitter-calculator username/room'",
			"You can change default room in config.json file as well as Gitter API token",
		].join("\n"));
	}

	gitterBot.connect();

	process.on("exit", handleExit.bind(null, { exit: false }));
	process.on("SIGINT", handleExit.bind(null, { exit: true }));

	function handleExit(opts) {
		gitterBot.disconnect();
		if (opts.exit) process.exit();
	}
}

main();

module.exports = main;