let socket
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

let firstNameAbbreviated
let lastNameAbbreviated

let icons

let frameWhenLastMoved // makes sure that you don't move until your position change is fully accounted for

let logWindowMessages

let otherPeople = []
let selectedPeople = []

let names

let DPSRemainingToSelect = 1
let HealersRemainingToSelect = 1
let TanksRemainingToSelect = 1

// this function is actually mostly ChatGPT's code
function formatDate(date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let year = date.getFullYear()
    let dayOfWeek = days[date.getDay()]
    let monthName = months[date.getMonth()]
    let unpaddedDay = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes().toString().padStart(2, '0')
    let seconds = date.getSeconds().toString().padStart(2, '0')
    let ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours.toString().padStart(2, '0') : '12' // Adjust 0 to 12 for AM/PM
    return `${dayOfWeek} ${year} ${monthName} ${unpaddedDay} ${hours}:${minutes}:${seconds} ${ampm}`
}

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

    logWindowMessages = []

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

        // now iterate through every name and update "names"
        names = []
        for (let people of Object.values(playerPositions)) {
            for (let person of people) {
                if (person[0] !== -20) {
                    // if the person's X is at -20, they're disconnected
                    names.push([person[3], person[4]])
                }
            }
        }
    })
    socket.on('log window message', function (location, msg) {
        if (location === yourLocation) {
            msg[2] = formatDate(new Date())
            logWindowMessages.push(msg)
        }
    })
}

function setup() {
    let cnv = createCanvas(1020, 1000)
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
    frameWhenLastMoved = 0
}

function draw() {
    background(234, 34, 24)

    push()
    translate(700, 300)



    // substitute for the board: chessboard-like bricks on corners
    stroke(0, 0, 0)
    strokeWeight(1)
    for (let i = 0; i < 8; i++) {
        fill(0, 55, 60)
        rect(-300, i * 80 - 300, 40, 20) // light-colored bricks, row 1
        rect(-220, i * 80 - 300, 40, 20)
        rect(-140, i * 80 - 300, 40, 20)
        rect(-60, i * 80 - 300, 40, 20)
        rect(20, i * 80 - 300, 40, 20)
        rect(100, i * 80 - 300, 40, 20)
        rect(180, i * 80 - 300, 40, 20)
        rect(260, i * 80 - 300, 40, 20)

        rect(-280, i * 80 - 280, 40, 20) // light-colored bricks, row 2
        rect(-200, i * 80 - 280, 40, 20)
        rect(-120, i * 80 - 280, 40, 20)
        rect(-40, i * 80 - 280, 40, 20)
        rect(40, i * 80 - 280, 40, 20)
        rect(120, i * 80 - 280, 40, 20)
        rect(200, i * 80 - 280, 40, 20)
        rect(280, i * 80 - 280, 20, 20)

        // only display rows 3 and 4 on i's 0-6
        if (i !== 7) {
            rect(-260, i * 80 - 260, 40, 20) // light-colored bricks, row 3
            rect(-180, i * 80 - 260, 40, 20)
            rect(-100, i * 80 - 260, 40, 20)
            rect(-20, i * 80 - 260, 40, 20)
            rect(60, i * 80 - 260, 40, 20)
            rect(140, i * 80 - 260, 40, 20)
            rect(220, i * 80 - 260, 40, 20)

            rect(-300, i * 80 - 240, 20, 20) // light-colored bricks, row 4
            rect(-240, i * 80 - 240, 40, 20)
            rect(-160, i * 80 - 240, 40, 20)
            rect(-80, i * 80 - 240, 40, 20)
            rect(0, i * 80 - 240, 40, 20)
            rect(80, i * 80 - 240, 40, 20)
            rect(160, i * 80 - 240, 40, 20)
            rect(240, i * 80 - 240, 40, 20)
        }
        fill(0, 60, 60)
        rect(-260, i * 80 - 300, 40, 20) // dark-colored bricks, row 1
        rect(-180, i * 80 - 300, 40, 20)
        rect(-100, i * 80 - 300, 40, 20)
        rect(-20, i * 80 - 300, 40, 20)
        rect(60, i * 80 - 300, 40, 20)
        rect(140, i * 80 - 300, 40, 20)
        rect(220, i * 80 - 300, 40, 20)

        rect(-300, i * 80 - 280, 20, 20) // dark-colored bricks, row 2
        rect(-240, i * 80 - 280, 40, 20)
        rect(-160, i * 80 - 280, 40, 20)
        rect(-80, i * 80 - 280, 40, 20)
        rect(0, i * 80 - 280, 40, 20)
        rect(80, i * 80 - 280, 40, 20)
        rect(160, i * 80 - 280, 40, 20)
        rect(240, i * 80 - 280, 40, 20)

        if (i !== 7) {
            rect(-300, i * 80 - 260, 40, 20) // dark-colored bricks, row 3
            rect(-220, i * 80 - 260, 40, 20)
            rect(-140, i * 80 - 260, 40, 20)
            rect(-60, i * 80 - 260, 40, 20)
            rect(20, i * 80 - 260, 40, 20)
            rect(100, i * 80 - 260, 40, 20)
            rect(180, i * 80 - 260, 40, 20)
            rect(260, i * 80 - 260, 40, 20)

            rect(-280, i * 80 - 240, 40, 20) // dark-colored bricks, row 4
            rect(-200, i * 80 - 240, 40, 20)
            rect(-120, i * 80 - 240, 40, 20)
            rect(-40, i * 80 - 240, 40, 20)
            rect(40, i * 80 - 240, 40, 20)
            rect(120, i * 80 - 240, 40, 20)
            rect(200, i * 80 - 240, 40, 20)
            rect(280, i * 80 - 240, 20, 20)
        }
    }

    if (yourLocation === "Lobby") {
        // stone in middle
        fill(0, 0, 50)
        rect(-200, -200, 400, 400)
        line(-120, -200, -120, 200)
        line(-40, -200, -40, 200)
        line(40, -200, 40, 200)
        line(120, -200, 120, 200)
        line(200, -120, -200, -120)
        line(200, -40, -200, -40)
        line(200, 40, -200, 40)
        line(200, 120, -200, 120)

        // the top-left and top-right squares are actually gates to each queue
        fill(0, 0, 20)
        rect(-200, -200, 80, 80)
        rect(120, -200, 80, 80)

        fill(0, 0, 0)
        text("Light\nParty\nQueue", -190, -180)
        text("Full\nParty\nQueue", 130, -180)
        if (state === "Changing job") {
            fill(0, 0, 40)
            rect(-200, -200, 80, 80)
            rect(120, -200, 80, 80)


            line(-183, -200, -183, -120)
            line(-166, -200, -166, -120)
            line(-149, -200, -149, -120)
            line(149, -200, 149, -120)
            line(166, -200, 166, -120)
            line(183, -200, 183, -120)
        } if (state === "Changing name") {
            fill(0, 0, 30)
            rect(-230, -200, 80, 80)
            rect(150, -200, 80, 80)


            line(-183, -200, -183, -120)
            line(-166, -200, -166, -120)
            line(-149, -200, -149, -120)
            line(149, -200, 149, -120)
            line(166, -200, 166, -120)
            line(183, -200, 183, -120)
        }
    }

    // light party queue and full party queue background
    if (yourLocation === "Full Party Queue" || yourLocation === "Light Party Queue") {
        // road on top, sidewalk on bottom
        fill(0, 0, 40)
        noStroke()
        rect(-300, -300, 600, 499)
        fill(0, 0, 80)
        rect(-300, -252, 600, 4)
        rect(-300, -153, 600, 6)
        rect(-300, 47, 600, 6)
        rect(-300, 148, 600, 4)
        fill(0, 0, 50)
        rect(-300, 241, 600, 60)

        if (yourLocation === "Full Party Queue") {
            // move to light party queue on the left
            fill(0, 0, 80)
            rect(-280, -53, 580, 6)
            stroke(0, 0, 80)
            strokeWeight(6)
            line(-280, -50, -265, -35)
            line(-280, -50, -265, -65)

            textSize(30)
            strokeWeight(2)
            text("Light Party Queue", -290, -80)
            text("Light Party Queue", -290, 0)

            stroke(180, 100, 100)
            line(-300, -300, -300, 300)

            // move to lobby on the bottom-left
            fill(0, 0, 20)
            noStroke()
            rect(-200, 200, 100, 100)
            fill(0, 0, 0)
            textSize(25)
            stroke(0, 0, 0)
            strokeWeight(2)
            text("Lobby", -190, 230)
        }

        // for light party queue, moving to full party queue is on the right
        // and lobby is on the bottom-right
        if (yourLocation === "Light Party Queue") {
            // move to light party queue on the left
            fill(0, 0, 80)
            rect(-300, -53, 580, 6)
            stroke(0, 0, 80)
            strokeWeight(6)
            line(280, -50, 265, -35)
            line(280, -50, 265, -65)

            textSize(30)
            strokeWeight(2)
            text("Full Party Queue", 15, -80)
            text("Full Party Queue", 15, 0)

            stroke(180, 100, 100)
            line(300, -300, 300, 300)

            // move to lobby on the bottom-left
            fill(0, 0, 20)
            noStroke()
            rect(100, 200, 100, 100)
            fill(0, 0, 0)
            textSize(25)
            stroke(0, 0, 0)
            strokeWeight(2)
            text("Lobby", 110, 230)
        }
    }

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

    // now iterate again and display names on top of players
    for (let playerPosition of playerPositions[yourLocation]) {
        fill(0, 0, 100)
        text(((firstNameAbbreviated) ? (playerPosition[3][0] + ".") : (playerPosition[3])) + " " +
            ((lastNameAbbreviated) ? (playerPosition[4][0] + ".") : (playerPosition[4])),
            playerPosition[0] - 700 - textWidth(
                ((firstNameAbbreviated) ? (playerPosition[3][0] + ".") : (playerPosition[3])) + " " +
                ((lastNameAbbreviated) ? (playerPosition[4][0] + ".") : (playerPosition[4]))) / 2, playerPosition[1] - 330)
    }

    // if you're in the lobby and you went to one of the holes while the
    // state allows you to access it, you can move to light party queue or
    // full party queue
    if (frameCount > frameWhenLastMoved + 10) {
        let posX = playerPositions[yourLocation][yourID - 1][0]
        let posY = playerPositions[yourLocation][yourID - 1][1]
        if (state === "Going Nowhere" && yourLocation === "Lobby" &&
            posY > 100 && posY < 180) {
            if (posX > 500 && posX < 580) {
                print("⚠️ Going into Light Party Queue.")
                socket.emit("move", ["Light Party Queue", 850, 475])
                yourLocation = "Light Party Queue"
                frameWhenLastMoved = frameCount
            } else if (posX > 820 && posX < 900) {
                print("⚠️ Going into Full Party Queue.")
                socket.emit("move", ["Full Party Queue", 550, 475])
                yourLocation = "Full Party Queue"
                frameWhenLastMoved = frameCount
            }
        }

        if (yourLocation === "Light Party Queue") {
            if (posX > 800 && posX < 900 &&
                posY > 500 && posY < 600) {
                print("⚠️ Going into Lobby.")
                socket.emit("move", ["Lobby", 540, 140])
                yourLocation = "Lobby"
                frameWhenLastMoved = frameCount
                state = "Changing job"
            } if (posX > 1000) {
                print("⚠️ Going into Full Party Queue.")
                socket.emit("move", ["Full Party Queue", 400, posY])
                yourLocation = "Full Party Queue"
                frameWhenLastMoved = frameCount
            }
        }

        if (yourLocation === "Full Party Queue") {
            if (posX > 500 && posX < 600 &&
                posY > 500 && posY < 600) {
                print("⚠️ Going into Lobby.")
                socket.emit("move", ["Lobby", 860, 140])
                yourLocation = "Lobby"
                frameWhenLastMoved = frameCount
                state = "Changing job"
            } if (posX < 400) {
                print("⚠️ Going into Light Party Queue.")
                socket.emit("move", ["Light Party Queue", 1000, posY])
                yourLocation = "Light Party Queue"
                frameWhenLastMoved = frameCount
            }
        }
    }



    if (keyIsPressed && frameCount - frameWhenLastMoved > 5) {
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
    else if (state === "Changing name") {
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
        // but only if both your first name and your last name consist of
        // more than 1 character
        if (yourFirstName.length > 1 && yourLastName.length > 1) {
            // and also if your name is unique
            // your name is unique if your first and last name are spotted 1
            // or less times in the names list
            let numTimesYourNameSpotted = 0
            for (let name of names) {
                if (yourFirstName === name[0] && yourLastName === name[1]) {
                    numTimesYourNameSpotted += 1
                }
            }

            if (numTimesYourNameSpotted <= 1) {
                fill(0, 0, 25)
                if (mouseX > 150 && mouseX < 400 &&
                    mouseY > 0 && mouseY < 25) fill(0, 0, 22)
                noStroke()
                rect(150, 0, 250, 25)

                fill(0, 0, 100)
                text("Finished changing name", 155, 20)
            } else {
                // otherwise no button will appear
                fill(0, 100, 100)
                noStroke()
                text("Your name isn't unique", 155, 20)
            }

        } else {
            // otherwise no button will appear
            fill(0, 100, 100)
            noStroke()
            text("Both your first and\n" +
                 "last name must include\n" +
                 "at least 2 characters", 155, 20)
        }
    } else {
        // then display some buttons for abbreviations
        // first name and last name for now
        fill(0, 0, 25)
        if (mouseX > 0 && mouseX < textWidth("Abbreviate First Name ") &&
            mouseY > 600 - textAscent() * 2 - textDescent() * 3 && mouseY < 600 - textAscent() - textDescent())
            fill(0, 0, 20)
        rect(0, 600 - textAscent() * 2 - textDescent() * 3, textWidth("Abbreviate First Name "), textAscent() + textDescent())
        fill(0, 0, 25)
        if (mouseX > 0 && mouseX < textWidth("Abbreviate Last Name ") &&
            mouseY > 600 - textAscent() - textDescent() && mouseY < 600)
            fill(0, 0, 20)
        rect(0, 600 - textAscent() - textDescent(), textWidth("Abbreviate Last Name "), textAscent() + textDescent())
        fill(0, 0, 100)
        text("Abbreviate First Name", textWidth(" ") / 2, 600 - textAscent() - textDescent() * 2.5)
        text("Abbreviate Last Name", textWidth(" ") / 2, 600 - textDescent() / 2)
    }

    // display a list of people on the left
    if (yourLocation === "Light Party Queue") {
        textSize(20)
        // get all the other people
        otherPeople = removeIndex(playerPositions["Light Party Queue"], yourID - 1)
        let oldSelectedPeople = selectedPeople
        selectedPeople = []

        // now iterate through all the other people and filter out all the
        // disconnected players that disconnected in the queue
        let index = 0
        for (let person of otherPeople) {
            if (person[0] === -20) { // always means they're disconnected
                otherPeople = removeIndex(otherPeople, index)
                index -= 1
            } else otherPeople[index][5] = false
            index += 1
        }

        // for each person in the selectedPeople list, toggle
        // the respective otherPerson's 6ᵗʰ index.
        for (let person of oldSelectedPeople) {
            let index = indexOfArrayIndex3and4(otherPeople, person)
            if (index !== -1) {
                otherPeople[index][5] = !otherPeople[index][5]
            }
        }

        // push to selectedPeople appropriately.
        // don't push the 3ʳᵈ+ person though.
        for (let person of otherPeople) {
            if (person[5] && selectedPeople.length < 3) {
                selectedPeople.push([person[3], person[4]])
            }
        }


        // display each other person
        // scroll-colored background, but will switch to white to display names
        noStroke()
        fill(60, 20, 70)
        let yPos = 20
        for (let otherPerson of otherPeople) {
            // if you're mousing over it gets a little darker
            if (mouseX > 10 && mouseX < 10 + textWidth("symb 10  chars 10  chars") &&
                mouseY > yPos && mouseY < yPos + 30) fill(60, 20, 66)

            // if it's selected, it gets much brighter
            if (otherPerson[5]) {
                fill(60, 20, 90)
                // if you're mousing over it it still gets a little darker
                if (mouseX > 10 && mouseX < 10 + textWidth("symb 10  chars 10  chars") &&
                    mouseY > yPos && mouseY < yPos + 30) fill(60, 20, 86)
            }

            rect(10, yPos, textWidth("symb 10  chars 10  chars"), 30)
            image(icons[otherPerson[2]], 15, yPos + 5, 20, 20)

            fill(0, 0, 100)
            text(otherPerson[3] + " " + otherPerson[4], 40, yPos + 20)
            yPos += 30

            fill(60, 20, 70)
        }
    }

    // after we're done with all this, we add a log window
    // to make it look good, we add multiple layers
    fill(0, 0, 0, 10)
    rect(0, 600, width, 440)

    // normally we'd add 10 for every layer, but we want to be more precise
    // here.
    fill(0, 0, 0, 10 * 100 / 90)
    rect(2, 602, width - 4, 436)
    fill(0, 0, 0, 10 * 100 / 80)
    rect(4, 604, width - 8, 432)
    fill(0, 0, 0, 10 * 100 / 70)
    rect(6, 606, width - 12, 428)
    fill(0, 0, 0, 10 * 100 / 60)
    rect(8, 608, width - 16, 424)
    fill(0, 0, 0, 10 * 100 / 50)
    rect(10, 610, width - 20, 420)
    fill(0, 0, 0, 10 * 100 / 40)
    rect(12, 612, width - 24, 416)
    fill(0, 0, 0, 10 * 100 / 30)
    rect(14, 614, width - 28, 412)
    fill(0, 0, 0, 10 * 100 / 20)
    rect(16, 616, width - 32, 408)
    fill(0, 0, 0, 10 * 100 / 10)
    rect(18, 618, width - 36, 404)

    textSize(19)
    // display each message inside
    // since textAscent() + textDescent() is always exactly the text size, in
    // this case 19
    let yPos = 640 + logWindowMessages.length*20
    for (let logWindowMessage of logWindowMessages) {
        if (yPos >= 1020) { // make sure the messages don't overflow
            yPos -= 20
        } else {
            yPos -= 20
            fill(logWindowMessage[1][0], logWindowMessage[1][1], logWindowMessage[1][2])
            text(logWindowMessage[0], textWidth("[" + logWindowMessage[2] + "]") + 26, yPos - textDescent())
            fill(0, 0, 90)
            text("[" + logWindowMessage[2] + "]", 20, yPos - textDescent())
        }
    }
    textSize(20)

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

        // you should tell the server
        socket.emit("change name", [yourFirstName, yourLastName])
    }
}

// Removes array[index] from array using concat() and subset().
function removeIndex(array, index) {
    return concat(subset(array, 0, index),
                  subset(array, index+1))
}

function mousePressed() {
    if (state === "Changing name") {
        // the new state will be "Going Nowhere"
        // but only if you actually have a name
        if (mouseX > 150 && mouseX < 400 &&
            mouseY > 0 && mouseY < 25 &&
            yourFirstName.length > 1 && yourLastName.length > 1) state = "Going Nowhere"

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
    } else if (state === "Changing job") {
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
    } else {
        if (mouseX > 0 && mouseX < textWidth("Abbreviate First Name ") &&
            mouseY > 600 - textAscent()*2 - textDescent()*3 && mouseY < 600 - textAscent() - textDescent())
            firstNameAbbreviated = !firstNameAbbreviated
        if (mouseX > 0 && mouseX < textWidth("Abbreviate Last Name ") &&
            mouseY > 600 - textAscent() - textDescent() && mouseY < 600)
            lastNameAbbreviated = !lastNameAbbreviated

        // in light party queue we want to add selection
        if (yourLocation === "Light Party Queue") {
            // iterate through everything in otherParty with the yPos
            let yPos = 20
            textSize(20)
            print(selectedPeople)
            for (let otherPerson of otherPeople) {
                if (mouseX > 10 && mouseX < 10 + textWidth("symb 10  chars 10  chars") &&
                    mouseY > yPos && mouseY < yPos + 30) {
                    // make sure there's not too many people selected
                    if (indexOfArrayIndex0and1( // it's fine to deselect
                        selectedPeople, [otherPerson[3], otherPerson[4]]) !== -1 ||
                        selectedPeople.length < 3) {
                        // now check the role
                        // you can only select 1 of each role
                        // it's also fine to deselect
                        let role = "DPS"
                        print(otherPerson[2])
                        if (["ast", "sge", "sch", "whm"].includes(otherPerson[2])) role = "Healer"
                        if (["drk", "gnb", "pld", "war"].includes(otherPerson[2])) role = "Tank"
                        print(role)
                        if (indexOfArrayIndex0and1(selectedPeople, [otherPerson[3], otherPerson[4]]) !== -1) {
                            selectedPeople.push([otherPerson[3], otherPerson[4]])
                            print(otherPerson[3], otherPerson[4], "was deselected!")
                            if (role === "DPS") DPSRemainingToSelect += 1
                            if (role === "Healer") HealersRemainingToSelect += 1
                            if (role === "Tank") TanksRemainingToSelect += 1
                        } else if (role === "DPS" && DPSRemainingToSelect >= 1) {
                            selectedPeople.push([otherPerson[3], otherPerson[4]])
                            print(otherPerson[3], otherPerson[4], "was selected!")
                            DPSRemainingToSelect -= 1
                        } else if (role === "Healer" && HealersRemainingToSelect >= 1) {
                            selectedPeople.push([otherPerson[3], otherPerson[4]])
                            print(otherPerson[3], otherPerson[4], "was selected!")
                            HealersRemainingToSelect -= 1
                        } else if (role === "Tank" && TanksRemainingToSelect >= 1) {
                            selectedPeople.push([otherPerson[3], otherPerson[4]])
                            TanksRemainingToSelect -= 1
                            print(otherPerson[3], otherPerson[4], "was selected!")
                        } else {
                            print("Tried to select", otherPerson[3], otherPerson[4], "but couldn't.")
                            print("DPS remaining:", DPSRemainingToSelect)
                            print("Healers remaining:", HealersRemainingToSelect)
                            print("Tanks remaining:", TanksRemainingToSelect)
                            print("Player role:", role)
                        }
                    }
                }
                yPos += 30
            }
        }
    }
}

// Array.indexOf(element) doesn't work when element is an array. This aims
// to handle this exception.
// It also aims to be tweaked to handle [arr[index][3], arr[index][4]]
// instead of [arr[index]].
function indexOfArrayIndex3and4(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        // Check if the element is an array and has at least five elements
        if (Array.isArray(element) && element.length >= 5) {
            // Check if the 4th and 5th elements match
            if (element[3] === value[0] && element[4] === value[1]) {
                return i; // Return the index of the matching array
            }
        }
    }
    return -1; // Return -1 if no match is found
}

function indexOfArrayIndex0and1(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        // Check if the element is an array and has at least two elements
        if (Array.isArray(element) && element.length >= 2) {
            // Check if the 1st and 2nd elements match
            if (element[0] === value[0] && element[1] === value[1]) {
                return i; // Return the index of the matching array
            }
        }
    }
    return -1; // Return -1 if no match is found
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

// let socket
// let playerPositions = {}
// let bossPositions = {}
// let yourID = 0
// let yourLocation = "Lobby"
// let yourClass = "rdm"
// let state = "Changing job" // there are different states. These can be like "Changing job", "Changing name", "3 players in current Light/Full Party", and "Exoflares".
// let boss
// let yourFirstName = ""
// let yourLastName = ""
// let cursor = [0, 0]
// let AoEs = []
//
// let font
// let fixedWidthFont
// let variableWidthFont
// let instructions
// let debugCorner /* output debug text in the bottom left corner of the canvas */
//
// let astIcon
// let brdIcon
// let blmIcon
// let bluIcon
// let dncIcon
// let drkIcon
// let drgIcon
// let gnbIcon
// let mchIcon
// let mnkIcon
// let ninIcon
// let pldIcon
// let rprIcon
// let rdmIcon
// let sgeIcon
// let samIcon
// let schIcon
// let smnIcon
// let warIcon
// let whmIcon
//
// let icons
//
// let yPadding
// let xPadding
// let blockHeight
// let yellowSlipperySoapYPos
// let blueSlipperySoapYPos
// let greenSlipperySoapYPos
// let yellowSlipperySoapWidth
// let blueSlipperySoapWidth
// let greenSlipperySoapWidth
//
// let silkie
//
// let firstNameAbbreviated
// let lastNameAbbreviated
//
// let logWindowMessages
//
// class CircleSpreadAOE {
//     constructor(type, target, radius, disappearsIn) {
//         this.type = type
//         this.x = playerPositions[yourLocation][target][0] - 700
//         this.y = playerPositions[yourLocation][target][1] - 300
//         this.r = radius
//         this.disappearsAt = millis() + disappearsIn
//     }
//
//     draw() {
//         if (millis() < this.disappearsAt) {
//             if (this.type === "untelegraphed electric") {
//                 let millisUntilDisappears = this.disappearsAt - millis()
//                 print(this.x, this.y)
//                 fill(45, 100, 100, min(map(millisUntilDisappears, 0, 200, 0, 10), 10))
//                 stroke(90, 100, 100, min(map(millisUntilDisappears, 0, 200, 0, 100), 100))
//                 strokeWeight(2)
//                 circle(this.x, this.y, this.r*2)
//
//                 // then stroke a very low-opacity white going across
//                 // since the middle will overlap, we just replace the middle
//                 // part with a circle
//                 stroke(0, 0, 100, min(map(millisUntilDisappears, 0, 200, 0, 15), 15))
//                 for (let angle = 0; angle < TWO_PI; angle += TWO_PI/50) {
//                     line(this.x - cos(angle)*15, this.y - sin(angle)*15, this.x - cos(angle)*this.r, this.y - sin(angle)*this.r)
//                 }
//                 noStroke()
//                 fill(0, 0, 100, min(map(millisUntilDisappears, 0, 200, 0, 15), 15))
//                 circle(this.x, this.y, 28)
//             }
//         }
//     }
// }
//
// class LineAOE {
//     constructor(type, x1, y1, x2, y2, thickness, disappearsIn) {
//         this.type = type
//         this.x1 = x1 - 700
//         this.y1 = y1 - 300
//         this.x2 = x2 - 700
//         this.y2 = y2 - 300
//         this.thickness = thickness
//         this.initiatedAt = millis()
//         this.disappearsAt = millis() + disappearsIn
//
//         // find the distance and angle from x1, y1 to x2, y2
//         let distance = sqrt((x2 - x1)**2 + (y2 - y1)**2)
//         let angle = atan2(y2 - y1, x2 - x1)
//
//         // now for each point, we check whether you nubcake
//         // only continue checking if you haven't nubcaked
//         let posX = playerPositions[yourLocation][yourID - 1][0]
//         let posY = playerPositions[yourLocation][yourID - 1][1]
//         let nubcaked = false
//         let x = x1
//         let y = y1
//         for (let i = 0; i < distance && nubcaked === false; i++) {
//             x += cos(angle)
//             y += sin(angle)
//             if (sqrt((x - posX)**2 + (y - posY)**2) < this.thickness/2) {
//                 nubcaked = true
//                 socket.emit("nubcake", ["got hit by a line AOE."])
//             }
//         }
//     }
//
//     draw() {
//         if (millis() < this.disappearsAt) {
//             if (this.type === "ice") {
//                 // light blue, appears/disappears from x1, y1 to x2, y2
//                 if (millis() - this.initiatedAt < 100) {
//                     let millisSinceAppeared = millis() - this.initiatedAt
//                     stroke(180, 30, 100, 50)
//                     strokeWeight(this.thickness)
//                     line(this.x1, this.y1, map(millisSinceAppeared, 0, 100, this.x1, this.x2), map(millisSinceAppeared, 0, 100, this.y1, this.y2))
//                 } else if (this.disappearsAt - millis() < 100) {
//                     let millisUntilDisappear = this.disappearsAt - millis()
//                     stroke(180, 30, 100, 50)
//                     strokeWeight(this.thickness)
//                     line(map(millisUntilDisappear, 0, 100, this.x2, this.x1), map(millisUntilDisappear, 0, 100, this.y2, this.y1), this.x2, this.y2)
//                 } else {
//                     stroke(180, 30, 100, 50)
//                     strokeWeight(this.thickness)
//                     line(this.x1, this.y1, this.x2, this.y2)
//                 }
//             }
//         }
//
//         // cut the line off at the left of the board where plaers can see
//         noStroke()
//         fill(234, 34, 24)
//         rect(-400, -300, 100, height)
//     }
// }
//
// class LineStackAOE {
//     constructor(type, resolvesIn, target, disappearsIn, x, y, thickness) {
//         this.type = type
//         this.resolvesAt = millis() + resolvesIn
//         this.disappearsAt = this.resolvesAt + disappearsIn
//         this.target = target
//         this.x = x
//         this.y = y
//         this.x2 = 0
//         this.y2 = 0
//         this.thickness = thickness
//         this.wentOff = false // set the position when this becomes true
//     }
//
//     draw() {
//         if (millis() < this.resolvesAt) {
//             if (this.type === "telegraphed water") {
//                 stroke(0, 0, 100)
//                 push()
//                 translate(playerPositions[yourLocation][this.target][0] - 700,
//                           playerPositions[yourLocation][this.target][1] - 300)
//                 let angleFromCenter = atan2(
//                     playerPositions[yourLocation][this.target][1] - this.y,
//                     playerPositions[yourLocation][this.target][0] - this.x)
//                 rotate(angleFromCenter)
//
//                 // add arrow lines
//                 line(0, 65, 0, 35)
//                 line(-30, 50, -30, 20)
//                 line(-60, 50, -60, 20)
//                 line(-90, 50, -90, 20)
//                 line(0, -65, 0, -35)
//                 line(-30, -50, -30, -20)
//                 line(-60, -50, -60, -20)
//                 line(-90, -50, -90, -20)
//
//                 line(30, 0, 60, 0)
//
//                 // now add arrow heads
//                 line(-3, 38, 0, 35)
//                 line(3, 38, 0, 35)
//                 line(-27, 23, -30, 20)
//                 line(-33, 23, -30, 20)
//                 line(-57, 23, -60, 20)
//                 line(-63, 23, -60, 20)
//                 line(-87, 23, -90, 20)
//                 line(-93, 23, -90, 20)
//                 line(3, -38, 0, -35)
//                 line(-3, -38, 0, -35)
//                 line(-27, -23, -30, -20)
//                 line(-33, -23, -30, -20)
//                 line(-57, -23, -60, -20)
//                 line(-63, -23, -60, -20)
//                 line(-87, -23, -90, -20)
//                 line(-93, -23, -90, -20)
//
//                 line(33, -3, 30, 0)
//                 line(33, 3, 30, 0)
//
//                 pop()
//             }
//         } else if (millis() < this.disappearsAt) {
//             if (this.type === "telegraphed water") {
//                 if (!this.wentOff) {
//                     this.wentOff = true
//                     this.x2 = playerPositions[yourLocation][this.target][0]
//                     this.y2 = playerPositions[yourLocation][this.target][1]
//                 }
//                 if (millis() - this.resolvesAt < 100) {
//                     let millisSinceResolved = millis() - this.resolvesAt
//                     stroke(180, 30, 100, 10)
//                     strokeWeight(this.thickness)
//                     line(this.x - 700, this.y - 300,
//                          map(millisSinceResolved, 0, 100, this.x, this.x2) - 700,
//                          map(millisSinceResolved, 0, 100, this.y, this.y2) - 300)
//                 } else if (this.disappearsAt - millis() < 100) {
//                     let millisUntilDisappears = this.disappearsAt - millis()
//                     stroke(180, 50, 100, 10)
//                     strokeWeight(this.thickness)
//                     line(map(millisUntilDisappears, 100, 0, this.x, this.x2) - 700,
//                          map(millisUntilDisappears, 100, 0, this.y, this.y2) - 300,
//                          this.x2 - 700,
//                          this.y2 - 300)
//                 } else {
//                     stroke(180, 50, 100, 10)
//                     strokeWeight(this.thickness)
//                     line(this.x - 700, this.y - 300, this.x2 - 700, this.y2 - 300)
//                 }
//             }
//         }
//     }
// }
//
// // this is a donut AOE, as you might've guessed
// class DonutAOE {
//     constructor(type, x, y, r, lingersForMillis) {
//         this.type = type
//         this.x = x - 700 // account for translate(700, 300)
//         this.y = y - 300
//         this.r = r
//         this.disappearsAt = millis() + lingersForMillis
//         this.initiatedAt = millis()
//
//         let posX = playerPositions[yourLocation][yourID - 1][0]
//         let posY = playerPositions[yourLocation][yourID - 1][1]
//
//         let bossPosX = bossPositions[yourLocation][0]
//         let bossPosY = bossPositions[yourLocation][1]
//
//         if (sqrt((posX - bossPosX)**2 + (posY - bossPosY)**2) > this.r)
//             socket.emit("nubcake", ["got hit by a donut AOE."])
//     }
//
//     draw() {
//         if (millis() < this.disappearsAt) {
//             if (this.type === "full wind") {
//                 let radius
//                 if (millis() - this.initiatedAt < 200) {
//                     let millisSinceAppeared = millis() - this.initiatedAt
//                     radius = map(millisSinceAppeared, 0, 200, 828, this.r)
//                 } else if (this.disappearsAt - millis() < 200) {
//                     let millisUntilDisappear = this.disappearsAt - millis()
//                     radius = map(millisUntilDisappear, 0, 200, 828, this.r)
//                 } else {
//                     radius = this.r
//                 }
//                 noStroke()
//                 fill(150, 20, 80, 60)
//                 beginShape()
//                 vertex(-300, -300)
//                 vertex(-300, 300)
//                 vertex(300, 300)
//                 vertex(300, -300)
//                 beginContour()
//                 for (let angle = 0; angle <= TWO_PI; angle += TWO_PI/100) {
//                     let x = max(-300, min(this.x + cos(angle)*radius, 300))
//                     let y = max(-300, min(this.y + sin(angle)*radius, 300))
//                     vertex(x, y)
//                 }
//                 endContour()
//                 endShape(CLOSE)
//             }
//         }
//     }
// }
//
// // this is a rectangle AOE, as you might've guessed
// class RectAOE {
//     constructor(type, x, y, w, h, lingersForMillis) {
//         this.type = type
//         this.x = x - 700 // account for translate(700, 300)
//         this.y = y - 300
//         this.w = w
//         this.h = h
//         this.disappearsAt = millis() + lingersForMillis
//         this.initiatedAt = millis()
//
//         let posX = playerPositions[yourLocation][yourID - 1][0]
//         let posY = playerPositions[yourLocation][yourID - 1][1]
//         if (this.x < posX && posX < this.x + this.w &&
//             this.y < posY && posY < this.x + this.h)
//             socket.emit("nubcake", ["got hit by a rect AOE."])
//     }
//
//     draw() {
//         if (millis() < this.disappearsAt) {
//             noStroke()
//             if (this.type === "horizontal ice") {
//                 // light blue, appears/disappears from left to right
//                 if (millis() - this.initiatedAt < 100) {
//                     let millisSinceAppeared = millis() - this.initiatedAt
//                     fill(180, 30, 100, 50)
//                     rect(this.x, this.y, map(millisSinceAppeared, 0, 100, 0, this.w), this.h)
//                 } else if (this.disappearsAt - millis() < 100) {
//                     let millisUntilDisappear = this.disappearsAt - millis()
//                     fill(180, 30, 100, 50)
//                     rect(map(millisUntilDisappear, 0, 100, this.x + this.w, this.x), this.y, map(millisUntilDisappear, 0, 100, 0, this.w), this.h)
//                 } else {
//                     fill(180, 30, 100, 50)
//                     rect(this.x, this.y, this.w, this.h)
//                 }
//             } if (this.type === "vertical ice") {
//                 // light blue, appears/disappears from top to bottom
//                 if (millis() - this.initiatedAt < 100) {
//                     let millisSinceAppeared = millis() - this.initiatedAt
//                     fill(180, 30, 100, 50)
//                     rect(this.x, this.y, this.w, map(millisSinceAppeared, 0, 100, 0, this.h))
//                 } else if (this.disappearsAt - millis() < 100) {
//                     let millisUntilDisappear = this.disappearsAt - millis()
//                     fill(180, 30, 100, 50)
//                     rect(this.x, map(millisUntilDisappear, 0, 100, this.y + this.h, this.y), this.w, map(millisUntilDisappear, 0, 100, 0, this.h))
//                 } else {
//                     fill(180, 30, 100, 50)
//                     rect(this.x, this.y, this.w, this.h)
//                 }
//             }
//         }
//     }
// }
//
// // this is a conal AOE, as you might've guessed
// class ConeAOE {
//     constructor(type, x, y, r, sAngle, eAngle, lingersForMillis) {
//         this.type = type
//         this.x = x - 700 // account for translate(700, 300)
//         this.y = y - 300
//         this.radius = r
//         this.start = sAngle
//         this.end = eAngle
//         this.disappearsAt = millis() + lingersForMillis
//         this.initiatedAt = millis()
//
//         let posX = playerPositions[yourLocation][yourID - 1][0]
//         let posY = playerPositions[yourLocation][yourID - 1][1]
//
//         if (sqrt(posX**2 + posY**2) < this.radius &&
//             this.start < atan2(posY, posX) && atan2(posY, posX) < this.end)
//             socket.emit("nubcake", ["got hit by a cone AOE."])
//
//         if (this.type === "electric") {
//             // to add an electric effect, select random angles as points
//             // to draw lines on
//             this.angleOne = random(this.start, this.end)
//             this.angleTwo = random(this.start, this.end)
//             this.angleThree = random(this.start, this.end)
//             this.angleFour = random(this.start, this.end)
//             this.angleFive = random(this.start, this.end)
//             this.angleSix = random(this.start, this.end)
//             this.angleSeven = random(this.start, this.end)
//             this.angleEight = random(this.start, this.end)
//             this.angleNine = random(this.start, this.end)
//         }
//     }
//
//     draw() {
//         if (millis() < this.disappearsAt) {
//             if (this.type === "electric") {
//                 // dark brown with yellow edges
//                 fill(45, 50, 20, 90)
//                 noStroke()
//                 arc(this.x, this.y, this.radius * 2, this.radius * 2, this.start, this.end)
//                 stroke(45, 50, 60, 90)
//                 line(this.x, this.y, this.x + cos(this.start)*this.radius, this.y + sin(this.start)*this.radius)
//                 line(this.x, this.y, this.x + cos(this.end)*this.radius, this.y + sin(this.end)*this.radius)
//
//                 if (frameCount % 2 === 0) {
//                     this.angleOne = random(this.start, this.end)
//                     this.angleTwo = random(this.start, this.end)
//                     this.angleThree = random(this.start, this.end)
//                     this.angleFour = random(this.start, this.end)
//                     this.angleFive = random(this.start, this.end)
//                     this.angleSix = random(this.start, this.end)
//                     this.angleSeven = random(this.start, this.end)
//                     this.angleEight = random(this.start, this.end)
//                     this.angleNine = random(this.start, this.end)
//                 }
//                 line(this.x, this.y, this.x + cos(this.angleOne)*this.radius/3, this.y + sin(this.angleOne)*this.radius/3)
//                 line(this.x + cos(this.angleOne)*this.radius/3, this.y + sin(this.angleOne)*this.radius/3,
//                     this.x + cos(this.angleTwo)*2*this.radius/3, this.y + sin(this.angleTwo)*2*this.radius/3)
//                 line(this.x + cos(this.angleTwo)*2*this.radius/3, this.y + sin(this.angleTwo)*2*this.radius/3,
//                     this.x + cos(this.angleThree)*this.radius, this.y + sin(this.angleThree)*this.radius)
//                 line(this.x, this.y, this.x + cos(this.angleFour)*this.radius/3, this.y + sin(this.angleFour)*this.radius/3)
//                 line(this.x + cos(this.angleFour)*this.radius/3, this.y + sin(this.angleFour)*this.radius/3,
//                     this.x + cos(this.angleFive)*2*this.radius/3, this.y + sin(this.angleFive)*2*this.radius/3)
//                 line(this.x + cos(this.angleFive)*2*this.radius/3, this.y + sin(this.angleFive)*2*this.radius/3,
//                     this.x + cos(this.angleSix)*this.radius, this.y + sin(this.angleSix)*this.radius)
//                 line(this.x, this.y, this.x + cos(this.angleSeven)*this.radius/3, this.y + sin(this.angleSeven)*this.radius/3)
//                 line(this.x + cos(this.angleSeven)*this.radius/3, this.y + sin(this.angleSeven)*this.radius/3,
//                     this.x + cos(this.angleEight)*2*this.radius/3, this.y + sin(this.angleEight)*2*this.radius/3)
//                 line(this.x + cos(this.angleEight)*2*this.radius/3, this.y + sin(this.angleEight)*2*this.radius/3,
//                     this.x + cos(this.angleNine)*this.radius, this.y + sin(this.angleNine)*this.radius)
//             }
//         }
//     }
// }
//
// function preload() {
//     font = loadFont('data/consola.ttf')
//     fixedWidthFont = loadFont('data/consola.ttf')
//     variableWidthFont = loadFont('data/meiryo.ttf')
//     astIcon = loadImage("data/Astrologian_Icon_3.png")
//     brdIcon = loadImage("data/Bard_Icon_3.png")
//     blmIcon = loadImage("data/Black_Mage_Icon_3.png")
//     bluIcon = loadImage("data/Blue_Mage_Icon_3.png")
//     dncIcon = loadImage("data/Dancer_Icon_3.png")
//     drkIcon = loadImage("data/Dark_Knight_Icon_3.png")
//     drgIcon = loadImage("data/Dragoon_Icon_3.png")
//     gnbIcon = loadImage("data/Gunbreaker_Icon_3.png")
//     mchIcon = loadImage("data/Machinist_Icon_3.png")
//     mnkIcon = loadImage("data/Monk_Icon_3.png")
//     ninIcon = loadImage("data/Ninja_Icon_3.png")
//     pldIcon = loadImage("data/Paladin_Icon_3.png")
//     rprIcon = loadImage("data/Reaper_Icon_3.png")
//     rdmIcon = loadImage("data/Red_Mage_Icon_3.png")
//     sgeIcon = loadImage("data/Sage_Icon_3.png")
//     samIcon = loadImage("data/Samurai_Icon_3.png")
//     schIcon = loadImage("data/Scholar_Icon_3.png")
//     smnIcon = loadImage("data/Summoner_Icon_3.png")
//     warIcon = loadImage("data/Warrior_Icon_3.png")
//     whmIcon = loadImage("data/White_Mage_Icon_3.png")
//     icons = {
//         "ast": astIcon,
//         "brd": brdIcon,
//         "blm": blmIcon,
//         "blu": bluIcon,
//         "dnc": dncIcon,
//         "drk": drkIcon,
//         "drg": drgIcon,
//         "gnb": gnbIcon,
//         "mch": mchIcon,
//         "mnk": mnkIcon,
//         "nin": ninIcon,
//         "pld": pldIcon,
//         "rpr": rprIcon,
//         "rdm": rdmIcon,
//         "sge": sgeIcon,
//         "sam": samIcon,
//         "sch": schIcon,
//         "smn": smnIcon,
//         "war": warIcon,
//         "whm": whmIcon
//     }
//
//     silkie = loadImage("data/Silkie.png")
//
//     // each log window message follows this: ["message", [hue, saturation, brightness]]
//     logWindowMessages = []
//
//     // Connect to the WebSocket server
//     socket = io.connect(window.location.origin)
//
//     socket.on('connection entry', function (msg) {
//         // this entry will always be [playerPositions, the player that you are, state that is for right now, boss]
//         playerPositions = msg[0]
//         yourID = msg[1]
//         state = msg[2]
//         boss = msg[3]
//     })
//     socket.on('other player connection entry', function (msg) {
//         // this entry will always be [playerPositions, the player that they are]
//         playerPositions = msg[0]
//     })
//     socket.on('update', function (msg) {
//         playerPositions = msg[0]
//     })
//     socket.on('change mechanic', function (msg) {
//         state = msg
//         switch (state) {
//             case "Slippery Soap (Blue)": boss = "Silkie"; break
//             case "Slippery Soap (Yellow)": boss = "Silkie"; break
//             case "Slippery Soap (Green)": boss = "Silkie"; break
//         }
//     })
//     socket.on('cone AOE', function (msg) {
//         AoEs.push(
//             new ConeAOE(...msg)
//         )
//     })
//     socket.on('rect AOE', function (msg) {
//         AoEs.push(
//             new RectAOE(...msg)
//         )
//     })
//     socket.on('donut AOE', function (msg) {
//         AoEs.push(
//             new DonutAOE(...msg)
//         )
//     })
//     socket.on('line stack', function (msg) {
//         AoEs.push(
//             new LineStackAOE(...msg)
//         )
//     })
//     socket.on('update boss positions', function (msg) {
//         bossPositions = msg
//     })
//     socket.on('line AOE', function (msg) {
//         AoEs.push(
//             new LineAOE(...msg)
//         )
//     })
//     socket.on('circle spread AOE', function (msg) {
//         AoEs.push(
//             new CircleSpreadAOE(...msg)
//         )
//     })
//     socket.on('log window message', function (location, msg) {
//         if (location === yourLocation) {
//             msg[2] = formatDate(new Date())
//             logWindowMessages.push(msg)
//         }
//     })
// }
//
//
// // this function is actually mostly ChatGPT's code
// function formatDate(date) {
//     const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
//     let year = date.getFullYear()
//     let dayOfWeek = days[date.getDay()]
//     let monthName = months[date.getMonth()]
//     let unpaddedDay = date.getDate()
//     let hours = date.getHours()
//     let minutes = date.getMinutes().toString().padStart(2, '0')
//     let seconds = date.getSeconds().toString().padStart(2, '0')
//     let ampm = hours >= 12 ? 'PM' : 'AM'
//     hours = hours % 12
//     hours = hours ? hours.toString().padStart(2, '0') : '12' // Adjust 0 to 12 for AM/PM
//     return `${dayOfWeek} ${year} ${monthName} ${unpaddedDay} ${hours}:${minutes}:${seconds} ${ampm}`
// }
//
//
// function setup() {
//     let cnv = createCanvas(1100, 1040)
//     colorMode(HSB, 360, 100, 100, 100)
//     background(234, 34, 24)
//     cnv.parent('#canvas')
//
//     colorMode(HSB, 360, 100, 100, 100)
//     textFont(font, 20)
//
//     /* initialize instruction div */
//     instructions = select('#ins')
//     instructions.html(`<pre>
//         numpad 1 → freeze sketch</pre>`)
//
//     debugCorner = new CanvasDebugCorner(5)
//     debugCorner.visible = false
//
//     yourClass = "ast"
//
//     yPadding = 3
//     xPadding = 3
//
//     blockHeight = textAscent()*1.1 + yPadding*2 + textDescent()
//
//     yellowSlipperySoapYPos = 50
//     blueSlipperySoapYPos = yellowSlipperySoapYPos + blockHeight + yPadding + 2
//     greenSlipperySoapYPos = blueSlipperySoapYPos + blockHeight + yPadding + 2
//
//     yellowSlipperySoapWidth = textWidth("Slippery Soap (Yellow)") + xPadding*2
//     blueSlipperySoapWidth = textWidth("Slippery Soap (Blue)") + xPadding*2
//     greenSlipperySoapWidth = textWidth("Slippery Soap (Green)") + xPadding*2
//
//     frameRate(60)
//
//     angleMode(RADIANS)
// }
//
// function draw() {
//     background(234, 34, 24)
//
//     push()
//     translate(700, 300)
//
//     if (yourLocation === "Lobby" && (state === "Changing job" || state === "Changing name" || state === "Going Nowhere")) {
//         // substitute for the board: chessboard-like bricks on corners, stone in
//         // middle
//         stroke(0, 0, 0)
//         strokeWeight(1)
//         for (let i = 0; i < 15; i++) {
//             fill(0, 55, 60)
//             rect(-300, i * 40 - 300, 40, 20)
//             rect(-220, i * 40 - 300, 40, 20)
//             rect(-140, i * 40 - 300, 40, 20)
//             rect(-60, i * 40 - 300, 40, 20)
//             rect(20, i * 40 - 300, 40, 20)
//             rect(100, i * 40 - 300, 40, 20)
//             rect(180, i * 40 - 300, 40, 20)
//             rect(260, i * 40 - 300, 40, 20)
//             rect(-280, i * 40 - 280, 40, 20)
//             rect(-200, i * 40 - 280, 40, 20)
//             rect(-120, i * 40 - 280, 40, 20)
//             rect(-40, i * 40 - 280, 40, 20)
//             rect(40, i * 40 - 280, 40, 20)
//             rect(120, i * 40 - 280, 40, 20)
//             rect(200, i * 40 - 280, 40, 20)
//             rect(280, i * 40 - 280, 20, 20)
//             fill(0, 60, 60)
//             rect(-260, i * 40 - 300, 40, 20)
//             rect(-180, i * 40 - 300, 40, 20)
//             rect(-100, i * 40 - 300, 40, 20)
//             rect(-20, i * 40 - 300, 40, 20)
//             rect(60, i * 40 - 300, 40, 20)
//             rect(140, i * 40 - 300, 40, 20)
//             rect(220, i * 40 - 300, 40, 20)
//             rect(-300, i * 40 - 280, 20, 20)
//             rect(-240, i * 40 - 280, 40, 20)
//             rect(-160, i * 40 - 280, 40, 20)
//             rect(-80, i * 40 - 280, 40, 20)
//             rect(0, i * 40 - 280, 40, 20)
//             rect(80, i * 40 - 280, 40, 20)
//             rect(160, i * 40 - 280, 40, 20)
//             rect(240, i * 40 - 280, 40, 20)
//         }
//
//         fill(0, 0, 50)
//         rect(-200, -200, 400, 400)
//         line(-120, -200, -120, 200)
//         line(-40, -200, -40, 200)
//         line(40, -200, 40, 200)
//         line(120, -200, 120, 200)
//         line(200, -120, -200, -120)
//         line(200, -40, -200, -40)
//         line(200, 40, -200, 40)
//         line(200, 120, -200, 120)
//     }
//
//     // add different backgrounds for certain bosses
//     if (boss === "Silkie") {
//         fill(300, 30, 80)
//         rect(-300, -300, 600, 600)
//         stroke(300, 40, 80)
//         strokeWeight(3)
//         fill(45, 30, 60)
//         rect(-260, -260, 520, 520)
//         let squareSize = 65
//
//         // to make the pattern, draw circles on each intersection
//         // this includes the ones at the permiters: draw filled arcs for those
//         // start at the ones in the middle
//         fill(45, 40, 60)
//         noStroke()
//         for (let x = -260 + squareSize; x < 260; x += squareSize) {
//             for (let y = -260 + squareSize; y < 260; y += squareSize) {
//                 circle(x, y, squareSize)
//             }
//         }
//
//         // left/right side
//         for (let y = -260 + squareSize; y < 260; y += squareSize) {
//             arc(-260, y, squareSize, squareSize, -PI / 2, PI / 2)
//             arc(260, y, squareSize, squareSize, PI / 2, -PI / 2)
//         }
//         // top/bottom side
//         for (let x = -260 + squareSize; x < 260; x += squareSize) {
//             arc(x, -260, squareSize, squareSize, 0, PI)
//             arc(x, 260, squareSize, squareSize, PI, 0)
//         }
//         // corners
//         arc(-260, -260, squareSize, squareSize, 0, PI / 2)
//         arc(-260, 260, squareSize, squareSize, -PI / 2, 0)
//         arc(260, 260, squareSize, squareSize, -PI, -PI / 2)
//         arc(260, -260, squareSize, squareSize, PI / 2, PI)
//
//         // now draw the lines
//         // left/right side
//         stroke(0, 0, 20, 10)
//         strokeWeight(1)
//         noFill()
//         for (let y = -260; y <= 260; y += squareSize) {
//             line(-260, y, 260, y)
//         }
//         // top/bottom side
//         for (let x = -260; x <= 260; x += squareSize) {
//             line(x, -260, x, 260)
//         }
//
//         // there are also faint circles along the perimeter
//         stroke(0, 0, 30, 20)
//         circle(-260 + squareSize / 2, -260 + 3 * squareSize / 2, squareSize - 5)
//         circle(-260 + squareSize / 2, -260 + 5 * squareSize / 2, squareSize - 5)
//         circle(-260 + squareSize / 2, -260 + 7 * squareSize / 2, squareSize - 5)
//         circle(-260 + squareSize / 2, -260 + 9 * squareSize / 2, squareSize - 5)
//         circle(-260 + squareSize / 2, -260 + 11 * squareSize / 2, squareSize - 5)
//         circle(-260 + squareSize / 2, -260 + 13 * squareSize / 2, squareSize - 5)
//         circle(-260 + 3 * squareSize / 2, -260 + 15 * squareSize / 2, squareSize - 5)
//         circle(-260 + 5 * squareSize / 2, -260 + 15 * squareSize / 2, squareSize - 5)
//         circle(-260 + 7 * squareSize / 2, -260 + 15 * squareSize / 2, squareSize - 5)
//         circle(-260 + 9 * squareSize / 2, -260 + 15 * squareSize / 2, squareSize - 5)
//         circle(-260 + 11 * squareSize / 2, -260 + 15 * squareSize / 2, squareSize - 5)
//         circle(-260 + 13 * squareSize / 2, -260 + 15 * squareSize / 2, squareSize - 5)
//         circle(-260 + 15 * squareSize / 2, -260 + 13 * squareSize / 2, squareSize - 5)
//         circle(-260 + 15 * squareSize / 2, -260 + 11 * squareSize / 2, squareSize - 5)
//         circle(-260 + 15 * squareSize / 2, -260 + 9 * squareSize / 2, squareSize - 5)
//         circle(-260 + 15 * squareSize / 2, -260 + 7 * squareSize / 2, squareSize - 5)
//         circle(-260 + 15 * squareSize / 2, -260 + 5 * squareSize / 2, squareSize - 5)
//         circle(-260 + 15 * squareSize / 2, -260 + 3 * squareSize / 2, squareSize - 5)
//         circle(-260 + 13 * squareSize / 2, -260 + squareSize / 2, squareSize - 5)
//         circle(-260 + 11 * squareSize / 2, -260 + squareSize / 2, squareSize - 5)
//         circle(-260 + 9 * squareSize / 2, -260 + squareSize / 2, squareSize - 5)
//         circle(-260 + 7 * squareSize / 2, -260 + squareSize / 2, squareSize - 5)
//         circle(-260 + 5 * squareSize / 2, -260 + squareSize / 2, squareSize - 5)
//         circle(-260 + 3 * squareSize / 2, -260 + squareSize / 2, squareSize - 5)
//
//         // also where there's exactly 3 squares away from the center
//         circle(-260 + 7 * squareSize / 2, -260 + 5 * squareSize / 2, squareSize - 5)
//         circle(-260 + 9 * squareSize / 2, -260 + 5 * squareSize / 2, squareSize - 5)
//         circle(-260 + 7 * squareSize / 2, -260 + 11 * squareSize / 2, squareSize - 5)
//         circle(-260 + 9 * squareSize / 2, -260 + 11 * squareSize / 2, squareSize - 5)
//         circle(-260 + 5 * squareSize / 2, -260 + 7 * squareSize / 2, squareSize - 5)
//         circle(-260 + 5 * squareSize / 2, -260 + 9 * squareSize / 2, squareSize - 5)
//         circle(-260 + 11 * squareSize / 2, -260 + 7 * squareSize / 2, squareSize - 5)
//         circle(-260 + 11 * squareSize / 2, -260 + 9 * squareSize / 2, squareSize - 5)
//
//         stroke(0, 0, 0, 40)
//         // also on the exact intercardinal squares that's not in the 2x2
//         // center squares
//         circle(-260 + 15 * squareSize / 2, -260 + 15 * squareSize / 2, squareSize - 5)
//         circle(-260 + squareSize / 2, -260 + 15 * squareSize / 2, squareSize - 5)
//         circle(-260 + squareSize / 2, -260 + squareSize / 2, squareSize - 5)
//         circle(-260 + 15 * squareSize / 2, -260 + squareSize / 2, squareSize - 5)
//         circle(-260 + 13 * squareSize / 2, -260 + 13 * squareSize / 2, squareSize - 5)
//         circle(-260 + 3 * squareSize / 2, -260 + 13 * squareSize / 2, squareSize - 5)
//         circle(-260 + 3 * squareSize / 2, -260 + 3 * squareSize / 2, squareSize - 5)
//         circle(-260 + 13 * squareSize / 2, -260 + 3 * squareSize / 2, squareSize - 5)
//         circle(-260 + 11 * squareSize / 2, -260 + 11 * squareSize / 2, squareSize - 5)
//         circle(-260 + 5 * squareSize / 2, -260 + 11 * squareSize / 2, squareSize - 5)
//         circle(-260 + 5 * squareSize / 2, -260 + 5 * squareSize / 2, squareSize - 5)
//         circle(-260 + 11 * squareSize / 2, -260 + 5 * squareSize / 2, squareSize - 5)
//     }
//
//
//     // display all AoEs
//     for (let AoE of AoEs) {
//         AoE.draw()
//     }
//
//     if (bossPositions[yourLocation]) {
//         let bossX = bossPositions[yourLocation][0]
//         let bossY = bossPositions[yourLocation][1]
//         if (boss === "Silkie") {
//             // display the targetting ring and then the Silkie image
//             stroke(0, 100, 100)
//             strokeWeight(3)
//             noFill()
//             circle(bossX - 700, bossY - 300, 135)
//             stroke(0, 70, 100)
//             strokeWeight(10)
//             circle(bossX - 700, bossY - 300, 155)
//
//             // then display the boss's facing with a triangle
//             push()
//             translate(bossX - 700, bossY - 300)
//             rotate(radians(bossPositions[yourLocation][3]))
//             triangle(90, -7, 90, 7, 102, 0)
//             pop()
//
//             image(silkie, bossX - 800, bossY - 400, 200, 200)
//
//             // add a tail color
//             if (bossPositions[yourLocation][2]) {
//                 switch (bossPositions[yourLocation][2]) {
//                     case "yellow":
//                         fill(50, 60, 80);
//                         stroke(50, 50, 90);
//                         break
//                     case "green":
//                         fill(120, 30, 100);
//                         stroke(120, 20, 100);
//                         break
//                     case "blue":
//                         fill(200, 20, 100);
//                         stroke(200, 10, 100);
//                         break
//                 }
//                 noStroke()
//                 circle(bossX - 758, bossY - 329, 55)
//             }
//         }
//     }
//
//     fill(0, 100, 100)
//     noStroke()
//     let player = 0
//     for (let playerPosition of playerPositions[yourLocation]) {
//         player += 1
//         if (yourID === player) {
//             fill(120, 100, 100)
//             rect(playerPosition[0] - 725, playerPosition[1] - 325, 50, 50, 10)
//         }
//         image(icons[playerPosition[2]], playerPosition[0] - 725, playerPosition[1] - 325, 50, 50)
//     }
//
//     // now iterate again and display names on top of players
//     for (let playerPosition of playerPositions[yourLocation]) {
//         fill(0, 0, 100)
//         text(((firstNameAbbreviated) ? (playerPosition[3][0] + ".") : (playerPosition[3])) + " " +
//             ((lastNameAbbreviated) ? (playerPosition[4][0] + ".") : (playerPosition[4])),
//             playerPosition[0] - 700 - textWidth(
//                 ((firstNameAbbreviated) ? (playerPosition[3][0] + ".") : (playerPosition[3])) + " " +
//                 ((lastNameAbbreviated) ? (playerPosition[4][0] + ".") : (playerPosition[4]))) / 2, playerPosition[1] - 330)
//     }
//
//     if (keyIsPressed) {
//         if (keyIsDown(87) && playerPositions[yourLocation][yourID - 1][1] > 0) socket.emit("move up", yourID)
//         if (keyIsDown(68) && playerPositions[yourLocation][yourID - 1][0] < 1000) socket.emit("move right", yourID)
//         if (keyIsDown(83) && playerPositions[yourLocation][yourID - 1][1] < 600) socket.emit("move down", yourID)
//         if (keyIsDown(65) && playerPositions[yourLocation][yourID - 1][0] > 400) socket.emit("move left", yourID)
//     }
//     pop()
//
//
//     // display all possible jobs
//     if (state === "Changing job") {
//         fill(0, 0, 100)
//         textSize(20)
//         text("Change jobs", 5, 20)
//         image(astIcon, 0, 100, 50, 50)
//         image(brdIcon, 50, 100, 50, 50)
//         image(blmIcon, 0, 150, 50, 50)
//         image(bluIcon, 50, 150, 50, 50)
//         image(dncIcon, 0, 200, 50, 50)
//         image(drkIcon, 50, 200, 50, 50)
//         image(drgIcon, 0, 250, 50, 50)
//         image(gnbIcon, 50, 250, 50, 50)
//         image(mchIcon, 0, 300, 50, 50)
//         image(mnkIcon, 50, 300, 50, 50)
//         image(ninIcon, 0, 350, 50, 50)
//         image(pldIcon, 50, 350, 50, 50)
//         image(rprIcon, 0, 400, 50, 50)
//         image(rdmIcon, 50, 400, 50, 50)
//         image(sgeIcon, 0, 450, 50, 50)
//         image(samIcon, 50, 450, 50, 50)
//         image(schIcon, 0, 500, 50, 50)
//         image(smnIcon, 50, 500, 50, 50)
//         image(warIcon, 0, 550, 50, 50)
//         image(whmIcon, 50, 550, 50, 50)
//
//         // also add button for "finished changing jobs"
//         fill(0, 0, 25)
//         if (mouseX > 150 && mouseX < 400 &&
//             mouseY > 0 && mouseY < 25) fill(0, 0, 22)
//         noStroke()
//         rect(150, 0, 250, 25)
//
//         fill(0, 0, 100)
//         text("Finished changing jobs", 155, 20)
//     }
//
//     // now you can change your name
//     else if (state === "Changing name") {
//         // add textboxes
//         fill(0, 0, 20)
//         stroke(0, 0, 50)
//         strokeWeight((cursor[0] === 0) ? 2 : 1)
//         rect(textWidth("First name:") + textWidth(" ") / 2 + 5, 80, textWidth("10  letters"), 25)
//
//         strokeWeight((cursor[0] === 0) ? 1 : 2)
//         rect(textWidth("First name:") + textWidth(" ") / 2 + 5, 110, textWidth("10  letters"), 25)
//
//         strokeWeight(1)
//
//         fill(0, 0, 100)
//         textSize(20)
//         text("Change names", 5, 20)
//         text("First name: " + yourFirstName, 5, 100)
//         text("Last name:  " + yourLastName, 5, 130)
//         text("10 max", 260, 100)
//         text("10 max", 260, 130)
//
//         // now display the cursor
//         stroke(0, 0, 100)
//         strokeWeight(1)
//         if (millis() % 1000 < 500) {
//             line(textWidth("First name: ") + textWidth(" ") * cursor[1] + 5, 83 + 30 * cursor[0],
//                 textWidth("Last name:  ") + textWidth(" ") * cursor[1] + 5, 102 + 30 * cursor[0])
//         }
//
//         // also add button for "finished changing name"
//         fill(0, 0, 25)
//         if (mouseX > 150 && mouseX < 400 &&
//             mouseY > 0 && mouseY < 25) fill(0, 0, 22)
//         noStroke()
//         rect(150, 0, 250, 25)
//
//         fill(0, 0, 100)
//         text("Finished changing name", 155, 20)
//     } else {
//         fill(0, 0, 100)
//         text("Mechanic selection", 5, 20)
//
//         stroke(0, 0, 50)
//         strokeWeight(2)
//         fill(0, 0, 20)
//         if (mouseX > xPadding && mouseX < xPadding + yellowSlipperySoapWidth &&
//             mouseY > yellowSlipperySoapYPos && mouseY < yellowSlipperySoapYPos + blockHeight)
//             fill(0, 0, 15)
//         rect(xPadding, yellowSlipperySoapYPos, yellowSlipperySoapWidth, blockHeight, 5)
//
//         fill(0, 0, 20)
//         if (mouseX > xPadding && mouseX < xPadding + blueSlipperySoapWidth &&
//             mouseY > blueSlipperySoapYPos && mouseY < blueSlipperySoapYPos + blockHeight)
//             fill(0, 0, 15)
//         rect(xPadding, blueSlipperySoapYPos, blueSlipperySoapWidth, blockHeight, 5)
//
//         fill(0, 0, 20)
//         if (mouseX > xPadding && mouseX < xPadding + greenSlipperySoapWidth &&
//             mouseY > greenSlipperySoapYPos && mouseY < greenSlipperySoapYPos + blockHeight)
//             fill(0, 0, 15)
//         rect(xPadding, greenSlipperySoapYPos, greenSlipperySoapWidth, blockHeight, 5)
//
//         fill(0, 0, 100)
//         noStroke()
//         text("Slippery Soap (Yellow)", xPadding * 2, yellowSlipperySoapYPos + blockHeight - textDescent() - 2)
//         text("Slippery Soap (Blue)", xPadding * 2, blueSlipperySoapYPos + blockHeight - textDescent() - 2)
//         text("Slippery Soap (Green)", xPadding * 2, greenSlipperySoapYPos + blockHeight - textDescent() - 2)
//
//         // then display some buttons for abbreviations
//         // first name and last name for now
//         fill(0, 0, 25)
//         if (mouseX > 0 && mouseX < textWidth("Abbreviate First Name ") &&
//             mouseY > 600 - textAscent() * 2 - textDescent() * 3 && mouseY < 600 - textAscent() - textDescent())
//             fill(0, 0, 20)
//         rect(0, 600 - textAscent() * 2 - textDescent() * 3, textWidth("Abbreviate First Name "), textAscent() + textDescent())
//         fill(0, 0, 25)
//         if (mouseX > 0 && mouseX < textWidth("Abbreviate Last Name ") &&
//             mouseY > 600 - textAscent() - textDescent() && mouseY < 600)
//             fill(0, 0, 20)
//         rect(0, 600 - textAscent() - textDescent(), textWidth("Abbreviate Last Name "), textAscent() + textDescent())
//
//         fill(0, 0, 100)
//         text("Abbreviate First Name", textWidth(" ") / 2, 600 - textAscent() - textDescent() * 2.5)
//         text("Abbreviate Last Name", textWidth(" ") / 2, 600 - textDescent() / 2)
//     }
//
//     // after we're done with all this, we add a log window
//     // to make it look good, we add multiple layers
//     fill(0, 0, 0, 10)
//     rect(0, 600, width, 440)
//
//     // normally we'd add 10 for every layer, but we want to be more precise
//     // here.
//     fill(0, 0, 0, 10 * 100 / 90)
//     rect(2, 602, width - 4, 436)
//     fill(0, 0, 0, 10 * 100 / 80)
//     rect(4, 604, width - 8, 432)
//     fill(0, 0, 0, 10 * 100 / 70)
//     rect(6, 606, width - 12, 428)
//     fill(0, 0, 0, 10 * 100 / 60)
//     rect(8, 608, width - 16, 424)
//     fill(0, 0, 0, 10 * 100 / 50)
//     rect(10, 610, width - 20, 420)
//     fill(0, 0, 0, 10 * 100 / 40)
//     rect(12, 612, width - 24, 416)
//     fill(0, 0, 0, 10 * 100 / 30)
//     rect(14, 614, width - 28, 412)
//     fill(0, 0, 0, 10 * 100 / 20)
//     rect(16, 616, width - 32, 408)
//     fill(0, 0, 0, 10 * 100 / 10)
//     rect(18, 618, width - 36, 404)
//
//     textSize(19)
//     // display each message inside
//     // since textAscent() + textDescent() is always exactly the text size, in
//     // this case 19
//     let yPos = 640 + logWindowMessages.length*20
//     for (let logWindowMessage of logWindowMessages) {
//         if (yPos <= 420) { // make sure the messages don't overflow
//
//         } else {
//             yPos -= 20
//             fill(logWindowMessage[1][0], logWindowMessage[1][1], logWindowMessage[1][2])
//             text(logWindowMessage[0], textWidth("[" + logWindowMessage[2] + "]") + 26, yPos - textDescent())
//             fill(0, 0, 90)
//             text("[" + logWindowMessage[2] + "]", 20, yPos - textDescent())
//         }
//     }
//     textSize(20)
//
//     /* debugCorner needs to be last so its z-index is highest */
//     debugCorner.setText(`frameCount: ${frameCount}`, 2)
//     debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
//     debugCorner.showBottom()
// }
//
// function keyPressed() {
//     if (state === "Changing name") {
//         // if the key is in the alphabet (keycodes 65 to 90 inclusive), then
//         // type it in at the current cursor
//         if (keyCode > 64 && keyCode < 91) {
//             if (cursor[0] === 0) {
//                 if (yourFirstName.length < 10) {
//                     let newName = ""
//                     for (let i = 0; i < yourFirstName.length; i++) {
//                         if (i === cursor[1]) {
//                             newName += key.toLowerCase()
//                         }
//                         newName += yourFirstName[i]
//                     }
//                     if (yourFirstName.length === cursor[1]) {
//                         // if you're adding a new character, then the previous
//                         // code's "i === cursor[1]" section will not operate
//                         if (cursor[1] === 0) {
//                             newName += key.toUpperCase()
//                         } else {
//                             newName += key.toLowerCase()
//                         }
//                     }
//                     yourFirstName = newName
//                     cursor[1] += 1
//                 }
//             } else {
//                 if (yourLastName.length < 10) {
//                     let newName = ""
//                     for (let i = 0; i < yourLastName.length; i++) {
//                         if (i === cursor[1]) {
//                             newName += key.toLowerCase()
//                         }
//                         newName += yourLastName[i]
//                     }
//                     if (yourLastName.length === cursor[1]) {
//                         // if you're adding a new character, then the previous
//                         // code's "i === cursor[1]" section will not operate
//                         if (cursor[1] === 0) {
//                             newName += key.toUpperCase()
//                         } else {
//                             newName += key.toLowerCase()
//                         }
//                     }
//                     yourLastName = newName
//                     cursor[1] += 1
//                 }
//             }
//         }
//
//         // if you type backspace, then the key before that will be deleted
//         if (keyCode === 8) {
//             if (cursor[0] === 0) {
//                 if (yourFirstName.length > 0 && cursor[1] > 0) {
//                     cursor[1] -= 1
//                     let newName = ""
//                     for (let i = 0; i < yourFirstName.length; i++) {
//                         if (i !== cursor[1]) {
//                             newName += yourFirstName[i]
//                         }
//                     }
//                     yourFirstName = newName
//                 }
//             } else {
//                 if (yourLastName.length > 0 && cursor[1] > 0) {
//                     cursor[1] -= 1
//                     let newName = ""
//                     for (let i = 0; i < yourLastName.length; i++) {
//                         if (i !== cursor[1]) {
//                             newName += yourLastName[i]
//                         }
//                     }
//                     yourLastName = newName
//                 }
//             }
//         }
//
//         // do the same for Delete
//         if (keyCode === 46) {
//             if (cursor[0] === 0) {
//                 if (yourFirstName.length > 0 && cursor[1] > 0) {
//                     let newName = ""
//                     for (let i = 0; i < yourFirstName.length; i++) {
//                         if (i !== cursor[1]) {
//                             newName += yourFirstName[i]
//                         }
//                     }
//                     yourFirstName = newName
//                 }
//                 else {
//                     if (yourLastName.length > 0 && cursor[1] > 0) {
//                         let newName = ""
//                         for (let i = 0; i < yourLastName.length; i++) {
//                             if (i !== cursor[1]) {
//                                 newName += yourLastName[i]
//                             }
//                         }
//                         yourLastName = newName
//                     }
//                 }
//             }
//         }
//
//         // if you type left or right (37 and 39 respectively), move the
//         // cursor one left or right respectively
//         if (keyCode === 37) {
//             if (cursor[1] > 0) {
//                 cursor[1] -= 1
//             }
//         } if (keyCode === 39) {
//             if (cursor[0] === 0) {
//                 if (cursor[1] < yourFirstName.length) {
//                     cursor[1] += 1
//                 }
//             } else {
//                 if (cursor[1] < yourLastName.length) {
//                     cursor[1] += 1
//                 }
//             }
//         }
//
//         // you should tell the server
//         socket.emit("change name", [yourFirstName, yourLastName])
//     }
// }
//
// function mousePressed() {
//     if (state === "Changing name") {
//         // the new state will be "Going Nowhere"
//         if (mouseX > 150 && mouseX < 400 &&
//             mouseY > 0 && mouseY < 25) state = "Going Nowhere"
//
//         // if the mouse is pressed, go to the nearest cursor location
//         // textWidth("First name:") + textWidth(" ")/2 + 5, 80,
//         // textWidth("10  letters"), 25
//         // x region where the textboxes are
//         if (mouseX > textWidth("First name:") + textWidth(" ")/2 + 5 &&
//             mouseX < textWidth("First name:10  letters") + textWidth(" ")/2 + 5) {
//             // first name textbox
//             if (mouseY > 80 && mouseY < 105) {
//                 cursor[0] = 0
//                 let firstLetterX = textWidth("First name: ") + 5
//                 cursor[1] = round(map(mouseX, firstLetterX, firstLetterX + textWidth("10  letters"), 0, 10))
//                 cursor[1] = max(0, min(yourFirstName.length, cursor[1]))
//             }
//             // last name textbox
//             if (mouseY > 110 && mouseY < 135) {
//                 cursor[0] = 1
//                 let firstLetterX = textWidth("First name: ") + 5
//                 cursor[1] = round(map(mouseX, firstLetterX, firstLetterX + textWidth("10  letters"), 0, 10))
//                 cursor[1] = max(0, min(yourLastName.length, cursor[1]))
//             }
//         }
//     } else if (state === "Changing job") {
//         // change classes (lined up on the left)
//         if (mouseX > 1 && mouseX < 49 &&
//             mouseY > 101 && mouseY < 149)
//             yourClass = "ast"
//         if (mouseX > 51 && mouseX < 99 &&
//             mouseY > 101 && mouseY < 149)
//             yourClass = "brd"
//         if (mouseX > 1 && mouseX < 49 &&
//             mouseY > 151 && mouseY < 199)
//             yourClass = "blm"
//         if (mouseX > 51 && mouseX < 99 &&
//             mouseY > 151 && mouseY < 199)
//             yourClass = "blu"
//         if (mouseX > 1 && mouseX < 49 &&
//             mouseY > 201 && mouseY < 249)
//             yourClass = "dnc"
//         if (mouseX > 51 && mouseX < 99 &&
//             mouseY > 201 && mouseY < 249)
//             yourClass = "drk"
//         if (mouseX > 1 && mouseX < 49 &&
//             mouseY > 251 && mouseY < 299)
//             yourClass = "drg"
//         if (mouseX > 51 && mouseX < 99 &&
//             mouseY > 251 && mouseY < 299)
//             yourClass = "gnb"
//         if (mouseX > 1 && mouseX < 49 &&
//             mouseY > 301 && mouseY < 349)
//             yourClass = "mch"
//         if (mouseX > 51 && mouseX < 99 &&
//             mouseY > 301 && mouseY < 349)
//             yourClass = "mnk"
//         if (mouseX > 1 && mouseX < 49 &&
//             mouseY > 351 && mouseY < 399)
//             yourClass = "nin"
//         if (mouseX > 51 && mouseX < 99 &&
//             mouseY > 351 && mouseY < 399)
//             yourClass = "pld"
//         if (mouseX > 1 && mouseX < 49 &&
//             mouseY > 401 && mouseY < 449)
//             yourClass = "rpr"
//         if (mouseX > 51 && mouseX < 99 &&
//             mouseY > 401 && mouseY < 449)
//             yourClass = "rdm"
//         if (mouseX > 1 && mouseX < 49 &&
//             mouseY > 451 && mouseY < 499)
//             yourClass = "sge"
//         if (mouseX > 51 && mouseX < 99 &&
//             mouseY > 451 && mouseY < 499)
//             yourClass = "sam"
//         if (mouseX > 1 && mouseX < 49 &&
//             mouseY > 501 && mouseY < 549)
//             yourClass = "sch"
//         if (mouseX > 51 && mouseX < 99 &&
//             mouseY > 501 && mouseY < 549)
//             yourClass = "smn"
//         if (mouseX > 1 && mouseX < 49 &&
//             mouseY > 551 && mouseY < 599)
//             yourClass = "war"
//         if (mouseX > 51 && mouseX < 99 &&
//             mouseY > 551 && mouseY < 599)
//             yourClass = "whm"
//         if (mouseX > 150 && mouseX < 400 &&
//             mouseY > 0 && mouseY < 25) state = "Changing name"
//
//         // tell everyone that you changed class!
//         socket.emit("change class", yourClass)
//         print(yourClass)
//     } else {
//         if (mouseX > xPadding && mouseX < xPadding + yellowSlipperySoapWidth &&
//             mouseY > yellowSlipperySoapYPos && mouseY < yellowSlipperySoapYPos + blockHeight) {
//             socket.emit("change mechanic", "Slippery Soap (Yellow)")
//         } if (mouseX > xPadding && mouseX < xPadding + blueSlipperySoapWidth &&
//             mouseY > blueSlipperySoapYPos && mouseY < blueSlipperySoapYPos + blockHeight) {
//             socket.emit("change mechanic", "Slippery Soap (Blue)")
//         } if (mouseX > xPadding && mouseX < xPadding + greenSlipperySoapWidth &&
//             mouseY > greenSlipperySoapYPos && mouseY < greenSlipperySoapYPos + blockHeight) {
//             socket.emit("change mechanic", "Slippery Soap (Green)")
//         }
//
//         if (mouseX > 0 && mouseX < textWidth("Abbreviate First Name ") &&
//             mouseY > 600 - textAscent()*2 - textDescent()*3 && mouseY < 600 - textAscent() - textDescent())
//             firstNameAbbreviated = !firstNameAbbreviated
//         if (mouseX > 0 && mouseX < textWidth("Abbreviate Last Name ") &&
//             mouseY > 600 - textAscent() - textDescent() && mouseY < 600)
//             lastNameAbbreviated = !lastNameAbbreviated
//     }
// }
//
// /** 🧹 shows debugging info using text() 🧹 */
// class CanvasDebugCorner {
//     constructor(lines) {
//         this.visible = true
//         this.size = lines
//         this.debugMsgList = [] /* initialize all elements to empty string */
//         for (let i in lines)
//             this.debugMsgList[i] = ''
//     }
//
//     setText(text, index) {
//         if (index >= this.size) {
//             this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
//         } else this.debugMsgList[index] = text
//     }
//
//     showBottom() {
//         if (this.visible) {
//             noStroke()
//             textFont(fixedWidthFont, 14)
//
//             const LEFT_MARGIN = 10
//             const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
//             const LINE_SPACING = 2
//             const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING
//
//             /* semi-transparent background */
//             fill(0, 0, 0, 10)
//             rectMode(CORNERS)
//             const TOP_PADDING = 3 /* extra padding on top of the 1st line */
//             rect(
//                 0,
//                 height,
//                 width,
//                 DEBUG_Y_OFFSET - LINE_HEIGHT * this.debugMsgList.length - TOP_PADDING
//             )
//
//             fill(0, 0, 100, 100) /* white */
//             strokeWeight(0)
//
//             for (let index in this.debugMsgList) {
//                 const msg = this.debugMsgList[index]
//                 text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
//             }
//         }
//     }
//
//     showTop() {
//         if (this.visible) {
//             noStroke()
//             textFont(fixedWidthFont, 14)
//
//             const LEFT_MARGIN = 10
//             const TOP_PADDING = 3 /* extra padding on top of the 1st line */
//
//             /* offset from top of canvas */
//             const DEBUG_Y_OFFSET = textAscent() + TOP_PADDING
//             const LINE_SPACING = 2
//             const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING
//
//             /* semi-transparent background, a console-like feel */
//             fill(0, 0, 0, 10)
//             rectMode(CORNERS)
//
//             rect( /* x, y, w, h */
//                 0,
//                 0,
//                 width,
//                 DEBUG_Y_OFFSET + LINE_HEIGHT*this.debugMsgList.length/*-TOP_PADDING*/
//             )
//
//             fill(0, 0, 100, 100) /* white */
//             strokeWeight(0)
//
//             textAlign(LEFT)
//             for (let i in this.debugMsgList) {
//                 const msg = this.debugMsgList[i]
//                 text(msg, LEFT_MARGIN, LINE_HEIGHT*i + DEBUG_Y_OFFSET)
//             }
//         }
//     }
// }