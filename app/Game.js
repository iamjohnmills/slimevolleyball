
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
      wait: 2,
      end: 3,
      pause: 4,
    }
    this.state = 1;
    this.interval = null;
    this.setup_round = options.setup_round;
    this.start_game = options.start_game;

  }
  async start(){
    await this.setup_round();
    window.requestAnimationFrame(this.start_game);
  }
  getScore(){
    return this.score;
  }
  getPlayerIsWinner(){
    return this.score.player == this.score.max;
  }
  setRoundOver(options){
    this.state = this.states.wait;
    setTimeout(() => {
      this.start()
    }, 400);
  }
  setGameOver(options){
    this.state = this.states.wait;
    setTimeout(() => {
      this.resetGame();
      this.start()
    }, 2000)
  }
  getGameEnd(){
    return this.state == this.states.end;
  }
  setPointPlayer(){
    this.player_to_serve = true;
    this.score.player++;
    if(this.score.player == this.score.max){
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
  setPaused(val){
    this.states.pause = val;
  }
  isWaiting(){
    return this.state == this.states.wait;
  }
  isPaused(){
    return this.state == this.states.pause;
  }
  resetGameInterval(){
    clearInterval(this.interval);
    this.interval = setInterval(this.start_game, 20);
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
