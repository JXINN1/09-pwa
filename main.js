const mealsElement = document.getElementById("meals");
const favoriteContainerElement = document.getElementById("fav-meals");
const mealPopupElement = document.getElementById("meal-popup");
const mealInfoElement = document.getElementById("meal-info");
const closePopupButton = document.getElementById("close-popup");
const searchTermInput = document.getElementById("search-term");
const searchButton = document.getElementById("search");

getRandomMeal();
fetchFavoriteMeals();
/*show random meal at the first page*/
async function getRandomMeal() {
    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const responseData = await response.json();
    const randomMeal = responseData.meals[0];

    addMeal(randomMeal, true);
}
/*get meal by id*/
async function getMealById(id) {
    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );

    const responseData = await response.json();
    const meal = responseData.meals[0];

    return meal;
}
/*meal search - searched by the term, sort option included*/
async function getMealsBySearch(term, sortBy) {
    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
    );

    const responseData = await response.json();
    let meals = responseData.meals;

    if (sortBy === 'lessIngredients') {
        meals = meals.sort((a, b) => countIngredients(a) - countIngredients(b));
    } else if (sortBy === 'shorterInstructions') {
        meals = meals.sort((a, b) => countInstructions(a) - countInstructions(b));
    }

    return meals;
}
/*count the number of ingredients*/
function countIngredients(meal) {
    let count = 0;
    for (let i = 1; i <= 20; i++) {
        if (meal["strIngredient" + i]) {
            count++;
        } else {
            break;
        }
    }
    return count;
}
/*count instructions - easiest way was to count the dot(.)s used in the instructions*/
function countInstructions(meal) {
    return (meal.strInstructions.split('.').length - 1);
}
/*add meal, show it in the order*/
function addMeal(mealData, isRandom = false) {
    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = `
        <div class="meal-header">
            ${isRandom ? `<span class="random"> Random Recipe </span>` : ""}
            <img crossorigin="anonymous"
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"/>
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn"><i class="fas fa-heart"></i></button>
        </div>`;

    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealFromLocalStorage(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealToLocalStorage(mealData.idMeal);
            btn.classList.add("active");
        }

        fetchFavoriteMeals();
    });

    meal.addEventListener("click", () => {
        showMealInformation(mealData);
    });

    mealsElement.appendChild(meal);
}
/*add meal to the local storage*/
function addMealToLocalStorage(mealId) {
    const mealIds = getMealsFromLocalStorage();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealFromLocalStorage(mealId) {
    const mealIds = getMealsFromLocalStorage();

    localStorage.setItem(
        "mealIds",
        JSON.stringify(mealIds.filter((id) => id !== mealId))
    );
}
/*get meals*/
function getMealsFromLocalStorage() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

/*add favorite meals*/
function addFavoriteMeal(mealData) {
    const favMeal = document.createElement("li");

    favMeal.innerHTML = `
        <img crossorigin="anonymous"
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"/><span>${mealData.strMeal}</span>
        <button class="clear"><i class="fas fa-window-close"></i></button>`;

    const btn = favMeal.querySelector(".clear");

    btn.addEventListener("click", () => {
        removeMealFromLocalStorage(mealData.idMeal);

        fetchFavoriteMeals();
    });

    favMeal.addEventListener("click", () => {
        showMealInformation(mealData);
    });

    favoriteContainerElement.appendChild(favMeal);
}

/*get favorite meals*/
async function fetchFavoriteMeals() {
    favoriteContainerElement.innerHTML = "";

    const mealIds = getMealsFromLocalStorage();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);

        addFavoriteMeal(meal);
    }
}
/*show meal info*/
function showMealInformation(mealData) {
    mealInfoElement.innerHTML = "";

    const mealElement = document.createElement("div");

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
            ingredients.push(`${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`);
        } else {
            break;
        }
    }

    mealElement.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img crossorigin="anonymous"
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"/>
        <p>${mealData.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}</ul>`;

    mealInfoElement.appendChild(mealElement);

    mealPopupElement.classList.remove("hidden");
}
/* click event add */
searchButton.addEventListener("click", async () => {
    mealsElement.innerHTML = "";

    const search = searchTermInput.value;
    const sortBy = document.getElementById('sort-filter').value;

    const meals = await getMealsBySearch(search, sortBy);

    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        });
    }
});


closePopupButton.addEventListener("click", () => {
    mealPopupElement.classList.add("hidden");
});
