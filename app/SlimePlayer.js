class SlimePlayer extends Slime {
  setSlimeMovement(options){
    if(this.y == 0 && options.inputs.jump){
      this.slimeJump();
    }
    this.do_slime_dunk = options.inputs.down;
    if(options.inputs.left && !options.inputs.right) {
      this.slimeMoveLeft();
    } else if(options.inputs.right && !options.inputs.left) {
      this.slimeMoveRight();
    } else {
      this.slimeStop();
    }
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
}
