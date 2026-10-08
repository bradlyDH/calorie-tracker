const setupForm = document.querySelector("#setup-form");

const formErrorText = document.querySelector("#validation-message");

const heightInFeetInput = document.querySelector("#height-feet");
const heightInInchesInput = document.querySelector("#height-inches");
const weightInput = document.querySelector("#body-weight");
const workoutDaySelection = document.querySelector("#workout-days");
const activityMultiplierOutput = document.querySelector(
  "#activity-multiplier-value",
);
const bmrCalculationValue = document.querySelector("#bmr-value");
const maintenanceCaloriesOutput = document.querySelector(
  "#maintenance-calories-value",
);
const targetCalorieGoal = document.querySelector("#target-calories-value");

const calorieGoal = document.querySelector("#goal");
const adjustmentValue = document.querySelector("#adjustment-value");

const ageInput = document.querySelector("#age");
const genderSelection = document.querySelector("#gender");

const macroPreference = document.querySelector("#macro-preference");
const proteinGoalValue = document.querySelector("#protein-goal-value");
const fatGoalValue = document.querySelector("#fat-goal-value");
const carbGoalValue = document.querySelector("#carb-goal-value");
const macroSplitValue = document.querySelector("#macro-split-value");

const outputResults = document.querySelectorAll(".result-row");

let outputValues = {};

const resetBtn = document.querySelector("#reset-setup");
const saveOutputBtn = document.querySelector("#save-output-btn");

// This function will convert the user's height and return it in centimeters
function convertHeightToCentimeters(heightInFeet, heightInInches) {
  const totalInches = heightInFeet * 12 + heightInInches;
  const totalCentimeters = totalInches * 2.54;
  return totalCentimeters;
}

// This function will convert the user's weight from pounds to kilograms
function convertWeightToKilograms(weightInPounds) {
  return weightInPounds / 2.20462;
}

/* This function will take the user's gender, age, weight, height in feet, height in inches, 
then calculates their BMR based on the arguments passed in.*/
function calculateBMR(gender, age, weight, heightInFeet, heightInInches) {
  if (gender.toLowerCase() === "male") {
    return Math.round(
      10 * convertWeightToKilograms(weight) +
        6.25 * convertHeightToCentimeters(heightInFeet, heightInInches) -
        5 * age +
        5,
    );
  } else {
    return Math.round(
      10 * convertWeightToKilograms(weight) +
        6.25 * convertHeightToCentimeters(heightInFeet, heightInInches) -
        5 * age -
        161,
    );
  }
}

// This function calculates the activity level based of the user's amount of days they workout
function calculateActivityMultiplier(workoutAmount) {
  if (workoutAmount === 0) {
    return 1.2;
  } else if (workoutAmount > 0 && workoutAmount < 3) {
    return 1.375;
  } else if (workoutAmount > 2 && workoutAmount < 6) {
    return 1.55;
  } else {
    return 1.725;
  }
}

/* This function will calculate the user's maintenance calories based off their 
BMR and their activity level*/
function calculateMaintenanceCalories(bmr, activityAmount) {
  return Math.round(bmr * activityAmount);
}

/* This function with calculate the user's calorie goal based off their
maintenance calories and their calorie target, whether their bulking,
cutting, or maintaining.
Bulking should add 500 calories to the maintenance calories
Cutting will subtract 500 calories from the maintenance calories
Maintenance will keep it at the calculated maintenance amount
*/
function calculateCalorieGoal(maintenanceCalories, goal) {
  if (goal.toLowerCase() === "cutting") {
    return maintenanceCalories - 500;
  } else if (goal.toLowerCase() === "bulking") {
    return maintenanceCalories + 500;
  } else {
    return maintenanceCalories;
  }
}

// This function will calculate the Macronutrient preference.
// This is is essentially how they want to split their macronutrients for their caloric intake
function calculateMacroPreference(macroNutrientSplit, targetCalories) {
  if (macroNutrientSplit.includes("Moderate")) {
    return {
      protein: Math.round((targetCalories * 0.3) / 4),
      fat: Math.round((targetCalories * 0.35) / 9),
      carbs: Math.round((targetCalories * 0.35) / 4),
      macroSplit: `30% / 35% / 35%`,
    };
  } else if (macroNutrientSplit.includes("Lower")) {
    return {
      protein: Math.round((targetCalories * 0.4) / 4),
      fat: Math.round((targetCalories * 0.4) / 9),
      carbs: Math.round((targetCalories * 0.2) / 4),
      macroSplit: `40% / 40% / 20%`,
    };
  } else if (macroNutrientSplit.includes("Higher")) {
    return {
      protein: Math.round((targetCalories * 0.3) / 4),
      fat: Math.round((targetCalories * 0.2) / 9),
      carbs: Math.round((targetCalories * 0.5) / 4),
      macroSplit: `30% / 20% / 50%`,
    };
  }
}

function calculateAdjustmentValue(adjustmentType) {
  if (adjustmentType.toLowerCase() === "cutting") {
    return "-500";
  } else if (adjustmentType.toLowerCase() === "bulking") {
    return "+500";
  } else {
    return "0";
  }
}

function renderCalculatedResults() {
  if (
    ageInput.value === "" ||
    weightInput.value === "" ||
    heightInFeetInput.value === "" ||
    heightInInchesInput.value === ""
  ) {
    formErrorText.style.display = "block";
  } else {
    formErrorText.style.display = "none";
  }

  const bmrValue = calculateBMR(
    genderSelection.value,
    Number(ageInput.value),
    Number(weightInput.value),
    Number(heightInFeetInput.value),
    Number(heightInInchesInput.value),
  );
  bmrCalculationValue.textContent = bmrValue;

  const activityMultiplierValue = calculateActivityMultiplier(
    Number(workoutDaySelection.value),
  );
  activityMultiplierOutput.textContent = activityMultiplierValue;

  const maintenanceCaloriesValue = calculateMaintenanceCalories(
    bmrValue,
    activityMultiplierValue,
  );
  maintenanceCaloriesOutput.textContent = maintenanceCaloriesValue;

  const targetCalories = calculateCalorieGoal(
    maintenanceCaloriesValue,
    calorieGoal.value,
  );
  targetCalorieGoal.textContent = targetCalories;

  adjustmentValue.textContent = calculateAdjustmentValue(calorieGoal.value);

  const macroOutput = calculateMacroPreference(
    macroPreference.value,
    targetCalories,
  );

  proteinGoalValue.textContent = macroOutput.protein;
  fatGoalValue.textContent = macroOutput.fat;
  carbGoalValue.textContent = macroOutput.carbs;
  macroSplitValue.textContent = macroOutput.macroSplit;
}

function resetForm() {
  const inputs = setupForm.querySelectorAll("input");

  inputs.forEach((input) => (input.value = ""));
  renderCalculatedResults();
}

function saveOutput() {
  console.log("clicked");
  outputResults.forEach((output) => {
    const resultRowElement = output.querySelector("[id*=value]");
    const key = resultRowElement.id;
    const value = resultRowElement.textContent;

    outputValues[key] = value;
    console.log(outputValues);
  });

  const storedSavedOutput = JSON.stringify(outputValues);
  localStorage.setItem("outputValues", storedSavedOutput);
}

setupForm.addEventListener("input", renderCalculatedResults);
resetBtn.addEventListener("click", resetForm);
saveOutputBtn.addEventListener("click", saveOutput);
renderCalculatedResults();
