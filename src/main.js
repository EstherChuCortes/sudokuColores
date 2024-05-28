

// Importar el archivo 'main.scss'
import "../sass/main.scss";


// Declaración de variables
let currentLevel = 0;
const levels = [
    { fixedColors: ['red', 'blue', 'green', 'yellow'], message: '¡Felicidades! Has completado el nivel 1. Pasas al nivel 2.' },
    { fixedColors: ['blue', 'green'], message: '¡Felicidades! Has completado el nivel 2. Pasas al nivel 3.' },
    { fixedColors: ['green'], message: '¡Felicidades! Has completado el nivel 3. ¡Reto Sudoku completado!' }
];
const board = document.getElementById('board');
const colorPicker = document.getElementById('colorPicker');
const elapsedTimeElement = document.getElementById('elapsedTime');
let timerInterval;
let elapsedTime = 0;
let gameStarted = false;

// Función para crear el tablero
function createBoard() {
    // Verifica si el tablero 'board' existe en el DOM
    if (!board) {
        // Muestra un mensaje de error en la consola si 'boar' no existe
        console.error("El elemento con el id 'board' no se encontró en el DOM.");
        // Sale de la funcion si no se encuentra el 'board'
        return;
    }
    //Limpia el contenido interno de 'board' para empezar de nuevo
    board.innerHTML = '';
    // Bucle para crear 4 filas
    for (let i = 0; i < 4; i++) {
        // crear un nuevo did para la fila
        const row = document.createElement('div');
        //Añade la clase row al div de la fila
        row.classList.add('row');
        // Bucle para crear 4 celdas en cada fila 
        for (let j = 0; j < 4; j++) {
            // Crear un nuevo elemento div para la celda
            const cell = document.createElement('div');
            // Añade la clase cell al div de la celda
            cell.classList.add('cell');
            // Establece el atributo 'data-row' con el indice de la fila actual
            cell.dataset.row = i;
            // Establece el atributo 'data-col' con el indice de la columna actual
            cell.dataset.col = j;
            // Añade un evento de click a la celda que llama a la funcion 'setColor'
            cell.addEventListener('click', () => setColor(cell));
            // Añade la celda al div de la fila
            row.appendChild(cell);
        }
        // Añade la fila completa al tablero
        board.appendChild(row);
    }
    //Llama a la funcion 'addFixedColors' para añadir color fijos a algunas celdas
    addFixedColors();
}

// Función para añadir los colores fijos al tablero
function addFixedColors() {
    //Obtener la lista de colores fijos del nivel actual
    const fixedColors = levels[currentLevel].fixedColors;
    //Obtiene todas las celdas del tablero
    const cells = document.getElementsByClassName('cell');
    //Itera sobre la lista de colores fijos
    for (let i = 0; i < fixedColors.length; i++) {
        //Establece el color de fondo de la celda actual al color fijo correspondiente
        cells[i].style.backgroundColor = fixedColors[i];
        //Marca la celda como fija para que no se pueda cambiar su color
        cells[i].dataset.fixed = 'true';
    }
}

// Función para establecer el color seleccionado por el usuario en una celda
function setColor(cell) {
    // Si la celda está marcada como fija, no permite cambiar el color
    if (cell.dataset.fixed === 'true') {
        return; // Sale de la función si la celda es fija
    }
    
    // Establece el color de fondo de la celda al valor seleccionado en el colorPicker
    cell.style.backgroundColor = colorPicker.value;
    
    // Verifica si el juego ya ha comenzado para evitar reiniciar el temporizador
    if (!gameStarted && !areAllCellsEmpty()) {
        startTimer(); // Inicia el temporizador
        gameStarted = true; // Establece la variable de control del juego a verdadero
    }

    // Verifica si el tablero está completo después de cambiar el color
    if (isBoardComplete()) {
        checkWin(); // Llama a la función checkWin para determinar si el jugador ha ganado
    } else {
        // Verifica si todas las celdas están coloreadas antes de mostrar el mensaje de derrota
        if (areAllCellsColored()) {
            showGameResult('Has perdido, vuelve a intentarlo.', false);
        }
    }
}

// Función auxiliar para verificar si todas las celdas están coloreadas
function areAllCellsColored() {
    const cells = document.getElementsByClassName('cell');
    return Array.from(cells).every(cell => cell.style.backgroundColor);
}

// Función auxiliar para verificar si todas las celdas están vacías
function areAllCellsEmpty() {
    const cells = document.getElementsByClassName('cell');
    return Array.from(cells).every(cell => !cell.style.backgroundColor);
}




// Función para verificar si el tablero ha sido completado correctamente
function isBoardComplete() {
    const cells = document.getElementsByClassName('cell');
    if (Array.from(cells).some(cell => !cell.style.backgroundColor)) {
        return false;
    }
    for (let i = 0; i < 4; i++) {
        const rowColors = Array.from(cells).filter(cell => cell.dataset.row == i).map(cell => cell.style.backgroundColor);
        const colColors = Array.from(cells).filter(cell => cell.dataset.col == i).map(cell => cell.style.backgroundColor);
        if (new Set(rowColors).size !== 4 || new Set(colColors).size !== 4) {
            return false;
        }
    }
    return true;
}

// Función para mostrar el resultado del juego
function showGameResult(message, isComplete) {
    alert(message);
    if (!isComplete) {
        gameStarted = false;
        elapsedTime = 0;
        elapsedTimeElement.textContent = formatTime(elapsedTime);
        createBoard();
    } else {
        if (currentLevel ===2){
            alert('¡Reto Soduko completado! El juego se reiniciará');
            gameStarted = false;
            currentLevel = 0;
            elapsedTime = 0; 
            elapsedTimeElement.textContent = formatTime(elapsedTime);
            createBoard();
        }else{
            currentLevel++;
            createBoard();
            resetTimer();
        }
    }
}

// Función para verificar si el jugador ha ganado y mostrar el resultado
function checkWin() {
    const isComplete = isBoardComplete();
    if (isComplete) {
        clearInterval(timerInterval);
        if (currentLevel === 2){ // Si es el ultimo nivel
            showGameResult(levels[currentLevel].message, true);
        }else{
            showGameResult(levels[currentLevel].message, true);
        }
        
    }else{
        // Aqui se llama a showGameResult con false para isComplete, lo que deberia mostar la alerta de derrota
        showGameResult('Has perdido, vuelve a intentarlo.', false);
    }
}

// Función para iniciar el temporizador
function startTimer() {
    // Establece un intervalo que llama a la función updateTime cada 1000 milisegundos (1 segundo)
    timerInterval = setInterval(updateTime, 1000);
}

// Función para actualizar el tiempo en el temporizador
function updateTime() {
    elapsedTime++; // Incrementa el contador de tiempo transcurrido
    elapsedTimeElement.textContent = formatTime(elapsedTime); // Actualiza el contenido de texto del elemento con el tiempo formateado
}

// Función para reiniciar el temporizador
function resetTimer() {
    clearInterval(timerInterval); // Detiene cualquier temporizador existente para evitar duplicados
    elapsedTime = 0; // Reinicia el contador de tiempo transcurrido a cero
    elapsedTimeElement.textContent = formatTime(elapsedTime); // Actualiza el elemento de tiempo en la interfaz de usuario con el tiempo reiniciado
    timerInterval = setInterval(updateTime, 1000); // Establece un nuevo intervalo para actualizar el tiempo cada segundo
}

// Función para formatear el tiempo en formato HH:MM:SS
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600); // Calcula las horas dividiendo los segundos totales entre 3600 (segundos en una hora)
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Calcula los minutos restantes después de extraer las horas
    const seconds = totalSeconds % 60; // Obtiene los segundos restantes después de extraer las horas y minutos
    // Devuelve el tiempo formateado como una cadena en formato HH:MM:SS, asegurándose de que cada unidad tenga dos dígitos
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Evento al cargar el DOM para iniciar el juego
document.addEventListener('DOMContentLoaded', () => {
    createBoard(); // Llama a la función createBoard para construir el tablero cuando el DOM está completamente cargado
});
