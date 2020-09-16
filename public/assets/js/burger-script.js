let currentZIndex = 0, currentBurgerId = 0, totalBurgerCount = 0;

// Runtime
$(document).ready(() => {
    // Add event listeners
    $(".burger-option").on("click", ingredientButtonHandler);

    // Cycle through burger listeners
    $("#prev-btn").on("click", {direction: -1}, moveButtonHandler);
    $("#next-btn").on("click", {direction: 1}, moveButtonHandler);

    // burger mutation button listeners
    $("#save-btn").on("click", saveButtonHandler);
    $("#view-btn").on("click", viewButtonHandler);
    $("#reset-btn").on("click", resetButtonHandler);

    $.ajax("/api-burger/get/all",{
        method: "GET"
    }).then(arg_response => {
        totalBurgerCount = arg_response.length;
    });
});

// BURGER RENDERING METHODS
// =============================================

// Cycles through burger selections
function moveButtonHandler(arg_event){
    // Get the direction
    let t_direction = arg_event.data.direction;

    // Display burger if it's not zero
    currentBurgerId += t_direction % (totalBurgerCount + 1);

    // Display next 
    if(currentBurgerId === 0){
        resetButtonHandler();
    }
    else{  
        getBurger(currentBurgerId).then(arg_data => {
            // Change the burger name
            $("#burger-name").val(arg_data.burger_name);

            // Render burger
            renderBurger(arg_data.ingredients);
            
            // Highlight the burger selections
            for(let i = 0; i < 15; i++){
                let t_div = $(".burger-option")[i];
                if(arg_data.ingredients.includes($(t_div).text().trim())){
                    $(t_div).addClass("active");
                }
                else{
                    $(t_div).removeClass("active");
                }
            }
        });
    }
}

// Make ajax calls for saving burger data
function saveButtonHandler(){
    let ingredients = [];

    // Get the burger names
    let t_name = $("#burger-name").val().trim();

    // Assemble selected ingredients
    for(let t_ingredient of $(".burger-option.active")){
        ingredients.push($(t_ingredient).text().trim());
    }

    // Update the db with either a new burger or updating the currently viewed one
    if(currentBurgerId != 0){
        $.ajax("/api-burger/update/" + currentBurgerId, {
            method: "POST",
            data: {
                burgerName: t_name,
                ingredients: ingredients
            }
        });
    }
    else{
        $.ajax("/api-burger/post",{
            method: "POST",
            data: {
                burgerName: t_name,
                ingredients: ingredients
            }
        }).then(arg_response => currentBurgerId = arg_response.insertId);
    }
}

// Display burger based on selection
function viewButtonHandler(arg_event){
    let ingredients = [];

    // Assemble selected ingredients
    for(let t_ingredient of $(".burger-option.active")){
        ingredients.push($(t_ingredient).text().trim());
    }

    // Call render method
    renderBurger(ingredients);
}

// Open a blank burger creation view
function resetButtonHandler(){
    currentBurgerId = 0;

    clearBurger();

    $(".burger-option").removeClass("active");
}

// Assemble the button selections
function ingredientButtonHandler(arg_event){
    // Prevent default
    arg_event.preventDefault();

    // Get button text
    let t_text = $(arg_event.target).text().trim();

    // If it's a bun only allow one to be selected
    if(["Plain","Sesame","Pumpernickel"].includes(t_text)){
        for(let i = 1; i <= 3; i++){
            if($($("#buns").children()[i]).text().trim() != t_text){
                $($("#buns").children()[i]).removeClass("active");
            }
            else{
                $($("#buns").children()[i]).addClass("active");
            }
        }
    }
    // If it's a patty only allow one to be selected
    else if(["Single","Double","Triple"].includes(t_text)){
        for(let i = 1; i <= 3; i++){
            if($($("#patties").children()[i]).text().trim() != t_text){
                $($("#patties").children()[i]).removeClass("active");
            }
            else{
                $($("#patties").children()[i]).addClass("active");
            }
        }
    }
    else{
        if($(arg_event.target).hasClass("active")){
            $(arg_event.target).removeClass("active")
        }
        else{
            $(arg_event.target).addClass("active")
        }
    }
}

function renderBurger(arg_ingredients){ 
    clearBurger();

    // Get bun selection
    if(arg_ingredients.includes("Plain")){
        renderIngredient("Plain_Bottom");
    }
    else if(arg_ingredients.includes("Pumpernickel")){
        renderIngredient("Pumpernickel_Bottom");
    }
    else if(arg_ingredients.includes("Sesame")){
        renderIngredient("Sesame_Bottom");
    }

    // Render patties
    if(arg_ingredients.includes("Single")){
        renderIngredient("Patty");
    }
    if(arg_ingredients.includes("Double")){
        renderIngredient("Patty");
        renderIngredient("Patty");
    }
    if(arg_ingredients.includes("Triple")){
        renderIngredient("Patty");
        renderIngredient("Patty");
        renderIngredient("Patty");
    }

    // Sauce
    if(arg_ingredients.includes("Ketchup")){
        renderIngredient("Ketchup");
    }
    if(arg_ingredients.includes("Mustard")){
        renderIngredient("Mustard");
    }

    // Ingredients
    if(arg_ingredients.includes("Cheese")){
        renderIngredient("Cheese");
    }
    if(arg_ingredients.includes("Lettuce")){
        renderIngredient("Lettuce");
    }
    if(arg_ingredients.includes("Tomato")){
        renderIngredient("Tomato");
    }
    if(arg_ingredients.includes("Onions")){
        renderIngredient("Onions");
    }
    if(arg_ingredients.includes("Bacon")){
        renderIngredient("Bacon");
    }
    if(arg_ingredients.includes("Egg")){
        renderIngredient("Egg");
    }
    if(arg_ingredients.includes("Pickles")){
        renderIngredient("Pickles");
    }

    // Finish the burger
    if(arg_ingredients.includes("Plain")){
        renderIngredient("Plain_Top");
    }
    else if(arg_ingredients.includes("Pumpernickel")){
        renderIngredient("Pumpernickel_Top");
    }
    else if(arg_ingredients.includes("Sesame")){
        renderIngredient("Sesame_Top");
    }
}

// Remove current displayed ingredients
function clearBurger(){
    $(".burger-ingredient").remove();
}

function renderIngredient(arg_ingredient){
    let $img = $("<img>").addClass("burger-ingredient").css("display","none");
    
    switch(arg_ingredient){
        case "Plain_Bottom":
            $img.attr("src","Burger_Bottom_Bun.png").css("margin-bottom", "-190px").css("z-index","1");
            currentZIndex = 2;
            break;
        case "Pumpernickel_Bottom":
            $img.attr("src","Burger_Bottom_Bun_Pumpernickel.png").css("margin-bottom", "-190px").css("z-index","1");
            currentZIndex = 2;
            break;
        case "Sesame_Bottom":
            $img.attr("src","Burger_Bottom_Bun_Sesame.png").css("margin-bottom", "-190px").css("z-index","1");
            currentZIndex = 2;
            break;
        case "Plain_Top":
            $img.attr("src","Burger_Top_Bun.png").css("margin-bottom", "-115px").css("z-index","17");
            currentZIndex = 2;
            break;
        case "Pumpernickel_Top":
            $img.attr("src","Burger_Top_Bun_Pumpernickel.png").css("margin-bottom", "-115px").css("z-index","17");
            currentZIndex = 2;
            break;
        case "Sesame_Top":
            $img.attr("src","Burger_Top_Bun_Sesame.png").css("margin-bottom", "-115px").css("z-index","17");
            currentZIndex = 2;
            break;
        case "Patty":
            $img.attr("src","Patty.png").css("margin-bottom", "-115px").css("z-index",currentZIndex);
            currentZIndex++;
            break;
        case  "Cheese":
            $img.attr("src","Cheese.png").css("margin-bottom", "-136px").css("z-index",currentZIndex);
            currentZIndex++;
            break;
        case "Lettuce":
            $img.attr("src","Lettuce.png").css("margin-bottom", "-136px").css("z-index",currentZIndex);
            currentZIndex++;
            break;
        case "Tomato":
            $img.attr("src","Tomato.png").css("margin-bottom", "-156px").css("z-index",currentZIndex);
            currentZIndex++;
            break;
        case "Onions":
            $img.attr("src","Onions.png").css("margin-bottom", "-125px").css("margin-top","30px").css("z-index",currentZIndex);
            currentZIndex++;
            break;
        case "Bacon":
            $img.attr("src","Bacon.png").css("margin-bottom", "-136px").css("z-index",currentZIndex);
            currentZIndex++;
            break;
        case "Egg":
            $img.attr("src","Egg.png").css("margin-bottom", "-136px").css("z-index",currentZIndex);
            currentZIndex++;
            break;
        case "Pickles":
            $img.attr("src","Pickles.png").css("margin-bottom", "-135px").css("margin-top","-30px").css("z-index",currentZIndex);
            currentZIndex++;
            break;
        case "Ketchup":
            $img.attr("src","Ketchup.png").css("margin-bottom", "-136px").css("z-index",currentZIndex);
            currentZIndex++;
            break;
        case "Mustard":
            $img.attr("src","Mustard.png").css("margin-bottom", "-136px").css("z-index",currentZIndex);
            currentZIndex++;
            break;
    }

    // Display ingerdient
    $(".burger-slider").prepend($img);
    $img.offset({top: 0 });
    $img.css("display","block");

    return;
}



// AJAX CALLS
// =============================================

// Call database for specific burger
function getBurger(arg_id){
    return new Promise(arg_resolve => {
        $.ajax("/api-burger/get/" + arg_id, {
            method: "GET"
        }).then(arg_data => arg_resolve(arg_data[0]));
    });
}

