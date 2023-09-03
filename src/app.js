const grid = document.querySelector(".grid");
const resultsDisplay = document.querySelector(".results");

let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

for (var i = 0; i < 225; i++) {

    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));
const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
  ];

// Function to draw the alien invaders on the grid
function draw() {
    // Iterate over each alien invader's index
    alienInvaders.forEach((invaderIndex, i) => {
        // Check if the invader has not been removed (not in aliensRemoved array)
        if (!aliensRemoved.includes(i)) {
            // Add the "invader" class to the corresponding square, making it visible
            squares[invaderIndex].classList.add("invader");
        }
    });
}

// Call the draw function to initially draw the alien invaders on the grid
draw();

// Function to remove the alien invaders from the grid
function remove() {
    // Iterate over each alien invader's index
    alienInvaders.forEach((invaderIndex) => {
        // Remove the "invader" class from the corresponding square, hiding it
        squares[invaderIndex].classList.remove("invader");
    });
}

squares[currentShooterIndex].classList.add("shooter");

// Function to move the shooter based on keyboard input
function moveShooter(e) {
    // Remove the shooter class from the current shooter position
    squares[currentShooterIndex].classList.remove("shooter");

    // Check if the left arrow key is pressed and the shooter is not at the left edge
    if (e.key === "ArrowLeft" && currentShooterIndex % width !== 0) {
        // Move the shooter one position to the left
        currentShooterIndex -= 1;
    } 
    // Check if the right arrow key is pressed and the shooter is not at the right edge
    else if (e.key === "ArrowRight" && currentShooterIndex % width < width - 1) {
        // Move the shooter one position to the right
        currentShooterIndex += 1;
    }

    // Add the shooter class to the new shooter position to update its visual appearance
    squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

// Function to move the alien invaders
function moveInvaders() {
    
    // Check if the leftmost invader is at the left edge of the grid
    const leftEdge = alienInvaders[0] % width === 0;
    // Check if the rightmost invader is at the right edge of the grid
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

    // Remove existing invaders from the grid
    remove();

    // If the invaders reach the right edge and are going right, move them down and change direction
    if (rightEdge && goingRight) {
        moveInvadersRight();
    }

    // If the invaders reach the left edge and are not going right, move them down and change direction
    if (leftEdge && !goingRight) {
        moveInvadersLeft();
    }

    // Move all invaders in their current direction
    alienInvaders.forEach((_, i) => (alienInvaders[i] += direction));

    // Redraw the invaders on the grid
    draw();

    // Check if the game is over (if the shooter is hit or invaders reach the bottom)
    if (isGameOver()) {
        resultsDisplay.innerHTML = "GAME OVER!";
        clearInterval(invadersId);
    }

    // Check if all invaders are removed (player wins)
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = "YOU WIN";
        clearInterval(invadersId);
    }
}


// Function to move the alien invaders to the right
function moveInvadersRight() {

    alienInvaders.forEach((_, i) => {
        // Move each invader to the right by adding width + 1 to their position
        alienInvaders[i] += width + 1;
        // Change the direction to -1 to indicate moving left next
        direction = -1;
        // Set goingRight to false to change the direction
        goingRight = false;
    });
}

// Function to move the alien invaders to the left
function moveInvadersLeft() {

    alienInvaders.forEach((_, i) => {
        // Move each invader to the left by subtracting width - 1 from their position
        alienInvaders[i] += width - 1;
        // Change the direction to 1 to indicate moving right next
        direction = 1;
        // Set goingRight to true to change the direction
        goingRight = true;
    });
}

// Function to check if the game is over
function isGameOver() {
    // Check if the shooter square contains both "invader" and "shooter" classes
    // or if any invader position exceeds the total number of squares
    return (
        squares[currentShooterIndex].classList.contains("invader", "shooter") ||
        alienInvaders.some((invader) => invader > squares.length)
    );
}


invadersId = setInterval(moveInvaders, 600);

// Function to handle shooting lasers
function shoot(e) {

    // Check if the "ArrowUp" key is pressed
    if (e.key === "ArrowUp") {

        // Initialize the current laser position to the shooter's position
        let currentLaserIndex = currentShooterIndex;

        // Function to move the laser
        function moveLaser() {

            // Remove the "laser" class from the current square
            squares[currentLaserIndex].classList.remove("laser");
            // Move the laser position upward by subtracting the width of the grid
            currentLaserIndex -= width;

            // Check if the laser is within the grid
            if (currentLaserIndex >= 0) {

                // Add the "laser" class to the new square, creating the laser movement effect
                squares[currentLaserIndex].classList.add("laser");

                // Check if the square the laser moved to contains an invader
                if (squares[currentLaserIndex].classList.contains("invader")) {

                    // Call the handleInvaderHit function to handle the hit
                    handleInvaderHit(currentLaserIndex);
                    // Clear the interval to stop moving the laser
                    clearInterval(laserId);
                }
            } 
            else {
                // If the laser reaches the top of the grid, clear the interval to stop moving it
                clearInterval(laserId);
            }
        }

        // Create an interval for moving the laser
        const laserId = setInterval(moveLaser, 100);
    }
}

// Add an event listener to call the shoot function when a key is pressed
document.addEventListener("keydown", shoot);


// Function to handle an invader being hit by a laser
function handleInvaderHit(index, laserId) {

    // Remove the laser class from the square
    squares[index].classList.remove("laser");
    // Remove the invader class from the square
    squares[index].classList.remove("invader");
    // Add the boom class to create an explosion effect
    squares[index].classList.add("boom");

    // Remove the boom class after a delay to clear the explosion effect
    setTimeout(() => squares[index].classList.remove("boom"), 300);
    
    // Clear the interval responsible for the laser movement
    clearInterval(laserId);

    // Find the index of the alien invader in the array
    const alienRemoved = alienInvaders.indexOf(index);
    // Add the index to the aliensRemoved array to keep track of removed invaders
    aliensRemoved.push(alienRemoved);
    
    // Increment the score
    results++;
    // Update the score displayed on the screen
    resultsDisplay.innerHTML = results;
    // Log the aliensRemoved array for debugging
    console.log(aliensRemoved);
}

document.addEventListener("keydown", shoot);

//This project was inspired by https://www.youtube.com/watch?v=3Nz4Yp7Y_uA&ab_channel=CodewithAniaKub%C3%B3w 