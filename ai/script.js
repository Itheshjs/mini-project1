// Select elements
const perceptBox = document.getElementById('percept');
const senseButton = document.getElementById('sense-button');
const actButton = document.getElementById('act-button');

// Variables to hold environment and agent state
let environmentState = "Clean";
let agentState = "Idle";

// Event: Sense the environment
senseButton.addEventListener('click', () => {
  perceptBox.textContent = `Percept: Environment is ${environmentState}`;
  agentState = "Sensed";
  console.log("Agent sensed the environment.");
});

// Event: Perform action
actButton.addEventListener('click', () => {
  if (agentState === "Sensed") {
    environmentState = "Dirty";
    perceptBox.textContent = "Percept: Environment is Dirty. Action: Cleaning...";
    setTimeout(() => {
      environmentState = "Clean";
      perceptBox.textContent = "Percept: Environment is Clean. Action Completed.";
    }, 2000);
    console.log("Agent acted to clean the environment.");
  } else {
    alert("Please sense the environment first!");
  }
});
