const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");

// Function to fetch and display recipes
const fetchRecipe = async (query) => {
  recipeContainer.innerHTML = "<h1>Fetching Recipes...</h1>"; 

  
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    // Clear the recipe container before displaying new recipes
    recipeContainer.innerHTML = ""; 

    // Check if there are meals in the response
    if (response.meals) {
      response.meals.forEach(meal => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add('recipe');

        recipeDiv.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h2>${meal.strMeal} (${meal.strArea})</h2>
        `;

        const button = document.createElement("button");
        button.textContent = "View Recipe";
        recipeDiv.appendChild(button);

        // Event listener to show detailed recipe info
        button.addEventListener("click", () => {
          showRecipeDetails(meal);
        });

        recipeContainer.appendChild(recipeDiv);
      });
    } else {
      // If no meals found, show a message
      recipeContainer.innerHTML = "<h2>No recipes found. Please try a different search term.</h2>";
    }
  } catch (error) {
    recipeContainer.innerHTML = "<h2>Error fetching recipes. Please try again later.</h2>";
  }
};

// Function to show detailed recipe information
const showRecipeDetails = (meal) => {
  recipeContainer.innerHTML = `
    <div class="recipe-detail">
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>
      <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
      <h3>Ingredients:</h3>
      <ul>
        ${getIngredientsList(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
      <button class="backBtn">Back to Results</button>
    </div>
  `;

  // Back button event listener
  const backBtn = document.querySelector(".backBtn");
  backBtn.addEventListener("click", () => {
    fetchRecipe(searchBox.value.trim() || 'chicken'); // Return to search results or default query
  });
};

// Function to extract ingredients and measurements
const getIngredientsList = (meal) => {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }
  return ingredients;
};

// Event listener for the search button
searchBtn.addEventListener("click", () => {
  const searchInput = searchBox.value.trim();

  // Check if the search input is not empty
  if (searchInput) {
    fetchRecipe(searchInput);
  } else {
    recipeContainer.innerHTML = "<h2>Please enter a search term.</h2>";
  }
});

// Fetch default recipe (chicken) when the page loads
window.addEventListener("load", () => {
  fetchRecipe("chicken");
});
