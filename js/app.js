const foodSearchInput = document.querySelector("#food-search");
const foodSuggestions = document.querySelector("#food-suggestions");
const amountEatenInput = document.querySelector("#amount-eaten");

// Food Log form
const addFoodEntryBtn = document.querySelector("#add-food-entry");
const foodLogTableBody = document.querySelector("#food-log-body");
const foodLogTable = document.querySelector("#food-log-table");
const clearFoodLogInputs = document.querySelector("#clear-food-log");

// Daily Settings
const goalSource = document.querySelector("#goal-source");
const manualGoalOverrides = document.querySelector("#manual-goal-overrides");
const manualGoalOverridesInput = manualGoalOverrides.querySelectorAll("input");

// Daily Summary Table
const dailySummaryTable = document.querySelector("#daily-summary-table");
const goalCalories = dailySummaryTable.querySelector("#goal-calories");
const goalFat = dailySummaryTable.querySelector("#goal-fat");
const goalCarbs = dailySummaryTable.querySelector("#goal-carbs");
const goalProtein = dailySummaryTable.querySelector("#goal-protein");

// Consumed Calories and Macro's
const consumedCalories = dailySummaryTable.querySelector("#consumed-calories");
const consumedFat = dailySummaryTable.querySelector("#consumed-fat");
const consumedCarbs = dailySummaryTable.querySelector("#consumed-carbs");
const consumedProtein = dailySummaryTable.querySelector("#consumed-protein");

// Remaining Calories and Macro's
const remainingCalories = dailySummaryTable.querySelector(
  "#remaining-calories",
);
const remainingFat = dailySummaryTable.querySelector("#remaining-fat");
const remainingCarbs = dailySummaryTable.querySelector("#remaining-carbs");
const remainingProtein = dailySummaryTable.querySelector("#remaining-protein");

// Percent Consumed Calories and Macro's
const percentConsumedCalories = dailySummaryTable.querySelector(
  "#percent-consumed-calories",
);
const percentConsumedFat = dailySummaryTable.querySelector(
  "#percent-consumed-fat",
);
const percentConsumedCarbs = dailySummaryTable.querySelector(
  "#percent-consumed-carbs",
);
const percentConsumedProtein = dailySummaryTable.querySelector(
  "#percent-consumed-protein",
);

// Progress Bar Stack
const calorieProgressBar = document.querySelector("#calorie-progress");
const calorieProgressLabel = document.querySelector("#calorie-progress-label");
const proteinProgressBar = document.querySelector("#protein-progress");
const proteinProgressLabel = document.querySelector("#protein-progress-label");
const carbProgressBar = document.querySelector("#carb-progress");
const carbProgressLabel = document.querySelector("#carb-progress-label");
const fatProgressBar = document.querySelector("#fat-progress");
const fatProgressLabel = document.querySelector("#fat-progress-label");

// Manual override inputs
const manualCalorieInput = document.querySelector("#manual-calories");
const manualFatInput = document.querySelector("#manual-fat");
const manualCarbInput = document.querySelector("#manual-carbs");
const manualProteinInput = document.querySelector("#manual-protein");

let foods = [];
let foodLog = [];
let selectedFoodId = null;

loadFoodList();

updateDailySummary();
updateRemainingCaloriesCount();

const incrementLogId = incrementFoodLogId();

function loadFoodList() {
  const getFoodList = localStorage.getItem("foods");

  if (getFoodList === null) {
    return;
  } else {
    foods = JSON.parse(getFoodList).map((food) => {
      if (food.brand === undefined) {
        food.brand = "";
      }
      return food;
    });
  }
}

function incrementFoodLogId() {
  let entryId = 0;
  if (foodLog.length !== 0) {
    entryId = Math.max(...foodLog.map((food) => food.id));
    ++entryId;
  }

  return function increment() {
    return entryId++;
  };
}

function searchFoodList(event) {
  const userInput = event.currentTarget.value.toLowerCase();
  foodSuggestions.textContent = "";

  if (userInput === "") {
    return;
  }
  const foodSearch = foods.filter(
    (food) =>
      food.name.toLowerCase().includes(userInput) ||
      food.brand.toLowerCase().includes(userInput),
  );
  foodSearch.forEach((food) => {
    const foodSuggestionBtn = document.createElement("button");
    foodSuggestionBtn.setAttribute("data-food-id", food.id);

    if (food.name && food.brand) {
      foodSuggestionBtn.textContent = `${food.name} - ${food.brand}`;
    } else {
      foodSuggestionBtn.textContent = `${food.name}`;
    }

    foodSuggestionBtn.type = "button";

    foodSuggestionBtn.addEventListener("click", selectFood);

    foodSuggestions.appendChild(foodSuggestionBtn);
  });
}

function selectFood(event) {
  selectedFoodId = Number(event.currentTarget.getAttribute("data-food-id"));
  // const selectedFood = foods.find((foodItem) => selectedFoodId === foodItem.id);

  foodSearchInput.value = event.currentTarget.textContent;

  foodSuggestions.textContent = "";
}

function addFoodEntry() {
  const selectedFood = foods.find((foodItem) => selectedFoodId === foodItem.id);
  const amountEaten = Number(amountEatenInput.value);
  const currentDateTime = new Date();

  if (selectedFoodId === false || amountEaten <= 0)
    return window.alert(
      "Please select a food and enter an amount eaten greater than 0.",
    );

  const scalingFactor = amountEaten / selectedFood.servingSize;
  const calorieCalculation = scalingFactor * selectedFood.calories;
  const fatCalculation = scalingFactor * selectedFood.fat;
  const carbsCalculation = scalingFactor * selectedFood.carbs;
  const proteinCalculation = scalingFactor * selectedFood.protein;

  const newFoodEntry = {
    id: incrementLogId(),
    foodId: selectedFoodId,
    name: selectedFood.name,
    brand: selectedFood.brand,
    amount: amountEaten,
    calories: calorieCalculation,
    fat: fatCalculation,
    carbs: carbsCalculation,
    protein: proteinCalculation,
    loggedAt: currentDateTime.getTime(),
  };

  foodLog.push(newFoodEntry);

  // saveFoodList();
  renderFoodLog(foodLog);
  updateConsumedCaloriesCount();
  updateDailySummary();
  updateGoalUsedPercentage();
  // clearFoodFormInputs();
  console.log(foodLog);
}

function renderFoodLog(foodLogArray) {
  foodLogTableBody.textContent = "";

  if (foodLogArray.length === 0) {
    const emptyTableRow = document.createElement("tr");
    const emptyTableCell = document.createElement("td");
    emptyTableCell.colSpan = 9;
    emptyTableCell.textContent = "Add your first food!";
    emptyTableRow.appendChild(emptyTableCell);
    foodLogTableBody.append(emptyTableRow);

    return;
  }

  foodLogArray.forEach((foodEntry) => {
    const entryDateTime = new Date(foodEntry.loggedAt);
    const row = document.createElement("tr");
    const dateCell = document.createElement("td");
    const timeCell = document.createElement("td");
    const foodNameCell = document.createElement("td");
    const amountCell = document.createElement("td");
    const caloriesCell = document.createElement("td");
    const fatCell = document.createElement("td");
    const carbsCell = document.createElement("td");
    const proteinCell = document.createElement("td");
    const actionCell = document.createElement("td");
    const deleteBtn = document.createElement("button");

    dateCell.textContent = entryDateTime.toLocaleDateString();
    row.appendChild(dateCell);

    foodNameCell.textContent = `${foodEntry.brand} ${foodEntry.name}`;
    row.appendChild(foodNameCell);

    amountCell.textContent = foodEntry.amount;
    amountCell.classList.add("number");
    row.appendChild(amountCell);

    caloriesCell.textContent = foodEntry.calories.toFixed(2);
    caloriesCell.classList.add("number");
    row.appendChild(caloriesCell);

    fatCell.textContent = foodEntry.fat.toFixed(2);
    fatCell.classList.add("number");
    row.appendChild(fatCell);

    carbsCell.textContent = foodEntry.carbs.toFixed(2);
    carbsCell.classList.add("number");
    row.appendChild(carbsCell);

    proteinCell.textContent = foodEntry.protein.toFixed(2);
    proteinCell.classList.add("number");
    row.appendChild(proteinCell);

    timeCell.textContent = entryDateTime.toLocaleTimeString();
    row.appendChild(timeCell);

    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("icon-btn");
    deleteBtn.type = "button";
    deleteBtn.setAttribute("data-action", "delete-row");
    deleteBtn.setAttribute("data-food-id", foodEntry.id);
    deleteBtn.addEventListener("click", deleteFoodLogEntry);
    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    foodLogTableBody.appendChild(row);
  });
}

function deleteFoodLogEntry(event) {
  console.log(event.target);
  foodLog = foodLog.filter(
    (foodItem) =>
      foodItem.id !== Number(event.target.getAttribute("data-food-id")),
  );
  console.log(foodLog);
  saveFoodLog();
  renderFoodLog(foodLog);
}

function saveFoodLog() {
  const storedFoodList = JSON.stringify(foodLog);

  localStorage.setItem("foodLog", storedFoodList);
}

function clearFoodLogFormInputs() {
  const foodLogInputsForm = document.querySelector("#food-log-form");

  const inputs = foodLogInputsForm.querySelectorAll("input");

  inputs.forEach((input) => {
    input.value = "";
  });
  isEditingFood = false;
  editingFood = null;
  // saveFoodBtn.textContent = "Save food";
}

function setGoalSource() {
  if (goalSource.value.toLowerCase() !== "calculator") {
    manualGoalOverrides.style.display = "block";
  } else {
    manualGoalOverrides.style.display = "none";
  }
}

function updateDailySummary() {
  goalCalories.textContent = Number(manualCalorieInput.value);
  goalFat.textContent = Number(manualFatInput.value);
  goalCarbs.textContent = Number(manualCarbInput.value);
  goalProtein.textContent = Number(manualProteinInput.value);
}

function updateConsumedCaloriesCount() {
  const initialValue = {
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
  };
  const caloriesSum = foodLog.reduce((accumulator, currentValue) => {
    accumulator.calories += currentValue.calories;
    accumulator.fat += currentValue.fat;
    accumulator.carbs += currentValue.carbs;
    accumulator.protein += currentValue.protein;
    return accumulator;
  }, initialValue);

  consumedCalories.textContent = Math.round(caloriesSum.calories);
  consumedFat.textContent = Math.round(caloriesSum.fat);
  consumedCarbs.textContent = Math.round(caloriesSum.carbs);
  consumedProtein.textContent = Math.round(caloriesSum.protein);
  clearFoodLogFormInputs();
  updateRemainingCaloriesCount();
}

function updateRemainingCaloriesCount() {
  remainingCalories.textContent = Math.round(
    goalCalories.textContent - consumedCalories.textContent,
  );

  remainingFat.textContent = Math.round(
    goalFat.textContent - consumedFat.textContent,
  );

  remainingCarbs.textContent = Math.round(
    goalCarbs.textContent - consumedCarbs.textContent,
  );

  remainingProtein.textContent = Math.round(
    goalProtein.textContent - consumedProtein.textContent,
  );
}

function updateGoalUsedPercentage() {
  // Update consumed percentage
  percentConsumedCalories.textContent = `${(
    Number(consumedCalories.textContent / goalCalories.textContent) * 100
  ).toFixed(1)}%`;

  // Update the progress label
  calorieProgressLabel.textContent = `${consumedCalories.textContent} / ${goalCalories.textContent}`;

  // Update the progress bar
  calorieProgressBar.setAttribute(
    "style",
    `--progress: ${percentConsumedCalories.textContent}`,
  );

  percentConsumedFat.textContent = `${(
    Number(consumedFat.textContent / goalFat.textContent) * 100
  ).toFixed(1)}%`;

  fatProgressLabel.textContent = `${consumedFat.textContent} / ${goalFat.textContent}`;

  fatProgressBar.setAttribute(
    "style",
    `--progress: ${percentConsumedFat.textContent}`,
  );

  percentConsumedCarbs.textContent = `${(
    Number(consumedCarbs.textContent / goalCarbs.textContent) * 100
  ).toFixed(1)}%`;

  carbProgressLabel.textContent = `${consumedCarbs.textContent} / ${goalCarbs.textContent}`;

  carbProgressBar.setAttribute(
    "style",
    `--progress: ${percentConsumedCarbs.textContent}`,
  );

  percentConsumedProtein.textContent = `${(
    Number(consumedProtein.textContent / goalProtein.textContent) * 100
  ).toFixed(1)}%`;

  proteinProgressLabel.textContent = `${consumedProtein.textContent} / ${goalProtein.textContent}`;

  proteinProgressBar.setAttribute(
    "style",
    `--progress: ${percentConsumedProtein.textContent}`,
  );
}

clearFoodLogInputs.addEventListener("click", clearFoodLogFormInputs);
foodSearchInput.addEventListener("input", searchFoodList);
addFoodEntryBtn.addEventListener("click", addFoodEntry);
goalSource.addEventListener("change", setGoalSource);
manualGoalOverrides.addEventListener("input", updateDailySummary);
foodLogTableBody.addEventListener("change", updateConsumedCaloriesCount);
