class FastGuySlime extends SlimeAI {
  setSlimeMovement(options){

    // Fasy guy is here

    if( this.slimeServe(options) ) return;

    const hitbox_in_air = 0
    const hitbox_on_ground = 5
    const hitbox = this.y > 0 ? hitbox_in_air : hitbox_on_ground;
    const ball_trajectory = this.getBallTrajectoryX({ ball: ball, y_limit: 125 });
    const slime_jumping = this.y !== 0;
    const slime_in_range_of_trajectory = Math.abs(this.x - ball_trajectory) < hitbox; // this.slimeInRange(ball_trajectory,hitbox);
    const ball_distance = Math.abs(this.x - options.ball.x);

    // JUMP BEHAVIOR
    const slime_jump_conditions = [
      (
        this.x <= 580
        && options.ball.x < 530
        && ball_distance < 100
      ),
      (
        Math.pow(ball_distance, 2) * 2 + Math.pow(Math.abs(this.y - options.ball.y), 2) < 28900
        && options.ball.x != this.x
      ),
      (
        Math.pow(Math.abs(options.ball.xv), 2) + Math.pow(Math.abs(options.ball.yv), 2) < 20
        && Math.abs(options.ball.x - this.x) < 30
        && options.ball.x != this.x
      ),
      (
        ball_distance < 150
        && options.ball.y > 50
        && options.ball.y < 400
        //Math.random() < 0.666
      ),
      /*
      (
        ball_trajectory > 500
        && options.ball.x > this.x
        && Math.abs(this.x - options.ball.x) < 150
      ),
      */
      /*
      (
        ball_trajectory <= 500 &&
        options.ball.yv < 0 &&
        options.ball.xv < 0 &&
        options.ball.x < this.x + 30 &&
        Math.abs(this.x - options.ball.x) < 20
      ),
      */
    ]

    if(!slime_jumping && slime_in_range_of_trajectory && slime_jump_conditions.includes(true)){
      this.slimeJump()
      //this.slimeJumpRandom(0.80)
    }



    // STOP BEHAVIOR
      const move_stop_conditions = [
      ( // stop position when player serve
        ball_trajectory < 500 &&
        Math.abs(this.x - 665) < 20
      ),
      ( // prepare for jump
        !slime_jumping &&
        ball_trajectory >= 500 &&
        slime_in_range_of_trajectory
      ),
      ( // stop moving after jumping and hitting ball
        slime_jumping &&
        ball_trajectory >= 500 &&
        Math.abs(this.x - options.ball.x) < hitbox
      ),
    ]

    if(move_stop_conditions.includes(true)){
      this.slimeStop();
      return;
    }





    // MOVE LEFT BEHAVIOR
    const move_left_conditions = [
      ( // move slime into default position
        ball_trajectory < 500 &&
        this.x > 665
      ),
      ( // ball will land in front of slime
        !slime_jumping &&
        ball_trajectory >= 500 &&
        this.x > ball_trajectory + hitbox
      ),
      ( // ball in front of slime while jumping
        slime_jumping &&
        ball_trajectory >= 500 &&
        this.x > options.ball.x
      ),
    ]


    if(move_left_conditions.includes(true)){
      this.slimeMoveLeft(12);
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
      this.slimeMoveRight(12);
      return;
    }






  }
  slimeServe(options){
    if(options.ball.x !== this.start_x) return false
    const jump_direction = Math.random() < 0.50 ? 'left' : 'right';
    if(this.y === 0 && jump_direction === 'right' && options.ball.y < 300){
      this.slimeJump();
      this.slimeMoveLeft();
      //this.slimeMoveRight();
    } else if(this.y === 0 && jump_direction === 'left' && options.ball.y < 300){
      this.slimeJump();
      this.slimeMoveLeft();
    }
    return true;
  }
}
