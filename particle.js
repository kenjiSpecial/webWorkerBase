var mix = require('./utils/utils').mix;

var Particle = function(x, y, radius ){
    this.pPos = {x: x - Math.random(), y: y};
    this.cPos = {x: x, y: y};
    this.radius = radius;
};

Particle.prototype.iterate = function(dt){
    var velX = this.cPos.x - this.pPos.x;
    var velY = this.cPos.y - this.pPos.y;

    var x = this.cPos.x + velX;
    var y = this.cPos.y + velY;

    this.pPos.x = this.cPos.x;
    this.pPos.y = this.cPos.y;

    this.cPos.x = x;
    this.cPos.y = y;
};

Particle.prototype.readFromSnapshot = function(data){
    this.pPos.x = data.px;
    this.pPos.y = data.py;
    this.cPos.x = data.cx;
    this.cPos.y = data.cy;
    this.radius = data.radius;
    this.id = this.id || data.id;
};

Particle.prototype.writeToSnapshot = function(data){
    data = data || {};

    data.px = this.pPos.x;
    data.py = this.pPos.y;
    data.cx = this.cPos.x;
    data.cy = this.cPos.y;
    data.radius = this.radius;
    data.id = this.id;

    return data;
}

Particle.prototype.getCurrentPosition = function(ratio){
    var x = mix( this.pPos.x, this.cPos.x, ratio );
    var y = mix( this.pPos.y, this.cPos.y, ratio );

    return {x: x, y: y};
}

module.exports = Particle;