//var gamma = require('gamma');
var config = require('./config')
var FixedStep = require('./utils/fixedstep');
var repeater = require('./utils/reapeater');
var physics  = require('./utils/physics');

var ParticleManager = require('./particleManager');
var mm = require('./utils/messagemanager')();

module.exports = function () {

    var stepper = new FixedStep(config.PHYSICS_HZ, config.PHYSICS_DT, update);
    
    mm._write = function(msg) {
        postMessage(msg);
    }
    addEventListener('message', function(ev) {
        mm._queue(ev.data);
    })

    var particleman = new ParticleManager();
    // Call the stepper as often as possible.
    var repeaterCtl = repeater(function(dt) {
        var start = Date.now();
        var steps = stepper.update(dt);
        var end = Date.now();

        //console.log(dt);

        if (steps > 0) {
            mm.write({
                type: 'physics:timing',
                steps: steps,
                computedTime: end - start,
                postedAt: end
            });
        }
    });


    repeaterCtl.start();


    initApp();

    function initApp(){
        for(var ii = 0; ii < config.NUMBER; ii++){
            var rad = parseInt(Math.random() * 10 + 10);
            var posX = 2000 * Math.random();
            var posY = 2000 * Math.random();

            var particle  = particleman.getinate(null, [posX, posY, rad]);
        }
    }

    function update(dt){
        var startTime = Date.now();
        mm.read(message);

        var snapshots = [];
        var particles = particleman.all();
        physics.update(particles, dt);
        var endTime = Date.now();

        particles.forEach(function(particle){
            snapshots.push(particle.writeToSnapshot({}));
        });

        mm.write({
            type: 'physics:step',
            snapshots: snapshots,
            computedTime: endTime - startTime,
            postedAt: endTime
        });

    }

    function message(msg) {
        if (msg.type === 'HALT') {
            repeaterCtl.stop();
            // This will error in a FF worker, but it's ok since we'll still see it.
            // It just has to be the last line, otherwise other stuff will break
            // (also, we're not starting this up again, so it's fine).
            console.log('halting from worker');
            return true;
        }
    }

};

//console.log('test');

