class Inputs {
  constructor() {
    this.jump = false;
    this.down = false;
    this.left = false;
    this.right = false;
    document.addEventListener('keydown', e => {
      this.keyDown(e.code);
    });

    document.addEventListener('keyup', e => {
      this.keyUp(e.code);
    });
  }
  getClient(){
    return {
      jump: this.jump,
      down: this.down,
      left: this.left,
      right: this.right,
    };
  }
  keyDown(key){
    if(key == 'ArrowUp'){
      this.jump = true;
    }
    if(key == 'ArrowDown'){
      this.down = true;
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
    if(key == 'ArrowDown'){
      this.down = false;
    }
    if(key == 'ArrowLeft'){
      this.left = false;
    }
    if(key == 'ArrowRight'){
      this.right = false;
    }
  }
}
