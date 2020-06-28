class SlimePlayer extends Slime {
  setSlimeMovement(options){
    if(this.y == 0 && options.inputs.jump){
      this.slimeJump();
    }
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
}
