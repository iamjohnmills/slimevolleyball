class SlimeAI extends Slime {
  constructor(...options){
    super(...options);
    this.hitbox_in_air = 0;
    this.hitbox_on_ground = 5;
    this.ball_trajectory = null;
    this.slime_in_range = false;
    this.ball_trajectory_y_limit = 125;
    // this.jump_rules = [];

    // alien slime
    // drunk slime
    // ambergris??? whale vomit intro

    // if(slimePowerJump(options)) return;
    // if(slimeMoves(options)) return;
    // if(slimeJumpMoves(options)) return;

    // ideas:
    // punt guy: jump when range of ball is ~80; hitbox ~5; plays back
    // -- power move: punt ball with jump + fast moveleft, then fast moveright

    // fast guy: fast move back
    // -- power move: rolls ball on head?
  }
  setCalculations(options){
    this.ball_trajectory = this.getBallTrajectoryX({ ball: options.ball });
    this.slime_in_range = Math.abs(this.x - this.ball_trajectory) < this.getHitbox();
  }
  isSlimeServe(options){
    return options.ball.x === this.start_x && options.ball.xv === 0;
  }
  canMove(options){
    return options.rules.some(rule => rule);
  }
  canJump(options){
    return !this.isSlimeJumping() && this.slime_in_range && options.rules.some(rule => rule);
  }
  getHitbox() {
    return this.y > 0 ? this.hitbox_in_air : this.hitbox_on_ground;
  }
  isSlimeJumping(){
    return this.y !== 0;
  }
  getBallTrajectoryX(options){  // calculate ending ball x given a starting y
    var frames = this.getFramesUntilLimit(options.ball.y, options.ball.yv, this.ball_trajectory_y_limit);
    var x = options.ball.x;
    var xv = options.ball.xv;
    for(var i = 0; i < frames; i++) {
      x += xv;
      if(x < 0) {
        x = 0;
        xv = -xv;
      } else if(x > 1000) {
        x = 1000;
        xv = -xv;
      }
    }
    return x;
  }
  getFramesUntilLimit(y,vy,limit){ // given y and yv, calculate count of times before reaches a limit by decremeting
    for(var count = 0; 1; count++) {
      vy--;
      y += vy;
      if(y <= limit) return count;
    }
  }
  slimeJumpRandom(percent){
    if (Math.random() <= percent) {
      this.slimeJump();
    }
  }
}
