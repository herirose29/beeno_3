// Определяем буквы и их изображения для игрового поля
const letterImages = {
'Б': `../words-game/images/Б.svg`,
    'В': '../words-game/images/В.png',
    'Г': '../words-game/images/Г.svg',
    'У': '../words-game/images/У.svg',
    'А': '../words-game/images/А.svg',
    'Л': '../words-game/images/Л.svg',
    'С': '../words-game/images/С.svg',
    'О': '../words-game/images/О.svg',
    'Р': '../words-game/images/Р.svg',
    'Ф': '../words-game/images/Ф.svg',
    'З': '../words-game/images/З.svg',
    'Е': '../words-game/images/Е.svg',
    'П': '../words-game/images/П.svg',
    'Ч': '../words-game/images/Ч.svg',
    'Х': '../words-game/images/Х.svg',
    'И': '../words-game/images/И.svg',
    'Й': '../words-game/images/Й.svg',
    'М': '../words-game/images/М.svg',
    'К': '../words-game/images/К.png',
    'Т': '../words-game/images/Т.svg',
    'Н': '../words-game/images/Н.svg',
    'Ы': '../words-game/images/Ы.svg',
    'Д': '../words-game/images/Д.svg'
};

// Определяем буквы для игрового поля
const letters = [
    'Б', 'С', 'Г', 'У', 'А', 'Л', 'С', 'О', 'Р', 'Н',
    'Л', 'Н', 'У', 'П', 'Ч', 'Е', 'Л', 'А', 'М', 'Е',
    'Е', 'Е', 'Р', 'С', 'У', 'Л', 'Е', 'Й', 'Е', 'К',
    'Д', 'Г', 'В', 'О', 'С', 'К', 'И', 'К', 'Д', 'Т',
    'А', 'Р', 'К', 'Т', 'И', 'К', 'А', 'Л', 'М', 'А',
    'И', 'В', 'Г', 'Ы', 'С', 'О', 'Т', 'Ы', 'П', 'Р'
];

// Определяем правильные слова
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

// Переменные для отслеживания состояния игры
let selectedLetters = [];
let foundWords = [];
let isSelecting = false;
let startCell = null;

// Создаем игровое поле
function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    
    // Очищаем игровое поле
    gameBoard.innerHTML = '';
    
    // Добавляем буквы на игровое поле
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 10; j++) {
            const letterIndex = i * 10 + j;
            if (letterIndex < letters.length) {
                const letterElement = document.createElement('div');
                letterElement.className = 'letter';
                
                // Создаем изображение для буквы
                const img = document.createElement('img');
                img.src = letterImages[letters[letterIndex]];
                img.alt = letters[letterIndex];
                img.draggable = false;
                letterElement.appendChild(img);
                
                letterElement.dataset.row = i;
                letterElement.dataset.col = j;
                
                // Добавляем обработчики событий
                letterElement.addEventListener('mousedown', startSelection);
                letterElement.addEventListener('mouseover', continueSelection);
                letterElement.addEventListener('mouseup', endSelection);
                
                // Предотвращаем стандартное поведение перетаскивания
                letterElement.addEventListener('dragstart', (e) => e.preventDefault());
                letterElement.addEventListener('drop', (e) => e.preventDefault());
                letterElement.addEventListener('dragover', (e) => e.preventDefault());
                
                gameBoard.appendChild(letterElement);
            }
        }
    }
    
    // Обработчик для отмены выделения при клике вне игрового поля
    document.addEventListener('mouseup', endSelection);
}

// Начало выделения
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

// Продолжение выделения
function continueSelection(event) {
    event.preventDefault();
    if (!isSelecting) return;
    
    const letterElement = event.target.closest('.letter');
    if (letterElement && !letterElement.classList.contains('found')) {
        const row = parseInt(letterElement.dataset.row);
        const col = parseInt(letterElement.dataset.col);
        const startRow = parseInt(startCell.dataset.row);
        const startCol = parseInt(startCell.dataset.col);
        
        // Проверяем, что выделение идет по прямой линии (горизонтально или вертикально)
        if (row === startRow || col === startCol) {
            clearSelection();
            selectedLetters = [];
            
            // Выделяем все буквы между начальной и текущей
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

// Завершение выделения
function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;
    
    // Формируем слово из выбранных букв
    const selectedWord = selectedLetters.map(letter => letter.querySelector('img').alt).join('');
    
    if (correctWords.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        // Слово найдено
        foundWords.push(selectedWord);
        
        // Отмечаем буквы как найденные
        selectedLetters.forEach(letter => {
            letter.classList.remove('selected');
            letter.classList.add('found');
        });
        
        // Можно добавить оповещение о найденном слове, если нужно
        // alert(`Найдено слово: ${selectedWord}`);
    } else {
        // Слово не найдено или уже было найдено ранее
        clearSelection();
    }
    
    selectedLetters = [];
    startCell = null;
}

// Выбор буквы
function selectLetter(letterElement) {
    letterElement.classList.add('selected');
    selectedLetters.push(letterElement);
}

// Очистка выделения
function clearSelection() {
    const selectedElements = document.querySelectorAll('.letter.selected');
    selectedElements.forEach(element => {
        if (!element.classList.contains('found')) {
            element.classList.remove('selected');
        }
    });
}

// Обновление списка найденных слов
function updateFoundWordsList() {
    const foundWordsList = document.getElementById('found-words-list');
    const foundCountElement = document.getElementById('found-count');
    
    // Очищаем список
    foundWordsList.innerHTML = '';
    
    // Добавляем найденные слова
    foundWords.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        foundWordsList.appendChild(listItem);
    });
    
    // Обновляем счетчик
    foundCountElement.textContent = foundWords.length;
    
    // Проверяем, если все слова найдены
    if (foundWords.length === correctWords.length) {
        setTimeout(() => {
            alert('Поздравляем! Вы нашли все слова!');
        }, 500);
    }
}

// Инициализация игры
window.addEventListener('DOMContentLoaded', () => {
    createGameBoard();
});