// ounces conversion
const ouncesInput = document.querySelector("#ounces");
const gramsResult = document.querySelector("#grams-result");

// New food inputs
const foodNameInput = document.querySelector("#food-name");
const servingSizeInput = document.querySelector("#serving-size");
const caloriesInput = document.querySelector("#food-calories");
const foodFatInput = document.querySelector("#food-fat");
const foodCarbsInput = document.querySelector("#food-carbs");
const foodProteinInput = document.querySelector("#food-protein");
const foodNotesInput = document.querySelector("#food-notes");
const foodBrandInput = document.querySelector("#food-brand");
const uploadFoodListInput = document.querySelector("#upload-foods-input");

// New food save and clear buttons
const saveFoodBtn = document.querySelector("#save-food");
const clearFoodFormBtn = document.querySelector("#clear-food-form");

// New food table elements
const tableBody = document.querySelector("#foods-table-body");

// food search input
const foodSearchInput = document.querySelector("#food-search");

// table headers
const tableHeader = document.querySelectorAll("#headers-row > th");

let foods = [];
loadFoodList();
let editingFood = null;
let isEditingFood = false;
let currentSortingColumn = null;
let sortAscending = true;
const incrementId = incrementFoodId();
renderFoodList(alphabetizeFoods(foods));

function incrementFoodId() {
  let foodId = 0;
  if (foods.length !== 0) {
    foodId = Math.max(...foods.map((food) => food.id));
    ++foodId;
  }

  return function increment() {
    return foodId++;
  };
}

function convertOuncesToGrams(ounceInput) {
  return (ounceInput * 28.3495).toFixed(2);
}

function updateGrams(event) {
  if (event.target.value === "") {
    gramsResult.value = "";
    return;
  }
  gramsResult.value = convertOuncesToGrams(Number(event.target.value));
}

function addToFoodsList() {
  const form = document.querySelector("#food-database-form");
  const formInputs = form.querySelectorAll("input");

  for (let i = 0; i < formInputs.length - 1; i++) {
    if (formInputs[i].required && formInputs[i].value === "") {
      window.alert(
        "Missing " + formInputs[i].previousElementSibling.textContent,
      );
      return;
    }
  }
  if (isEditingFood) {
    const updatedFood = foods.find((foodItem) => editingFood === foodItem.id);

    updatedFood.name = foodNameInput.value;
    updatedFood.brand = foodBrandInput.value;
    updatedFood.servingSize = Number(servingSizeInput.value);
    updatedFood.calories = Number(caloriesInput.value);
    updatedFood.fat = Number(foodFatInput.value);
    updatedFood.carbs = Number(foodCarbsInput.value);
    updatedFood.protein = Number(foodProteinInput.value);
    updatedFood.notes = foodNotesInput.value;
  } else {
    const newFood = {
      id: incrementId(),
      name: foodNameInput.value,
      brand: foodBrandInput.value,
      servingSize: Number(servingSizeInput.value),
      calories: Number(caloriesInput.value),
      fat: Number(foodFatInput.value),
      carbs: Number(foodCarbsInput.value),
      protein: Number(foodProteinInput.value),
      notes: foodNotesInput.value,
    };

    foods.push(newFood);
  }
  saveFoodList();
  renderFoodList(alphabetizeFoods(foods));
  clearFoodFormInputs();
  isEditingFood = false;
  editingFood = null;
  saveFoodBtn.textContent = "Save food";
}

function clearFoodFormInputs() {
  const foodInputsForm = document.querySelector("#food-database-form");

  const inputs = foodInputsForm.querySelectorAll("input");

  inputs.forEach((input) => {
    input.value = "";
  });
  isEditingFood = false;
  editingFood = null;
  saveFoodBtn.textContent = "Save food";
}

function deleteFoodItem(event) {
  foods = foods.filter(
    (foodItem) =>
      foodItem.id !== Number(event.target.getAttribute("data-food-id")),
  );
  saveFoodList();
  renderFoodList(alphabetizeFoods(foods));
  // window.alert("DELETE!");
}

function editFoodItem(event) {
  isEditingFood = true;
  editingFood = Number(event.target.getAttribute("data-food-id"));
  saveFoodBtn.textContent = "Update food";

  const editFood = foods.find(
    (foodItem) =>
      foodItem.id === Number(event.target.getAttribute("data-food-id")),
  );

  foodNameInput.value = editFood.name;
  foodBrandInput.value = editFood.brand;
  servingSizeInput.value = editFood.servingSize;
  caloriesInput.value = editFood.calories;
  foodFatInput.value = editFood.fat;
  foodCarbsInput.value = editFood.carbs;
  foodProteinInput.value = editFood.protein;
  foodNotesInput.value = editFood.notes;
}

function renderFoodList(foodListArray) {
  tableBody.textContent = "";

  if (foodListArray.length === 0) {
    const emptyTableRow = document.createElement("tr");
    const emptyTableCell = document.createElement("td");
    emptyTableCell.colSpan = 9;
    emptyTableCell.textContent = "No foods found.";
    emptyTableRow.appendChild(emptyTableCell);
    tableBody.append(emptyTableRow);

    return;
  }

  foodListArray.forEach((food) => {
    // New food table elements
    const row = document.createElement("tr");
    const foodNameCell = document.createElement("td");
    const foodBrandCell = document.createElement("td");
    const servingSizeCell = document.createElement("td");
    const caloriesCell = document.createElement("td");
    const fatCell = document.createElement("td");
    const carbsCell = document.createElement("td");
    const proteinCell = document.createElement("td");
    const notesCell = document.createElement("td");
    const buttonsCell = document.createElement("td");
    const editFoodBtn = document.createElement("button");
    const deleteFoodBtn = document.createElement("button");
    const buttonsWrapper = document.createElement("div");

    foodNameCell.textContent = food.name;
    row.appendChild(foodNameCell);

    foodBrandCell.textContent = food.brand;
    row.appendChild(foodBrandCell);

    servingSizeCell.textContent = food.servingSize;
    servingSizeCell.classList.add("number");
    row.append(servingSizeCell);

    caloriesCell.textContent = food.calories;
    caloriesCell.classList.add("number");
    row.append(caloriesCell);

    fatCell.textContent = food.fat;
    fatCell.classList.add("number");
    row.append(fatCell);

    carbsCell.textContent = food.carbs;
    carbsCell.classList.add("number");
    row.append(carbsCell);

    proteinCell.textContent = food.protein;
    proteinCell.classList.add("number");
    row.append(proteinCell);

    notesCell.textContent = food.notes;
    notesCell.classList.add("muted");
    row.append(notesCell);

    buttonsWrapper.classList.add("table-actions");

    editFoodBtn.textContent = "Edit";
    editFoodBtn.setAttribute("type", "button");
    editFoodBtn.setAttribute("data-action", "edit-food");
    editFoodBtn.setAttribute("data-food-id", food.id);
    editFoodBtn.classList.add("icon-btn");
    editFoodBtn.addEventListener("click", editFoodItem);
    buttonsWrapper.appendChild(editFoodBtn);

    deleteFoodBtn.textContent = "Delete";
    deleteFoodBtn.setAttribute("type", "button");
    deleteFoodBtn.setAttribute("data-action", "delete-food");
    deleteFoodBtn.setAttribute("data-food-id", food.id);
    deleteFoodBtn.classList.add("icon-btn");
    buttonsWrapper.appendChild(deleteFoodBtn);
    deleteFoodBtn.addEventListener("click", deleteFoodItem);
    buttonsCell.appendChild(buttonsWrapper);
    row.append(buttonsCell);

    tableBody.appendChild(row);
  });
}

function saveFoodList() {
  const storedFoodList = JSON.stringify(foods);

  localStorage.setItem("foods", storedFoodList);
}

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

function searchFoodList(event) {
  const userInput = event.target.value.toLowerCase();

  const foodSearch = foods.filter(
    (food) =>
      food.name.toLowerCase().includes(userInput) ||
      food.brand.toLowerCase().includes(userInput),
  );

  renderFoodList(foodSearch);
}

function sortFoodList(event) {
  const getHeaderId = event.currentTarget.id;
  const currentSearchInput = foodSearchInput.value.toLowerCase();

  if (getHeaderId === currentSortingColumn) {
    sortAscending = !sortAscending;
  } else {
    currentSortingColumn = getHeaderId;
    sortAscending = true;
  }

  const foodsToSort = foods.filter((food) =>
    food.name.toLowerCase().includes(currentSearchInput),
  );

  const sortedArray = foodsToSort.sort((a, b) => {
    if (typeof a[getHeaderId] === "number" && sortAscending === true) {
      return a[getHeaderId] - b[getHeaderId];
    } else if (typeof a[getHeaderId] !== "number" && sortAscending === true) {
      return a[getHeaderId].localeCompare(b[getHeaderId]);
    } else if (typeof a[getHeaderId] === "number" && sortAscending === false) {
      return b[getHeaderId] - a[getHeaderId];
    } else if (typeof a[getHeaderId] !== "number" && sortAscending === false) {
      return b[getHeaderId].localeCompare(a[getHeaderId]);
    }
  });

  renderFoodList(sortedArray);
}

function alphabetizeFoods(foodListArray) {
  const arr = [...foodListArray];

  arr.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return arr;
}

function handleFoodListFileUpload(event) {
  const file = event.target.files[0];
  // console.log(file);

  if (!file) {
    window.alert("No file selected. Please choose a file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const fileContents = reader.result;

    const fileRow = fileContents.split("\n");

    const headerRow = fileRow[0].toLowerCase().trim();

    console.log(headerRow);

    const headerRowArray = headerRow.split(",");

    console.log(headerRowArray);

    const trimmedWhiteSpaceHeaders = headerRowArray.map((item) => item.trim());

    console.log(trimmedWhiteSpaceHeaders);

    const calorieHeaderIndex = trimmedWhiteSpaceHeaders.indexOf("calories"); // index 3
    const foodNameHeaderIndex = trimmedWhiteSpaceHeaders.indexOf("food name"); // index 0

    if (calorieHeaderIndex === -1 || foodNameHeaderIndex === -1) {
      // window.alert("File is missing Calories or Food Name column.");

      return;
    }
    for (let i = 1; i < fileRow.length; i++) {
      // console.log(fileRow[i]);

      const rowItem = fileRow[i].trim().split(",");

      console.log(rowItem, "ROW ITEM");
      console.log(rowItem.length);
      newFoodFromFile = {
        id: incrementId(),
        name: rowItem[0].trim(),
        brand: rowItem[1].trim(),
        servingSize: Number(rowItem[2].trim()),
        calories: Number(rowItem[3].trim()),
        fat: Number(rowItem[4].trim()),
        carbs: Number(rowItem[5].trim()),
        protein: Number(rowItem[6].trim()),
        notes: rowItem[7].trim(),
      };
      foods.push(newFoodFromFile);
    }

    console.log(foods);
  };

  reader.readAsText(file);
}

saveFoodBtn.addEventListener("click", addToFoodsList);
clearFoodFormBtn.addEventListener("click", clearFoodFormInputs);
ouncesInput.addEventListener("input", updateGrams);
foodSearchInput.addEventListener("input", searchFoodList);
tableHeader.forEach((header) => header.addEventListener("click", sortFoodList));
uploadFoodListInput.addEventListener("change", handleFoodListFileUpload);
