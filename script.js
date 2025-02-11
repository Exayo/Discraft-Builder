const blocks = [
    'Grass', 'Dirt', 'Steve1', 'Steve2', 'Obsidian', 
    'Portal', 'Leaves', 'Log', 'RedFlower', 
    'YellowFlower', 'Chest', 'Air'
];

let currentTool = 'Air';
let isMouseDown = false;
let gridData = [];

function createGrid() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    gridData = [];
    
    // Inicjowanie
    for(let i = 0; i < rows; i++) {
        gridData.push(Array(cols).fill('Air'));
    }
    
    // Elementy siatki
    for(let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        
        for(let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.type = 'Air';
            cell.style.backgroundColor = getColor('Air');
            
            cell.addEventListener('mousedown', () => {
                isMouseDown = true;
                paintCell(i, j, cell);
            });
            
            cell.addEventListener('mouseover', () => {
                if(isMouseDown) paintCell(i, j, cell);
            });
            
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
    
    updateOutput();
}

function paintCell(row, col, cell) {
    if(currentTool === 'Eraser') {
        gridData[row][col] = 'Air';
    } else {
        gridData[row][col] = currentTool;
    }
    
    cell.dataset.type = gridData[row][col];
    cell.style.backgroundColor = getColor(gridData[row][col]);
    updateOutput();
}

function getColor(type) {
    const colors = {
        'Grass': '#00ff00',
        'Dirt': '#804000',
        'Steve1': '#87CEEB',
        'Steve2': '#4682B4',
        'Obsidian': '#191970',
        'Portal': '#800080',
        'Leaves': '#008000',
        'Log': '#8B4513',
        'RedFlower': '#ff0000',
        'YellowFlower': '#ffff00',
        'Chest': '#D2691E',
        'Air': '#ffffff'
    };
    return colors[type];
}

function updateOutput() {
    const blockCodes = {
        'Obsidian': 'm1',
        'Portal': 'm2',
        'Grass': 'm3',
        'Steve1': 'm4',
        'Steve2': 'm5',
        'Dirt': 'm6',
        'Air': 'm7',
        'Leaves': 'm8',
        'Log': 'm9',
        'Chest': 'm10',
        'RedFlower': 'm11',
        'YellowFlower': 'm12'
    };

    let total = 0;
    const outputLines = gridData.map(row => {
        let line = '';
        for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            let code;
            let shouldAdd = false;

            if (cell !== 'Air') {
                code = blockCodes[cell];
                line += `:${code}:`;
                shouldAdd = true;
            } else {
                const hasNonAirRight = row.slice(j + 1).some(c => c !== 'Air');
                if (hasNonAirRight) {
                    code = blockCodes[cell];
                    line += `:${code}:`;
                    shouldAdd = true;
                }
            }

            if (shouldAdd) {
                const numberPart = parseInt(code.substring(1), 10);
                total += numberPart >= 10 ? 26 : 25;
            }
        }
        return line;
    });

    const output = outputLines.join('\n');
    const charCountElement = document.getElementById('charCount');
    
    // Aktualizacja wyświetlacza
    charCountElement.innerHTML = `
        <span class="${total > 2000 ? 'limit-warning' : ''}">${total}</span>
        / 2000
    `;
    
    document.getElementById('output').textContent = output;
}

// Narzędzia
function initTools() {
    const toolsContainer = document.getElementById('tools');
    
    blocks.forEach(block => {
        const tool = document.createElement('div');
        tool.className = 'tool';
        tool.textContent = block;
        tool.style.backgroundColor = getColor(block);
        
        tool.addEventListener('click', () => {
            document.querySelectorAll('.tool').forEach(t => t.classList.remove('selected'));
            tool.classList.add('selected');
            currentTool = block;
        });
        
        toolsContainer.appendChild(tool);
    });
}

function copyOutput() {
    const outputText = document.getElementById('output').textContent;
    
    navigator.clipboard.writeText(outputText).then(() => {
        // Pokazanie potwierdzenia kopiowania
        const button = document.querySelector('.copy-button');
        const originalText = button.textContent;
        button.textContent = "Skopiowano!";
        button.style.backgroundColor = "#2196F3";
        
        // Przywrócenie oryginalnego tekstu po 2 sekundach
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = "#4CAF50";
        }, 2000);
    }).catch(err => {
        alert("Błąd podczas kopiowania: " + err);
    });
}

document.addEventListener('mouseup', () => isMouseDown = false);

initTools();
createGrid();