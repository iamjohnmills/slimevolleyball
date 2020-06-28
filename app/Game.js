
class Game {
  constructor(options) {
    this.score = {
      player: 0,
      opponent: 0,
      max: 7,
    }
    this.player_to_serve = true
    this.states = {
      active: 1,
      pause: 2,
      end: 3,
    }
    this.state = 1;
    this.interval = {
      callback: options.interval.callback,
      delay: options.interval.delay,
      obj: null,
    };
    this.setup_game_round_callback = options.setup_game_round_callback;
  }
  start(){
    this.resetGameInterval();
    this.setup_game_round_callback();
  }
  setPoint(options){
    this.state = this.states.pause;
    setTimeout(function(){
      options.callback();
    }, 400)
  }
  setPointPlayer(){
    this.player_to_serve = true;
    this.score.player++;
  }
  setPointOpponent(){
    this.player_to_serve = false;
    this.score.opponent++;
  }
  getWhoServes(){
    return this.player_to_serve;
  }
  setPaused(){
    this.state = this.states.pause;
  }
  isPaused(){
    return this.state == this.states.pause;
  }
  resetGameInterval(){
    clearInterval(this.interval.obj);
    this.interval.obj = setInterval(this.interval.callback, this.interval.delay);
  }
  setStateActive(){
    this.state = this.states.active;
  }
  resetGame(){
    this.score.player = 0
    this.score.opponent = 0
    this.state = this.state.active
  }
}
