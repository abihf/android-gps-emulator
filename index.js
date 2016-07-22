var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Client = require('./client');

var client = new Client('127.0.0.1', 5554);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('new connection');
  socket.on('geo', function(point) {
    var lat = point[0].toString().replace('.', ',');
    var lon = point[1].toString().replace('.', ',');
    var cmd = 'geo fix ' + lat + ' ' + lon;
    console.log('sending ', cmd);
    client.send(cmd, function(err, response) {
      if (err) console.error(err);
      else console.log(response);
      socket.emit('geo', response);
    });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
