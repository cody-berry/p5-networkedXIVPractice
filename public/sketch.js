let socket
let circles = 0
let playerPositions = []
let yourID = 0
let yourLocation = "Lobby"
let yourClass = "rdm"
let state = "Changing job" // there are different states. These can be like "Changing job", "Changing name", "3 players in current Light/Full Party", and "Exoflares".
let yourFirstName = ""
let yourLastName = ""
let cursor = [0, 0]

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

let icons


function preload() {
    font = loadFont('data/consola.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')
    astIcon = loadImage("data/Astrologian_Icon_3.png")
    brdIcon = loadImage("data/Bard_Icon_3.png")
    blmIcon = loadImage("data/Black_Mage_Icon_3.png")
    bluIcon = loadImage("data/Blue_Mage_Icon_3.png")
    dncIcon = loadImage("data/Dancer_Icon_3.png")
    drkIcon = loadImage("data/Dark_Knight_Icon_3.png")
    drgIcon = loadImage("data/Dragoon_Icon_3.png")
    gnbIcon = loadImage("data/Gunbreaker_Icon_3.png")
    mchIcon = loadImage("data/Machinist_Icon_3.png")
    mnkIcon = loadImage("data/Monk_Icon_3.png")
    ninIcon = loadImage("data/Ninja_Icon_3.png")
    pldIcon = loadImage("data/Paladin_Icon_3.png")
    rprIcon = loadImage("data/Reaper_Icon_3.png")
    rdmIcon = loadImage("data/Red_Mage_Icon_3.png")
    sgeIcon = loadImage("data/Sage_Icon_3.png")
    samIcon = loadImage("data/Samurai_Icon_3.png")
    schIcon = loadImage("data/Scholar_Icon_3.png")
    smnIcon = loadImage("data/Summoner_Icon_3.png")
    warIcon = loadImage("data/Warrior_Icon_3.png")
    whmIcon = loadImage("data/White_Mage_Icon_3.png")
    icons = {
        "ast": astIcon,
        "brd": brdIcon,
        "blm": blmIcon,
        "blu": bluIcon,
        "dnc": dncIcon,
        "drk": drkIcon,
        "drg": drgIcon,
        "gnb": gnbIcon,
        "mch": mchIcon,
        "mnk": mnkIcon,
        "nin": ninIcon,
        "pld": pldIcon,
        "rpr": rprIcon,
        "rdm": rdmIcon,
        "sge": sgeIcon,
        "sam": samIcon,
        "sch": schIcon,
        "smn": smnIcon,
        "war": warIcon,
        "whm": whmIcon
    }

    // Connect to the WebSocket server
    socket = io.connect(window.location.origin)

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
    debugCorner.visible = false

    yourClass = "ast"
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
    for (let playerPosition of playerPositions[yourLocation]) {
        player += 1
        if (yourID === player) {
            fill(120, 100, 100)
            rect(playerPosition[0] - 725, playerPosition[1] - 325, 50, 50, 10)
        }
        image(icons[playerPosition[2]], playerPosition[0] - 725, playerPosition[1] - 325, 50, 50)
    }
    if (keyIsPressed) {
        if (keyIsDown(87)) socket.emit("move up", yourID)
        if (keyIsDown(68)) socket.emit("move right", yourID)
        if (keyIsDown(83)) socket.emit("move down", yourID)
        if (keyIsDown(65)) socket.emit("move left", yourID)
    }
    pop()


    // display all possible jobs
    if (state === "Changing job") {
        fill(0, 0, 100)
        textSize(20)
        text("Change jobs", 5, 20)
        image(astIcon, 0, 100, 50, 50)
        image(brdIcon, 50, 100, 50, 50)
        image(blmIcon, 0, 150, 50, 50)
        image(bluIcon, 50, 150, 50, 50)
        image(dncIcon, 0, 200, 50, 50)
        image(drkIcon, 50, 200, 50, 50)
        image(drgIcon, 0, 250, 50, 50)
        image(gnbIcon, 50, 250, 50, 50)
        image(mchIcon, 0, 300, 50, 50)
        image(mnkIcon, 50, 300, 50, 50)
        image(ninIcon, 0, 350, 50, 50)
        image(pldIcon, 50, 350, 50, 50)
        image(rprIcon, 0, 400, 50, 50)
        image(rdmIcon, 50, 400, 50, 50)
        image(sgeIcon, 0, 450, 50, 50)
        image(samIcon, 50, 450, 50, 50)
        image(schIcon, 0, 500, 50, 50)
        image(smnIcon, 50, 500, 50, 50)
        image(warIcon, 0, 550, 50, 50)
        image(whmIcon, 50, 550, 50, 50)

        // also add button for "finished changing jobs"
        fill(0, 0, 25)
        if (mouseX > 150 && mouseX < 400 &&
            mouseY > 0 && mouseY < 25) fill(0, 0, 22)
        noStroke()
        rect(150, 0, 250, 25)

        fill(0, 0, 100)
        text("Finished changing jobs", 155, 20)
    }

    // now you can change your name
    if (state === "Changing name") {
        // add textboxes
        fill(0, 0, 20)
        stroke(0, 0, 50)
        strokeWeight((cursor[0] === 0) ? 2 : 1)
        rect(textWidth("First name:") + textWidth(" ")/2 + 5, 80, textWidth("10  letters"), 25)

        strokeWeight((cursor[0] === 0) ? 1 : 2)
        rect(textWidth("First name:") + textWidth(" ")/2 + 5, 110, textWidth("10  letters"), 25)

        strokeWeight(1)

        fill(0, 0, 100)
        textSize(20)
        text("Change names", 5, 20)
        text("First name: " + yourFirstName, 5, 100)
        text("Last name:  " + yourLastName, 5, 130)
        text("10 max", 260, 100)
        text("10 max", 260, 130)

        // now display the cursor
        stroke(0, 0, 100)
        strokeWeight(1)
        if (millis() % 1000 < 500) {
            line(textWidth("First name: ") + textWidth(" ")*cursor[1] + 5, 83 + 30*cursor[0],
                 textWidth("Last name:  ") + textWidth(" ")*cursor[1] + 5, 102 + 30*cursor[0])
        }

        // also add button for "finished changing name"
        fill(0, 0, 25)
        if (mouseX > 150 && mouseX < 400 &&
            mouseY > 0 && mouseY < 25) fill(0, 0, 22)
        noStroke()
        rect(150, 0, 250, 25)

        fill(0, 0, 100)
        text("Finished changing name", 155, 20)
    }

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.showBottom()
}

function keyPressed() {
    if (state === "Changing name") {
        // if the key is in the alphabet (keycodes 65 to 90 inclusive), then
        // type it in at the current cursor
        if (keyCode > 64 && keyCode < 91) {
            if (cursor[0] === 0) {
                if (yourFirstName.length < 10) {
                    let newName = ""
                    for (let i = 0; i < yourFirstName.length; i++) {
                        if (i === cursor[1]) {
                            newName += key.toLowerCase()
                        }
                        newName += yourFirstName[i]
                    }
                    if (yourFirstName.length === cursor[1]) {
                        // if you're adding a new character, then the previous
                        // code's "i === cursor[1]" section will not operate
                        if (cursor[1] === 0) {
                            newName += key.toUpperCase()
                        } else {
                            newName += key.toLowerCase()
                        }
                    }
                    yourFirstName = newName
                    cursor[1] += 1
                }
            } else {
                if (yourLastName.length < 10) {
                    let newName = ""
                    for (let i = 0; i < yourLastName.length; i++) {
                        if (i === cursor[1]) {
                            newName += key.toLowerCase()
                        }
                        newName += yourLastName[i]
                    }
                    if (yourLastName.length === cursor[1]) {
                        // if you're adding a new character, then the previous
                        // code's "i === cursor[1]" section will not operate
                        if (cursor[1] === 0) {
                            newName += key.toUpperCase()
                        } else {
                            newName += key.toLowerCase()
                        }
                    }
                    yourLastName = newName
                    cursor[1] += 1
                }
            }
        }

        // if you type backspace, then the key before that will be deleted
        if (keyCode === 8) {
            if (cursor[0] === 0) {
                if (yourFirstName.length > 0 && cursor[1] > 0) {
                    cursor[1] -= 1
                    let newName = ""
                    for (let i = 0; i < yourFirstName.length; i++) {
                        if (i !== cursor[1]) {
                            newName += yourFirstName[i]
                        }
                    }
                    yourFirstName = newName
                }
            } else {
                if (yourLastName.length > 0 && cursor[1] > 0) {
                    cursor[1] -= 1
                    let newName = ""
                    for (let i = 0; i < yourLastName.length; i++) {
                        if (i !== cursor[1]) {
                            newName += yourLastName[i]
                        }
                    }
                    yourLastName = newName
                }
            }
        }

        // do the same for Delete
        if (keyCode === 46) {
            if (cursor[0] === 0) {
                if (yourFirstName.length > 0 && cursor[1] > 0) {
                    let newName = ""
                    for (let i = 0; i < yourFirstName.length; i++) {
                        if (i !== cursor[1]) {
                            newName += yourFirstName[i]
                        }
                    }
                    yourFirstName = newName
                }
                else {
                    if (yourLastName.length > 0 && cursor[1] > 0) {
                        let newName = ""
                        for (let i = 0; i < yourLastName.length; i++) {
                            if (i !== cursor[1]) {
                                newName += yourLastName[i]
                            }
                        }
                        yourLastName = newName
                    }
                }
            }
        }

        // if you type left or right (37 and 39 respectively), move the
        // cursor one left or right respectively
        if (keyCode === 37) {
            if (cursor[1] > 0) {
                cursor[1] -= 1
            }
        } if (keyCode === 39) {
            if (cursor[0] === 0) {
                if (cursor[1] < yourFirstName.length) {
                    cursor[1] += 1
                }
            } else {
                if (cursor[1] < yourLastName.length) {
                    cursor[1] += 1
                }
            }
        }
    }
}

function mousePressed() {
    if (state === "Changing name") {
        // the new state will be "Going Nowhere"
        if (mouseX > 150 && mouseX < 400 &&
            mouseY > 0 && mouseY < 25) state = "Going Nowhere 🤣"

        // if the mouse is pressed, go to the nearest cursor location
        // textWidth("First name:") + textWidth(" ")/2 + 5, 80,
        // textWidth("10  letters"), 25
        // x region where the textboxes are
        if (mouseX > textWidth("First name:") + textWidth(" ")/2 + 5 &&
            mouseX < textWidth("First name:10  letters") + textWidth(" ")/2 + 5) {
            // first name textbox
            if (mouseY > 80 && mouseY < 105) {
                cursor[0] = 0
                let firstLetterX = textWidth("First name: ") + 5
                cursor[1] = round(map(mouseX, firstLetterX, firstLetterX + textWidth("10  letters"), 0, 10))
                cursor[1] = max(0, min(yourFirstName.length, cursor[1]))
            }
            // last name textbox
            if (mouseY > 110 && mouseY < 135) {
                cursor[0] = 1
                let firstLetterX = textWidth("First name: ") + 5
                cursor[1] = round(map(mouseX, firstLetterX, firstLetterX + textWidth("10  letters"), 0, 10))
                cursor[1] = max(0, min(yourLastName.length, cursor[1]))
            }
        }
    } if (state === "Changing job") {
        // change classes (lined up on the left)
        if (mouseX > 1 && mouseX < 49 &&
            mouseY > 101 && mouseY < 149)
            yourClass = "ast"
        if (mouseX > 51 && mouseX < 99 &&
            mouseY > 101 && mouseY < 149)
            yourClass = "brd"
        if (mouseX > 1 && mouseX < 49 &&
            mouseY > 151 && mouseY < 199)
            yourClass = "blm"
        if (mouseX > 51 && mouseX < 99 &&
            mouseY > 151 && mouseY < 199)
            yourClass = "blu"
        if (mouseX > 1 && mouseX < 49 &&
            mouseY > 201 && mouseY < 249)
            yourClass = "dnc"
        if (mouseX > 51 && mouseX < 99 &&
            mouseY > 201 && mouseY < 249)
            yourClass = "drk"
        if (mouseX > 1 && mouseX < 49 &&
            mouseY > 251 && mouseY < 299)
            yourClass = "drg"
        if (mouseX > 51 && mouseX < 99 &&
            mouseY > 251 && mouseY < 299)
            yourClass = "gnb"
        if (mouseX > 1 && mouseX < 49 &&
            mouseY > 301 && mouseY < 349)
            yourClass = "mch"
        if (mouseX > 51 && mouseX < 99 &&
            mouseY > 301 && mouseY < 349)
            yourClass = "mnk"
        if (mouseX > 1 && mouseX < 49 &&
            mouseY > 351 && mouseY < 399)
            yourClass = "nin"
        if (mouseX > 51 && mouseX < 99 &&
            mouseY > 351 && mouseY < 399)
            yourClass = "pld"
        if (mouseX > 1 && mouseX < 49 &&
            mouseY > 401 && mouseY < 449)
            yourClass = "rpr"
        if (mouseX > 51 && mouseX < 99 &&
            mouseY > 401 && mouseY < 449)
            yourClass = "rdm"
        if (mouseX > 1 && mouseX < 49 &&
            mouseY > 451 && mouseY < 499)
            yourClass = "sge"
        if (mouseX > 51 && mouseX < 99 &&
            mouseY > 451 && mouseY < 499)
            yourClass = "sam"
        if (mouseX > 1 && mouseX < 49 &&
            mouseY > 501 && mouseY < 549)
            yourClass = "sch"
        if (mouseX > 51 && mouseX < 99 &&
            mouseY > 501 && mouseY < 549)
            yourClass = "smn"
        if (mouseX > 1 && mouseX < 49 &&
            mouseY > 551 && mouseY < 599)
            yourClass = "war"
        if (mouseX > 51 && mouseX < 99 &&
            mouseY > 551 && mouseY < 599)
            yourClass = "whm"
        if (mouseX > 150 && mouseX < 400 &&
            mouseY > 0 && mouseY < 25) state = "Changing name"

        // tell everyone that you changed class!
        socket.emit("change class", yourClass)
        print(yourClass)
    }
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