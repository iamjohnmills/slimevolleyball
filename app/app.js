var slime_player;
var slime_opponent;

const themes = {
  classic: {
    mode: 'fill',
    ball: '#FFFF00',
    background: ['#0000FF','#0000FF'],
    water: 'rgba(0, 150, 255,0.8)',
    net: '#FFFFFF',
    score: {
      inactive: "#0000CF",
      active: "#FFFF00",
    },
    slime_player: {
      body: '#FFFF00',
      eye: '#FFFFFF',
      pupil: '#000000'
    },
    slime_opponent: {
      body: '#FFFFFF',
      eye: '#FFFFFF',
      pupil: '#000000'
    },
  },
  sunset: {
    mode: 'fill',
    ball: '#FFFF00',
    background: ['#ff5f6d','#ff5f6d'],
    water: 'rgba(199, 0, 57 ,0.6)',
    net: '#FFFFFF',
    score: {
      inactive: "#C70039",
      active: "#FFFF00",
    },
    slime_player: {
      body: '#FFFF00',
      eye: '#FFFFFF',
      pupil: '#000000'
    },
    slime_opponent: {
      body: '#FFFFFF',
      eye: '#FFFFFF',
      pupil: '#000000'
    },
  },
}

let active_theme = themes.classic;

var animate = new Animate({ theme: active_theme, width: 750, height: 375, pi: Math.PI });
var inputs = new Inputs();
var ball = new Ball();
var water = new Water();
var game = new Game({ setup_game_round_callback: setupGameRound, interval: { callback: startGame, delay: 20 } });
var online = new Online({ socket_installed: typeof io == 'function', init_callback: onlineInit });

var socket;

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
      slime_opponent = new SlimePlayer({ x: 800, is_player: false, color: 'Yellow', eye_location: 'left', chat: { location: 'right' }, radius: 100, left: 555, right: 950 });
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




function setupSlimes(){
  slime_player = new SlimePlayer({ x: 202, is_player: true, color: 'Yellow', eye_location: 'right', chat: { location: 'left' }, radius: 100, left: 50, right: 445 });
  slime_opponent = new PatheticWhiteSlime({ x: 800, is_player: false, color: '#FFFFFF', eye_location: 'left', chat: { location: 'right' }, radius: 100, left: 555, right: 950 });
}

function setupGameRound(){
  ball.resetBall(game.getWhoServes());
  slime_player.resetSlime();
  slime_opponent.resetSlime();
  game.setStateActive();
}

async function runGame(){
  await slime_player.setSlime(); // move player slime
  await slime_opponent.setSlime(); // move opponent slime
  await water.splashSlime(slime_player);
  await water.splashSlime(slime_opponent);
  await ball.setBall(); // move ball
  await ball.hitSlime(slime_player);
  await ball.hitSlime(slime_opponent);
  await ball.hitWall();
  await ball.hitNet();
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



function setupLocalGame(){
  slime_player.setSlimeMovement({ inputs: inputs.getClient() }); // set slime with keyboard inputs
  slime_opponent.setSlimeMovement({ ball: ball, slime: slime_player }); // set slime with AI inputs
}

async function startGame() {
  if( game.isPaused() ) return;
  if( online.ready() ){
    setupOnlineGame();
    runGame();
  } else {
    setupLocalGame();
    runGame();
  }
  requestAnimationFrame(async function(){
    await animate.game({
      ball: ball,
      slime_player: slime_player,
      slime_opponent: slime_opponent,
      score: game.getScore(),
      water: { particles: await water.getParticles() }
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
  animate.game({ score: game.getScore() });
  setupSlimes();
  game.start();
}

document.addEventListener('DOMContentLoaded', function(event) {
  init();
});
