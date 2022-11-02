const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

// SET DIMENSIONS OF CANVAS 
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// GRAVITY, SO PLAYER MODEL WILL FALL IF AIRBORN
const gravity = 0.5

class Player {
    // CREATES PLAYER MODEL
    constructor() {
        // STARTING POSITION OF PLAYER MODEL (DROPS THEM MIDAIR)
        this.position = {
            x: 100, 
            y: 100
        }
        // DEFAULT DIRECTIONAL MOVEMENT OF PLAYER MODEL
        this.velocity = {
            x: 0,
            y: 0
        }
        // DEFAULT DIMENSIONS OF PLAYER MODEL
        this.width = 30
        this.height = 30

    }

    draw() {
        // SETS COLOR OF PLAYER MODEL
        c.fillStyle = 'red'
        // SETS DIMENSIONS AND POSITION OF PLAYER MODEL
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    // UPDATES MODEL BASED ON GAME INFORMATION
    update() {
        this.draw()
        // DETERMINES X AXIS MOVEMENT
        this.position.x += this.velocity.x
        // DETERMINES Y AXIS MOVEMENT
        this.position.y += this.velocity.y

        // SETS A FLOOR TO THE SCREEN (WHEN PLAYER MODEL TOUCHES BOTTOM OF WINDOW, MOVEMENT IS ZERO)
        if (this.position.y +this.height +this.velocity.y <= canvas.height)
        this.velocity.y += gravity
        else this.velocity.y = 0
    }
}

class Platform {
    // INFORMATION FOR PLATFORM
    constructor({ x, y }) {
        // SET POSITION OF PLATFORM
        this.position = {
            x, 
            y
        }

        // SET DIMENSIONS OF PLATFORM
        this.width = 200   
        this.height = 20
    }

    // RENDER PLATFORM
    draw() {
        // SET COLOR OF PLATFORM
        c.fillStyle = 'blue'
        // SETS DIMENSIONS AND POSITION OF PLLATFORM
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

// DECLARE PLAYER
const player = new Player()

// DECLARE PLATFORM
const platforms = [
    new Platform( { x: 200, y: 100 } ), 
    new Platform( { x: 500, y: 200 } )
]

let scrollOffset = 0

const keys = {

    right: {
        pressed: false
    },
    left: {
        pressed: false
    }

}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    platforms.forEach(platform => {
        platform.draw()
    })

    // ANIMATES MOVEMENT WHEN PRESSING LEFT AND RIGHT
    if (keys.right.pressed
        // BEGINS TO SCROLL BACKGROUND WHEN PASSING CERTAIN POSITION ON SCREEN
        && player.position.x < 400) {
        // WHEN RIGHT KEY IS PRESSED, MOVE RIGHT
        player.velocity.x = 5
    } else if (keys.left.pressed
        // SCROLLS BG WHEN PASSING LEFT THRESHOLD ON SCREEN
        && player.position.x >100) {
        // WHEN LEFT KEY IS PRESSED, MOVE LEFT
        player.velocity.x = -5
    } else {
        // MAKES PLAYER STOP MOVING WHEN NEIGHT LEFT NOR RIGHT KEY IS PRESSED
        player.velocity.x = 0

        // REPOSITIONS PLATFORMS WHEN BG SCROLLS
        if (keys.right.pressed) {
            scrollOffset +=5
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
        } else if (keys.left.pressed) {
            scrollOffset -=5
            platforms.forEach(platform => {
                platform.position.x += 5
            })
        }
    }

    console.log(scrollOffset)

    // PLATFORM COLLISION DETECTION
    platforms.forEach(platform => {
        if(player.position.y + player.height <= platform.position.y 
            && 
            player.position.y + player.height + player.velocity.y >= platform.position.y 
            && 
            player.position.x + player.width >= platform.position.x 
            && 
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    if (scrollOffset > 2000) {
        console.log('YOU WIN!')
    }
}

animate()

addEventListener('keydown', ({keyCode}) => {
    // LISTENS FOR BUTTON INPUT
    switch (keyCode) {
        case 65: 
            // LISTENS FOR 'A' KEY
            console.log('left keydown')
            keys.left.pressed = true
            break;
        case 83: 
            // LISTENS FOR 'S' KEY
            console.log('down keydown')
            break;
        case 68: 
            // LISTENS FOR 'D' KEY
            console.log('right keydown')
            keys.right.pressed = true
            break;
        case 87: 
            // LISTENS FOR 'W' KEY
            console.log('up keydown')
            player.velocity.y -= 20
            break;
    }
    console.log(keys.right.pressed)
})
addEventListener('keyup', ({keyCode}) => {
    // LISTENS FOR WHEN YOU RELEASE BUTTONS
    switch (keyCode) {
        case 65: 
            console.log('left keyup')
            keys.left.pressed = false
            break;
        case 83: 
            console.log('down keyup')
            break;
        case 68: 
            console.log('right keyup')
            keys.right.pressed = false
            break;
        case 87: 
            console.log('up keyup')
            break;
    }
    console.log(keys.right.pressed)

})
