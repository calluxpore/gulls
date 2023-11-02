let blueColor, whiteColor, currentColor;
let lastTransitionTime;
let isTransitioning = false;
let fadeDuration = 5000; // Duration to fade to white
let cycleDuration = 20000; // Total cycle duration (20 seconds)
let waveSound; // Variable to hold our sound file
let permissionGranted = false;
let permissionButton;

function preload() {
  // Load the sound file
  soundFormats('mp3', 'ogg');
  waveSound = loadSound('gulls.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  blueColor = color(145,218,78); // Green color
  whiteColor = color(255); // White color
  currentColor = color(0); // Start with grey
  background(currentColor); // Set initial background

  // Create permission button for iOS devices
  permissionButton = createButton('START');
  permissionButton.position(width / 2 - 50, height / 2 - 15);
  permissionButton.size(100, 30);
  permissionButton.style('font-size', '20px');
  permissionButton.style('font-family', 'Arial');
  permissionButton.style('color', ' black');
  permissionButton.style('background-color', 'white');
  permissionButton.style('border', 'none');
  permissionButton.style('border-radius', '15px');
  

  permissionButton.mousePressed(requestPermission);

  // Sync with universal time
  syncWithUniversalTime();
}

function draw() {
  if (isTransitioning && permissionGranted) {
    let currentTime = millis();
    let timeSinceLastTransition = currentTime - lastTransitionTime;
    
    if (timeSinceLastTransition <= fadeDuration) {
      // Transition from blue to white
      currentColor = lerpColor(blueColor, whiteColor, map(timeSinceLastTransition, 0, fadeDuration, 0, 1));
    } else if (timeSinceLastTransition <= cycleDuration) {
      // Transition from white to blue
      currentColor = lerpColor(whiteColor, blueColor, map(timeSinceLastTransition - fadeDuration, 0, cycleDuration - fadeDuration, 0, 1));
    }
    
    if (timeSinceLastTransition >= cycleDuration) {
      lastTransitionTime = currentTime;
    }
  }
  
  background(currentColor); // Set the background color based on the lerp
}

function requestPermission() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
  // Play the wave sound and loop it indefinitely
  waveSound.loop();
  permissionGranted = true;
  permissionButton.hide(); // Hide the permission button after pressing it
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Update the permission button position
  permissionButton.position(width / 2 - permissionButton.width / 2, height / 2 - permissionButton.height / 2);
}

function syncWithUniversalTime() {
  let currentSeconds = second(); // Get the current second
  let currentMillis = millis() % 1000; // Get the milliseconds part of the current time
  
  // Calculate how many milliseconds until the next 20-second mark
  let secondsUntilNextTransition = (20 - currentSeconds % 20) % 20;
  let msUntilNextTransition = secondsUntilNextTransition * 1000 - currentMillis;

  // If we are at the exact 0, 20, or 40-second mark, start the transition immediately
  if (msUntilNextTransition === 0) {
    lastTransitionTime = millis() - currentMillis; // Adjust for the current second
    isTransitioning = true;
  } else {
    // Set a delay to start the transition at the next interval
    setTimeout(startTransition, msUntilNextTransition);
  }
}

function startTransition() {
  lastTransitionTime = millis();
  isTransitioning = true;
}
