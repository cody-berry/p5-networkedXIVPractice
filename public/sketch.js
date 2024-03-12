let socket
let circles = 0
let playerPositions = []
let yourID = 0
let state // state of you

let font
let fixedWidthFont
let variableWidthFont
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */

let astIcon
let brdIcon
let blmIcon
let bluIcon
let dncIcon
let drkIcon
let drgIcon
let gnbIcon
let mchIcon
let mnkIcon
let ninIcon
let pldIcon
let rprIcon
let rdmIcon
let sgeIcon
let samIcon
let schIcon
let smnIcon
let warIcon
let whmIcon


function preload() {
    font = loadFont('data/consola.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')
    astIcon = loadFont("data/Astrologian_Icon_3.png")
    brdIcon = loadFont("data/Bard_Icon_3.png")
    blmIcon = loadFont("data/Black_Mage_Icon_3.png")
    bluIcon = loadFont("data/Blue_Mage_Icon_3.png")
    dncIcon = loadFont("data/Dancer_Icon_3.png")
    drkIcon = loadFont("data/Dark_Knight_Icon_3.png")
    drgIcon = loadFont("data/Dragoon_Icon_3.png")
    gnbIcon = loadFont("data/Gunbreaker_Icon_3.png")
    mchIcon = loadFont("data/Machinist_Icon_3.png")
    mnkIcon = loadFont("data/Monk_Icon_3.png")
    ninIcon = loadFont("data/Ninja_Icon_3.png")
    pldIcon = loadFont("data/Paladin_Icon_3.png")
    rprIcon = loadFont("data/Reaper_Icon_3.png")
    rdmIcon = loadFont("data/Red_Mage_Icon_3.png")
    sgeIcon = loadFont("data/Sage_Icon_3.png")
    samIcon = loadFont("data/Samurai_Icon_3.png")
    schIcon = loadFont("data/Scholar_Icon_3.png")
    smnIcon = loadFont("data/Summoner_Icon_3.png")
    warIcon = loadFont("data/Warrior_Icon_3.png")
    whmIcon = loadFont("data/White_Mage_Icon_3.png")
}

function setup() {
    let cnv = createCanvas(1000, 600)
    colorMode(HSB, 360, 100, 100, 100)
    background(234, 34, 24)
    cnv.parent('#canvas')

    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

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

    state = "Changing class"
}

function draw() {
    background(234, 34, 24)

    push()
    translate(700, 300)

    fill(0, 0, 50) // substitute for the board
    rect(-300, -300, 600, 600)

    fill(0, 100, 100)
    noStroke()
    let player = 0
    for (let playerPosition of playerPositions) {
        player += 1
        if (yourID === player) {
            fill(120, 100, 100)
        }
        text(player, playerPosition[0] - 700, playerPosition[1] - 300)
        fill(0, 100, 100)
    }
    if (keyIsPressed) {
        if (keyIsDown(87)) socket.emit("move up", yourID)
        if (keyIsDown(68)) socket.emit("move right", yourID)
        if (keyIsDown(83)) socket.emit("move down", yourID)
        if (keyIsDown(65)) socket.emit("move left", yourID)
    }




    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.showBottom()
    pop()
}

/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.visible = true
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    showBottom() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */
            rect(
                0,
                height,
                width,
                DEBUG_Y_OFFSET - LINE_HEIGHT * this.debugMsgList.length - TOP_PADDING
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            for (let index in this.debugMsgList) {
                const msg = this.debugMsgList[index]
                text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
            }
        }
    }

    showTop() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */

            /* offset from top of canvas */
            const DEBUG_Y_OFFSET = textAscent() + TOP_PADDING
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background, a console-like feel */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)

            rect( /* x, y, w, h */
                0,
                0,
                width,
                DEBUG_Y_OFFSET + LINE_HEIGHT*this.debugMsgList.length/*-TOP_PADDING*/
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            textAlign(LEFT)
            for (let i in this.debugMsgList) {
                const msg = this.debugMsgList[i]
                text(msg, LEFT_MARGIN, LINE_HEIGHT*i + DEBUG_Y_OFFSET)
            }
        }
    }
}