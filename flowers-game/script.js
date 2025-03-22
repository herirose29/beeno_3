document.addEventListener('DOMContentLoaded', function() {
    const flowersPanel = document.getElementById('flowersPanel');
    const stemArea = document.getElementById('stemArea');
    const resetButton = document.getElementById('resetButton');
    
    const flowers = [
        {
            id: 'flower1',
            svg: `<img src="../flowers-game/images/1.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower2',
            svg: `<img src="../flowers-game/images/2.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower3',
            svg: `<img src="../flowers-game/images/3.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower4',
            svg: `<img src="../flowers-game/images/4.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower5',
            svg: `<img src="../flowers-game/images/5.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower6',
            svg: `<img src="../flowers-game/images/6.svg" draggable="true" class="flower">`
        },
        {
            id: 'flower7',
            svg: `<img src="../flowers-game/images/7.svg" draggable="true" class="flower">`
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
        { left: '16%', bottom: '42%' },
        { left: '24%', bottom: '41%' },
        { left: '27%', bottom: '56%' },
        { left: '41%', bottom: '63%' },
        { left: '51%', bottom: '55%' },
        { left: '70%', bottom: '51%' },
        { left: '73%', bottom: '35%' }
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