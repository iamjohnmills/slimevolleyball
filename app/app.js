import themes from './themes.js'

var slime_player;
var slime_opponent;

let active_theme;

let animate;
let inputs;
let ball;
let water;
let game;
let online;
let music;

function setTheme(name){
  active_theme = themes[name];
  document.getElementById('logo').style.color = active_theme.logo;
  if(animate){
    animate.setTheme(active_theme);
  }
}

async function init(){

  let debug_ball = false;
  document.addEventListener('keydown', e => {
    if(e.code === 'Space'){
      game.setPaused( !game.isPaused() );
      if(!game.isPaused()) {
        debug_ball = false;
        game.start_game()
      }
    } else if(game.isPaused()){
      if(e.code === 'Enter'){
        debug_ball = false;
        slime_player.slimeStop()
        game.start_game()
      }
      if(e.code === 'KeyB'){
        debug_ball = true;
      }
      if(e.code === 'ArrowLeft'){
        slime_player.slimeStop()
        slime_player.slimeMoveLeft()
        game.start_game()
      }
      if(e.code === 'ArrowRight'){
        slime_player.slimeStop()
        slime_player.slimeMoveRight()
        game.start_game()
      }
      if(e.code === 'ArrowUp'){
        slime_player.slimeStop()
        slime_player.slimeJump()
        game.start_game()
      }
      if(e.code === 'ArrowDown'){
        inputs.down = true;
        game.start_game()
      }
    }

  });

  document.getElementById('toggle-audio').addEventListener('click',function(event){

    if(this.classList.contains('off')){
      this.classList.add('on');
      this.classList.remove('off');
      document.getElementById('music').play()
    } else {
      this.classList.add('off');
      this.classList.remove('on');
      document.getElementById('music').pause()
    }
  })

  const themes_el = document.getElementById('themes');
  Object.keys(themes).forEach(i => {
    const theme_el = document.createElement('div');
    theme_el.classList.add('theme');
    theme_el.style.backgroundColor = themes[i].background[0];
    themes_el.appendChild(theme_el);
    theme_el.addEventListener('click',(e) => {
      setTheme(i);
    })
  })

  await setTheme('classic')

  animate = new Animate({ theme: active_theme });
  inputs = new Inputs();
  ball = new Ball();
  water = new Water();


  var framerate = 17;


  game = new Game({
    setup_round: () => {
      slime_player = new SlimePlayer({ x: 202, is_player: true, eye_location: 'right', chat: { location: 'left' }, radius: 100, left: 50, right: 445 });
      if( online.ready() ){
        slime_opponent = new SlimePlayer({ x: 800, is_player: false, color: 'Yellow', eye_location: 'left', chat: { location: 'right' }, radius: 100, left: 555, right: 950 });
      } else {
        slime_opponent = new PatheticWhiteSlime({ x: 800, is_player: false, eye_location: 'left', chat: { location: 'right' }, radius: 100, left: 555, right: 950 });
      }
      ball.resetBall(game.getWhoServes());
      slime_player.resetSlime();
      slime_opponent.resetSlime();
      game.setStateActive();
    },
    start_game: async (time) => {

      if( game.isWaiting() ){
        return;
      }

      if( online.ready() ){
        document.getElementById('room-input').classList.add('hide');
        document.getElementById('chat-input').classList.remove('hide');
        online.socketio.emit('game_from_client', { client_id: online.getClientID(), room_name: online.getRoomName(), ball: ball.getPosition(), slime_player: slime_player.getPosition(), slime_opponent: slime_opponent.getPosition() });
        if( online.isRoomHost() ){
          slime_player.setSlimeMovement({ inputs: inputs.getClient() });
        } else if( online.isRoomOpponent() ){
          slime_opponent.setSlimeMovement({ inputs: inputs.getClient() });
        }
      } else {
        if(!game.isPaused()){
          slime_player.setSlimeMovement({ inputs: inputs.getClient() });
        }
        slime_opponent.setSlimeMovement({ debug: game.isPaused(), ball: ball, slime: slime_player });
      }


      await slime_player.setSlime();
      await slime_opponent.setSlime();
      await water.splashSlime(slime_player);
      await water.splashSlime(slime_opponent);

      if(!debug_ball){
        await ball.setBall();
      }
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
          game.setGameOver();
        } else {
          game.setRoundOver();
        }
      }
      await animate.game({
        ball: ball,
        slime_player: slime_player,
        slime_opponent: slime_opponent,
        score: game.getScore(),
        water: {
          particles: await water.getParticles()
        }
      });


      var delta = Date.now();
      var deltaTime = Date.now() - delta;
      if (deltaTime >= framerate) {
        //window.requestAnimationFrame(game.start_game);
        //requestAnimationFrame(exampleThree);
      } else {
        setTimeout( () => {
          if(!game.isPaused()){
            window.requestAnimationFrame(game.start_game);
          }
        }, framerate - deltaTime);
      }


    },
  });


  online = new Online({
    socketio: typeof io == 'function' ? io() : null,
    opponent_joined: () => {
      //game.start();
      game.resetGame({ delay: 700 });
      slime_opponent = new SlimePlayer({ x: 800, is_player: false, color: 'Yellow', eye_location: 'left', chat: { location: 'right' }, radius: 100, left: 555, right: 950 });
      slime_opponent.setSlimeChat({message: 'Yo', delay: 2000 });
      //game.start();
    },
    opponent_disconnected: () => {
      game.resetGame({ delay: 700 });
      //game.start();
      slime_opponent = new PatheticWhiteSlime({ x: 800, is_player: false, eye_location: 'left', chat: { location: 'right' }, radius: 100, left: 555, right: 950 });
      slime_opponent.setSlimeChat({message: 'Player quit', delay: 2000 });
      //game.start();
    },
    set_player_chat: (options) => {
      slime_player.setSlimeChat({ message: options.message, delay: 2000 });
    },
    set_opponent_chat: (options) => {
      slime_opponent.setSlimeChat({ message: options.message, delay: 2000 });
    },
    set_player: (options) => {
      slime_player.setPosition(options.slime_player);
      if(options.ball.x < 500){
        ball.setPositionFromServer(options.ball);
      }
    },
    set_opponent: (options) => {
      slime_opponent.setPosition(options.slime_opponent);
      if(options.ball.x > 500){
        ball.setPositionFromServer(options.ball);
      }
    }
  });

  animate.game({ score: game.getScore() });
  game.start();
}

document.addEventListener('DOMContentLoaded', function(event) {
  init();
});
