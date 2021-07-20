class Water {
  constructor(options) {
  	this.color = "#3F00FF"
  	this.extend = 100
  	this.fK = 0.95
    this.up_force = 15
    this.down_force = 2
    this.total_particles = 40
  	this.particles = Array.apply(null, Array(40))
  	this.springs = []
  	this.width = 1000
  	this.height = 750
    this.directionY = 'up'
    this.createWater()
  }
  getParticles(){
    return this.particles;
  }
	async createWater() {
		var space = (this.width + this.extend) / this.total_particles;
		var xpos = (space * .5) - (this.extend * .5);
		var ypos = this.height + 30;
    this.particles = await this.particles.map((particle,i,particles) => {
      particle = {};
			particle.x = particle.xpos = xpos;
			particle.y = particle.ypos = particle.origY = ypos;
			particle.ay = 0;
			particle.vy = 0;
			particle.mass = 60;
			xpos += space;
      return particle
    })
    this.springs = await this.particles.map( (particle,i,particles) => {
      if( particles[i+1] ){
        return { iLengthY: particles[i+1].y - particle.y }
      }
    })
	}
  async moveWater(x,y,xv,yv) {
    //x = x - 50
    y = y + 750
    const target = await this.particles.reduce( (target_obj, particle, i) => {
			var dx = x - particle.x;
			var dy = y - particle.y;
			var dist = Math.sqrt(dx * dx + dy * dy);
      if(dist < target_obj.distance){
        target_obj.distance = dist;
        target_obj.particle = particle;
        target_obj.index = i;
      }
      return target_obj
    }, { distance: this.particles.length } )

    if(target.particle && y <= target.particle.y){

      const speed = yv > 0 ? y - (y + this.up_force) : y - (y - this.down_force);
      //const speed = this.directionY == 'up' ? y - (y + this.up_force) : y - (y - this.down_force);
			//await applyWaveMovement(target.index,speed);
			//this.particles[target.index - 3].vy = speed / 4;
			this.particles[target.index - 2].vy = speed / 4;
			this.particles[target.index - 1].vy = speed / 2;
			this.particles[target.index].vy = speed / 2;
			this.particles[target.index + 1].vy = speed / 2;
			this.particles[target.index + 2].vy = speed / 4;
			//this.particles[target.index + 3].vy = speed / 4;
    };
    this.particles = this.particles.map( (particle,i,particles) => {
			var fExtensionY = 0;
			var fForceY = 0;
			if(i > 0) {
				fExtensionY = particles[i-1].y - particle.y - this.springs[i-1].iLengthY;
				fForceY += -this.fK * fExtensionY;
			}
			if(i < particles.length-1) {
				fExtensionY = particle.y - particles[i+1].y - this.springs[i].iLengthY;
				fForceY += this.fK * fExtensionY;
			}
			fExtensionY = particle.y - particle.origY;
			fForceY += this.fK/15 * fExtensionY;
			particle.ay = -fForceY/particle.mass;
			particle.vy	+= particle.ay;
			particle.ypos += particle.vy;
			particle.vy /= 1.04;
      return particle
    })
  }
  async splashSlime(slime) {
    await this.moveWater(slime.x,slime.y,slime.xv,slime.yv)
  }
}
