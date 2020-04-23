const app: Express.Application = require('express')();
import * as http from 'http';
const server: http.Server = require('http').createServer(app);
const io: SocketIO.Server = require('socket.io')(server);

io.on('connection', (socket: any) => {
  socket.on('message', ({ name, message }) => {
    io.emit('message', { name, message });
  });
});

server.listen(4000, function () {
  console.log('listening on port 4000');
});
