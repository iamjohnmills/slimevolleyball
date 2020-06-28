class SlimeAI extends Slime {
  getBallTrajectoryX(options){  // calculate ending ball x given a starting y
    var frames = this.getFramesUntilLimit(options.ball.y, options.ball.yv, options.y_limit);
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
