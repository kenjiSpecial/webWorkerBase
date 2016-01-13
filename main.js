document.body.style.margin = '0';

var canvas = document.createElement('canvas');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

var config = require('./config');
var work = require('webworkify');
var w    = work(require('./worker.js'));
var cur  = Date.now(); var prev = Date.now();
var mm   = require('./utils/messagemanager')();
var raf  = require('raf');
var lastSnapshotReceivedAt;
var ParticleMan = require('./particleManager');
var particleMan = new ParticleMan();

w.addEventListener('message', function (ev) {
    mm._queue(ev.data);
});

function loop(){
    var total = mm.read(message);

    var now = Date.now();
    var ratio = (now - lastSnapshotReceivedAt) / 1000 / config.PHYSICS_HZ;
    var particles = particleMan.all();
    console.log(mm._buffer.length);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(particle, index){
        var currentPos = particle.getCurrentPosition(ratio);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect( currentPos.x, currentPos.y, particle.radius, particle.radius );
    });

    particles.forEach(function(){})


    raf(loop);
}

function message(msg){
    if(msg.type == 'physics:step'){
        var snapShots = msg.snapshots;
        snapShots.forEach(function(snapshot){
            var particle = particleMan.getinate(snapshot.id);
            particle.readFromSnapshot(snapshot);
        })

        lastSnapshotReceivedAt = Date.now();
        return true;
    }

    if(msg.type = 'physics:timing'){
        return true;
    }
}

raf(loop);
