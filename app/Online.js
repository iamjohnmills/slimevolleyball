class Online {
  constructor(options){
    this.socket_installed = options.socket_installed;
    this.is_online = true;
    this.init_callback = options.init_callback;
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
  }
  init(){
    this.init_callback();
  }
  reset(){
    this.room.room_name = null;
    this.room.client_id_host = null;
    this.room.client_id_opponent = null;
  }
  getIsOnline(){
    return this.socket_installed && this.is_online;
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
  //setRoomOpponent(options){
  //  this.room.client_id_opponent = options.client_id_opponent;
  //}
}
