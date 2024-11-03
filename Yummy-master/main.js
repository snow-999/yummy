"use strict";

let data = document.getElementById("data");
let mealDetails = document.getElementById("mealDetails");
let categories = document.getElementById("categories");
let categoriesList = document.getElementById("categoriesList");
let areaList = document.getElementById("areaList");
let ingredientsList = document.getElementById("ingredientsList");

$("document").ready(() => {
  $("#loading").fadeOut(2000, () => {
    $("body").css("overflow", "auto");
  });
});

// @ ====================> side-nav <==============================

$(".side-nav").css("left", -$(".side-nav-inner").innerWidth());
$("#closeIcon").fadeOut(0);
$(".side-nav ul li").css("top", 150);

let left = $(".side-nav-inner").innerWidth();

function closeSideNav() {
  $(".side-nav").css("left", -left);
  $("#closeIcon").fadeOut(0);
  $("#openIcon").fadeIn(0);
  $(".side-nav ul li").animate({ top: 150 }, 80);
}

function openSideNav() {
  $(".side-nav").css("left", 0);
  $("#closeIcon").fadeIn(0);
  $("#openIcon").fadeOut(0);
  for (let i = 0; i < 6; i++) {
    $(".side-nav ul li")
      .eq(i)
      .animate({ top: 0 }, (i + 2) * 80);
  }
}

$(".menuIcon").click(() => {
  if ($(".side-nav").css("left") === "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

$("#theme").click(() => {
  let mode = $("body").attr("data-bs-theme");
  if (mode === "dark") {
    $("body").attr("data-bs-theme", "light");
    $("#theme span").text("theme: Light");
  } else {
    $("body").attr("data-bs-theme", "dark");
    $("#theme span").text("theme: Dark");
  }
});

// @ <==================================================>

// ? ====================> categories & meals <==============================

$("#mealDetails").fadeOut(0);
$("#categories").fadeOut(0);

$("#closeCategories").click(() => {
  $("#categories").fadeOut(300);
  $("#data").css("opacity", 1);
});

$("#categoriesLink").click(() => {
  getCategories();
  closeSideNav();
});

getCategoryMeals("Seafood");

// // <==================================================>

function displayMeals(meals) {
  data.innerHTML = meals
    .map(
      (meal) => `<div class="col-md-3">
              <div class="card rounded-2" onclick="getMealDetails('${meal.idMeal}')">
                <img src="${meal.strMealThumb}" alt="Meal" />
                <div class="overlay text-center">
                <h5 class="fs-5 text-white">${meal.strMeal}</h5>
              </div>
            </div>
          </div>`
    )
    .join("");
}

async function getCategoryMeals(category) {
  $("#loading").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));

  $("#loading").fadeOut(300);
}

async function getMealDetails(mealID) {
  $("#loading").fadeIn(300);

  $("#mealDetails").fadeIn(300), $("#data").css("opacity", "0.2");

  // searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  response = await response.json();

  displayMealDetails(response.meals[0]);

  $("#loading").fadeOut(300);
}

function displayMealDetails(meal) {
  // !--------------------------------------------------ingredients--------------------------------------------------

  let ingredients = "";

  for (let i = 0; i < 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-light m-1 py-1 px-2">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  // !--------------------------------------------------tags--------------------------------------------------

  let tags = meal.strTags?.split(",") ?? [];
  let tagsStr = "";

  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
    <li class="alert alert-light m-1 py-1 px-2">${tags[i]}</li>`;
  }

  // !--------------------------------------------------inner html--------------------------------------------------

  let box = `
  <div class="bg-body-tertiary rounded-3 shadow p-5 overflow-auto">
  <i
    id="closeBtn"
    class="fa-solid fa-xmark p-3 rounded-3 shadow text-dark fs-5"
    onclick="$('#mealDetails').fadeOut(300), $('#data').css('opacity', '1')"
  ></i>
  <div class="row">
    <div class="col-md-4 mb-3 mb-md-0">
      <div>
        <img
          src="${meal.strMealThumb}"
          alt="meal"
          class="img-fluid rounded-3 shadow border"
        />
        <h2 class="mt-2 text-warning fw-bold">${meal.strMeal}</h2>
      </div>
    </div>
    <div class="col-md-8">
      <h3 class="fw-bold text-warning">Instructions</h3>
      <p>${meal.strInstructions}</p>

      <h5 class="mt-2">
        <span class="fw-bold text-warning">Area : </span>${meal.strArea}
      </h5>

      <h5 class="mt-2">
        <span class="fw-bold text-warning">Category : </span>${meal.strCategory}
      </h5>

      <h5 class="mt-2 fw-bold text-warning">Recipes :</h5>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${ingredients}
      </ul>

      <h5 class="mt-2 fw-bold text-warning">Tags :</h5>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${tagsStr}
      </ul>

      <a
        target="_blank"
        href="${meal.strSource}"
        class="btn btn-primary mt-2 me-1"
        ><i class="fa-solid fa-link me-2"></i>Source</a
      >
      <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger mt-2"
        ><i class="fa-brands fa-youtube me-2"></i>Youtube</a
      >
    </div>
  </div>
</div>
`;

  mealDetails.innerHTML = box;
}

// & categories ==========>

async function getCategories() {
  $("#loading").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();

  displayCategories(response.categories);

  $("#loading").fadeOut(300);
}

function displayCategories(categories) {
  $("#data").css("opacity", 0.3);

  categoriesList.innerHTML = categories
    .map(
      (category) =>
        `
  <div class="col-sm-12 col-md-6 col-lg-4">
      <div class="card rounded-2" onclick="getCategoryMeals('${
        category.strCategory
      }'); $('#data').css('opacity', '1'); $('#categories').fadeOut(300)">
        <img src="${category.strCategoryThumb}" alt="Category" />
        <div class="overlay text-center">
        <h4>${category.strCategory}</h4>
        <p>${category.strCategoryDescription
          .split(" ")
          .slice(0, 20)
          .join(" ")}...</p>
        </div>
      </div>
    </div>
  `
    )
    .join(" ");

  $("#categories").fadeIn(300);
}

// ?<==================================================>

// ^ ====================> area <==============================

$("#area").fadeOut(0);

$("#closeArea").click(() => {
  $("#area").fadeOut(300);
  $("#data").css("opacity", 1);
});

$("#areaLink").click(() => {
  getArea();
  closeSideNav();
});

// // <==================================================>

async function getArea() {
  $("#loading").fadeIn(300);

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  respone = await respone.json();

  displayArea(respone.meals);

  $("#loading").fadeOut(300);
}

async function getAreaMeals(area) {
  $("#loading").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));

  $("#loading").fadeOut(300);
}

function displayArea(area) {
  $("#data").css("opacity", 0.3);

  areaList.innerHTML = area
    .map(
      (data) => `
  <div class="col-md-3">
    <div class="card rounded-2 text-center py-3" onclick="getAreaMeals('${data.strArea}'); $('#data').css('opacity', '1'); $('#area').fadeOut(300)">
      <i class="fa-solid fa-earth-americas fa-3x mb-3"></i>
      <h4 class="mb-0">${data.strArea}</h4> 
    </div>
  </div>
  `
    )
    .join(" ");

  $("#area").fadeIn(300);
}

// ^<==================================================>

// , ====================> ingredients <==============================

$("#ingredients").fadeOut(0);

$("#closeIngredients").click(() => {
  $("#ingredients").fadeOut(300);
  $("#data").css("opacity", 1);
});

$("#ingredientsLink").click(() => {
  getIngredients();
  closeSideNav();
});

// // <==================================================>

async function getIngredients() {
  $("#loading").fadeIn(300);

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  respone = await respone.json();

  displayIngredients(respone.meals.slice(0, 20));

  $("#loading").fadeOut(300);
}

async function getIngredientsMeals(ingredients) {
  $("#loading").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));

  $("#loading").fadeOut(300);
}

function displayIngredients(ingredient) {
  $("#data").css("opacity", 0.3);

  ingredientsList.innerHTML = ingredient
    .map(
      (data) =>
        `
        <div class="col-md-3">
          <div class="card rounded-2" onclick="getIngredientsMeals('${
            data.strIngredient
          }'); $('#data').css('opacity', '1'); $('#ingredients').fadeOut(300)">
            <img src="https://www.themealdb.com/images/ingredients/${
              data.strIngredient
            }.png" alt="ingredient" />
            <div class="overlay text-center">
            <h4>${data.strIngredient}</h4>
            <p>${data.strDescription.split(" ").slice(0, 20).join(" ")}...</p>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  $("#ingredients").fadeIn(300);
}

// ,<==================================================>

// ~ ====================> search <==============================

$("#search").fadeOut(0);

$("#closeSearch").click(() => {
  $("#search").fadeOut(300);
});

$("#searchLink").click(() => {
  closeSideNav();
  $("#search").fadeIn(300);
});

async function searchByName(term) {
  // $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  response = await response.json();

  displayMeals(response.meals);

  // $(".inner-loading-screen").fadeOut(300);
}

async function searchByFLetter(term) {
  // $(".inner-loading-screen").fadeIn(300);

  if (term === "") {
    term = "l";
  } else {
    term = term;
  }

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  response = await response.json();

  displayMeals(response.meals);

  // $(".inner-loading-screen").fadeOut(300);
}

// ~<==================================================>

// @ ====================> contact us <==============================

$("#contact").fadeOut(0);

$("#contact input").keyup(() => {
  inputsValidation();
});

$("#nameWarning").fadeOut(0);
$("#emailWarning").fadeOut(0);
$("#phoneWarning").fadeOut(0);
$("#ageWarning").fadeOut(0);
$("#passwordWarning").fadeOut(0);
$("#rePasswordWarning").fadeOut(0);

$("#closeContact").click(() => {
  $("#contact").fadeOut(300);
  $("#data").css("opacity", 1);
});

$("#contactUs").click(() => {
  closeSideNav();
  $("#data").css("opacity", 0.3);
  $("#contact").fadeIn(300);
});

let submitBtn = document.getElementById("submitBtn");

function inputsValidation() {
  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.classList.remove("disabled");
    $("#submitBtn").css("cursor", "pointer");
  } else {
    submitBtn.classList.add("disabled");
    $("#submitBtn").css("cursor", "not-allowed");
  }
}

function nameValidation() {
  return /^[a-zA-Z ]+$/.test($("#uName").val());
}

$("#uName").keyup(() => {
  if (nameValidation()) {
    $("#nameWarning").fadeOut(300);
  } else {
    $("#nameWarning").fadeIn(300);
  }
});

function emailValidation() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("email").value
  );
}

$("#email").keyup(() => {
  if (emailValidation()) {
    $("#emailWarning").fadeOut(300);
  } else {
    $("#emailWarning").fadeIn(300);
  }
});

function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    document.getElementById("phone").value
  );
}

$("#phone").keyup(() => {
  if (phoneValidation()) {
    $("#phoneWarning").fadeOut(300);
  } else {
    $("#phoneWarning").fadeIn(300);
  }
});

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    document.getElementById("age").value
  );
}

$("#age").keyup(() => {
  if (ageValidation()) {
    $("#ageWarning").fadeOut(300);
  } else {
    $("#ageWarning").fadeIn(300);
  }
});

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("password").value
  );
}

$("#password").keyup(() => {
  if (passwordValidation()) {
    $("#passwordWarning").fadeOut(300);
  } else {
    $("#passwordWarning").fadeIn(300);
  }
});

function repasswordValidation() {
  return (
    document.getElementById("rePassword").value ===
    document.getElementById("password").value
  );
}

$("#rePassword").keyup(() => {
  if (repasswordValidation()) {
    $("#rePasswordWarning").fadeOut(300);
  } else {
    $("#rePasswordWarning").fadeIn(300);
  }
});
