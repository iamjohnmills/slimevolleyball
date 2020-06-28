// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/app', express.static(__dirname + '/app'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

var rooms = [];

io.on('connection', function(socket) {

  socket.on('disconnect', function() {
    io.sockets.emit('client_disconnected', { client_id: socket.id });
  })

  socket.on('remove_room', function(name) {
    delete rooms[name];
    io.sockets.emit('room_removed', name);
  })

  socket.on('create_join_room', function(options) {
    if(typeof rooms[options.room_name] == 'undefined'){
      var room = {
        room_name: options.room_name,
        client_id_host: options.client_id,
        client_id_opponent: null,
      }
      rooms[options.room_name] = room;
      io.sockets.emit('room_created', { room_name: options.room_name, client_id_host: options.client_id });
    } else { // join room
      if(!rooms[options.room_name].client_id_opponent){
        rooms[options.room_name].client_id_opponent = options.client_id;
        io.sockets.emit('opponent_joined', { client_id_opponent: options.client_id });
      }
    }
  });

  socket.on('game_from_client_host', function(options) {
    if(typeof rooms[options.room_name] == 'undefined') return;
    io.sockets.emit('game_from_server_host', { ball: options.ball, slime: options.slime });
  });

  socket.on('game_from_client_guest', function(options) {
    if(typeof rooms[options.room_name] == 'undefined') return;
    io.sockets.emit('game_from_server_guest', { slime: options.slime });
  });

});
