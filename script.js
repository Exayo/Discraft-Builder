const blockMap = {
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
    'YellowFlower': 'm12',
    'Stone': 'm13'
};

let currentTool = 'Air';
let isMouseDown = false;
let gridData = [];

function createGrid() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    gridData = [];

    for(let i = 0; i < rows; i++) {
        gridData.push(Array(cols).fill('Air'));
    }

    for(let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        
        for(let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.type = 'Air';
            cell.style.backgroundImage = `url('Assets/m7.png')`;
            
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
    cell.style.backgroundImage = gridData[row][col] === 'Air' 
        ? ''
        : `url('Assets/${blockMap[gridData[row][col]]}.png')`;
    updateOutput();
}

function updateOutput() {
    let total = 0;
    const outputLines = gridData.map(row => {
        let line = '';
        for(let j = 0; j < row.length; j++) {
            const cell = row[j];
            if(cell === 'Air') {
                const hasNonAirRight = row.slice(j + 1).some(c => c !== 'Air');
                if(hasNonAirRight) {
                    line += `:${blockMap[cell]}:`;
                    total += 25;
                }
            } else {
                line += `:${blockMap[cell]}:`;
                const code = blockMap[cell];
                total += code.length >= 3 ? 26 : 25;
            }
        }
        return line;
    });

    const output = outputLines.join('\n');
    document.getElementById('output').textContent = output;
    
    const charCountElement = document.getElementById('charCount');
    charCountElement.innerHTML = total > 2000 
        ? `<span class="limit-warning">${total}</span>` 
        : total;
}

function initTools() {
    const toolsContainer = document.getElementById('tools');
    
    Object.entries(blockMap).forEach(([name, id]) => {
        if(name === 'Air') return;
        
        const tool = document.createElement('div');
        tool.className = 'tool';
        tool.dataset.name = name;
        tool.innerHTML = `<img src="Assets/${id}.png" alt="${name}">`;
        
        tool.addEventListener('click', () => {
            document.querySelectorAll('.tool').forEach(t => t.classList.remove('selected'));
            tool.classList.add('selected');
            currentTool = name;
        });
        
        toolsContainer.appendChild(tool);
    });

    // Eraser tool
    const eraser = document.createElement('div');
    eraser.className = 'tool';
    eraser.dataset.name = 'Gumka';
    eraser.innerHTML = `
        <div style="
            width: 100%;
            height: 100%;
            background: #ff4444;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        ">✖</div>
    `;
    
    eraser.addEventListener('click', () => {
        document.querySelectorAll('.tool').forEach(t => t.classList.remove('selected'));
        eraser.classList.add('selected');
        currentTool = 'Eraser';
    });
    
    toolsContainer.appendChild(eraser);
}

function copyOutput() {
    const outputText = document.getElementById('output').textContent;
    navigator.clipboard.writeText(outputText).then(() => {
        const button = document.querySelector('.copy-button');
        button.textContent = "Skopiowano!";
        button.style.backgroundColor = "#4CAF50";
        setTimeout(() => {
            button.textContent = "Kopiuj do schowka";
        }, 2000);
    });
}

document.addEventListener('mouseup', () => isMouseDown = false);
initTools();
createGrid();