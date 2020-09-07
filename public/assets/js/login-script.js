// REGISTRATION METHODS
// ============================================================

function registerHandler(arg_event){
    // Prevent default
    arg_event.preventDefault();
    console.log("Event data: ", arg_event.data);

    // Register user
    $.ajax({
        url: "/api-login/register",
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(arg_event.data)
    });
}

// LOGIN METHODS
// ============================================================

// Handle login attempt
function loginHandler(arg_event){

    // Prevent event's default
    arg_event.preventDefault();
    console.log("Event data: ", arg_event.data);
    
    // Send login request
    $.ajax({
        url: "/api-login/login",
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(arg_event.data)
    });
}

// Add event listeners
$("#login-form").on("submit", { username: $("#input-username").val(), password: $("#input-password").val() }, loginHandler);
$("#register-form").on("submit", { username: $("#register-username").val(), password: $("#register-password").val(), display: $("#register-display").val() }, registerHandler);