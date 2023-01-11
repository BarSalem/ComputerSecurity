$(document).ready(() => {
    addEventListeners();
});

function addEventListeners(){
    $(".form-footer").on('keypress', inputFlow)
    $("#sign-up").on("click",
    function register(){
        $("#sign-up").submit()
    });
    addTermsListener();

}

function addTermsListener(){
    $("#terms-and-policy-input").on("change",(e) => {
        let SUButton = $("#sign-up");
        SUButton.prop("disabled",!e.target.checked);
        SUButton.prop("title", e.target.checked?"Please confirm the terms and policy.":"Sign up");
    });
}


function formSubmitListener(){
    // Get the form input values
    $("#sign-up").on("submit", (e) =>{
        e.preventDefault()
    
    let user_email = document.getElementById("email").value;
    let fname = document.getElementById("firsst-name").value;
    let lname = document.getElementById("last-name").value;
    let user_phone = document.getElementById("phone-number").value;
    let user_password = document.getElementById("password").value;
    if(!isValidEmail(user_email)){
        alert("Invalid email address format");
        return;
    }
    else{
        console.log(fname,lname,user_email, user_password,user_phone)
        sendPOSTRequestRegister(fname,lname,user_email, user_password,user_phone);
    }
    });
}

function sendPOSTRequestRegister(fname,lname, user_email, user_password, user_phone) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/register',
        data: {
            fname: fname,
            lname: lname,
            user_email: user_email,
            user_password: user_password,
            user_phone: user_phone
        },
        success: function(response) {
            if (response.result == 'redirect') window.location.replace("http://localhost:8080" + response.url);
            alert(response.message)
        },
        error: function(error) {
            console.log(error);
        }
    });
}
