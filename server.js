var express = require('express'),
	app = module.exports = express.createServer();

/*
* Configurations
*/

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.logger(':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));
    app.use(express.favicon());
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

/*
* Express
*/

function secondsToString(seconds) {
	var numDays = Math.floor(seconds / 86400);
	var numHours = Math.floor((seconds % 86400) / 3600);
	var numMinutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numSeconds = Math.floor((seconds % 86400) % 3600) % 60;

	return numDays +' days '+ numHours +' hours '+ numMinutes +' minutes '+ numSeconds +' seconds.';
}

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

app.get('/trigger.html', function(req, res) {
	res.sendfile('trigger.html'); res.send('user ' + req.params.id);
});

app.get('/:rfid/h1/94', function(req, res) {
	console.log('Trigger command arrived from HTTP, rfid: '+ req.params.rfid);

	io.sockets.emit('trigger');

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Triggered');
});

app.get('/uptime', function(req, res) {
	res.end('The server has been up for: '+ secondsToString( process.uptime().toString() ) );
});

/*
* Main
*/

var	totUsers = 0;

app.listen(process.env.PORT || 8001);

console.log('Express server listening in %s mode', app.settings.env);

/*
* Functions
*/

function strencode(data) {
  return unescape(encodeURIComponent(JSON.stringify(data)));
}

/*
* Socket.io
*/

var io = require('socket.io').listen(app);

io.configure(function() {
	io.enable('browser client minification');
	io.set('log level', 1);
});

io.sockets.on('connection', function(client) {
	totUsers++;
	console.log('+ User '+ client.id +' connected, total users: '+ totUsers);

	client.emit('clientId', { id: client.id });
	io.sockets.emit('tot', { tot: totUsers });

	client.on('trigger', function() {
		console.log('Trigger command arrived from js');

		io.sockets.emit('trigger');
	});

	client.on('disconnect', function() {
		totUsers--;
		console.log('- User '+ client.id +' disconnected, total users: '+ totUsers);

		io.sockets.emit('tot', { tot: totUsers });
	});
});