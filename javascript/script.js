
    window.onload = () => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    };

    function adjustContainerHeight() {
        const bgContainer = document.getElementById('bg-container');
        const img = new Image();
        img.src = './images/main-bg.png';
        
        img.onload = function() {
            const imageAspectRatio = img.height / img.width;
            const currentWidth = bgContainer.offsetWidth;
            const calculatedHeight = currentWidth * imageAspectRatio;
            bgContainer.style.height = `${calculatedHeight}px`;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        adjustContainerHeight();
        setAspectRatio();

        window.addEventListener('resize', () => {
            adjustContainerHeight();
            setAspectRatio();
        });

        const objects = document.querySelectorAll('.object');
        objects.forEach(obj => {
            obj.addEventListener('click', () => {
                const objNumber = obj.id.replace('obj', '');
                toggleModal(objNumber);
                setTimeout(setAspectRatio, 0);
            });
        });
    });

    function setAspectRatio() {
        let modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            let height = modal.clientHeight;
            modal.style.width = (height * (16 / 9)) + 'px';
        });
    }

    function toggleModal(objNumber) {
        const modal = document.getElementById(`modal${objNumber}`);
        modal.classList.toggle('disabled');
    }


const letterImages = {
    'Б': `./images/words-game-images/Б.png`,
    'В': './images/words-game-images/В.png',
    'Г': './images/words-game-images/Г.svg',
    'У': './images/words-game-images/У.png',
    'А': './images/words-game-images/А.svg',
    'Л': './images/words-game-images/Л.svg',
    'С': './images/words-game-images/С.svg',
    'О': './images/words-game-images/О.svg',
    'Р': './images/words-game-images/Р.svg',
    'Ф': './images/words-game-images/Ф.svg',
    'З': './images/words-game-images/З.svg',
    'Е': './images/words-game-images/Е.svg',
    'П': './images/words-game-images/П.svg',
    'Ч': './images/words-game-images/Ч.png',
    'Х': './images/words-game-images/Х.svg',
    'И': './images/words-game-images/И.png',
    'Й': './images/words-game-images/Й.png',
    'М': './images/words-game-images/М.svg',
    'К': './images/words-game-images/К.png',
    'Т': './images/words-game-images/Т.png',
    'Н': './images/words-game-images/Н.png',
    'Ы': './images/words-game-images/Ы.svg',
    'Д': './images/words-game-images/Д.png'
};

const letters = [
    'Б', 'С', 'Г', 'У', 'А', 'Л', 'С', 'О', 'Р', 'Н',
    'Л', 'Н', 'У', 'П', 'Ч', 'Е', 'Л', 'А', 'М', 'Е',
    'Е', 'Е', 'Р', 'С', 'У', 'Л', 'Е', 'Й', 'Е', 'К',
    'Д', 'Г', 'В', 'О', 'С', 'К', 'И', 'К', 'Д', 'Т',
    'А', 'Р', 'К', 'Т', 'И', 'К', 'А', 'Л', 'М', 'А',
    'И', 'В', 'Г', 'Ы', 'С', 'О', 'Т', 'Ы', 'П', 'Р'
];

const correctWords = [
    'ПЧЕЛА', 
    'МЕД', 
    'УЛЕЙ', 
    'ВОСК', 
    'АРКТИКА', 
    'СНЕГ', 
    'ЛЕД',
    'СОТЫ',
    'НЕКТАР'
];

let selectedLetters = [];
let foundWords = [];
let isSelecting = false;
let startCell = null;

// Функция для нормализации размеров букв
function normalizeSvgLetterSizes() {
    // Получаем все изображения букв
    const letterImages = document.querySelectorAll('.letter img');
    
    letterImages.forEach(img => {
        // Сохраняем исходный src
        const originalSrc = img.src;
        
        // Обработка после загрузки изображения
        img.onload = function() {
            // Сохраняем ссылку на текущее изображение
            const currentImg = this;
            const letterContainer = currentImg.parentElement;
            
            // Получаем размеры контейнера
            const containerWidth = letterContainer.offsetWidth;
            const containerHeight = letterContainer.offsetHeight;
            
            // Устанавливаем стиль для контейнера, если еще не установлен
            if (!letterContainer.style.position) {
                letterContainer.style.position = 'relative';
                letterContainer.style.display = 'flex';
                letterContainer.style.justifyContent = 'center';
                letterContainer.style.alignItems = 'center';
            }
            
            // Устанавливаем стандартный размер и положение для изображения
            currentImg.style.maxWidth = '80%';
            currentImg.style.maxHeight = '80%';
            currentImg.style.position = 'absolute';
            currentImg.style.top = '50%';
            currentImg.style.left = '50%';
            currentImg.style.transform = 'translate(-50%, -50%)';
            
            // Для конкретных проблемных букв можно применить дополнительное масштабирование
            const letter = currentImg.alt;
            if (letter === 'К' || letter === 'В') {
                currentImg.style.maxWidth = '70%'; // Уменьшаем размер проблемных букв
                currentImg.style.maxHeight = '70%';
            }
        };
        
        // Перезагружаем изображение, чтобы сработал onload
        // Это необходимо, если изображения уже были загружены кэшем
        if (img.complete) {
            const tempSrc = img.src;
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            setTimeout(() => {
                img.src = tempSrc;
            }, 10);
        }
    });
}

// Запускаем функцию после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    normalizeSvgLetterSizes();
    
    // Также запускаем функцию после создания игровой доски
    const originalCreateGameBoard = window.createGameBoard;
    if (originalCreateGameBoard) {
        window.createGameBoard = function() {
            originalCreateGameBoard.apply(this, arguments);
            setTimeout(normalizeSvgLetterSizes, 100);
        };
    }
});

function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 10; j++) {
            const letterIndex = i * 10 + j;
            if (letterIndex < letters.length) {
                const letterElement = document.createElement('div');
                letterElement.className = 'letter';
                
                const img = document.createElement('img');
                img.src = letterImages[letters[letterIndex]];
                img.alt = letters[letterIndex];
                img.draggable = false;
                letterElement.appendChild(img);
                
                letterElement.dataset.row = i;
                letterElement.dataset.col = j;
                
                letterElement.addEventListener('mousedown', startSelection);
                letterElement.addEventListener('mouseover', continueSelection);
                letterElement.addEventListener('mouseup', endSelection);
                
                letterElement.addEventListener('dragstart', (e) => e.preventDefault());
                letterElement.addEventListener('drop', (e) => e.preventDefault());
                letterElement.addEventListener('dragover', (e) => e.preventDefault());
                
                gameBoard.appendChild(letterElement);
            }
        }
    }
    
    document.addEventListener('mouseup', endSelection);
}

function startSelection(event) {
    event.preventDefault();
    isSelecting = true;
    selectedLetters = [];
    clearSelection();
    
    const letterElement = event.target.closest('.letter');
    if (letterElement && !letterElement.classList.contains('found')) {
        startCell = letterElement;
        selectLetter(letterElement);
    }
}

function continueSelection(event) {
    event.preventDefault();
    if (!isSelecting) return;
    
    const letterElement = event.target.closest('.letter');
    if (letterElement && !letterElement.classList.contains('found')) {
        const row = parseInt(letterElement.dataset.row);
        const col = parseInt(letterElement.dataset.col);
        const startRow = parseInt(startCell.dataset.row);
        const startCol = parseInt(startCell.dataset.col);
        
        if (row === startRow || col === startCol) {
            clearSelection();
            selectedLetters = [];
            
            const minRow = Math.min(row, startRow);
            const maxRow = Math.max(row, startRow);
            const minCol = Math.min(col, startCol);
            const maxCol = Math.max(col, startCol);
            
            for (let i = minRow; i <= maxRow; i++) {
                for (let j = minCol; j <= maxCol; j++) {
                    const cell = document.querySelector(`.letter[data-row="${i}"][data-col="${j}"]`);
                    if (cell && !cell.classList.contains('found')) {
                        selectLetter(cell);
                    }
                }
            }
        }
    }
}

function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;
    
    const selectedWord = selectedLetters.map(letter => letter.querySelector('img').alt).join('');
    
    if (correctWords.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        foundWords.push(selectedWord);
        
        selectedLetters.forEach(letter => {
            letter.classList.remove('selected');
            letter.classList.add('found');
        });
        
        
    } else {
        clearSelection();
    }
    
    selectedLetters = [];
    startCell = null;
}

function selectLetter(letterElement) {
    letterElement.classList.add('selected');
    selectedLetters.push(letterElement);
}

function clearSelection() {
    const selectedElements = document.querySelectorAll('.letter.selected');
    selectedElements.forEach(element => {
        if (!element.classList.contains('found')) {
            element.classList.remove('selected');
        }
    });
}

function updateFoundWordsList() {
    const foundWordsList = document.getElementById('found-words-list');
    const foundCountElement = document.getElementById('found-count');
    
    foundWordsList.innerHTML = '';
    
    foundWords.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        foundWordsList.appendChild(listItem);
    });
    
    foundCountElement.textContent = foundWords.length;
    
    if (foundWords.length === correctWords.length) {
        setTimeout(() => {
            alert('Поздравляем! Вы нашли все слова!');
        }, 500);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    createGameBoard();
});



document.addEventListener('DOMContentLoaded', function() {
    const flowersPanel = document.getElementById('flowersPanel');
    const stemArea = document.getElementById('stemArea');
    
    const flowers = [
        {
            id: 'flower1',
            svg: `<img src="./images/flowers-game-images/1.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower2',
            svg: `<img src="./images/flowers-game-images/2.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower3',
            svg: `<img src="./images/flowers-game-images/3.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower4',
            svg: `<img src="./images/flowers-game-images/4.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower5',
            svg: `<img src="./images/flowers-game-images/5.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower6',
            svg: `<img src="./images/flowers-game-images/6.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower7',
            svg: `<img src="./images/flowers-game-images/7.svg" draggable="true" class="flower">`
        }
    ];
    
    flowers.forEach(flower => {
        const flowerElement = document.createElement('div');
        flowerElement.className = 'flower';
        flowerElement.id = flower.id;
        flowerElement.innerHTML = flower.svg;
        flowersPanel.appendChild(flowerElement);
        
        const imgElement = flowerElement.querySelector('img');
        if (imgElement) {
            imgElement.addEventListener('dragstart', handleDragStart);
            imgElement.addEventListener('dragend', handleDragEnd);
        }
    });
    
    const stemPositions = [
        { left: '16%', bottom: '46%' },
        { left: '24%', bottom: '45%' },
        { left: '27%', bottom: '60%' },
        { left: '41%', bottom: '68%' },
        { left: '51%', bottom: '60%' },
        { left: '70%', bottom: '55%' },
        { left: '73%', bottom: '40%' }
    ];
    
    stemPositions.forEach((position, index) => {
        const stemSpot = document.createElement('div');
        stemSpot.className = 'stem-spot';
        stemSpot.id = 'stem-' + index;
        stemSpot.setAttribute('data-occupied', 'false');
        stemSpot.style.left = position.left;
        stemSpot.style.bottom = position.bottom;
        stemArea.appendChild(stemSpot);
        
        stemSpot.addEventListener('dragover', handleDragOver);
        stemSpot.addEventListener('drop', handleDrop);
        stemSpot.addEventListener('dragenter', handleDragEnter);
        stemSpot.addEventListener('dragleave', handleDragLeave);
    });
    
    let draggedElement = null;
    let sourceElement = null;
    
    function handleDragStart(e) {
        draggedElement = e.target;
        sourceElement = e.target.parentElement;
        
        if (sourceElement.classList.contains('stem-spot')) {
            e.dataTransfer.setData('source-stem', sourceElement.id);
        }
        
        if (draggedElement.tagName === 'IMG') {
            e.dataTransfer.setData('text/plain', draggedElement.parentElement.id);
        } else if (draggedElement.classList.contains('placed-flower')) {
            e.dataTransfer.setData('text/plain', draggedElement.getAttribute('data-flower-id'));
        } else {
            e.dataTransfer.setData('text/plain', draggedElement.id);
        }
        
        e.dataTransfer.effectAllowed = 'move';
        
        setTimeout(() => {
            draggedElement.style.opacity = '0.5';
        }, 0);
    }
    
    function handleDragEnd(e) {
        if (draggedElement) {
            draggedElement.style.opacity = '1';
        }
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
        const target = e.target.closest('.stem-spot') || e.target;
        if (target.classList.contains('stem-spot')) {
            target.classList.add('highlight');
        }
    }
    
    function handleDragLeave(e) {
        const target = e.target.closest('.stem-spot') || e.target;
        if (target.classList.contains('stem-spot')) {
            target.classList.remove('highlight');
        }
    }
    
    function handleDrop(e) {
        e.preventDefault();
        
        const targetStem = e.target.closest('.stem-spot');
        
        if (!targetStem || !targetStem.classList.contains('stem-spot')) {
            return false;
        }
        
        targetStem.classList.remove('highlight');
        
        const flowerId = e.dataTransfer.getData('text/plain');
        const sourceStemId = e.dataTransfer.getData('source-stem');
        
        if (sourceStemId && sourceStemId !== targetStem.id) {
            const sourceStem = document.getElementById(sourceStemId);
            if (sourceStem) {
                sourceStem.innerHTML = '';
                sourceStem.setAttribute('data-occupied', 'false');
                sourceStem.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                sourceStem.style.border = '2px dashed #4CAF50';
            }
        }
        
        if (targetStem.getAttribute('data-occupied') === 'true') {
            targetStem.innerHTML = '';
        }
        
        const flowerData = flowers.find(f => f.id === flowerId);
        
        if (!flowerData) return false;
        
        const placedFlower = document.createElement('div');
        placedFlower.className = 'placed-flower';
        placedFlower.innerHTML = flowerData.svg;
        placedFlower.setAttribute('data-flower-id', flowerId);
        
        const imgElement = placedFlower.querySelector('img');
        if (imgElement) {
            imgElement.addEventListener('dragstart', handleDragStart);
            imgElement.addEventListener('dragend', handleDragEnd);
        }
        
        targetStem.innerHTML = '';
        targetStem.appendChild(placedFlower);
        targetStem.setAttribute('data-occupied', 'true');
        targetStem.style.backgroundColor = 'transparent';
        targetStem.style.border = 'none';
        
        if (draggedElement) {
            draggedElement.style.opacity = '1';
        }
        
        return false;
    }
});



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

document.addEventListener('DOMContentLoaded', startGame)

function checkOrientation() {
  if (window.innerWidth < 768) {
    if (window.innerWidth < window.innerHeight) {
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

  bee.innerHTML = `<img src="./images/hive-game-images/bee1.svg">`

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
  bee.style.pointerEvents = "auto"

  gameArea.appendChild(bee)
}

function catchBee(id) {
  const beeIndex = bees.findIndex((bee) => bee.id === id)

  if (beeIndex !== -1) {
    const bee = bees[beeIndex]
    
    bee.element.style.pointerEvents = "none"
    bee.element.classList.add("disappearing")

    bees.splice(beeIndex, 1)
    
    score++
    scoreElement.textContent = score
    remainingBees--
    
    setTimeout(() => {
      if (bee.element.parentNode) {
        bee.element.parentNode.removeChild(bee.element)
      }
      
      if (remainingBees === 0) {
        endGame()
      }
    }, 500)
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
      bee.speedX = Math.abs(bee.speedX)
    } else if (bee.x > 90) {
      bee.x = 90
      bee.speedX = -Math.abs(bee.speedX)
    }

    if (bee.y < 0) {
      bee.y = 0
      bee.speedY = Math.abs(bee.speedY)
    } else if (bee.y > 80) {
      bee.y = 80
      bee.speedY = -Math.abs(bee.speedY)
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
    
    bee.element.style.pointerEvents = "auto"
  })

  requestAnimationFrame(updateGame)
}

const rotationMessage = document.getElementById('rotationMessage');

function checkOrientation() {
    if (window.innerWidth < 768) {
        if (window.innerWidth < window.innerHeight) {
            rotationMessage.style.display = "flex";
            document.getElementById('bg-container').style.display = "none";
        } else {
            rotationMessage.style.display = "none";
            document.getElementById('bg-container').style.display = "block";
        }
    } else {
        rotationMessage.style.display = "none";
        document.getElementById('bg-container').style.display = "block";
    }
    
    adjustContainerHeight();
}

window.addEventListener('load', function() {
    checkOrientation();
    setTimeout(checkOrientation, 100);
});

window.addEventListener('resize', function() {
    checkOrientation();
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(checkOrientation, 200);
});

window.addEventListener('orientationchange', function() {
    setTimeout(checkOrientation, 300);
});