class Ball {
  constructor() {
    this.x = 0; // Position X
    this.y = 0; // Position Y
    this.xv = 0; // Velocity X
    this.yv = 0; // Velocity Y
    this.xv_max = 15; // 15 // Max Velocity X
    this.yv_max = 22; // 22 // Max Velocity Y
    this.gravity = 1; // 1
    this.color = 'Yellow';
    this.radius = 30;
    this.trajectory_y_limit = 125;
    this.trajectory = null;
    this.bounds = {
      collision_padding: 5,
      net_left: 482,
      net_right: 518,
      net_top: 132,
      wall_left: 15,
      wall_right: 985,
    };
    this.player = {
      x: 202,
      y: 50,
    };
    this.opponent = {
      x: 800,
      y: 50
    };
  }
  log(){
    console.log('ball trajectory x: ' + this.trajectory);
    console.log('ball x,y: ' + this.x + ',' + this.y);
    console.log('ball xv,yv: ' + this.xv + ',' + this.yv );
    console.log('-----------------------------------------');
  }
  getPosition(){
    return {
      x: this.x,
      y: this.y,
      xv: this.xv,
      yv: this.yv,
    }
  }
  setPosition(options){
    this.x = options.x;
    this.y = options.y;
    this.xv = options.xv;
    this.yv = options.yv;
  }
  setPositionFromServer(options){
    if(options.x != this.x){
      this.x = options.x;
    }
    if(options.y != this.y){
      this.y = options.y;
    }
    if(options.xv != this.xv){
      this.xv = options.xv;
    }
    if(options.yv != this.yv){
      this.yv = options.yv;
    }
  }
  resetBall(player_to_serve){
    this.x = player_to_serve ? this.player.x : this.opponent.x;
    this.y = 356;
    this.xv = 0;
    this.yv = 0;
  }
  setBall(){
    this.yv += -this.gravity;
    if(this.yv < -this.yv_max) {
      this.yv = -this.yv_max;
    }
    this.x += this.xv;
    this.y += this.yv;
    this.trajectory = this.getBallTrajectoryX();
  }
  hitFloor(){
    if(this.y < 0) {
      this.y = 0;
      return this.x;
    }
    return false
  }
  hitWall(){
    if (this.x < 15) {
      this.x = 15;
      this.xv = -this.xv;
    } else if(this.x > 985){
      this.x = 985;
      this.xv = -this.xv;
    }
  }
  hitNet(){
    if (this.x > 480 && this.x < 520 && this.y < 140) {
      // bounces off top of net
      if (this.yv < 0 && this.y > 130) {
        this.yv *= -1;
        this.y = 130;
      } else if (this.x < 500) { // hits side of net
        this.x = 480;
        this.xv = this.xv >= 0 ? -this.xv : this.xv;
      } else {
        this.x = 520;
        this.xv = this.xv <= 0 ? -this.xv : this.xv;
      }
    }
  }
  hitSlime(slime) {
    var dx = 2 * (this.x - slime.x);
    var dy = this.y - slime.y;
    var dist = Math.trunc(Math.sqrt(dx * dx + dy * dy));
    var dVelocityX = this.xv - slime.xv;
    var dVelocityY = this.yv - slime.yv;
    if(dy > 0 && dist < this.radius + slime.radius && dist > this.bounds.collision_padding) {
      this.x = slime.x + Math.trunc(Math.trunc((slime.radius + this.radius) / 2) * dx / dist);
      this.y = slime.y + Math.trunc((slime.radius + this.radius) * dy / dist);
      var l = Math.trunc((dx * dVelocityX + dy * dVelocityY) / dist);
      if(l <= 0) {
        this.xv += Math.trunc(slime.xv - 2 * dx * l / dist);
        this.yv += Math.trunc(slime.yv - 2 * dy * l / dist);
        if( this.xv < -this.xv_max) this.xv = -this.xv_max;
        else if(this.xv > this.xv_max) this.xv =  this.xv_max;
        if( this.yv < -this.yv_max) this.yv = -this.yv_max;
        else if(this.yv > this.yv_max) this.yv = this.yv_max;
      }
    }
  }
  getBallTrajectoryX(){  // calculate ending ball x given a starting y
    var frames = this.getFramesUntilLimit(this.y, this.yv, this.trajectory_y_limit);
    var x = this.x;
    var xv = this.xv;
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
}
