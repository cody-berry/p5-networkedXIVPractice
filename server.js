// let http = require('http');
// let express = require('express');
// let socketIo = require('socket.io');
//
// let app = express();
// let server = http.createServer(app);
// let io = socketIo(server);
//
// // Serve the static files from the "public" directory
// app.use(express.static('public'));
//
// let connectedPlayers = 0
// let connectedPlayerPositions = {
//     "Lobby": [],
//     "Light Party Queue": [],
//     "Full Party Queue": [],
//     "Light Party 1": [],
//     "Light Party 2": [],
//     "Light Party 3": [],
//     "Light Party 4": [],
//     "Light Party 5": [],
//     "Full Party 1": [],
//     "Full Party 2": [],
//     "Full Party 3": [],
// }
//
// io.on('connection', (socket) => {
//     connectedPlayers += 1
//     let player = connectedPlayers
//     let playerLocation = "Lobby"
//     let playerID = connectedPlayerPositions["Lobby"].length + 1
//
//     console.log(`Player ${player} connected`);
//     // extend the list with [700, 300] as a position
//     connectedPlayerPositions["Lobby"] = [...connectedPlayerPositions["Lobby"], [700, 300, "ast", "", ""]]
//     socket.emit('connection entry', [connectedPlayerPositions, playerID])
//     io.emit('other player connection entry', [connectedPlayerPositions, playerID])
//
//     socket.on('disconnect', () => {
//         console.log(`Player ${player} disconnected`);
//         connectedPlayerPositions[playerLocation][playerID - 1] = [-20, -20, "ast", "", ""]
//         io.emit('update', [connectedPlayerPositions])
//     });
//
//     socket.on('message', (msg) => {
//         console.log('Message received:', msg);
//         io.emit('message', msg); // Broadcast the message to all clients
//     });
//
//     socket.on('move up', (msg) => {
//         connectedPlayerPositions[playerLocation][msg - 1][1] -= 0.9
//         io.emit('update', [connectedPlayerPositions])
//     })
//     socket.on('move right', (msg) => {
//         connectedPlayerPositions[playerLocation][msg - 1][0] += 0.9
//         io.emit('update', [connectedPlayerPositions])
//     })
//     socket.on('move down', (msg) => {
//         connectedPlayerPositions[playerLocation][msg - 1][1] += 0.9
//         io.emit('update', [connectedPlayerPositions])
//     })
//     socket.on('move left', (msg) => {
//         connectedPlayerPositions[playerLocation][msg - 1][0] -= 0.9
//         io.emit('update', [connectedPlayerPositions])
//     })
//     socket.on('change class', (msg) => {
//         connectedPlayerPositions[playerLocation][playerID - 1][2] = msg
//         io.emit('update', [connectedPlayerPositions])
//     })
//     socket.on('move', (msg) => {
//         let previousLocation = connectedPlayerPositions[playerLocation][playerID - 1]
//         connectedPlayerPositions[playerLocation][playerID - 1] = [-20, -20, "ast", "", ""]
//         playerID = connectedPlayerPositions[msg[0]].length + 1
//         playerLocation = msg[0]
//         connectedPlayerPositions[playerLocation][playerID - 1] = [msg[1], msg[2], previousLocation[2], previousLocation[3], previousLocation[4]]
//         io.emit('update', [connectedPlayerPositions])
//         socket.emit("connection entry", [connectedPlayerPositions, playerID])
//     })
//
//     socket.on('change name', (msg) => {
//         console.log(`Player ${player} changed their name to ${msg[0]} ${msg[1]}`)
//         connectedPlayerPositions[playerLocation][playerID - 1][3] = msg[0]
//         connectedPlayerPositions[playerLocation][playerID - 1][4] = msg[1]
//     })
// });
//
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });

let PI = 3.14159265358979323846

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

let currentlyConnectedPlayers = 0
let mechanicStartedAt = 0
let mechanic = "Changing job"
let boss = "None"

io.on('connection', (socket) => {
    connectedPlayers += 1
    currentlyConnectedPlayers += 1
    let player = connectedPlayers
    let playerLocation = "Lobby"
    let playerID = connectedPlayerPositions["Lobby"].length + 1

    console.log(`Player ${player} connected`);
    // extend the list with [700, 300] as a position
    connectedPlayerPositions["Lobby"] = [...connectedPlayerPositions["Lobby"], [700, 300, "ast", "", ""]]
    socket.emit('connection entry', [connectedPlayerPositions, playerID, mechanic, boss])
    io.emit('other player connection entry', [connectedPlayerPositions, playerID])

    socket.on('disconnect', () => {
        console.log(`Player ${player} disconnected`);
        connectedPlayerPositions[playerLocation][playerID - 1] = [-20, -20, "ast", "", ""]
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

    socket.on('change name', (msg) => {
        console.log(`Player ${player} changed their name to ${msg[0]} ${msg[1]}`)
        connectedPlayerPositions[playerLocation][playerID - 1][3] = msg[0]
        connectedPlayerPositions[playerLocation][playerID - 1][4] = msg[1]
    })

    socket.on('change mechanic', async (msg) => {
        io.emit('change mechanic', msg)
        mechanicStartedAt = new Date()
        mechanicStartedAt = mechanicStartedAt.getTime()
        mechanic = msg
        switch (msg) {
            case "Slippery Soap (Blue)":
                boss = "Silkie"
                await new Promise(resolve => setTimeout(resolve, 1000)) // wait for a second
                // make two rectangle AoEs at the center
                io.emit('rect AOE', ["horizontal ice", // displayed as ice attack
                    400, 235, // starts at left of board and 65 higher than N&S center of board
                    600, 130, // 600 width, 130 height
                    1500 // disappears in 1.5 seconds
                ])
                io.emit('rect AOE', ["vertical ice", 635, 0, 130, 600, 1500])

                break
            case "Slippery Soap (Yellow)":
                boss = "Silkie"
                await new Promise(resolve => setTimeout(resolve, 1000)) // wait for a second
                // simulate an electricity attack going off
                io.emit('cone AOE', ["electric", // displayed as electricity attack
                    700, 300, // goes off at center
                    800, // virtually infinite size
                    PI/8, 3*PI/8, // covers PI/4 intercardinal region
                    1500 // disappears in 1.5 seconds
                ])

                // now do the same for the 3PI/4 5PI/4, and 7PI/4 regions.
                io.emit('cone AOE', ["electric", 700, 300, 800, 5*PI/8, 7*PI/8, 1500])
                io.emit('cone AOE', ["electric", 700, 300, 800, 9*PI/8, 11*PI/8, 1500])
                io.emit('cone AOE', ["electric", 700, 300, 800, 13*PI/8, 15*PI/8, 1500])
                break
            case "Slippery Soap (Green)":
                boss = "Silkie"
                break
        }
    })
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
