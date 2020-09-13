let ingredients = [];
let renderedIngredients = [];
let currentIndex = 0;

// Runtime
$(document).ready(() => {
    // Add event listeners
    $(".burger-option").on("click", ingredientButtonHandler);
});



// Assemble the button selections
function ingredientButtonHandler(arg_event){
    // Prevent default
    arg_event.preventDefault();

    // Get button text
    let t_text = $(arg_event.target).text().trim();
    console.log(t_text);

    // If it's a bun only allow one to be selected
    if(["Plain","Sesame","Pumpernickel"].includes(t_text)){
        for(let i = 1; i <= 3; i++){
            console.log($($("#buns").children()[i]).text().trim());
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
            console.log($($("#patties").children()[i]).text().trim());
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
    // Render each ingredient
    for(let i = 0; i < arg_ingredients.length; i++){
        renderIngredient(t_ingredient);
    }
}

async function renderIngredient(arg_ingredient){
    let $img = $("<img>").addClass("burger-ingredient").css("display","none");
    
    switch(arg_ingredient){
        case "Plain_Bottom":
            $img.attr("src","Burger_Bottom_Bun.png").css("margin-bottom", "-200px").css("z-index","1");
            currentIndex = 2;
            break;
        case "Pumpernickel_Bottom":
            $img.attr("src","Burger_Bottom_Bun_Pumpernickel.png").css("margin-bottom", "-200px").css("z-index","1");
            currentIndex = 2;
            break;
        case "Sesame_Bottom":
            $img.attr("src","Burger_Bottom_Bun_Sesame.png").css("margin-bottom", "-200px").css("z-index","1");
            currentIndex = 2;
            break;
        case "Patty":
            $img.attr("src","Patty.png").css("margin-bottom", "-100px").css("z-index",currentIndex);
            currentIndex++;
            break;
        case  "Cheese":
            $img.attr("src","Cheese.png").css("margin-bottom", "-136px").css("z-index",currentIndex);
            currentIndex++;
            break;
        case "Lettuce":
            $img.attr("src","Lettuce.png").css("margin-bottom", "-136px").css("z-index",currentIndex);
            currentIndex++;
            break;
        case "Tomato":
            $img.attr("src","Tomato.png").css("margin-bottom", "-156px").css("z-index",currentIndex);
            currentIndex++;
            break;
        case "Onions":
            $img.attr("src","Onions.png").css("margin-bottom", "-136px").css("z-index",currentIndex);
            currentIndex++;
            break;
        case "Bacon":
            $img.attr("src","Bacon.png").css("margin-bottom", "-136px").css("z-index",currentIndex);
            currentIndex++;
            break;
        case "Egg":
            $img.attr("src","Egg.png").css("margin-bottom", "-136px").css("z-index",currentIndex);
            currentIndex++;
            break;
        case "Pickles":
            $img.attr("src","Pickles.png").css("margin-bottom", "-156px").css("z-index",currentIndex);
            currentIndex++;
            break;
        case "Ketchup":
            $img.attr("src","Ketchup.png").css("margin-bottom", "-136px").css("z-index",currentIndex);
            currentIndex++;
            break;
        case "Mustard":
            $img.attr("src","Mustard.png").css("margin-bottom", "-136px").css("z-index",currentIndex);
            currentIndex++;
            break;
    }

    // Display ingerdient at top of div
    $(".burger-slider").prepend($img);
    $img.offset({top: 0 });
    $img.css("display","block");

    // Signal end of animation
    renderedIngredients.push(arg_ingredient);
    return;
}

function sortIngredients(){
    let t_array = [];

}