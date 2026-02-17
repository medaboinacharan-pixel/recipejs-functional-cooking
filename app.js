// =========================
// RECIPE DATA (PART 1)
// =========================
const recipes = [
    { id:1, title:"Classic Spaghetti Carbonara", time:25, difficulty:"easy", description:"Creamy Italian pasta with eggs and cheese." },
    { id:2, title:"Chicken Tikka Masala", time:45, difficulty:"medium", description:"Tender chicken in spiced tomato sauce." },
    { id:3, title:"Homemade Croissants", time:180, difficulty:"hard", description:"Buttery, flaky French pastries." },
    { id:4, title:"Greek Salad", time:15, difficulty:"easy", description:"Fresh vegetables with feta cheese." },
    { id:5, title:"Beef Wellington", time:120, difficulty:"hard", description:"Beef fillet wrapped in puff pastry." },
    { id:6, title:"Vegetable Stir Fry", time:20, difficulty:"easy", description:"Mixed vegetables in savory sauce." },
    { id:7, title:"Pad Thai", time:30, difficulty:"medium", description:"Thai noodles with shrimp and peanuts." },
    { id:8, title:"Margherita Pizza", time:60, difficulty:"medium", description:"Classic pizza with mozzarella and basil." }
];

// =========================
// STATE (PART 2)
// =========================
let currentFilter = "all";
let currentSort = "none";

// =========================
// DOM SELECTION
// =========================
const recipeContainer = document.querySelector("#recipe-container");
const filterButtons = document.querySelectorAll("[data-filter]");
const sortButtons = document.querySelectorAll("[data-sort]");

// =========================
// CREATE CARD
// =========================
const createRecipeCard = (recipe) => `
    <div class="recipe-card">
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
            <span>⏱ ${recipe.time} min</span>
            <span class="difficulty ${recipe.difficulty}">
                ${recipe.difficulty}
            </span>
        </div>
        <p>${recipe.description}</p>
    </div>
`;

// =========================
// RENDER
// =========================
const renderRecipes = (recipeList) => {
    recipeContainer.innerHTML =
        recipeList.map(createRecipeCard).join("");
};

// =========================
// FILTER FUNCTION
// =========================
const applyFilter = (recipeList, filterType) => {
    switch(filterType) {
        case "easy":
        case "medium":
        case "hard":
            return recipeList.filter(r => r.difficulty === filterType);
        case "quick":
            return recipeList.filter(r => r.time < 30);
        default:
            return recipeList;
    }
};

// =========================
// SORT FUNCTION
// =========================
const applySort = (recipeList, sortType) => {
    switch(sortType) {
        case "name":
            return [...recipeList].sort((a,b) =>
                a.title.localeCompare(b.title)
            );
        case "time":
            return [...recipeList].sort((a,b) =>
                a.time - b.time
            );
        default:
            return recipeList;
    }
};

// =========================
// UPDATE DISPLAY
// =========================
const updateDisplay = () => {
    let updated = recipes;
    updated = applyFilter(updated, currentFilter);
    updated = applySort(updated, currentSort);
    renderRecipes(updated);
};

// =========================
// ACTIVE BUTTONS
// =========================
const updateActiveButtons = () => {

    filterButtons.forEach(btn => {
        btn.classList.remove("active");
        if(btn.dataset.filter === currentFilter){
            btn.classList.add("active");
        }
    });

    sortButtons.forEach(btn => {
        btn.classList.remove("active");
        if(btn.dataset.sort === currentSort){
            btn.classList.add("active");
        }
    });
};

// =========================
// EVENTS
// =========================
filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        currentFilter = e.target.dataset.filter;
        updateActiveButtons();
        updateDisplay();
    });
});

sortButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        currentSort = e.target.dataset.sort;
        updateActiveButtons();
        updateDisplay();
    });
});

// =========================
// INITIAL LOAD
// =========================
updateDisplay();
