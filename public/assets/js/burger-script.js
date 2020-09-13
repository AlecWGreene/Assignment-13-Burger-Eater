let ingredients = [];

// Runtime
$(document).ready(() => {
    // Add event listeners
    $(".burger-option").on("click", ingredientButtonHandler);
});

function displayBurger(arg_images){

}

function getImages(arg_ingredients){
    
}

// Assemble 
function ingredientButtonHandler(arg_event){
    // Prevent default
    arg_event.preventDefault();

    // Get the button text
    let t_text = $(arg_event.target).text().trim();
    
    // Append necessary suffix
    switch(t_text){
        case "Plain":
        case "Sesame":
        case "Pumpernickel":
            t_text + " Bun";
            break;
        case "Single":
        case "Double":
        case "Triple":
            t_text + " Patty";
            break;
        case "Cheese":
        case "Lettuce":
        case "Tomato":
        case "Onions":
        case "Bacon":
        case "Egg":
        case "Pickles":
            break;
        case "Ketchup":
        case "Mustard":
            break;
    }

    // Push the text to the ingredients array
    ingredients.push(t_text);
    console.log(ingredients);
}
