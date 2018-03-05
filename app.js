var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.send(`
		<!doctype html>
		<html>
			<head>
				<title>Socket.IO chat</title>
				<style>
					* { margin: 0; padding: 0; box-sizing: border-box; }
					body { font: 13px Helvetica, Arial; }
					form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
					form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
					form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
					#messages { list-style-type: none; margin: 0; padding: 0; }
					#messages li { padding: 5px 10px; }
					#messages li:nth-child(odd) { background: #eee; }
				</style>
			</head>
			<body>
				<ul id="messages"></ul>
				<form action="">
					<input id="m" autocomplete="off" /><button>Send</button>
				</form>
				<script src="/socket.io/socket.io.js"></script>
				<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
				<script>
					$(function () {
						var socket = io();
						$('form').submit(function(){
							socket.emit('chat message', $('#m').val());
							$('#m').val('');
							return false;
						});
						socket.on('chat message', function(msg){
							console.log(msg)
							$('#messages').append($('<li>').text(msg));
						});
					});
				</script>
			</body>
		</html>
	`);
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(3001, function(){
	console.log('listening on *:3001');
});

module.exports = app;