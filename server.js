let http = require('http');
let express = require('express');
let socketIo = require('socket.io');

let app = express();
let server = http.createServer(app);
let io = socketIo(server);

// Serve the static files from the "public" directory
app.use(express.static('public'));

let connectedPlayers = 0
let connectedPlayerPositions = []

io.on('connection', (socket) => {
    connectedPlayers += 1
    let player = connectedPlayers
    console.log(`Player ${player} connected`);
    connectedPlayerPositions = [...connectedPlayerPositions, [player*20, player*20]]
    socket.emit('connection entry', [connectedPlayerPositions, player])
    io.emit('other player connection entry', [connectedPlayerPositions, player])

    socket.on('disconnect', () => {
        console.log(`Player ${player} disconnected`);
        connectedPlayerPositions[player - 1] = [-20, -20]
        io.emit('update', [connectedPlayerPositions])
    });

    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        io.emit('message', msg); // Broadcast the message to all clients
    });

    socket.on('move up', (msg) => {
        connectedPlayerPositions[msg - 1][1] -= 0.9
        io.emit('update', [connectedPlayerPositions])
    })
    socket.on('move right', (msg) => {
        connectedPlayerPositions[msg - 1][0] += 0.9
        io.emit('update', [connectedPlayerPositions])
    })
    socket.on('move down', (msg) => {
        connectedPlayerPositions[msg - 1][1] += 0.9
        io.emit('update', [connectedPlayerPositions])
    })
    socket.on('move left', (msg) => {
        connectedPlayerPositions[msg - 1][0] -= 0.9
        io.emit('update', [connectedPlayerPositions])
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});