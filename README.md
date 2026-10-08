# Calorie Tracker — HTML/CSS JavaScript Practice Project

This project is a website version of the provided `Calorie Tracker.xlsx` workbook.

## What is included

- `index.html` — Daily Tracking
- `setup.html` — Calorie & Macro Calculator
- `foods.html` — Foods Database
- `weight.html` — Weight Progress
- `history.html` — Tracking History
- `instructions.html` — User flow + suggested JavaScript build order
- `styles.css` — Shared responsive styles

There is intentionally **no JavaScript** in the starter.

## Run it

You can open `index.html` directly in a browser. For a more realistic development workflow, open the folder in VS Code and use a simple local server such as Live Server.

## Good first JavaScript exercise

Create `app.js`, link it from `setup.html`, and make the **Calculate goals** button update the calculated results.

Useful element IDs already in the HTML:

- `height-feet`
- `height-inches`
- `body-weight`
- `age`
- `gender`
- `workout-days`
- `goal`
- `macro-preference`
- `calculate-goals`
- `bmr-value`
- `activity-multiplier-value`
- `maintenance-calories-value`
- `target-calories-value`
- `protein-goal-value`
- `fat-goal-value`
- `carb-goal-value`
- `macro-split-value`
- `adjustment-value`

## Workbook logic to recreate

### Activity multiplier

| Workout days | Multiplier |
|---|---:|
| 0 | 1.2 |
| 1–2 | 1.375 |
| 3–4 | 1.55 |
| 5–6 | 1.725 |
| 7 | 1.9 |

### Goal adjustment

- Cutting: maintenance - 500 calories
- Maintaining: no adjustment
- Bulking: maintenance + 500 calories

### Macro splits

- Moderate Carb: 30% protein / 35% fat / 35% carbs
- Lower Carb: 40% protein / 40% fat / 20% carbs
- Higher Carb: 30% protein / 20% fat / 50% carbs

Protein and carbs contain 4 calories per gram. Fat contains 9 calories per gram.

### Food scaling

When a food is saved with nutrition for a serving size in grams:

`scale = grams eaten / serving size`

Multiply calories, fat, carbs, and protein by that scale.

## Suggested learning sequence

1. Event listeners and reading input values
2. Functions and conditional logic
3. Arrays and objects
4. DOM creation/rendering
5. Add/edit/delete operations
6. Array methods (`find`, `filter`, `map`, `reduce`)
7. `localStorage`
8. Date filtering
9. Updating progress bars
10. Drawing the weight SVG from stored data
11. Refactoring into modules

Try each step yourself before asking for the solution. That will make this project much more useful as practice.
