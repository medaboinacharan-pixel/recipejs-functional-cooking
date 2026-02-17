// IIFE Module Pattern
const RecipeApp = (() => {
    console.log("RecipeApp initializing...");

    // ======= Recipe Data =======
    const recipes = [
        {
            id: 1,
            title: "Spaghetti Bolognese",
            difficulty: "easy",
            time: 25,
            ingredients: ["Spaghetti", "Tomato Sauce", "Ground Beef", "Onion", "Garlic"],
            steps: [
                "Boil water",
                "Cook spaghetti",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Heat oil",
                        "Add onion and garlic",
                        "Add ground beef",
                        {
                            text: "Add spices",
                            substeps: ["Salt", "Pepper", "Italian herbs"]
                        },
                        "Add tomato sauce and simmer"
                    ]
                },
                "Mix spaghetti with sauce",
                "Serve hot"
            ]
        },
        {
            id: 2,
            title: "Grilled Cheese Sandwich",
            difficulty: "easy",
            time: 10,
            ingredients: ["Bread", "Cheese", "Butter"],
            steps: ["Butter bread", "Place cheese between slices", "Grill until golden"]
        },
        {
            id: 3,
            title: "Chicken Curry",
            difficulty: "medium",
            time: 45,
            ingredients: ["Chicken", "Curry Powder", "Onion", "Garlic", "Coconut Milk"],
            steps: [
                "Cut chicken into pieces",
                "Saute onion and garlic",
                {
                    text: "Cook chicken",
                    substeps: [
                        "Add chicken pieces",
                        "Add curry powder",
                        "Pour coconut milk",
                        "Simmer 30 minutes"
                    ]
                },
                "Garnish and serve"
            ]
        },
        {
            id: 4,
            title: "Pancakes",
            difficulty: "easy",
            time: 20,
            ingredients: ["Flour", "Milk", "Eggs", "Sugar", "Butter"],
            steps: ["Mix ingredients", "Heat pan", "Pour batter", "Cook both sides", "Serve with syrup"]
        },
        {
            id: 5,
            title: "Beef Stew",
            difficulty: "hard",
            time: 90,
            ingredients: ["Beef", "Carrots", "Potatoes", "Onions", "Beef Stock"],
            steps: [
                "Cut vegetables",
                {
                    text: "Brown beef",
                    substeps: ["Season beef", "Heat oil", "Sear beef chunks"]
                },
                "Add vegetables and stock",
                "Simmer for 1.5 hours",
                "Serve warm"
            ]
        },
        {
            id: 6,
            title: "Caesar Salad",
            difficulty: "easy",
            time: 15,
            ingredients: ["Lettuce", "Croutons", "Parmesan", "Caesar Dressing"],
            steps: ["Wash lettuce", "Toss with dressing", "Add croutons and parmesan", "Serve fresh"]
        },
        {
            id: 7,
            title: "Vegetable Stir Fry",
            difficulty: "medium",
            time: 25,
            ingredients: ["Broccoli", "Carrots", "Bell Pepper", "Soy Sauce", "Garlic"],
            steps: ["Chop vegetables", "Heat oil", "Stir fry garlic", "Add vegetables", "Add soy sauce", "Serve hot"]
        },
        {
            id: 8,
            title: "Chocolate Cake",
            difficulty: "hard",
            time: 60,
            ingredients: ["Flour", "Cocoa Powder", "Sugar", "Eggs", "Butter"],
            steps: [
                "Preheat oven",
                "Mix dry ingredients",
                "Add wet ingredients",
                {
                    text: "Bake cake",
                    substeps: ["Pour batter in pan", "Bake for 40 minutes", "Cool before serving"]
                }
            ]
        }
    ];

    // ======= State =======
    let currentFilter = "all";
    let currentSort = "none";

    // ======= DOM References =======
    const recipeContainer = document.getElementById("recipe-container");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const sortButtons = document.querySelectorAll("[data-sort]");

    // ======= Filter Functions =======
    const filterByDifficulty = (recipes, level) =>
        recipes.filter(recipe => recipe.difficulty === level);

    const filterByTime = (recipes, maxTime) =>
        recipes.filter(recipe => recipe.time <= maxTime);

    const applyFilter = (recipes, filterType) => {
        switch (filterType) {
            case "easy": return filterByDifficulty(recipes, "easy");
            case "medium": return filterByDifficulty(recipes, "medium");
            case "hard": return filterByDifficulty(recipes, "hard");
            case "quick": return filterByTime(recipes, 30);
            case "all": default: return [...recipes];
        }
    };

    // ======= Sort Functions =======
    const sortByName = (recipes) => [...recipes].sort((a, b) => a.title.localeCompare(b.title));
    const sortByTime = (recipes) => [...recipes].sort((a, b) => a.time - b.time);

    const applySort = (recipes, sortType) => {
        switch (sortType) {
            case "name": return sortByName(recipes);
            case "time": return sortByTime(recipes);
            case "none":
            default: return [...recipes];
        }
    };

    // ======= Recursive Steps Rendering =======
    const renderSteps = (steps, level = 0) => {
        const ol = document.createElement("ol");
        steps.forEach(step => {
            const li = document.createElement("li");
            if (typeof step === "string") {
                li.textContent = step;
            } else if (typeof step === "object" && step.text) {
                li.textContent = step.text;
                if (step.substeps) {
                    li.appendChild(renderSteps(step.substeps, level + 1));
                }
            }
            if (level > 0) li.classList.add("substep");
            ol.appendChild(li);
        });
        return ol;
    };

    // ======= Create Recipe Card =======
    const createRecipeCard = (recipe) => {
        const card = document.createElement("div");
        card.className = "recipe-card";

        card.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
            <p><strong>Time:</strong> ${recipe.time} min</p>
            <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">Show Steps</button>
            <div class="steps-container" id="steps-${recipe.id}"></div>
            <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">Show Ingredients</button>
            <div class="ingredients-container" id="ingredients-${recipe.id}">
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
            </div>
        `;

        const stepsContainer = card.querySelector(`#steps-${recipe.id}`);
        stepsContainer.appendChild(renderSteps(recipe.steps));

        return card;
    };

    // ======= Render Recipes =======
    const renderRecipes = (recipesToRender) => {
        recipeContainer.innerHTML = "";
        recipesToRender.forEach(recipe => {
            recipeContainer.appendChild(createRecipeCard(recipe));
        });
    };

    // ======= Update Display =======
    const updateDisplay = () => {
        let updated = applyFilter(recipes, currentFilter);
        updated = applySort(updated, currentSort);
        renderRecipes(updated);
        updateActiveButtons();
    };

    // ======= Update Active Button States =======
    const updateActiveButtons = () => {
        filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === currentFilter));
        sortButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.sort === currentSort));
    };

    // ======= Event Delegation for Toggles =======
    const handleToggleClick = (event) => {
        const btn = event.target.closest(".toggle-btn");
        if (!btn) return;

        const recipeId = btn.dataset.recipeId;
        const toggleType = btn.dataset.toggle;
        const container = document.getElementById(`${toggleType}-${recipeId}`);
        if (!container) return;

        container.classList.toggle("visible");
        btn.textContent = container.classList.contains("visible") 
            ? `Hide ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}` 
            : `Show ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`;
    };

    // ======= Event Listeners =======
    const setupEventListeners = () => {
        filterButtons.forEach(btn => btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter;
            updateDisplay();
        }));

        sortButtons.forEach(btn => btn.addEventListener("click", () => {
            currentSort = btn.dataset.sort;
            updateDisplay();
        }));

        recipeContainer.addEventListener("click", handleToggleClick);
    };

    // ======= Initialize App =======
    const init = () => {
        updateDisplay();
        setupEventListeners();
        console.log("Event listeners attached!");
        console.log("RecipeApp ready!");
    };

    return { init, updateDisplay };
})();

// Initialize App
RecipeApp.init();
