class PatheticWhiteSlime extends SlimeAI {
  setSlimeMovement(options){
    // Pathetic White Slime reporting for duty
    var state = -1
    if(options.ball.x < 500){
      state = -1;
    }
    var xWhenBallBelow125 = this.getBallTrajectoryX({ ball: ball, y_limit: 125 });
    var something;
    if(this.y > 0 && this.x < 575) {
      something = 0;
    } else {
      something = 25 + Math.trunc(10 * Math.random());
    }

    if( state != -1 || (options.ball.xv == 0 && options.ball.x == 800)) {
      if (state == -1) {
        if(options.slime.x > 250) {
          state = 0;
        } else {
          state = 1;
        }
        if(Math.random() < 0.35) {
          state = Math.trunc(2 * Math.random());
        }
      }
      if(state == 0) {
        if(options.ball.y < 300 && options.ball.yv < -3) {
          this.slimeMoveRight();
          this.slimeJump();
        }
      } else if(state == 1) {
        if(options.ball.y < 300 && options.ball.yv < 0) {
          this.slimeMoveLeft();
          this.slimeJump();
        }
      }
      return;
    }

    if (xWhenBallBelow125 < 500){
      if (Math.abs(this.x - 666) < 20) {
        this.slimeStop();
      } else if (this.x > 666) {
        this.slimeMoveLeft();
      } else {
        this.slimeMoveRight();
      }
      return;
    }

    if (Math.abs(this.x - xWhenBallBelow125) < something){
      if (this.y != 0 || Math.random() < 0.3) return;
      if (
        (this.x >= 900 && options.ball.x > 830) ||
        (this.x <= 580 && options.ball.x < 530 && Math.abs(options.ball.x - this.x) < 100)
      ) {
        this.slimeJumpRandom(0.85);
      } else if ((Math.pow(options.ball.x - this.x, 2) * 2 + Math.pow(options.ball.y - this.y, 2) < 28900) &&
        (options.ball.x != this.x)) {
          this.slimeJumpRandom(0.85);
      } else if ((Math.pow(options.ball.xv, 2) + Math.pow(options.ball.yv, 2) < 20) &&
        (options.ball.x - this.x < 30) &&
        (options.ball.x != this.x)) {
          this.slimeJumpRandom(0.85);
      } else if ((Math.abs(options.ball.x - this.x) < 150) &&
        (options.ball.y > 50) && (options.ball.y < 400) && (Math.random() < 0.666)) {
          this.slimeJumpRandom(0.85);
      }
    }

    if (state == -1) {
      if(this.y == 0) {
        if (Math.abs(this.x - xWhenBallBelow125) < something) {
          this.slimeStop();
        } else if (xWhenBallBelow125 + something < this.x) {
          this.slimeMoveLeft();
        } else if (xWhenBallBelow125 + something > this.x) {
          this.slimeMoveRight();
        }
      } else {
        if (this.x < 575) {
          return;
        }
        if (this.x > 900){
          this.slimeMoveRight();
          return;
        }
        if (Math.abs(this.x - options.ball.x) < something) {
          this.slimeStop();
        } else if (options.ball.x < this.x) {
          this.slimeMoveLeft();
        } else if (options.ball.x > this.x) {
          this.slimeMoveRight();
        }
      }
    }
  }
  slimeServe(){

  }
}
