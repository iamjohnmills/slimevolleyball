class PatheticWhiteSlime extends SlimeAI {
  setSlimeMovement(options){
    // Pathetic White Slime reporting for duty

    // const ball_trajectory = this.getBallTrajectoryX({ ball: ball, y_limit: 125 });
    // const rng = slimeRNG()
    // if(slimePowerJumps()) return;
    // if(slimeMoves()) return;
    // if(slimeJumpMoves()) return;

    // BALL TRAJECTORY
    var xWhenBallBelow125 = this.getBallTrajectoryX({ ball: ball, y_limit: 125 });

    // RANDOM NUMBER LOGIC
    var something;
    if(this.y > 0 && this.x < 575) { // slime jumping and close to net
      something = 0;
    } else { // slime not jumping nor close to net
      something = 25 + Math.trunc(10 * Math.random());
    }

    // STATE SETTING
    var state = -1
    if(options.ball.x < 500){ // ball on player side
      state = -1;
    }

    // POWER JUMP
    // ball on player side OR ball is reset to serve
    if( state != -1 || (options.ball.xv == 0 && options.ball.x == 800)) {
      if (state == -1) { // ball on player side
        if(options.slime.x > 250) { // player is close to net
          state = 0;
        } else { // player is close to wall
          state = 1;
        }
        if(Math.random() < 0.35) {
          state = Math.trunc(2 * Math.random()); // random state applied, possibly broken
        }
      }
      if(state == 0) { // player is close to net
        if(options.ball.y < 300 && options.ball.yv < -3) { // ball close to wall and moving down fast
          this.slimeMoveRight();
          this.slimeJump();
        }
      } else if(state == 1) { // player is close to wall
        if(options.ball.y < 300 && options.ball.yv < 0) { // ball close to wall and moving down
          this.slimeMoveLeft();
          this.slimeJump();
        }
      }
      return;
    }

    // MOVEMENT LOGIC
    if (xWhenBallBelow125 < 500){ // ball landing trajectory on player side
      if (Math.abs(this.x - 666) < 20) { // slime closer to net
        this.slimeStop();
      } else if (this.x > 666) { // slime close to wall
        this.slimeMoveLeft();
      } else { // slime closer to net
        this.slimeMoveRight();
      }
      return;
    }

    // MOVING JUMP LOGIC
    if (Math.abs(this.x - xWhenBallBelow125) < something){ // slime x less than random
      if (this.y != 0 || Math.random() < 0.3) return; // slime jumping or random
      // slime close to wall, ball close to wall
      // slime close to net, ball close to net, slime close to ball
      if (
        (this.x >= 900 && options.ball.x > 830) ||
        (this.x <= 580 && options.ball.x < 530 && Math.abs(options.ball.x - this.x) < 100)
      ) {
        this.slimeJumpRandom(0.85);
      // distance x/y between ball and slime less than 28900
      // ball x is not same as slime x
      } else if (
        (Math.pow(options.ball.x - this.x, 2) * 2 + Math.pow(options.ball.y - this.y, 2) < 28900) &&
        (options.ball.x != this.x)) {
          this.slimeJumpRandom(0.85);
      // ball velocity x/y less than amount (?)
      // ball in front of slime
      // ball x is not same as slime x
      } else if (
        (Math.pow(options.ball.xv, 2) + Math.pow(options.ball.yv, 2) < 20) &&
        (options.ball.x - this.x < 30) &&
        (options.ball.x != this.x)) {
          this.slimeJumpRandom(0.85);
      // distance between slime and ball is less than num
      // ball is in middle of player side
      // random num less than num
      } else if (
        (Math.abs(options.ball.x - this.x) < 150) &&
        (options.ball.y > 50) && (options.ball.y < 400) &
        (Math.random() < 0.666)) {
          this.slimeJumpRandom(0.85);
      }
    }
    if (state == -1) { // ball on player side
      if(this.y == 0) { // slime not jumping
        if (Math.abs(this.x - xWhenBallBelow125) < something) { // distance between slime and trajectory less than random num
          this.slimeStop();
        } else if (xWhenBallBelow125 + something < this.x) { // ball trajectory to left of slime
          this.slimeMoveLeft();
        } else if (xWhenBallBelow125 + something > this.x) {  // ball trajectory to right of slime
          this.slimeMoveRight();
        }
      } else { // slime jumping
        if (this.x < 575) { // slime close to net
          return;
        }
        if (this.x > 900){ // slime close to wall
          this.slimeMoveRight();
          return;
        }
        if (Math.abs(this.x - options.ball.x) < something) { // slime within random reach of ball
          this.slimeStop();
        } else if (options.ball.x < this.x) { // ball to the left of slime
          this.slimeMoveLeft();
        } else if (options.ball.x > this.x) { // ball to the right of slime
          this.slimeMoveRight();
        }
      }
    }

  }
  slimeRNG(){

  }
  slimePowerJumps(){

  }
  slimeMoves(){

  }
  slimeJumpMoves(){

  }
}
