var http = require('http'),
    fs = require('fs');
 
var app = http.createServer(function (request, response) {
    fs.readFile("client.html", 'utf-8', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}).listen(80);

 var names = [];
 
var io = require('socket.io').listen(app);
 
io.sockets.on('connection', function(socket) {
    socket.on('message_to_server', function(data) {
        io.sockets.emit("message_to_client", {message:data , nickname:socket.nickname});
    });
});


io.sockets.on('connection', function(socket){
	socket.on('new user' ,function(username){
		socket.nickname = username;
		names.push(socket.nickname);
		updateOnline();
		io.sockets.emit('user connected' , (socket.nickname + ' has join the game'));
	});
});


function updateOnline(){
	io.sockets.emit('usernames' , names);
	
}

io.sockets.on('connection', function(socket){
  socket.on('disconnect', function(){
	  if(!socket.nickname) return;
	  names.splice(names.indexOf(socket.nickname) , 1);
	  updateOnline();
	  io.sockets.emit('user connected' , (socket.nickname + ' has left the game'));
     
  });
});















/* ----------------------------with sanitize
var http = require('http'),
    fs = require('fs'),
    sanitize = require('validator').sanitize;


var app = http.createServer(function (request, response) {
    fs.readFile("client.html", 'utf-8', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}).listen(1337);
 
var io = require('socket.io').listen(app);
 
io.sockets.on('connection', function(socket) {
    socket.on('message_to_server', function(data) {
        var escaped_message = sanitize(data["message"]).escape();
        io.sockets.emit("message_to_client",{ message: escaped_message });
    });
});
*/