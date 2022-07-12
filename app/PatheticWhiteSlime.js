// Pathetic White Slime reporting for duty
class PatheticWhiteSlime extends SlimeAI {
  constructor(...options){
    super(...options);
    this.ball_trajectory_y_limit = 125;
  }
  setSlimeMovement(options){
    this.debug = options.debug;
    if(this.isSlimeServe(options)) return this.serve(options);
    this.setCalculations(options);
    const jump = this.canJump({ rules: this.getJumpRules(options) });
    const move_stop = this.canMove({ rules: this.getMoveStopRules(options) });
    const move_left = this.canMove({ rules: this.getMoveLeftRules(options) });
    const move_right = this.canMove({ rules: this.getMoveRightRules(options) });
    if(this.debug){
      console.log('ball trajectory: ' + this.ball_trajectory);
      console.log('slime in range: ' + this.slime_in_range);
      console.log('ball x,y: ' + options.ball.x + ',' + options.ball.y);
      console.log('ball xv,yv: ' + options.ball.xv + ',' + options.ball.yv);
      console.log('slime x,y: ' + this.x + ',' + this.y);
      console.log('slime xv,yv: ' + this.xv + ',' + this.yv );
      console.log('-----------------------------------------');
      // console.log('jump', this.getJumpRules(options));
      // console.log('move_stop', this.getMoveStopRules(options));
      // console.log('move_left', this.getMoveLeftRules(options));
      // console.log('move_right', this.getMoveRightRules(options));
    }
    if(jump) this.slimeJumpRandom(0.80)
    if(move_stop) return this.slimeStop();
    if(move_left) return this.slimeMoveLeft();
    if(move_right) return this.slimeMoveRight();
  }
  getMoveRightRules(options){
    return [
      (
        this.ball_trajectory < 500
      ),
      (
        !this.isSlimeJumping() &&
        this.ball_trajectory >= 500 &&
        this.x < this.ball_trajectory + this.getHitbox()
      ),
    ]
  }
  getMoveLeftRules(options){
    return [
      (
        this.ball_trajectory < 500 &&
        this.x > 665
      ),
      (
        !this.isSlimeJumping() &&
        this.ball_trajectory >= 500 &&
        this.x > this.ball_trajectory + this.getHitbox()
      ),
      (
        this.isSlimeJumping() &&
        this.ball_trajectory >= 500 &&
        this.x > options.ball.x
      ),
    ]
  }
  getMoveStopRules(options){
    return [
      (
        this.ball_trajectory < 500 &&
        Math.abs(this.x - 665) < 20
      ),
      (
        !this.isSlimeJumping() &&
        this.ball_trajectory >= 500 &&
        this.slime_in_range
      ),
      (
        this.isSlimeJumping() &&
        this.ball_trajectory >= 500 &&
        Math.abs(this.x - options.ball.x) < this.getHitbox()
      ),
      (
        this.isSlimeJumping() &&
        this.ball_trajectory >= 500 &&
        this.x < options.ball.x
      ),
    ]
  }
  getJumpRules(options){
    return [
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
        (Math.pow(Math.abs(options.ball.xv), 2) + Math.pow(Math.abs(options.ball.yv), 2) < 20) &&
        (options.ball.x - this.x < 30) &&
        (options.ball.x != this.x)
      ),
      // (
      //   Math.abs(this.x - options.ball.x) < 150 &&
      //   options.ball.y > 50 &&
      //   options.ball.y < 400 &&
      //   Math.random() < 0.666
      // ),
    ]
  }
  serve(options){
    const jump_direction = Math.random() < 0.50 ? 'left' : 'right';
    if(this.y === 0 && jump_direction === 'right' && options.ball.y < 300){
      this.slimeJump();
      this.slimeMoveRight();
    } else if(this.y === 0 && jump_direction === 'left' && options.ball.y < 300){
      this.slimeJump();
      this.slimeMoveLeft();
    }
  }
}
