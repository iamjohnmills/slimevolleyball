class Inputs {
  constructor() {
    this.jump = false;
    this.left = false;
    this.right = false;
  }
  getClient(){
    return {
      jump: this.jump,
      left: this.left,
      right: this.right,
    };
  }
  keyDown(key){
    if(key == 'ArrowUp'){
      this.jump = true;
    }
    if(key == 'ArrowLeft'){
      this.left = true;
    }
    if(key == 'ArrowRight'){
      this.right = true;
    }
  }
  keyUp(key){
    if(key == 'ArrowUp'){
      this.jump = false;
    }
    if(key == 'ArrowLeft'){
      this.left = false;
    }
    if(key == 'ArrowRight'){
      this.right = false;
    }
  }
}
