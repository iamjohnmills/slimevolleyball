class Slime {
  constructor(options) {
    this.is_player = options.is_player;
    this.x = options.x;
    this.y = 0;
    this.xv = 0;
    this.yv = 0;
    this.do_slime_dunk = false;
    this.color = options.color
    this.radius = options.radius;
    this.eye_location = options.eye_location;
    this.bounds = {
      left: options.left,
      right: options.right,
    }
    this.start_x = options.x;
    this.chat = {
      show: false,
      location: options.chat.location,
      message: options.chat.message,
    }
  }
  resetSlime(){
    this.x = this.start_x;
    this.y = 0;
    this.xv = 0;
    this.yv = 0;
  }
  setSlime(){
    //if(this.xv == 0 && this.yv == 0) return; // slime not moving
    this.x += this.xv; // increase slime movement
    if(this.x < this.bounds.left){ // slime at left boundary
      this.x = this.bounds.left
    } else if(this.x > this.bounds.right){ // slime at right boundary
      this.x = this.bounds.right
    }
    /*
    if(this.yv == 0) return; // not jumping
    this.yv -= 2; // decrease slime velocity if jumping
    this.y += this.yv;
    if(this.y == 0) { // set slime to floor
      this.y = 0;
      this.yv = 0;
    }
    */

    if(this.do_slime_dunk) {
        this.yv -= 2;
        this.y += this.yv;
      if(this.y <= 0 && this.yv >= 0) {
        this.yv = 40;
      } else if(this.y <= -40 && this.yv <= 0) {
        this.yv += Math.abs(this.yv) * 2;
      }
    } else {
      this.yv -= 2;
      this.y += this.yv;
      if(this.y < 0 && this.yv < 0) {
        this.y = 0;
        this.yv = 0;
      }
    }

  }
  slimeMoveLeft(v = 8){
    this.xv = -v
  }
  slimeMoveRight(v = 8){
    this.xv = v
  }
  slimeJump(){
    this.yv = 31;
  }
  slimeStop(){
    this.xv = 0
  }
  setSlimeChat(options){
    this.chat.show = true;
    this.chat.message = options.message;
    setTimeout(function(){
      this.chat.show = false;
    }.bind(this),options.delay)

  }
}
