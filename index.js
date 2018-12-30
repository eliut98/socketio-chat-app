const express = require('express');
const path = require('path');
const app = express();

const SocketIO = require('socket.io');

// Settings
app.set('port', process.env.PORT || 3000);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start server
const server = app.listen(app.get('port'), () => {
    console.log('server listening');
});

// WebSockets
const io = SocketIO(server);

io.on('connection', (socket) => {
    console.log('New connection', socket.id);
    socket.on('message', (data) => {
        io.sockets.emit('messageServer', data);
    });
    socket.on('typing', (data) => {
        socket.broadcast.emit('userTyping', data);
    });
});