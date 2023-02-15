class SlimeAI extends Slime {
  constructor(...options){
    super(...options);
    this.show_logs = false;
    this.variant = options[0].variant;

    this.serves = [
      { name: 'back_wall_and_near_jump', phase_count: 7 },
      { name: 'back_wall_net_skip', phase_count: 5 },
      { name: 'low_net_skip', phase_count: 8 },
      { name: 'basic', phase_count: 3 },
    ];

    this.current_serve = this.getServe(options[0].previous_serve);
  }
  log(){
    this.show_logs = true;
  }
  // setServe(to_serve){
  //   if(to_serve){
  //     this.current_serve = this.getServe();
  //   }
  // }
  getServe(previous_serve){
    const available_serves = previous_serve ? this.serves.filter(serve => serve.name !== previous_serve) : this.serves;
    const serve = available_serves[Math.floor(Math.random()*available_serves.length)];
    return {
      ...serve,
      phases: new Array(serve.phase_count).fill(false),
    }
  }
  getCurrentServeName(){
    return this.current_serve.name
  }
  setSlimeMovement(options){

    if(this.current_serve.phases.includes(false) && this.to_serve) return this.serve(options)

    const hitbox = this.y > 0 ? 0 : 5;
    const slime_in_range = Math.abs(this.x - options.ball.trajectory) < hitbox;

    const jump = Array.from([
      this.x <= 580 && options.ball.x < 530 && Math.abs(this.x - options.ball.x) < 100,
      (Math.pow(Math.abs(this.x - options.ball.x), 2) * 2 + Math.pow(Math.abs(this.y - options.ball.y), 2) < 28900) && options.ball.x != this.x,
      (Math.pow(Math.abs(options.ball.xv), 2) + Math.pow(Math.abs(options.ball.yv), 2) < 20) && options.ball.x - this.x < 30 && options.ball.x != this.x,
    ]).some(rule => rule) && this.y === 0 && slime_in_range;
    if(jump) return this.slimeJump(0.80)

    const move_stop = Array.from([
      options.ball.trajectory < 500 && Math.abs(this.x - 665) < 20,
      this.y === 0 && options.ball.trajectory >= 500 && slime_in_range,
      this.y !== 0 && options.ball.trajectory >= 500 && Math.abs(this.x - options.ball.x) < hitbox,
      this.y !== 0 && options.ball.trajectory >= 500 && this.x < options.ball.x,
    ]).some(rule => rule);
    if(move_stop) return this.slimeStop();

    const move_left = Array.from([
      options.ball.trajectory < 500 && this.x > 665,
      this.y === 0 && options.ball.trajectory >= 500 && this.x > options.ball.trajectory + hitbox,
      this.y !== 0 && options.ball.trajectory >= 500 && this.x > options.ball.x,
    ]).some(rule => rule);
    if(move_left) return this.slimeMoveLeft();

    const move_right = Array.from([
      options.ball.trajectory < 500,
      this.y === 0 && options.ball.trajectory >= 500 && this.x < options.ball.trajectory + hitbox,
    ]).some(rule => rule);
    if(move_right) return this.slimeMoveRight();

    // if(this.show_logs){
    //   console.log('slime ai in range: ' + slime_in_range);
    //   console.log('slime ai x,y: ' + this.x + ',' + this.y);
    //   console.log('slime ai xv,yv: ' + this.xv + ',' + this.yv );
    //   console.log('-----------------------------------------');
    // }


  }

  async serve(options){

    // if(!this.current_serve.phases.includes(false)) {
    //   let random_serve = this.getServe();
    //   while(random_serve.name === this.current_serve.name){
    //     random_serve = this.getServe();
    //   }
    //   this.current_serve = random_serve;
    // }

    if(this.current_serve.name === 'basic'){
      this.current_serve.jump_direction = !this.current_serve.jump_direction ? Math.random() < 0.50 ? 'left' : 'right' : this.current_serve.jump_direction;
      if(!this.current_serve.phases[0]){
        this.current_serve.phases[0] = options.ball.y < 300;
      } else if(!this.current_serve.phases[1]){
        this.slimeJump();
        this.current_serve.phases[1] = this.yv > 0;
      } else if(!this.current_serve.phases[2]){
        if(this.current_serve.jump_direction === 'right'){
          this.slimeMoveRight();
        } else {
          this.slimeMoveLeft()
        }
        this.current_serve.phases[2] = options.ball.x < 550;
      }
    }

    if(this.current_serve.name === 'back_wall_net_skip'){
      if(!this.current_serve.phases[0]){
        this.current_serve.phases[0] = options.ball.yv > 0;
      } else if(!this.current_serve.phases[1]){
        this.slimeMoveLeft()
        this.current_serve.phases[1] = this.x < 765;
      } else if(!this.current_serve.phases[2]){
        this.slimeStop();
        this.current_serve.phases[2] = options.ball.yv < 0 && options.ball.y < 262;
      } else if(!this.current_serve.phases[3]){
        this.slimeJump();
        this.current_serve.phases[3] = this.yv !== 0;
      } else if(!this.current_serve.phases[4]){
        this.current_serve.phases[4] = this.yv === 0;
      }
    }

    // back wall + random close jump
    if(this.current_serve.name === 'back_wall_and_near_jump'){
      if(!this.current_serve.phases[0]){
        this.slimeMoveLeft()
        this.current_serve.phases[0] = this.x <= 720;
      } else if(!this.current_serve.phases[1]){
        this.slimeStop();
        this.slimeJump();
        this.current_serve.phases[1] = this.yv !== 0;
      } else if(!this.current_serve.phases[2]){
        this.slimeMoveRight();
        this.current_serve.phases[2] = this.x > 750;
      } else if(!this.current_serve.phases[3]){
        this.slimeStop();
        this.slimeMoveLeft();
        this.current_serve.phases[3] = this.x < 650;
      } else if(!this.current_serve.phases[4]){
        this.slimeStop();
        this.current_serve.phases[4] = this.y === 0 && options.ball.x < 700;
      } else if(!this.current_serve.phases[5]){
        this.slimeJump(0.5);
        this.current_serve.phases[5] = true;
      } else if(!this.current_serve.phases[6]){
        this.slimeMoveLeft();
        this.current_serve.phases[6] = options.ball.x <= 550;
      }
    }

    if(this.current_serve.name === 'low_net_skip'){
      this.current_serve.ball_y_logic = !this.current_serve.ball_y_logic ? Math.random() <= 0.66 ? 262 : 300 : this.current_serve.ball_y_logic;
      if(!this.current_serve.phases[0]){
        this.current_serve.phases[0] = options.ball.yv > 0;
      } else if(!this.current_serve.phases[1]){
        this.slimeMoveRight()
        this.current_serve.phases[1] = this.x >= 860;
      } else if(!this.current_serve.phases[2]){
        this.slimeStop();
        this.current_serve.phases[2] = options.ball.yv < 0 && options.ball.y < this.current_serve.ball_y_logic;
      } else if(!this.current_serve.phases[3]){
        this.slimeJump();
        this.current_serve.phases[3] = this.y !== 0;
      } else if(!this.current_serve.phases[4]){
        this.slimeStop();
        this.current_serve.phases[4] = this.y !== 0 && Math.abs(this.y - options.ball.y) < 130;
      } else if(!this.current_serve.phases[5]){
        this.slimeMoveLeft(13);
        this.current_serve.phases[5] = this.x <= 875;
      } else if(!this.current_serve.phases[6]){
        this.slimeMoveRight();
        this.current_serve.phases[6] = this.x >= 900;
      } else if(!this.current_serve.phases[7]){
        this.slimeStop();
        this.current_serve.phases[7] = this.y === 0;
      }
    }
  }
}
