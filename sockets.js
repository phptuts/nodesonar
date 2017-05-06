var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(){
    console.log('connected');
});

setInterval(function () {
    io.sockets.emit('hello', {'i_am_here': true});
}, 2000);

server.listen(1800);
