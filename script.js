const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const favoriteMeals = document.getElementById("favorite-meals");
const favOpenBtn = document.getElementById('favorite-opn');
const favArray =[];


//event listeners
searchBtn.addEventListener("click", getMealList);
searchBtn.addEventListener("keypress", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
    mealDetailsContent.parentElement.classList.remove("showRecipe")
});
favOpenBtn.addEventListener("click", displayFavSection);

const section = document.getElementById("favorite-id");
section.style.display = "none";
function displayFavSection(){
    if (section.style.display === "none"){
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

//get meal list that matches with the ingredients
//The use of .then() 2 times reason: 1st one returns the response the 2nd one actualy works with the data.
function getMealList(){
    let searchInputTxt = document.getElementById("search-input").value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json()).then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="food">
                </div>
                <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href="#" class="recipe-btn" data-id="${meal.idMeal}"> Get Recipe</a>
                </div>
            </div>
                `
            });
            mealList.classList.remove("notFound")
        } else{
            // When we cant find the Ingradients then we add the notFound class to that element class so our CSS can work on that element.
            html = "Sorry, we didn't found any meal!";
            mealList.classList.add("notFound")
        }
        mealList.innerHTML = html;
    })
}

//get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains("recipe-btn")){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
        // favArray.push(mealItem.dataset.id);
    }
}


//create a modal
function mealRecipeModal(meal){
    if (meal && Array.isArray(meal) && meal.length > 0) {
        meal = meal[0];
    }
    let html = `
    <h2 class="recipe-title">Me>${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="" />
    </div>
    <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    </div>
    <button class="fav-recipe-btn" type="button" data-id="${meal.idMeal}">Favourite</button>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add("showRecipe")
}


// Function to add a meal to favorites
function addMealToFavorites(meal) {
    if (meal && typeof meal === 'object') {
        if (favArray.includes(meal.idMeal)) {
            return;
        }
        let html = `
        <div class="favorite-meal-item" data-id="${meal.idMeal}">
            <div class="favorite-img" id="fav-img">
                <img src="${meal.strMealThumb}" alt="food">
            </div>
            <div class="favorite-name">
                <h3>${meal.strMeal}</h3>
                <button class="remove-favorite-btn"> Remove from Favorites</button>
            </div>
        </div>
        `;
        favoriteMeals.innerHTML += html;
        favArray.push(meal.idMeal);
        setTimeout(alert('Meal added to Favorite!'), 2000);
    } else {
        console.error('Invalid meal data:', meal);
    }
}


// Event listener to add meal to favorites
mealDetailsContent.addEventListener("click", (e) => {
    if (e.target.classList.contains("fav-recipe-btn")) {
        let mealItem = e.target;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals !== null) {
                const meal = data.meals[0];
                addMealToFavorites(meal);
            } else {
                console.error('No meal data found for the given ID');
            }
        })
        .catch(error => {
            console.error('Error fetching meal data:', error);
        });
    }
});

// Event listener to remove meal from favorites
favoriteMeals.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-favorite-btn")) {
        e.target.parentElement.parentElement.remove();
    }
});
