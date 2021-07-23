class Online {
  constructor(options){
    //this.socket_installed = options.socket_installed;
    this.socketio = options.socketio;
    this.is_online = true;
    this.client_id = null;
    this.online_state = 1;
    this.online_states = {
      initialized: 1,
      room_created: 2,
      client_joined: 3,
      client_disconnected: 4,
    };
    this.room = {
      room_name: null,
      client_id_host: null,
      client_id_opponent: null,
    };

    this.socketio.on('connect', () => {
      this.setClientID({ client_id: this.socketio.id })
    });

    this.socketio.on('room_unavailable', (params) => {
      if( this.getClientID() != params.client_id ) return;
      document.getElementById('room-status').innerHTML = 'Room unavailable.';
      setTimeout(function(){
        document.getElementById('room-status').innerHTML = '';
      },2000);
    });

    this.socketio.on('room_created', (params) => {
      if( this.getClientID() == params.client_id_host){
        this.setRoomNameAndHost({ client_id_host: params.client_id_host, room_name: params.room_name })
        if( this.isRoomHost() ){
          document.getElementById('room-status').innerHTML = '...';
        }
      }
    });

    this.socketio.on('opponent_joined', (params) => {
      if( this.getClientID() == params.client_id_opponent || this.getClientID() == params.client_id_host){
        this.setRoom({ room_name: params.room_name, client_id_host: params.client_id_host, client_id_opponent: params.client_id_opponent });
        document.getElementById('room-status').innerHTML = '';
        options.opponent_joined();
      }
    });

    this.socketio.on('client_disconnected', (params) => {
      this.setClientDisconnected({ client_id: params.client_id });
      if( this.isInRoom() ){
        document.getElementById('room-input').classList.remove('hide');
        document.getElementById('room-input').value = '';
        document.getElementById('room-input').blur();
        document.getElementById('chat-input').classList.add('hide');
        this.reset();
        options.opponent_disconnected();
      }
    });

    this.socketio.on('chat_from_server', (params) => {
      if( params.client_id == this.getRoomHost() ){
        options.set_player_chat(params);
      } else if( params.client_id == this.getRoomOpponent() ){
        options.set_opponent_chat(params);
      }
    })

    this.socketio.on('game_from_server', (params) => {
      if( params.client_id == this.getRoomOpponent() && this.isRoomHost() ){
        options.set_opponent(params);
      } else if( params.client_id == this.getRoomHost() && this.isRoomOpponent() ){
        options.set_player(params);
      }
    });

    document.getElementById('menu-bottom').classList.remove('hide');

    document.getElementById('room-input').addEventListener('keyup', (event) => {
      if(!event.target.value){
        event.target.blur();
        return;
      }
      if(event.keyCode === 13) { // press enter
        this.socketio.emit('create_join_room', { room_name: event.target.value, client_id: this.getClientID() });
        event.target.blur();
      }
    });

    document.getElementById('chat-input').addEventListener('keyup', (event) => {
      if (event.keyCode === 13) { // press enter
        this.socketio.emit('chat_from_client', { room_name: this.getRoomName(), message: event.target.value, client_id: this.getClientID() });
        event.target.value = '';
        event.target.blur();
      }
    });


  }
  reset(){
    this.room.room_name = null;
    this.room.client_id_host = null;
    this.room.client_id_opponent = null;
  }
  getIsOnline(){
    return this.socketio && this.is_online;
  }
  ready(){
    return this.room.client_id_host && this.room.client_id_opponent ? true : false;
  }
  setIsOnline(value){
    this.is_online = value;
  }
  getClientID(){
    return this.client_id;
  }
  setClientID(options){
    this.client_id = options.client_id;
  }
  getClientIDOpponent(){
    return this.room.client_id_opponent;
  }
  getRoomHost(){
    return this.room.client_id_host;
  }
  getRoomOpponent(){
    return this.room.client_id_opponent;
  }
  setClientDisconnected(options){
    if(options.client_id == this.room.client_id_host){
      this.room.client_id_host = null;
    } else if( options.client_id == this.room.client_id_opponent ){
      this.room.client_id_opponent = null;
    }
  }
  removeRoom(){
    this.room.room_name = null;
  }
  isInRoom(){
    return this.client_id == this.room.client_id_host || this.client_id == this.room.client_id_opponent;
  }
  isRoomHost(){
    return this.isInRoom() && this.client_id == this.room.client_id_host;
  }
  isRoomOpponent(){
    return this.isInRoom() && this.client_id == this.room.client_id_opponent;
  }
  getRoom(){
    return this.room;
  }
  getRoomName(){
    return this.room.room_name;
  }
  setRoom(options){
    this.room.room_name = options.room_name;
    this.room.client_id_host = options.client_id_host;
    this.room.client_id_opponent = options.client_id_opponent;
  }
  setRoomNameAndHost(options){
    this.room.room_name = options.room_name;
    this.room.client_id_host = options.client_id_host;
  }
}
