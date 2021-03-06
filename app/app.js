var slime_player;
var slime_opponent;
var game = new Game({ setup_game_round_callback: setupGameRound, interval: { callback: startGame, delay: 20 } });
var animate = new Animate({ width: 750, height: 375, pi: Math.PI });
var inputs = new Inputs();
var ball = new Ball();

var socket;
var online = new Online({ socket_installed: typeof io == 'function', init_callback: onlineInit });

function onlineInit(){

  if(!online.getIsOnline()) return;

  socket = io();

  socket.on('connect', function() {
    online.setClientID({ client_id: socket.id })
  });

  socket.on('room_unavailable', function(options) {
    if( online.getClientID() != options.client_id ) return;
    document.getElementById('room-status').innerHTML = 'Room unavailable.';
    setTimeout(function(){
      document.getElementById('room-status').innerHTML = '';
    },2000);
  });

  socket.on('room_created', function(options) {
    if( online.getClientID() == options.client_id_host){
      online.setRoomNameAndHost({ client_id_host: options.client_id_host, room_name: options.room_name })
      if( online.isRoomHost() ){
        document.getElementById('room-status').innerHTML = '...';
      }
    }
  });

  socket.on('opponent_joined', function(options) {
    if( online.getClientID() == options.client_id_opponent || online.getClientID() == options.client_id_host){
      online.setRoom({ room_name: options.room_name, client_id_host: options.client_id_host, client_id_opponent: options.client_id_opponent });
      //online.setRoomOpponent({ client_id_opponent: options.client_id_opponent });
      //online.setRoomNameAndHost({ client_id_host: options.client_id_host, room_name: options.room_name })
      slime_opponent = new SlimePlayer({ x: 800, color: 'Yellow', eye_location: 'left', chat: { location: 'right' }, radius: 100, left: 555, right: 950 });
      document.getElementById('room-status').innerHTML = '';
      slime_opponent.setSlimeChat({message: 'Yo', delay: 2000 });
      game.start();
    }
  });

  socket.on('client_disconnected', function(options) {
    online.setClientDisconnected({ client_id: options.client_id });
    if( online.isInRoom() ){
      document.getElementById('room-input').classList.remove('hide');
      document.getElementById('room-input').value = '';
      document.getElementById('room-input').blur();
      document.getElementById('chat-input').classList.add('hide');
      online.reset();
      game.resetGame({ delay: 700 });
      setupSlimes();
      slime_opponent.setSlimeChat({message: 'Player quit', delay: 2000 });
      game.start();
    }
  });

  socket.on('chat_from_server', function(options) {
    if( options.client_id == online.getRoomHost() ){
      slime_player.setSlimeChat({ message: options.message, delay: 2000 });
    } else if( options.client_id == online.getRoomOpponent() ){
      slime_opponent.setSlimeChat({ message: options.message, delay: 2000 });
    }
  })

  socket.on('game_from_server', function(options) {
    if( options.client_id == online.getRoomOpponent() && online.isRoomHost() ){
      slime_opponent.setPosition(options.slime_opponent);
      if(options.ball.x > 500){
        ball.setPositionFromServer(options.ball);
      }
    } else if( options.client_id == online.getRoomHost() && online.isRoomOpponent() ){
      slime_player.setPosition(options.slime_player);
      if(options.ball.x < 500){
        ball.setPositionFromServer(options.ball);
      }
    }
  });

  document.getElementById('menu-bottom').classList.remove('hide');

  document.getElementById('room-input').addEventListener('keyup', function(event) {
    if(!this.value){
      this.blur();
      return;
    }
    if(event.keyCode === 13) { // press enter
      socket.emit('create_join_room', { room_name: this.value, client_id: online.getClientID() });
      this.blur();
    }
  });

  document.getElementById('chat-input').addEventListener('keyup', function(event) {
    if (event.keyCode === 13) { // press enter
      socket.emit('chat_from_client', { room_name: online.getRoomName(), message: this.value, client_id: online.getClientID() });
      this.value = '';
      this.blur();
    }
  });

}

function setupSlimes(){
  slime_player = new SlimePlayer({ x: 202, color: 'Yellow', eye_location: 'right', chat: { location: 'left' }, radius: 100, left: 50, right: 445 });
  slime_opponent = new PatheticWhiteSlime({ x: 800, color: '#FFFFFF', eye_location: 'left', chat: { location: 'right' }, radius: 100, left: 555, right: 950 });
}

function setupGameRound(){
  ball.resetBall(game.getWhoServes());
  slime_player.resetSlime();
  slime_opponent.resetSlime();
  game.setStateActive();
}

function runGame(){
  slime_player.setSlime(); // move player slime
  slime_opponent.setSlime(); // move opponent slime
  ball.setBall(); // move ball
  ball.hitSlime(slime_player);
  ball.hitSlime(slime_opponent);
  ball.hitWall();
  ball.hitNet();
  if(ball.hitFloor()){
    if(ball.x < 500){
      slime_player.setSlimeChat({ message: 'AHHH!', delay: 400 });
      game.setPointOpponent();
    } else if(ball.x > 500){
      slime_opponent.setSlimeChat({ message: 'AHHH!', delay: 400 });
      game.setPointPlayer();
    }
    if( game.getGameEnd() ){
      if( game.getPlayerIsWinner() ){
      } else {
      }
      game.setGameOver({ callback: setupGameRound, delay: 2000 });
    } else {
      game.setRoundOver({ callback: setupGameRound, delay: 400 });
    }
  }
}

function setupOnlineGame(){
  document.getElementById('room-input').classList.add('hide');
  document.getElementById('chat-input').classList.remove('hide');
  if( online.isRoomHost() ){
    slime_player.setSlimeMovement({ inputs: inputs.getClient() });
  } else if( online.isRoomOpponent() ){
    slime_opponent.setSlimeMovement({ inputs: inputs.getClient() });
  }
  socket.emit('game_from_client', { client_id: online.getClientID(), room_name: online.getRoomName(), ball: ball.getPosition(), slime_player: slime_player.getPosition(), slime_opponent: slime_opponent.getPosition() });
}

function setupLocalGame(){
  slime_player.setSlimeMovement({ inputs: inputs.getClient() }); // set slime with keyboard inputs
  slime_opponent.setSlimeMovement({ ball: ball, slime: slime_player }); // set slime with AI inputs
}

function startGame() {
  if( game.isPaused() ) return;
  if( online.ready() ){
    setupOnlineGame();
    runGame();
  } else {
    setupLocalGame();
    runGame();
  }
  requestAnimationFrame(function(){
    animate.game({
      ball: ball,
      slime_player: slime_player,
      slime_opponent: slime_opponent,
      score: game.getScore(),
    });
  });
}

function init(){

  document.addEventListener('keydown',function(e){
    inputs.keyDown(e.code);
  });

  document.addEventListener('keyup',function(e){
    inputs.keyUp(e.code);
  });

  online.init();
  animate.setCanvas({ canvas: document.getElementById('slime') });
  animate.arena({ score: game.getScore() });
  setupSlimes();
  game.start();
}

document.addEventListener('DOMContentLoaded', function(event) {
  init();
});
