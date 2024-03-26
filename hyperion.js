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
let playerPositions = {
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

let bossPositions = {
    "Lobby": null,
    "Light Party Queue": null,
    "Full Party Queue": null,
    "Light Party 1": null,
    "Light Party 2": null,
    "Light Party 3": null,
    "Light Party 4": null,
    "Light Party 5": null,
    "Full Party 1": null,
    "Full Party 2": null,
    "Full Party 3": null
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
    let playerID = playerPositions["Lobby"].length + 1
    socket.emit('update boss positions', bossPositions)

    console.log(`Player ${player} connected`);
    // extend the list with [700, 300] as a position
    playerPositions["Lobby"] = [...playerPositions["Lobby"], [700, 300, "ast", "", ""]]
    socket.emit('connection entry', [playerPositions, playerID, mechanic, boss])
    io.emit('other player connection entry', [playerPositions, playerID])

    socket.on('disconnect', () => {
        console.log(`Player ${player} disconnected`);
        playerPositions[playerLocation][playerID - 1] = [-20, -20, "ast", "", ""]
        io.emit('update', [playerPositions])
        currentlyConnectedPlayers -= 1
        if (currentlyConnectedPlayers === 0) {
            mechanic = "Changing job" // reset
            boss = "None"
        }
    });

    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        io.emit('message', msg); // Broadcast the message to all clients
    });

    socket.on('move up', (msg) => {
        playerPositions[playerLocation][msg - 1][1] -= 0.9
        io.emit('update', [playerPositions])
    })
    socket.on('move right', (msg) => {
        playerPositions[playerLocation][msg - 1][0] += 0.9
        io.emit('update', [playerPositions])
    })
    socket.on('move down', (msg) => {
        playerPositions[playerLocation][msg - 1][1] += 0.9
        io.emit('update', [playerPositions])
    })
    socket.on('move left', (msg) => {
        playerPositions[playerLocation][msg - 1][0] -= 0.9
        io.emit('update', [playerPositions])
    })
    socket.on('change class', (msg) => {
        console.log(playerPositions)
        console.log(playerPositions[playerLocation][playerID - 1][2])
        playerPositions[playerLocation][playerID - 1][2] = msg
        io.emit('update', [playerPositions])
    })

    socket.on('change name', (msg) => {
        console.log(`Player ${player} changed their name to ${msg[0]} ${msg[1]}`)
        playerPositions[playerLocation][playerID - 1][3] = msg[0]
        playerPositions[playerLocation][playerID - 1][4] = msg[1]
    })

    socket.on('change mechanic', async (msg) => {
        io.emit('change mechanic', msg)
        mechanicStartedAt = new Date()
        mechanicStartedAt = mechanicStartedAt.getTime()
        mechanic = msg
        switch (msg) {
            case "Slippery Soap (Blue)":
                boss = "Silkie"
                bossPositions["Lobby"] = [700, 300, "blue", 270]
                io.emit('update boss positions', bossPositions)
                await new Promise(resolve => setTimeout(resolve, 1000)) // wait for a second
                let targets = []
                let index = 0
                for (let player of playerPositions["Lobby"]) {
                    if (!(player[0] === -20 && player[1] === -20)) {
                        targets.push(index)
                    }
                    index += 1
                }
                let target = targets[Math.floor(Math.random() * targets.length)]
                io.emit("line stack", ["telegraphed water", // displayed as water, telegraphed
                    3000, // resolves in 3s
                    target, // targets a random player
                    1000, // animation disappears 1s after it goes off
                    700, 300, // starts at 700, 300
                    100 // thickness 100
                ])
                await new Promise(resolve => setTimeout(resolve, 3000)) // wait for 3 seconds
                // make the boss leap to the player
                let playerPosX = playerPositions[playerLocation][target][0]
                let playerPosY = playerPositions[playerLocation][target][1]

                // convert to degrees: 180º per π radians
                let angle = Math.atan2(playerPosY - bossPositions["Lobby"][1], playerPosX - bossPositions["Lobby"][0])*(180/PI)

                bossPositions["Lobby"] = [playerPosX, playerPosY, "blue", angle]
                io.emit('update boss positions', bossPositions)
                await new Promise(resolve => setTimeout(resolve, 2000)) // wait for 2 seconds
                // make two rectangle AoEs at the center
                io.emit('line AOE', ["ice", // displayed as ice attack
                    0, 300, // starts at left of board, ends at right
                    1000, 300,
                    130, // thickness 130
                    1500 // 1.5s 'till disappears
                ])
                io.emit('line AOE', ["ice", 700, 0, 700, 600, 130, 1500])
                bossPositions["Lobby"][2] = "none"
                io.emit('update boss positions', bossPositions)
                break
            case "Slippery Soap (Yellow)":
                boss = "Silkie"
                bossPositions["Lobby"] = [700, 300, "yellow", 270]
                io.emit('update boss positions', bossPositions)
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
                bossPositions["Lobby"] = [700, 300, "none", 270]
                io.emit('update boss positions', bossPositions)
                break
            case "Slippery Soap (Green)":
                boss = "Silkie"
                bossPositions["Lobby"] = [700, 300, "green", 270]
                io.emit('update boss positions', bossPositions)
                await new Promise(resolve => setTimeout(resolve, 1000)) // wait for a second
                // make a donut AOE at the center
                io.emit('donut AOE', ["full wind", // displayed as wind attack covering full board
                    700, 300, // center of board
                    65, // 65 radius in center of safety
                    1500 // disappears in 1.5 seconds
                ])
                bossPositions["Lobby"] = [700, 300, "none", 270]
                io.emit('update boss positions', bossPositions)
                break
        }
    })
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
