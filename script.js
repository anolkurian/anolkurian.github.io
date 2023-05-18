var canvas, ctx;
var columns, rows;
var matrix;
var charSet = "abcdefghijklmnopqrstuvwxyz0123456789";
var words = ["Anol Kurian","Click"];
var mouse = { x: 0, y: 0 };
var characterSpacing = 20; // Adjust the spacing between characters

// Initialize the matrix
function initializeMatrix() {
    canvas = document.getElementById("matrixCanvas");
    ctx = canvas.getContext("2d");

    updateDimensions();

    matrix = [];
    for (var x = 0; x < columns; x++) {
        matrix[x] = {
            characters: [], // Array to hold multiple characters within a column
            yPosition: Math.floor(Math.random() * rows) * characterSpacing,
            velocity: getRandomVelocity()
        };

        // Choose a random word from the words array
        var word = words[Math.floor(Math.random() * words.length)];

        // Add characters from the chosen word to the matrix column
        for (var i = 0; i < word.length; i++) {
            matrix[x].characters.push({
                value: word[i],
                color: getRandomColor(),
                yPosition: i * characterSpacing
            });
        }
    }
}

// Update the canvas dimensions
function updateDimensions() {
    columns = Math.floor(window.innerWidth / characterSpacing);
    rows = Math.floor(window.innerHeight / characterSpacing);

    canvas.width = columns * characterSpacing;
    canvas.height = rows * characterSpacing;
}

// Handle window resize events
function handleResize() {
    updateDimensions();
    initializeMatrix();
}

// Get a random character from the character set
function getRandomChar() {
    return charSet[Math.floor(Math.random() * charSet.length)];
}

// Get a random color
function getRandomColor() {
    var colors = ["#00ff00", "#00cc00", "#009900", "#006600", "#003300"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Get a random delay between 0 and 300 milliseconds
function getRandomDelay() {
    return Math.floor(Math.random() * 300);
}

// Get a random velocity between -1 and 1
function getRandomVelocity() {
    return Math.random() * 2 - 1;
}

// Update the mouse position
function updateMousePosition(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

// Draw the matrix
function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "15px monospace";

    for (var x = 0; x < columns; x++) {
        var matrixColumn = matrix[x];
        var yPosition = matrixColumn.yPosition;

        for (var i = 0; i < matrixColumn.characters.length; i++) {
            var matrixCell = matrixColumn.characters[i];
            ctx.fillStyle = matrixCell.color;
            ctx.fillText(matrixCell.value, x * characterSpacing, yPosition);
            yPosition += characterSpacing;
        }
    }
}

// Update the matrix
function updateMatrix() {
    for (var x = 0; x < columns; x++) {
        var matrixColumn = matrix[x];

        // Calculate the distance between the mouse and the column's position
        var distance = calculateDistance(mouse.x, mouse.y, x * characterSpacing, matrixColumn.yPosition);

        // Move the column towards the mouse if the distance is less than a threshold
        if (distance < 200) {
            var dx = (mouse.x - (x * characterSpacing)) / characterSpacing;
            var dy = (mouse.y - matrixColumn.yPosition) / characterSpacing;
            matrixColumn.yPosition += dy;
            matrixColumn.velocity += dx;
        }
        // Otherwise, move the column randomly up or down
        else {
            matrixColumn.yPosition += Math.random() < 0.5 ? -1 : 1;
            matrixColumn.velocity += (Math.random() - 0.5) * 0.1;
        }

        // Limit the velocity of the column
        matrixColumn.velocity = Math.max(-2, Math.min(matrixColumn.velocity, 2));

        // Update each character's position within the column
        for (var i = 0; i < matrixColumn.characters.length; i++) {
            var matrixCell = matrixColumn.characters[i];

            // Move the character randomly up or down
            matrixCell.yPosition += Math.random() < 0.5 ? -1 : 1;

            if (matrixCell.yPosition >= canvas.height || matrixCell.yPosition < 0) {
                matrixCell.value = getRandomChar();
                matrixCell.color = getRandomColor();
                matrixCell.yPosition = matrixCell.yPosition < 0 ? canvas.height : 0;
            }
        }

        if (matrixColumn.yPosition >= canvas.height || matrixColumn.yPosition < 0) {
            matrixColumn.yPosition = matrixColumn.yPosition < 0 ? canvas.height : 0;
            matrixColumn.velocity = getRandomVelocity();
        }
    }
}


// Calculate the distance between two points
function calculateDistance(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// Main loop
function loop() {
    drawMatrix();
    updateMatrix();
    requestAnimationFrame(loop);
}

// Initialize and start the loop
initializeMatrix();
loop();

// Listen for window resize events
window.addEventListener("resize", handleResize);

// Listen for mousemove events
window.addEventListener("mousemove", updateMousePosition);
