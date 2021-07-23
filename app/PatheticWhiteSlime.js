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


    const hitbox_in_air = 0
    const hitbox_on_ground = 5
    const hitbox = this.y > 0 ? hitbox_in_air : hitbox_on_ground;
    const ball_trajectory = this.getBallTrajectoryX({ ball: ball, y_limit: 125 });
    const slime_jumping = this.y !== 0;
    const slime_in_range_of_trajectory = Math.abs(this.x - ball_trajectory) < hitbox; // this.slimeInRange(ball_trajectory,hitbox);


    // JUMP BEHAVIOR
    const slime_jump_conditions = [
      /*
      (
        this.x >= 900 &&
        options.ball.x > 830
      ),
      */
      (
        this.x <= 580 &&
        options.ball.x < 530 &&
        Math.abs(this.x - options.ball.x) < 100
      ),
      (
        (Math.pow(Math.abs(this.x - options.ball.x), 2) * 2 + Math.pow(Math.abs(this.y - options.ball.y), 2) < 28900) &&
        (options.ball.x != this.x)
      ),
      (
         // might need to be asolute-ized
        (Math.pow(Math.abs(options.ball.xv), 2) + Math.pow(Math.abs(options.ball.yv), 2) < 20) &&
        (options.ball.x - this.x < 30) &&
        (options.ball.x != this.x)
      ),
      (
        Math.abs(this.x - options.ball.x) < 150 &&
        options.ball.y > 50 &&
        options.ball.y < 400 &&
        Math.random() < 0.666
      ),
    ]

    if(!slime_jumping && slime_in_range_of_trajectory && slime_jump_conditions.includes(true)){
      this.slimeJump();
    }

    // STOP BEHAVIOR
    const move_stop_conditions = [
      (
        ball_trajectory < 500 &&
        Math.abs(this.x - 665) < 20
      ),
      (
        !slime_jumping &&
        ball_trajectory >= 500 &&
        slime_in_range_of_trajectory
      ),
      (
        slime_jumping &&
        ball_trajectory >= 500 &&
        Math.abs(this.x - options.ball.x) < hitbox
      ),
      (
        slime_jumping &&
        ball_trajectory >= 500 &&
        this.x < options.ball.x
      ),
    ]

    if(move_stop_conditions.includes(true)){
      this.slimeStop();
      return;
    }

    // MOVE LEFT BEHAVIOR
    const move_left_conditions = [
      (
        ball_trajectory < 500 &&
        this.x > 665
      ),
      (
        !slime_jumping &&
        ball_trajectory >= 500 &&
        this.x > ball_trajectory + hitbox
      ),
      (
        slime_jumping &&
        ball_trajectory >= 500 &&
        this.x > options.ball.x
      ),
    ]

    if(move_left_conditions.includes(true)){
      this.slimeMoveLeft();
      return;
    }


    // MOVE RIGHT BEHAVIOR
    const move_right_conditions = [
      (
        ball_trajectory < 500
      ),
      (
        !slime_jumping &&
        ball_trajectory >= 500 &&
        this.x < ball_trajectory + hitbox
      ),
    ]

    if(move_right_conditions.includes(true)){
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
}
