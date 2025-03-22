// Game variables
let score = 0
let gameStarted = false
const bees = []
let beeId = 0
let gameArea
let gameAreaRect
const MAX_BEES = 15
let remainingBees = MAX_BEES

const gameScreen = document.getElementById("game-screen")
const scoreElement = document.getElementById("score")
const gameAreaElement = document.getElementById("game-area")

// Start game automatically when page loads
document.addEventListener('DOMContentLoaded', startGame)

// Function to check device orientation
function checkOrientation() {
  // Only show rotation message on mobile devices
  if (window.innerWidth < 768) {
    if (window.innerWidth < window.innerHeight) {
      // Portrait mode
      rotationMessage.style.display = "flex"
      if (gameStarted) {
        gameScreen.style.display = "none"
      }
    } else {
      rotationMessage.style.display = "none"
      if (gameStarted) {
        gameScreen.style.display = "block"
      }
    }
  } else {
    rotationMessage.style.display = "none"
  }
}

function startGame() {
  gameStarted = true
  gameScreen.style.display = "block"

  gameArea = document.getElementById("game-area")
  gameAreaRect = gameArea.getBoundingClientRect()

  for (let i = 0; i < MAX_BEES; i++) {
    spawnBee()
  }
  requestAnimationFrame(updateGame)
}

function spawnBee() {
  const bee = document.createElement("div")
  const id = beeId++

  bee.className = "bee"
  bee.id = `bee-${id}`
  bee.style.left = `${Math.random() * 90}%`
  bee.style.top = `${Math.random() * 80}%`

  let xPos = Number.parseFloat(bee.style.left)
  let yPos = Number.parseFloat(bee.style.top)

  if (isNaN(xPos)) xPos = Math.random() * 90
  if (isNaN(yPos)) yPos = Math.random() * 80

  bee.innerHTML = `<img src="../hive-game/images/bee1.svg">
`

  const minSpeed = 0.3 
  const maxSpeed = 0.6 
  const speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
  const directionX = Math.random() > 0.5 ? 1 : -1
  const directionY = Math.random() > 0.5 ? 1 : -1

  bees.push({
    element: bee,
    id: id,
    x: xPos,
    y: yPos,
    speedX: speed * directionX,
    speedY: speed * directionY,
  })

  bee.addEventListener("click", () => catchBee(id))

  gameArea.appendChild(bee)
}

function catchBee(id) {
  const beeIndex = bees.findIndex((bee) => bee.id === id)

  if (beeIndex !== -1) {
    const bee = bees[beeIndex]

    bee.element.classList.add("disappearing")

    setTimeout(() => {
      if (bee.element.parentNode) {
        bee.element.parentNode.removeChild(bee.element)
      }
      bees.splice(beeIndex, 1)

      remainingBees--

      if (remainingBees === 0) {
        endGame()
      }
    }, 500)

    score++
    scoreElement.textContent = score
  }
}

function endGame() {
  const endScreen = document.createElement("div")
  endScreen.className = "end-screen"
  endScreen.innerHTML = `
    <div class="end-message">
      <h1>Игра окончена!</h1>
      <p>Вы поймали всех пчел!</p>
      <p>Ваш счет: ${score}</p>
      <button id="restart-button">Играть снова</button>
    </div>
  `

  document.querySelector(".game-container").appendChild(endScreen)

  document.getElementById("restart-button").addEventListener("click", () => {
    location.reload() 
  })
}

function updateGame() {
  gameAreaRect = gameArea.getBoundingClientRect()

  bees.forEach((bee) => {
    bee.x += bee.speedX
    bee.y += bee.speedY

    if (bee.x < 0) {
      bee.x = 0
      bee.speedX *= -1
    } else if (bee.x > 90) {
      bee.x = 90
      bee.speedX *= -1
    }

    if (bee.y < 0) {
      bee.y = 0
      bee.speedY *= -1
    } else if (bee.y > 80) {
      bee.y = 80
      bee.speedY *= -1
    }

    const minSpeed = 0.3
    if (Math.abs(bee.speedX) < minSpeed) {
      bee.speedX = minSpeed * (bee.speedX < 0 ? -1 : 1)
    }
    if (Math.abs(bee.speedY) < minSpeed) {
      bee.speedY = minSpeed * (bee.speedY < 0 ? -1 : 1)
    }

    bee.element.style.left = `${bee.x}%`
    bee.element.style.top = `${bee.y}%`
    if (bee.speedX > 0) {
      bee.element.style.transform = "scaleX(-1)"
    } else {
      bee.element.style.transform = "scaleX(1)"
    }
  })

  requestAnimationFrame(updateGame)
}

