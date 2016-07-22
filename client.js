
var net = require('net');

function Client(host, port) {
    var socket = new net.Socket();
    socket.on('connect', function(){
      socket.write("\xFF\xFC\x01\n");
    });
    socket.on('data', this.onRecv.bind(this));
    socket.connect({host: '127.0.0.1', port: 5554});    
    
    this.socket = socket;
    this.recvCb = null;
    this.status = 'ready';
}

Client.prototype.send = function send(msg, cb) {
  var self = this;
  if (self.status == 'ready') {
    self.socket.write(msg + "\n");
    self.recvCb = function(msg) {
      cb(null, msg.toString());
    }
  }
  
}

Client.prototype.onRecv = function onRecv(msg) {
  if (this.recvCb) {
    this.recvCb(msg);
    this.recvCb = null;
  }
  else {
      console.log(msg.toString());
  }
}

module.exports = Client;

