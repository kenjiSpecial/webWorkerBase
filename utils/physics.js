
module.exports = {
    update : function(particles, dt){
        particles.forEach(function(particle){
            particle.iterate(dt)
        });
    }
};