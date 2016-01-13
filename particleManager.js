var Particle = require('./particle');


var ParticleManager = function(){
    this.particles = {};
};

ParticleManager.uid = (function() {
    var id = 0;
    return function() {
        return 'particle_' + (++id);
    }
}());

ParticleManager.prototype.getinate = function(id, opts){
    var particle = this.particles[id];

    if(!particle){
        particle = new Particle();
        if(opts) Particle.apply(particle,opts);
        particle.id = id || ParticleManager.uid();
        this.particles[particle.id] = particle;
    }

    return particle;
};

ParticleManager.prototype.all = function(){
    return Object.keys(this.particles).map(function(id){
        return this.particles[id];
    }.bind(this));
};


ParticleManager.prototype.forEach = function(cb) {
    var particleIds = Object.keys(this.particles);
    var particle, ii;
    
    for (ii = 0; ii < particleIds.length; ii++) {
        particle = this.particles[particleIds[i]];
        cb(particle, ii);
    }
};



module.exports = ParticleManager;