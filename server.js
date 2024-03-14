let http = require('http');
let express = require('express');
let socketIo = require('socket.io');

let app = express();
let server = http.createServer(app);
let io = socketIo(server);

// Serve the static files from the "public" directory
app.use(express.static('public'));

let connectedPlayers = 0
let connectedPlayerPositions = {
    "Lobby": [],
    "Light Party Queue": [],
    "Full Party Queue": [],
    "Light Party 1": [],
    "Light Party 2": [],
    "Light Party 3": [],
    "Light Party 4": [],
    "Light Party 5": [],
    "Full Party 1": [],
    "Full Party 2": [],
    "Full Party 3": [],
}
console.log(connectedPlayerPositions)

io.on('connection', (socket) => {
    connectedPlayers += 1
    let player = connectedPlayers
    let playerLocation = "Lobby"
    let playerID = connectedPlayerPositions["Lobby"].length + 1

    console.log(`Player ${player} connected`);
    // extend the list with [700, 300] as a position
    connectedPlayerPositions["Lobby"] = [...connectedPlayerPositions["Lobby"], [700, 300, "ast"]]
    console.log(connectedPlayerPositions)
    socket.emit('connection entry', [connectedPlayerPositions, playerID])
    io.emit('other player connection entry', [connectedPlayerPositions, playerID])

    socket.on('disconnect', () => {
        console.log(`Player ${player} disconnected`);
        connectedPlayerPositions[playerLocation][playerID - 1] = [-20, -20, "ast"]
        io.emit('update', [connectedPlayerPositions])
    });

    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        io.emit('message', msg); // Broadcast the message to all clients
    });

    socket.on('move up', (msg) => {
        connectedPlayerPositions[playerLocation][msg - 1][1] -= 0.9
        io.emit('update', [connectedPlayerPositions])
    })
    socket.on('move right', (msg) => {
        connectedPlayerPositions[playerLocation][msg - 1][0] += 0.9
        io.emit('update', [connectedPlayerPositions])
    })
    socket.on('move down', (msg) => {
        connectedPlayerPositions[playerLocation][msg - 1][1] += 0.9
        io.emit('update', [connectedPlayerPositions])
    })
    socket.on('move left', (msg) => {
        connectedPlayerPositions[playerLocation][msg - 1][0] -= 0.9
        io.emit('update', [connectedPlayerPositions])
    })
    socket.on('change class', (msg) => {
        console.log(connectedPlayerPositions)
        console.log(connectedPlayerPositions[playerLocation][playerID - 1][2])
        connectedPlayerPositions[playerLocation][playerID - 1][2] = msg
        io.emit('update', [connectedPlayerPositions])
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});