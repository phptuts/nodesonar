var express = require('express');
var path = require("path");
var five = require("johnny-five");
var net = require('net');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var client = new net.Socket();
var board = new five.Board();

app.use('/socket-io', express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use('/smoothie', express.static(__dirname + '/node_modules/smoothie/'));

board.on("ready", function() {

    var distance = null;

    var proximity = new five.Proximity({
        controller: "HCSR04",
        pin: 7
    });

    io.on('connection', function(){
        console.log('connected');
        proximity.on("data", function() {
            distance = {in: this.in, cm: this.cm};
        });
    });

    setInterval(function () {
        io.sockets.emit('distance-updated', distance);
    }, 700);

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/index.html'));
    });

    app.listen(3000, function () {
        console.log('localhost:3000 is ready.')
    });

    server.listen(1800);
});


