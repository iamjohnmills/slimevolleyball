// Dependencies
var express = require('express');
const serveStatic = require('serve-static')
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

const PORT = process.env.PORT || 5000;

app.set('port', PORT);
app.use('/app', express.static(__dirname + '/app'));

app.use('/', serveStatic(path.join(__dirname, '/static')))

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/static/index.html'));
});

// Starts the server.
server.listen(PORT, function() {
  console.log('Starting server on port 5000');
});

var rooms = [];

io.on('connection', function(socket) {

  socket.on('disconnect', function() {
    for(var i in rooms){
      if(socket.id == rooms[i].client_id_host || socket.id == rooms[i].client_id_opponent){
        delete rooms[i];
        io.sockets.emit('client_disconnected', { client_id: socket.id });
        return;
      }
    }
  })

  socket.on('remove_room', function(name) {
    delete rooms[name];
    io.sockets.emit('room_removed', name);
  })

  socket.on('chat_from_client', function(options) {
    if(typeof rooms[options.room_name] == 'undefined') return;
    var room = rooms[options.room_name];
    if(options.client_id == room.client_id_host || options.client_id == room.client_id_opponent){
      io.sockets.emit('chat_from_server', { client_id: options.client_id, message: options.message });
    }
  })

  socket.on('create_join_room', function(options) {

    // Create room
    if(typeof rooms[options.room_name] == 'undefined'){
      var room = {
        room_name: options.room_name,
        client_id_host: options.client_id,
        client_id_opponent: null,
      }
      rooms[options.room_name] = room;
      io.sockets.emit('room_created', { room_name: options.room_name, client_id_host: options.client_id });
      return;
    }

    var room = rooms[options.room_name];
    // Join room
    if(!room.client_id_opponent){
      rooms[options.room_name].client_id_opponent = options.client_id;
      io.sockets.emit('opponent_joined', { client_id_opponent: options.client_id, client_id_host: room.client_id_host, room_name: options.room_name });
      return;
    }
    // Room full
    if(room.client_id_host && room.client_id_opponent){
      io.sockets.emit('room_unavailable', { room_name: options.room_name, client_id: options.client_id });
      return;
    }
  });

  socket.on('game_from_client', function(options) {
    if(typeof rooms[options.room_name] == 'undefined') return;
    var room = rooms[options.room_name];
    if(options.client_id == room.client_id_host || options.client_id == room.client_id_opponent){
      io.sockets.emit('game_from_server', { client_id: options.client_id, ball: options.ball, slime_player: options.slime_player, slime_opponent: options.slime_opponent });
    }
  });
});
