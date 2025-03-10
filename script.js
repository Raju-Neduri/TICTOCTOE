console.log("Welcome to Tic Tac Toe");

let turn = "X";
let isGameOver = false;

const boxes = document.getElementsByClassName("box");
const boxtexts = document.getElementsByClassName("boxtext");
const info = document.querySelector(".info");
const line = document.querySelector(".line");
const resetBtn = document.getElementById("reset");
const imgBox = document.querySelector(".imgbox img");
const container = document.querySelector(".container");

// Turn & Gameover Sounds – ensure these files are correctly located
let audioTurn = new Audio("ting.mp3");
let gameoverSound = new Audio("gameover.mp3");

const winCombos = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Col 1
    [1, 4, 7], // Col 2
    [2, 5, 8], // Col 3
    [0, 4, 8], // Diagonal 1
    [2, 4, 6]  // Diagonal 2
];

// Switch turn between X and O
function changeTurn() {
    return turn === "X" ? "O" : "X";
}

/**
 * Draws a line between the center of two boxes (startBox, endBox)
 * with an extension added to both ends.
 */
function drawWinLine(startBox, endBox) {
    const containerRect = container.getBoundingClientRect();
    const rectStart = boxes[startBox].getBoundingClientRect();
    const rectEnd = boxes[endBox].getBoundingClientRect();

    // Calculate centers of the starting and ending boxes
    const startX = rectStart.left + rectStart.width / 2 - containerRect.left;
    const startY = rectStart.top + rectStart.height / 2 - containerRect.top;
    const endX = rectEnd.left + rectEnd.width / 2 - containerRect.left;
    const endY = rectEnd.top + rectEnd.height / 2 - containerRect.top;

    // Calculate the difference and distance between the centers
    const diffX = endX - startX;
    const diffY = endY - startY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const angle = Math.atan2(diffY, diffX) * (180 / Math.PI);

    // Add an extension (in pixels) to both ends of the line
    const extension = 20; // Adjust this value as needed

    // Update the line width by adding twice the extension (for both ends)
    line.style.width = (distance + extension * 2) + "px";

    // Adjust the starting point by subtracting the extension along the direction of the line
    const rad = Math.atan2(diffY, diffX);
    const newStartX = startX - extension * Math.cos(rad);
    const newStartY = startY - extension * Math.sin(rad);

    // Apply the new transformation for the line
    line.style.transform = `translate(${newStartX}px, ${newStartY}px) rotate(${angle}deg)`;
}

/**
 * Checks if there's a winner and updates info text styling accordingly.
 */
function checkWin() {
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (
            boxtexts[a].innerText !== "" &&
            boxtexts[a].innerText === boxtexts[b].innerText &&
            boxtexts[b].innerText === boxtexts[c].innerText
        ) {
            info.innerText = boxtexts[a].innerText + " Won!";
            info.classList.add("winner");
            isGameOver = true;

            drawWinLine(a, c);
            imgBox.style.width = "200px"; // Show celebration GIF

            gameoverSound.play().catch(err => console.log("Game over sound error:", err));
            break;
        }
    }
}

/**
 * Checks if all boxes are filled (for tie condition).
 */
function isBoardFull() {
    for (let boxText of boxtexts) {
        if (boxText.innerText === "") {
            return false;
        }
    }
    return true;
}

// Handle clicks on each box
Array.from(boxes).forEach((box, index) => {
    box.addEventListener("click", () => {
        if (!isGameOver && boxtexts[index].innerText === "") {
            boxtexts[index].innerText = turn;
            audioTurn.play().catch(err => console.log("Turn sound error:", err));

            checkWin();

            // Check for tie if no win is detected
            if (!isGameOver) {
                if (isBoardFull()) {
                    info.innerText = "It's a Tie!";
                    isGameOver = true;
                } else {
                    turn = changeTurn();
                    info.innerText = "Turn for " + turn;
                    info.classList.remove("winner");
                }
            }
        }
    });
});

// Reset button logic: clear board and reset info styling
resetBtn.addEventListener("click", () => {
    Array.from(boxtexts).forEach(btxt => (btxt.innerText = ""));
    turn = "X";
    isGameOver = false;
    info.innerText = "Turn for " + turn;
    info.classList.remove("winner");

    line.style.width = "0";
    imgBox.style.width = "0";
});
