class Animate {
  constructor(options) {
    this.theme = options.theme;
    console.log(this.theme)
    this.context = null;
    this.pi = options.pi;
    this.two_pi = options.pi * 2;
    this.pixel_density = {
      x: options.width / 1000,
      y: options.height / 1000,
    }
    this.backdrop = {
      color: '#0000FF',
      x: 0,
      y: 0,
      width: options.width,
      height: options.height - 75,
    }
    this.floor = {
      color: '#0000FF',
      x: 0,
      y: options.height - 75,
      width: options.width,
      height: 75,
    }
    this.net = {
      color: 'White',
      x: 372.5,
      y: 264,
      width: 4,
      height: 40,
    }
    this.water = {
      color: "rgba(0, 150, 255,0.8)", //#0, 150, 255,0.8
      width: 750,
      height: 375,
    }
  }
  setCanvas(options){
    this.context = options.canvas.getContext("2d", {alpha: false});
  }
  game(options){
    this.drawBackdrop();
    this.drawFloor()

    if(options.slime_player){
      this.drawSlime( this.applyPixelDensityToSlime({ slime: options.slime_player, ball: options.ball }) );
    }
    if(options.slime_opponent){
      this.drawSlime( this.applyPixelDensityToSlime({ slime: options.slime_opponent, ball: options.ball }) );
    }
    this.drawNet();
    if(options.ball){
      this.drawBall( this.applyPixelDensityToBall({ ball: options.ball }) );
    }

    if(options.water){
      this.drawWater({ particles: options.water.particles })
    }
    this.drawScores({ score: options.score });
  }
  arena(options){
    this.drawBackdrop();
    this.drawBall( this.applyPixelDensityToBall({ ball: options.ball }) );
    this.drawNet();
    this.drawScores({ score: options.score });
  }
  drawBackdrop(){
    //this.context.fillStyle = this.backdrop.color;
    const gradient = this.context.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, this.theme.background[0]);
    gradient.addColorStop(1, this.theme.background[1]);
    this.context.fillStyle = gradient;
    this.context.fillRect(this.backdrop.x, this.backdrop.y, this.backdrop.width, this.backdrop.height);
  }
  drawFloor(){
    this.context.beginPath();
    this.context.rect(this.floor.x, this.floor.y, this.floor.width, this.floor.height);
    this.context.fillStyle = this.theme.background[1];
    this.context.fill();
  }
  drawNet(){
    this.context.beginPath();
    this.context.rect(this.net.x, this.net.y, this.net.width, this.net.height);
    this.context.fillStyle = this.theme.net;
    this.context.fill();
  }
  drawBall(ball){
    this.context.beginPath();
    this.context.arc(ball.x, ball.y, ball.radius, 0, this.two_pi);
    this.context.fillStyle = this.theme.ball;
    this.context.fill();
  }
  drawSlime(slime){
    this.drawSlimeChat(slime);
    this.context.beginPath();
    this.context.arc(slime.x, slime.y, slime.radius, this.pi, this.two_pi);
    this.context.fillStyle = slime.is_player ? this.theme.slime_player.body : this.theme.slime_opponent.body;
    this.context.fill();
    this.context.beginPath();
    this.context.ellipse(slime.x, slime.y, slime.radius,slime.radius / 5,0,0, this.two_pi);
    this.context.fillStyle = slime.is_player ? this.theme.slime_player.body : this.theme.slime_opponent.body;
    this.context.fill();
    this.context.translate(slime.eye.translate.x, slime.eye.translate.y);
    this.context.beginPath();
    this.context.arc(slime.eye.x, slime.eye.y, slime.eye.radius, 0, this.two_pi);
    this.context.fillStyle = slime.is_player ? this.theme.slime_player.eye : this.theme.slime_opponent.eye;
    this.context.fill();
    this.context.beginPath();
    this.context.arc(slime.pupil.x, slime.pupil.y, slime.pupil.radius, 0, this.two_pi);
    this.context.fillStyle = slime.is_player ? this.theme.slime_player.pupil : this.theme.slime_opponent.pupil;
    this.context.fill();
    this.context.setTransform(1,0,0,1,0,0);
  }
  drawSlimeChat(slime){
    if(!slime.chat.show) return;
    this.context.font = 'bold 16px Arial';
    var x = slime.x;
    var y = slime.y - slime.radius - 20;
    var line_height = 18;
    var max_width = 100;
    var words = slime.chat.message.split(' ');
    var lines = [];
    var currentLine = words[0];
    var biggest_line_width = this.context.measureText(currentLine).width;
    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = this.context.measureText(currentLine + ' ' + word).width;
        if (width < max_width) {
            biggest_line_width = width > biggest_line_width ? width : biggest_line_width;
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    x = slime.chat.location == 'left' ? x + 40 : slime.x - biggest_line_width - 40;
    var message_height = line_height * lines.length;
    var y_height = y - message_height;
    var padding = 10;
    var chat_bubble = {
      x: x - padding,
      y: y_height - padding + 5,
      width: biggest_line_width + padding * 2,
      height: message_height + padding * 2 - 2,
      border_radius: 10,
      color: '#FFFFFF',
    }

    this.roundRect(chat_bubble.x, chat_bubble.y, chat_bubble.width, chat_bubble.height, chat_bubble.border_radius, chat_bubble.color);

    for(var i in lines){
      this.context.beginPath();
      this.context.fillStyle = '#000';
      y_height = y_height + line_height;
      this.context.fillText(lines[i], x, y_height);
      this.context.fill();
    }

  }
  roundRect(x, y, width, height, radius, fill) {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
    this.context.beginPath();
    this.context.moveTo(x + radius.tl, y);
    this.context.lineTo(x + width - radius.tr, y);
    this.context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.context.lineTo(x + width, y + height - radius.br);
    this.context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    this.context.lineTo(x + radius.bl, y + height);
    this.context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.context.lineTo(x, y + radius.tl);
    this.context.quadraticCurveTo(x, y, x + radius.tl, y);
    this.context.closePath();
    this.context.fillStyle = fill;
    this.context.fill();
  }
  drawScores(options){
    var color;
    for(var i = 1; i <= options.score.max; i++){
      color = i <= options.score.player ? this.theme.score.active : this.theme.score.inactive;
      this.drawScore({ x: i * 20, y: 20, color: color });
    }
    for(var i = 1; i <= options.score.max; i++){
      color = i > options.score.max - options.score.opponent ? this.theme.score.active : this.theme.score.inactive;
      this.drawScore({ x: 590 + i * 20, y: 20, color: color });
    }
  }
  drawScore(options){
    this.context.beginPath();
    this.context.arc(options.x, options.y, 5, 0, this.two_pi);
    this.context.fillStyle = options.color;
    this.context.fill();
  }
  drawWater(options){
      // this.context.globalCompositeOperation = 'multiply';
			this.context.fillStyle = this.theme.water;
			this.context.beginPath();
      options.particles.forEach( (particle,i,particles) => {
				if(i === 0) {
					this.context.moveTo((particle.xpos * this.pixel_density.x) + ((particles[i+1].xpos * this.pixel_density.x) - (particle.xpos * this.pixel_density.x)) / 2, (particle.ypos * this.pixel_density.y) + ((particles[i+1].ypos * this.pixel_density.y) - (particle.ypos * this.pixel_density.y)) / 2);
				} else if(i < particles.length-1) {
					this.context.quadraticCurveTo((particle.xpos * this.pixel_density.x), (particle.ypos * this.pixel_density.y), (particle.xpos * this.pixel_density.x) + ((particles[i+1].xpos * this.pixel_density.x) - (particle.xpos * this.pixel_density.x)) / 2, (particle.ypos * this.pixel_density.y) + ((particles[i+1].ypos * this.pixel_density.y) - (particle.ypos * this.pixel_density.y)) / 2);
				}
				particle.x = particle.xpos;
				particle.y = particle.ypos;
      })
			this.context.lineTo(this.water.width, this.water.height);
			this.context.lineTo(0, this.water.height);
			this.context.lineTo(0, this.water.height / 2);
			this.context.closePath();
			this.context.fill();

  }
  applyPixelDensityToBall(options){ // apply pixel densities to ball
    return {
      x: options.ball.x * this.pixel_density.x,
      y: this.backdrop.height - (options.ball.y * this.pixel_density.y),
      color: options.ball.color,
      radius: options.ball.radius * this.pixel_density.y
    }
  }
  applyPixelDensityToSlime(options){ // generate eyes and apply pixel densities to slime
    // Slime
    var aa = options.slime.x * this.pixel_density.x;
    var ab = this.backdrop.height - (options.slime.y * this.pixel_density.y);
    var ac = options.slime.radius * this.pixel_density.y;
    // Eye
    var ba = options.slime.x + (options.slime.eye_location == 'right' ? 1 : -1) * options.slime.radius / 4;
    var bb = options.slime.y + options.slime.radius / 2;
    var bc = ba * this.pixel_density.x;
    var bd = this.backdrop.height - (bb * this.pixel_density.y);
    var be = ac / 4;
    // Pupil
    var ca = options.ball.x - ba;
    var cb = bb - options.ball.y;
    var cc = Math.sqrt(ca * ca + cb * cb);
    var cd = ac / 8;
    var ce = cd * ca / cc;
    var cf = cd * cb / cc;
    return {
      x: aa,
      y: ab,
      is_player: options.slime.is_player,
      color: options.slime.color,
      chat: options.slime.chat,
      radius: ac,
      eye: {
        x: 0,
        y: 0,
        radius: be,
        translate: {
          x: bc,
          y: bd,
        },
      },
      pupil: {
        x: ce,
        y: cf,
        radius: cd,
      }
    }
  }
}
