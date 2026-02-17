const RecipeApp = (() => {
  // ----------------- Recipe Data -----------------
  const recipes = [
    {
      id: 1,
      title: "Spaghetti",
      difficulty: "easy",
      time: 20,
      ingredients: ["pasta", "tomato sauce", "salt", "olive oil"],
      steps: ["Boil water", "Add pasta", "Drain", "Add sauce"]
    },
    {
      id: 2,
      title: "Chicken Curry",
      difficulty: "medium",
      time: 45,
      ingredients: ["chicken", "spices", "onion", "tomatoes"],
      steps: [
        "Prepare chicken",
        {
          text: "Make curry",
          substeps: [
            "Heat oil",
            "Add onions",
            {
              text: "Add spices",
              substeps: ["Add cumin", "Add turmeric", "Add chili"]
            },
            "Add tomatoes",
            "Add chicken and simmer"
          ]
        },
        "Serve hot"
      ]
    },
    {
      id: 3,
      title: "Salad",
      difficulty: "easy",
      time: 10,
      ingredients: ["lettuce", "tomato", "cucumber", "olive oil"],
      steps: ["Chop vegetables", "Mix together", "Add dressing"]
    },
    {
      id: 4,
      title: "Beef Stew",
      difficulty: "hard",
      time: 120,
      ingredients: ["beef", "potatoes", "carrots", "onion", "broth"],
      steps: ["Cut beef", "Brown beef", "Add vegetables", "Simmer 2 hours"]
    },
    {
      id: 5,
      title: "Pancakes",
      difficulty: "easy",
      time: 15,
      ingredients: ["flour", "milk", "egg", "sugar", "baking powder"],
      steps: ["Mix ingredients", "Heat pan", "Pour batter", "Flip pancakes"]
    },
    {
      id: 6,
      title: "Omelette",
      difficulty: "easy",
      time: 10,
      ingredients: ["eggs", "salt", "pepper", "butter", "cheese"],
      steps: ["Beat eggs", "Heat pan", "Pour eggs", "Add fillings", "Fold omelette"]
    },
    {
      id: 7,
      title: "Tomato Soup",
      difficulty: "medium",
      time: 30,
      ingredients: ["tomatoes", "onion", "garlic", "vegetable stock"],
      steps: ["Chop vegetables", "Saute onion and garlic", "Add tomatoes", "Add stock", "Simmer 20 minutes", "Blend soup"]
    },
    {
      id: 8,
      title: "Grilled Cheese",
      difficulty: "easy",
      time: 10,
      ingredients: ["bread", "cheese", "butter"],
      steps: ["Butter bread", "Add cheese", "Grill until golden"]
    }
  ];

  // ----------------- State -----------------
  let currentFilter = "all";
  let currentSort = "none";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites") || "[]");

  // ----------------- DOM References -----------------
  const recipeContainer = document.getElementById("recipe-container");
  const filterButtons = document.querySelectorAll(".filter-buttons button");
  const sortButtons = document.querySelectorAll(".sort-buttons button");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");
  const recipeCounter = document.getElementById("recipe-counter");

  // ----------------- Filter/Sort -----------------
  const filterByDifficulty = (recipes, difficulty) => {
    if(difficulty === "all") return [...recipes];
    if(difficulty === "favorites") return recipes.filter(r => favorites.includes(r.id));
    if(difficulty === "quick") return recipes.filter(r => r.time <= 30);
    return recipes.filter(r => r.difficulty === difficulty);
  };

  const filterBySearch = (recipes, query) => {
    if(!query) return recipes;
    const lower = query.toLowerCase();
    return recipes.filter(r => r.title.toLowerCase().includes(lower) || r.ingredients.some(i => i.toLowerCase().includes(lower)));
  };

  const sortByName = recipes => [...recipes].sort((a,b)=>a.title.localeCompare(b.title));
  const sortByTime = recipes => [...recipes].sort((a,b)=>a.time - b.time);
  const applySort = (recipes, sortType) => {
    switch(sortType){
      case "name": return sortByName(recipes);
      case "time": return sortByTime(recipes);
      default: return [...recipes];
    }
  };
  const applyFilter = (recipes, filterType) => filterByDifficulty(recipes, filterType);

  // ----------------- Recursive Steps -----------------
  const renderSteps = (steps) => {
    let html = "<ul>";
    steps.forEach(step => {
      if(typeof step === "string") html += `<li>${step}</li>`;
      else if(step.substeps) html += `<li>${step.text}${renderSteps(step.substeps)}</li>`;
      else html += `<li>${step.text}</li>`;
    });
    html += "</ul>";
    return html;
  };

  // ----------------- Recipe Card -----------------
  const createRecipeCard = (recipe) => `
    <div class="recipe-card">
      <h3>${recipe.title}</h3>
      <button class="favorite-btn ${favorites.includes(recipe.id) ? 'favorited':''}" data-id="${recipe.id}">❤️</button>
      <p>Difficulty: ${recipe.difficulty}</p>
      <p>Time: ${recipe.time} mins</p>
      <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">Show Steps</button>
      <div class="steps-container" id="steps-${recipe.id}">${renderSteps(recipe.steps)}</div>
      <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">Show Ingredients</button>
      <div class="ingredients-container" id="ingredients-${recipe.id}">
        <ul>${recipe.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul>
      </div>
    </div>
  `;

  // ----------------- Render -----------------
  const renderRecipes = (recipesToRender) => {
    recipeContainer.innerHTML = recipesToRender.map(createRecipeCard).join("");
    recipeCounter.textContent = `Showing ${recipesToRender.length} of ${recipes.length} recipes`;
  };

  const updateActiveButtons = () => {
    filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === currentFilter));
    sortButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.sort === currentSort));
  };

  // ----------------- Display -----------------
  const updateDisplay = () => {
    let result = [...recipes];
    result = filterBySearch(result, searchQuery);
    result = applyFilter(result, currentFilter);
    result = applySort(result, currentSort);
    renderRecipes(result);
    updateActiveButtons();
  };

  // ----------------- Event Handlers -----------------
  let debounceTimer;
  const handleSearch = (e) => {
    clearTimeout(debounceTimer);
    const val = e.target.value;
    debounceTimer = setTimeout(() => {
      searchQuery = val.trim();
      clearSearchBtn.style.display = searchQuery ? "inline" : "none";
      updateDisplay();
    }, 300);
  };

  const handleClearSearch = () => {
    searchQuery = "";
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    updateDisplay();
  };

  const handleToggleClick = (e) => {
    if(e.target.classList.contains("toggle-btn")){
      const recipeId = e.target.dataset.recipeId;
      const toggleType = e.target.dataset.toggle;
      const container = document.getElementById(`${toggleType}-${recipeId}`);
      container.classList.toggle("visible");
      e.target.textContent = container.classList.contains("visible")
        ? `Hide ${toggleType.charAt(0).toUpperCase()+toggleType.slice(1)}`
        : `Show ${toggleType.charAt(0).toUpperCase()+toggleType.slice(1)}`;
    }

    if(e.target.classList.contains("favorite-btn")){
      const id = parseInt(e.target.dataset.id);
      toggleFavorite(id);
    }
  };

  const toggleFavorite = (id) => {
    if(favorites.includes(id)) favorites = favorites.filter(f => f !== id);
    else favorites.push(id);
    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
    updateDisplay();
  };

  // ----------------- Setup -----------------
  const setupEventListeners = () => {
    filterButtons.forEach(btn => btn.addEventListener("click", () => { currentFilter = btn.dataset.filter; updateDisplay(); }));
    sortButtons.forEach(btn => btn.addEventListener("click", () => { currentSort = btn.dataset.sort; updateDisplay(); }));
    searchInput.addEventListener("input", handleSearch);
    clearSearchBtn.addEventListener("click", handleClearSearch);
    recipeContainer.addEventListener("click", handleToggleClick);
  };

  const init = () => {
    console.log("RecipeApp initializing...");
    setupEventListeners();
    updateDisplay();
    console.log("RecipeApp ready!");
  };

  return { init, updateDisplay };
})();

document.addEventListener("DOMContentLoaded", RecipeApp.init);
