class PatheticWhiteSlime extends SlimeAI {
  setSlimeMovement(options){
    // Pathetic White Slime reporting for duty


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

    if( this.slimeServe(options) ) return;

    const hitbox = this.y > 0 && this.x < 575 ? 0 : 35; // 35 // this ends up being where the slime will try to hit it on its head
    const ball_trajectory = this.getBallTrajectoryX({ ball: ball, y_limit: 125 });
    const slime_jumping = this.y !== 0;
    const slime_in_range_of_trajectory = Math.abs(this.x - ball_trajectory) < hitbox; // this.slimeInRange(ball_trajectory,hitbox);

    //if( slime_in_range_of_trajectory && slime_jumping ) return;

    // SLIME JUMP BEHAVIOR
    const slime_in_range_of_ball_150 = Math.abs(this.x - options.ball.x) < 150; // this.slimeInRange(options.ball.x,150);
    const slime_can_jump =
      !slime_jumping &&
      ball_trajectory >= 500 &&
      ball_trajectory <= 1000 &&
      slime_in_range_of_trajectory &&
      slime_in_range_of_ball_150;

      //(this.x >= 900 && options.ball.x > 830) ||
      //(this.x <= 580 && options.ball.x < 530 && Math.abs(options.ball.x - this.x) < 100)
      //options.ball.y > 50 &&
      //options.ball.y < 400 &&
      //options.ball.x != this.x &&
      //Math.pow(options.ball.xv, 2) + Math.pow(options.ball.yv, 2) < 20;
      //Math.pow(options.ball.x - this.x, 2) * 2 + Math.pow(options.ball.y - this.y, 2) < 28900;

    if( slime_can_jump ) {
      this.slimeJump();
      return;
    }

    // SLIME BEHAVIOR WHEN BALL ON PLAYERS SIDE
    const slime_in_range_of_665_20 = Math.abs(this.x - 665) < 20; // this.slimeInRange(665,20);
    const slime_beyond_665 = this.x > 665;
    if ( ball_trajectory < 500 && slime_in_range_of_665_20 ) {
      this.slimeStop();
      return;
    } else if ( ball_trajectory < 500 && slime_beyond_665 ) {
      this.slimeMoveLeft();
      return;
    } else if( ball_trajectory < 500 ) {
      this.slimeMoveRight();
      return;
    }

    // SLIME BEHAVIOR WHEN BALL ON SLIME SIDE
    const ball_trajectory_left_of_slime = ball_trajectory + hitbox < this.x;
    const ball_trajectory_right_of_slime = ball_trajectory + hitbox > this.x;
    if( ball_trajectory >= 500 && !slime_jumping && slime_in_range_of_trajectory ) {
      this.slimeStop();
      return;
    } else if ( ball_trajectory >= 500 && !slime_jumping && ball_trajectory_left_of_slime ) {
      this.slimeMoveLeft();
      return;
    } else if ( ball_trajectory >= 500 && !slime_jumping && ball_trajectory_right_of_slime ) {
      this.slimeMoveRight();
      return;
    }

    // SLIME BEHAVIOR WHEN BALL ON SLIME SIDE AND JUMPING
    const slime_in_range_of_ball_hitbox = Math.abs(this.x - options.ball.x) < hitbox; // this.slimeInRange(options.ball.x,hitbox);
    const ball_right_of_slime = options.ball.x > this.x;
    const ball_left_of_slime = options.ball.x < this.x;
    if( ball_trajectory >= 500 && slime_jumping && slime_in_range_of_ball_hitbox ) {
      this.slimeStop();
      return;
    } else if ( ball_trajectory >= 500 && slime_jumping && ball_left_of_slime ) { // ball to the left of slime
      this.slimeMoveLeft();
      return;
    } else if ( ball_trajectory >= 500 && slime_jumping && ball_right_of_slime ) { // ball to the right of slime
      this.slimeMoveRight();
      return;
    }




  }
  slimeServe(options){
    if(options.ball.x !== this.start_x) return false
    const jump_direction = Math.random() < 0.50 ? 'left' : 'right';
    if(this.y === 0 && jump_direction === 'right' && options.ball.y < 300){
      this.slimeJump();
      this.slimeMoveRight();
    } else if(this.y === 0 && jump_direction === 'left' && options.ball.y < 300){
      this.slimeJump();
      this.slimeMoveLeft();
    }
    return true;
  }
  slimeMoves(){

  }
  slimeJumpMoves(){

  }
}
