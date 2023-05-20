// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

// Store the connected users' streams
const connectedUsers = {};

io.on('connection', socket => {
  // Listen for 'user-connected' events from clients
  socket.on('user-connected', stream => {
    connectedUsers[socket.id] = stream;

    // Emit the 'user-connected' event to all other connected clients, passing the ID and stream of the new user
    socket.broadcast.emit('user-connected', { userId: socket.id, stream });

    // Listen for 'disconnect' events from clients
    socket.on('disconnect', () => {
      // Delete the disconnected user's stream from the connected users' object
      delete connectedUsers[socket.id];

      // Emit the 'user-disconnected' event to all connected clients, passing the ID of the disconnected user
      socket.broadcast.emit('user-disconnected', socket.id);
    });

    // Listen for 'call-ended' events from clients
    socket.on('call-ended', () => {
      // Emit the 'call-ended' event to all connected clients
      io.emit('call-ended');
    });
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
