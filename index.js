

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')  
const scoreElement = document.querySelector('#score')

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    constructor({position}){
        this.position = position 
        this.width = 20
        this.height = 20
    }

    draw(){
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height) 
    }
}

class Player {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 9.9
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }
    
    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.draw()
    }
}

class Pellet {
    constructor({position,}){
        this.position = position
        this.radius = 2
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
    
}

const keys = {
    w:{
        pressed: false  
    },
    s:{
        pressed: false
    },
    a:{
        pressed: false  
    },
    d:{
        pressed: false
    }
}

let lastKey = ''
let score = 0

const map =
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

const pellets = []
const boundaries = []
const player = new Player({
    position: {
        x: 30,
        y: 30
    },
    velocity: {
        x: 0,
        y: 0
    }
})

map.forEach((row,i) =>{
    row.forEach((symbol,j) => {
        switch(symbol){
            case 0:
                pellets.push(new Pellet({
                    position: {
                        x:j * 20 + 10,
                        y:i * 20 + 10
                    }
                }))
                break
            case 1:
                boundaries.push(new Boundary({
                    position: {
                        x:j * 20,
                        y:i * 20
                    }
                }))
                break
        }
    })
})

function checkCollision({circle, rectangle}){
    return(circle.position.x-circle.radius + circle.velocity.x <= rectangle.position.x+rectangle.width && 
        circle.position.x+circle.radius + circle.velocity.x >= rectangle.position.x && 
        circle.position.y-circle.radius + circle.velocity.y <= rectangle.position.y+rectangle.height && 
        circle.position.y+circle.radius + circle.velocity.y >= rectangle.position.y)
    }

function animate(){

    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    for(let i =pellets.length-1; 0<i; i--){
        const pellet = pellets[i]
        pellet.draw()
        if(Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y)<pellet.radius + player.radius){
            pellets.splice(i,1)
            score+=1
            scoreElement.innerHTML = score
        }
    }

    boundaries.forEach(boundary => {
        boundary.draw()
        if(checkCollision({circle:player, rectangle:boundary})){
                player.velocity.y = 0
                player.velocity.x = 0
            }
    })
    
    player.update()

    if(keys.w.pressed && lastKey === 'w'){
        for (let i=0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if(checkCollision({circle:{...player,velocity:{x:0,y:-1}}, rectangle:boundary})){
                player.velocity.y = 0
                break
            }
            else{
                player.velocity.y = -1
            }

        }
    }
    else if(keys.s.pressed && lastKey === 's'){
        for (let i=0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if(checkCollision({circle:{...player,velocity:{x:0,y:1}}, rectangle:boundary})){
                player.velocity.y = 0
                break
            }   
            else{
                player.velocity.y = 1
            }
        }
    }   
    else if(keys.a.pressed && lastKey === 'a'){
        for (let i=0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if(checkCollision({circle:{...player,velocity:{x:-1,y:0}}, rectangle:boundary})){
                player.velocity.x = 0
                break
            }
            else{
                player.velocity.x = -1
            }
        }
    }   
    else if(keys.d.pressed && lastKey === 'd'){
        for (let i=0; i< boundaries.length; i++) {  
            const boundary = boundaries[i]
            if(checkCollision({circle:{...player,velocity:{x:1,y:0}}, rectangle:boundary})){
                player.velocity.x = 0
                break
            }
            else{
                player.velocity.x = 1
            }
        }   
    }
    
}

animate()


window.addEventListener('keydown', ({key}) => {
    switch(key){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})
window.addEventListener('keyup', ({key}) => {
    switch(key){
        case 'w':
            keys.w.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})
