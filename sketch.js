// Group: Team B
// Members: Orus, Valen, Carol, Samarth

// Variable declarations
let blueColor, whiteColor, currentColor;
let lastTransitionTime;
let isTransitioning = false;
let fadeDuration = 5000;  // Duration to fade to white in milliseconds
let cycleDuration = 20000;  // Total cycle duration in milliseconds (20 seconds)
let waveSound;  // Variable to hold our sound file
let permissionGranted = false;
let permissionButton;
let carryButton;

// Preload function to load assets before setup
function preload() {
  // Load the sound file
  soundFormats('mp3', 'ogg');
  waveSound = loadSound('gulls.mp3');
}

// Setup function to initialize the canvas and variables
function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that fills the window
  colorMode(RGB); // Set color mode to RGB
  blueColor = color(145, 218, 78); // Green color
  whiteColor = color(255); // White color
  currentColor = color(0); // Start with grey
  background(currentColor); // Set initial background

  // Create permission button for iOS devices
  permissionButton = createButton('START');
  let xPosPermission = width / 2 - permissionButton.width / 2;  // Central x-position based on permissionButton width
  permissionButton.position(xPosPermission, height / 2 - permissionButton.height / 2);  // Centered position
  permissionButton.style('font-size', '5em');  // Set font size
  permissionButton.style('padding', '40px 80px');  // Set padding to adjust size
  permissionButton.style('background-color', 'white');  // Set background color
  permissionButton.style('color', 'black');  // Set text color
  permissionButton.style('border', 'none');  // Remove border
  permissionButton.style('border-radius', '90px');  // Set border radius
  permissionButton.style('cursor', 'pointer');  // Set cursor style
  permissionButton.mousePressed(requestPermission);  // Set mousePressed event handler
  permissionButton.center();  // Center the button within its parent element

  // Create the "Carry the calmness with you" button
  carryButton = createButton('Carry the calmness with you');
  carryButton.style('font-size', '45px');  // Set font size
  carryButton.size(650, 100);  // Set button size
  let xPosCarry = width / 2 - 650 / 2;  // Central x-position based on carryButton width
  carryButton.position(xPosCarry, height - 200);  // Adjust the y-position to your liking
  carryButton.style('background-color', 'rgb(169, 169, 169)');  // Set background color to grey
  carryButton.style('color', 'white');  // Set text color
  carryButton.style('border', 'none');  // Remove border
  carryButton.style('border-radius', '100px');  // Set border radius
  carryButton.mousePressed(() => {
    window.location.href = 'fifth.html';  // Navigate to fifth.html on button press
  });
  carryButton.hide();  // Initially hide the button

  // Schedule to show the button after 1 minute
  setTimeout(() => {
    carryButton.show();
  }, 60000);  // 1 minute in milliseconds

  // Update the button positions on window resize
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);  // Resize the canvas to fit the window
    let xPosPermission = width / 2 - permissionButton.width / 2;  // Update x-position on window resize
    let xPosCarry = width / 2 - carryButton.width / 2;  // Update x-position on window resize
    carryButton.position(xPosCarry, height - 100);  // Adjust the y-position to your liking
    permissionButton.position(xPosPermission, height / 2 - permissionButton.height / 2);  // Updated position of permissionButton
  }

  // Sync with universal time
  syncWithUniversalTime();
}

// Function to handle window resize events
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // Resize the canvas to fit the window
}

// ... continuing the code

// Draw function to update the canvas each frame
function draw() {
  if (isTransitioning && permissionGranted) {
    let currentTime = millis();  // Get the current time in milliseconds
    let timeSinceLastTransition = currentTime - lastTransitionTime;  // Calculate time since the last transition

    // Transition from blue to white
    if (timeSinceLastTransition <= fadeDuration) {
      currentColor = lerpColor(blueColor, whiteColor, map(timeSinceLastTransition, 0, fadeDuration, 0, 1));
    }
    // Transition from white to blue
    else if (timeSinceLastTransition <= cycleDuration) {
      currentColor = lerpColor(whiteColor, blueColor, map(timeSinceLastTransition - fadeDuration, 0, cycleDuration - fadeDuration, 0, 1));
    }

    // Reset the transition time if a cycle is completed
    if (timeSinceLastTransition >= cycleDuration) {
      lastTransitionTime = currentTime;
    }
  }

  background(currentColor);  // Set the background color based on the lerp
}

// Function to request audio permission and start playing the sound
function requestPermission() {
  // Check if audio context is running
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();  // Resume audio context if not running
  }
  waveSound.loop();  // Play the wave sound and loop it indefinitely
  permissionGranted = true;  // Set permission granted flag to true
  permissionButton.hide();  // Hide the permission button after pressing it
}

// Function to handle window resize events
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // Resize the canvas to fit the window
  // Update the permission button position
  permissionButton.position(width / 2 - permissionButton.width / 2, height / 2 - permissionButton.height / 2);
}

// Function to sync transition with universal time
function syncWithUniversalTime() {
  let currentSeconds = second();  // Get the current second
  let currentMillis = millis() % 1000;  // Get the milliseconds part of the current time

  // Calculate how many milliseconds until the next 20-second mark
  let secondsUntilNextTransition = (20 - currentSeconds % 20) % 20;
  let msUntilNextTransition = secondsUntilNextTransition * 1000 - currentMillis;

  // If we are at the exact 0, 20, or 40-second mark, start the transition immediately
  if (msUntilNextTransition === 0) {
    lastTransitionTime = millis() - currentMillis;  // Adjust for the current second
    isTransitioning = true;
  } else {
    // Set a delay to start the transition at the next interval
    setTimeout(startTransition, msUntilNextTransition);
  }
}

// Function to start the color transition
function startTransition() {
  lastTransitionTime = millis();  // Set the last transition time to the current time
  isTransitioning = true;  // Set the transitioning flag to true
}