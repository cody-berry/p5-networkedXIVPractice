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
        playerPositions[playerLocation][playerID - 1] = [-20, -20, "ast", "Disconnect", "edPlayer"]
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
                await new Promise(resolve => setTimeout(resolve, 3000)) // wait for 3 seconds

                // trace out the path the boss is facing to the edge: add
                // line AOE for that
                let cardinalFrontX = bossPositions["Lobby"][0]
                let cardinalFrontY = bossPositions["Lobby"][1]
                let bossAngleRadians = bossPositions["Lobby"][3]*(PI/180)
                while (cardinalFrontX > 400 && cardinalFrontX < 1000 &&
                       cardinalFrontY > 0 && cardinalFrontY < 600) {
                    cardinalFrontX += Math.cos(bossAngleRadians)
                    cardinalFrontY += Math.sin(bossAngleRadians)
                }
                let cardinalRightX = bossPositions["Lobby"][0]
                let cardinalRightY = bossPositions["Lobby"][1]
                while (cardinalRightX > 400 && cardinalRightX < 1000 &&
                       cardinalRightY > 0 && cardinalRightY < 600) {
                    cardinalRightX += Math.cos(bossAngleRadians - PI/2)
                    cardinalRightY += Math.sin(bossAngleRadians - PI/2)
                }
                let cardinalBackX = bossPositions["Lobby"][0]
                let cardinalBackY = bossPositions["Lobby"][1]
                while (cardinalBackX > 400 && cardinalBackX < 1000 &&
                       cardinalBackY > 0 && cardinalBackY < 600) {
                    cardinalBackX += Math.cos(bossAngleRadians - PI)
                    cardinalBackY += Math.sin(bossAngleRadians - PI)
                }
                let cardinalLeftX = bossPositions["Lobby"][0]
                let cardinalLeftY = bossPositions["Lobby"][1]
                while (cardinalLeftX > 400 && cardinalLeftX < 1000 &&
                       cardinalLeftY > 0 && cardinalLeftY < 600) {
                    cardinalLeftX += Math.cos(bossAngleRadians + PI/2)
                    cardinalLeftY += Math.sin(bossAngleRadians + PI/2)
                }


                // make two rectangle AoEs at the center
                io.emit('line AOE', ["ice", // displayed as ice attack
                    cardinalFrontX, cardinalFrontY, // starts at the position the boss is facing
                    cardinalBackX, cardinalBackY, // ends at the position opposite to the boss
                    130, // thickness of 130
                    1500 // sticks around for 1.5s
                ])
                io.emit('line AOE', ["ice", cardinalLeftX, cardinalLeftY, cardinalRightX, cardinalRightY, 130, 1500])
                bossPositions["Lobby"][2] = "none"
                io.emit('update boss positions', bossPositions)
                break
            case "Slippery Soap (Yellow)":
                boss = "Silkie"
                bossPositions["Lobby"] = [700, 300, "yellow", 270]
                io.emit('update boss positions', bossPositions)
                await new Promise(resolve => setTimeout(resolve, 1000)) // wait for a second
                let targets2 = []
                let index2 = 0
                for (let player of playerPositions["Lobby"]) {
                    if (!(player[0] === -20 && player[1] === -20)) {
                        targets2.push(index2)
                    }
                    index2 += 1
                }
                let target2 = targets2[Math.floor(Math.random() * targets2.length)]
                io.emit("line stack", ["telegraphed water", // displayed as water, telegraphed
                    3000, // resolves in 3s
                    target2, // targets a random player
                    1000, // animation disappears 1s after it goes off
                    700, 300, // starts at 700, 300
                    100 // thickness 100
                ])
                await new Promise(resolve => setTimeout(resolve, 3000)) // wait for 3 seconds
                // make the boss leap to the player
                let playerPosX2 = playerPositions[playerLocation][target2][0]
                let playerPosY2 = playerPositions[playerLocation][target2][1]

                // convert to degrees: 180º per π radians
                let angle2 = Math.atan2(playerPosY2 - bossPositions["Lobby"][1], playerPosX2 - bossPositions["Lobby"][0])*(180/PI)

                bossPositions["Lobby"] = [playerPosX2, playerPosY2, "yellow", angle2]
                io.emit('update boss positions', bossPositions)
                await new Promise(resolve => setTimeout(resolve, 3000)) // wait for 3 seconds

                // figure out where the boss is facing
                let bossAngleRadians2 = bossPositions["Lobby"][3]*(PI/180)
                // simulate an electricity attack going off
                io.emit('cone AOE', ["electric", // displayed as electricity attack
                    bossPositions["Lobby"][0], bossPositions["Lobby"][1], // goes off at boss position
                    1200, // virtually infinite size
                    PI/8 + bossAngleRadians2, 3*PI/8 + bossAngleRadians2, // covers PI/4 intercardinal region according to boss's facing
                    1500 // disappears in 1.5 seconds
                ])

                // now do the same for the 3PI/4 5PI/4, and 7PI/4 regions.
                io.emit('cone AOE', ["electric", bossPositions["Lobby"][0], bossPositions["Lobby"][1],
                        1200, 5*PI/8 + bossAngleRadians2, 7*PI/8 + bossAngleRadians2, 1500])
                io.emit('cone AOE', ["electric", bossPositions["Lobby"][0], bossPositions["Lobby"][1],
                        1200, 9*PI/8 + bossAngleRadians2, 11*PI/8 + bossAngleRadians2, 1500])
                io.emit('cone AOE', ["electric", bossPositions["Lobby"][0], bossPositions["Lobby"][1],
                        1200, 13*PI/8 + bossAngleRadians2, 15*PI/8 + bossAngleRadians2, 1500])

                for (let target of targets2) {
                    io.emit('circle spread AOE', [
                        "untelegraphed electric", // displayed as an untelegraphed electric attack
                        target, // the target
                        100, // radius of 100
                        1500 // disappears in 1.5 seconds
                    ])
                }

                // also emit spread AOEs
                bossPositions["Lobby"][2] = "none"
                io.emit('update boss positions', bossPositions)
                break
            case "Slippery Soap (Green)":
                boss = "Silkie"
                bossPositions["Lobby"] = [700, 300, "green", 270]
                io.emit('update boss positions', bossPositions)
                await new Promise(resolve => setTimeout(resolve, 1000)) // wait for a second
                let targets3 = []
                let index3 = 0
                for (let player of playerPositions["Lobby"]) {
                    if (!(player[0] === -20 && player[1] === -20)) {
                        targets3.push(index3)
                    }
                    index3 += 1
                }
                let target3 = targets3[Math.floor(Math.random() * targets3.length)]
                io.emit("line stack", ["telegraphed water", // displayed as water, telegraphed
                    3000, // resolves in 3s
                    target3, // targets a random player
                    1000, // animation disappears 1s after it goes off
                    700, 300, // starts at 700, 300
                    100 // thickness 100
                ])
                await new Promise(resolve => setTimeout(resolve, 3000)) // wait for 3 seconds
                // make the boss leap to the player
                let playerPosX3 = playerPositions[playerLocation][target3][0]
                let playerPosY3 = playerPositions[playerLocation][target3][1]

                // convert to degrees: 180º per π radians
                let angle3 = Math.atan2(playerPosY3 - bossPositions["Lobby"][1], playerPosX3 - bossPositions["Lobby"][0])*(180/PI)

                bossPositions["Lobby"] = [playerPosX3, playerPosY3, "green", angle3]
                io.emit('update boss positions', bossPositions)
                await new Promise(resolve => setTimeout(resolve, 3000)) // wait for 3 seconds
                // make a donut AOE at the center
                io.emit('donut AOE', ["full wind", // displayed as wind attack covering full board
                    bossPositions["Lobby"][0], bossPositions["Lobby"][1], // boss's position
                    65, // 65 radius in center of safety
                    1500 // disappears in 1.5 seconds
                ])
                io.emit('update boss positions', bossPositions)
                break
        }
    })
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
