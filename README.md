# 09 Progressive Web App
*The Final assignment for the ReCode class at NYU's IMA program, Fall 2023.*

## Cookit

Cookit is a recipe app that uses meadDB API. Features include random recipe suggestions, finding recipes by name, and sorting the recipe based on fewer ingredients or shorter instructions. Rather than just fetching recipes based on the name, I wanted to add features such as sorting by the criteria mentioned above or saving favorite recipes.
 
## Installation

Download the repository from this git, run the index.html via the VSCode Live server.

To use the pwa, you should be able to download the app using the browser after you run the code.

## Process of developing

Using the mealDB was easy,
```javascript
async function getRandomMeal() {
    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const responseData = await response.json();
    const randomMeal = responseData.meals[0];

    addMeal(randomMeal, true);
}
```
the API provided a test API key('1') to use the API for free. Further functions are provided with funding the mealDB. This is a function where I used 'random' from the mealDB to generate a random recipe when users first load the app.

To add the sorting feature:
```javascript
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

function countInstructions(meal) {
    return (meal.strInstructions.split('.').length - 1);
}
```
I included functions to count ingredients and instructions. However the way to physically and objectively count the instruction length was difficult, so I decided to count the number of period('.')s from the instructions.
```javascript
if (sortBy === 'lessIngredients') {
        meals = meals.sort((a, b) => countIngredients(a) - countIngredients(b));
    } else if (sortBy === 'shorterInstructions') {
        meals = meals.sort((a, b) => countInstructions(a) - countInstructions(b));
    }
```
While trying the pwa adapt using VSCode Live server, there was a minor issue that the images wouldn't load well. This was resolved by adding the ```crossorigin="anonymous"``` to wherever the code needed to get images.
```javascript
mealElement.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img crossorigin="anonymous"
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"/>
        <p>${mealData.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}</ul>`;

    mealInfoElement.appendChild(mealElement);
```
The web app didn't run well when opening it in mobile enviornment, so I added mobile design to the css, which solved the case.
```javascript
@media screen and (max-width: 600px) {
    header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding: 1rem;
    }

    header input {
        width: calc(100% - 40px); /* Adjust input width */
        margin-bottom: 5px; /* Add some spacing */
    }

    header button {
        flex: 0 0 auto; /* Allow button to grow or shrink */
        margin-left: auto; /* Push button to the right */
    }

    label[for="sort-filter"] {
        width: 100%; /* Make the label full width */

    }

    #sort-filter {
        flex: 0 0 100%; /* Make the select full width */
        margin-top: 5px; /* Add spacing */
    }
}
```
Here is the before and after:

## Running images

