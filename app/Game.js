
class Game {
  constructor(options) {
    this.score = {
      player: 0,
      opponent: 0,
      max: 7,
    }
    this.player_to_serve = true;
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
  getScore(){
    return this.score;
  }
  getPlayerIsWinner(){
    return this.score.player == this.score.max;
  }
  setRoundOver(options){
    this.state = this.states.pause;
    setTimeout(function(){
      options.callback();
    }, options.delay)
  }
  setGameOver(options){
    this.state = this.states.pause;
    setTimeout(function(){
      this.resetGame();
      options.callback();
    }.bind(this), options.delay)
  }
  getGameEnd(){
    return this.state == this.states.end;
  }
  setPointPlayer(){
    this.player_to_serve = true;
    this.score.player++;
    if(this.score.opponent == this.score.max){
      this.state = this.states.end;
    }
  }
  setPointOpponent(){
    this.player_to_serve = false;
    this.score.opponent++;
    if(this.score.opponent == this.score.max){
      this.state = this.states.end;
    }
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
    this.score.player = 0;
    this.score.opponent = 0;
    this.player_to_serve = true;
    this.state = this.state.active;
  }
}
