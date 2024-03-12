let socket
let circles = 0
let playerPositions = []
let yourID = 0

function setup() {
    createCanvas(400, 400)
    colorMode(HSB, 360, 100, 100, 100)
    background(234, 34, 24)

    // Connect to the WebSocket server
    socket = io.connect(window.location.origin)

    // Listen for messages from the server
    socket.on('message', function (msg) {
        console.log('Received message:', msg)
    })
    socket.on('connection entry', function (msg) {
        // this entry will always be [playerPositions, the player that you are]
        playerPositions = msg[0]
        yourID = msg[1]
    })
    socket.on('other player connection entry', function (msg) {
        // this entry will always be [playerPositions, the player that they are]
        playerPositions = msg[0]
    })
    socket.on('update', function (msg) {
        playerPositions = msg[0]
    })
}

function draw() {
    background(234, 34, 24)
    fill(0, 100, 100)
    noStroke()
    let player = 0
    for (let playerPosition of playerPositions) {
        player += 1
        if (yourID === player) {
            fill(120, 100, 100)
        }
        text(player, playerPosition[0], playerPosition[1])
        fill(0, 100, 100)
    }
    if (keyIsPressed) {
        if (keyIsDown(87)) socket.emit("move up", yourID)
        if (keyIsDown(68)) socket.emit("move right", yourID)
        if (keyIsDown(83)) socket.emit("move down", yourID)
        if (keyIsDown(65)) socket.emit("move left", yourID)
    }
}

function keyPressed(event) {
}