let confLen;
let confData;
fetch("../configuration.json")
    .then(response => response.json())
    .then(data => {
        confLen = data.length;
        confData = data;
    });
var strength = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
$(document).ready(() => {
    addEventListeners();
});


function addEventListeners() {
    addTermsListener();
    jumpLinesListener();
    signUpListener();
    let password = $("#password");
    password.on("keyup", passwordCheck())
    password.on("keydown", passwordCheck())
}

function passwordCheck() {
    let password = $("#password");
    var meter = $("#password-strength-meter");
    var text = $("#password-strength-text");
    let val = password.val();
    let specialRegEx = /[!@#\$%\^\&*\)\(+=._-]/;
    let numbersRegEx = /\d/;
    let upperLowerRegEx = /^(?=.*[a-z])(?=.*[A-Z])/;
    if (val === "") {
        meter.addClass("invisible");
        text.addClass("invisible");
    } else {
        meter.removeClass("invisible");
        text.removeClass("invisible");
        if (!specialRegEx.test(val)) {
            meter.val(0);
            text.text("Please use special characters (!#!@$^%&)");
        } else if (!numbersRegEx.test(val)) {
            meter.val(0);
            text.text("Please use at least one number in your password");
        } else if (!upperLowerRegEx.test(val)) {
            meter.val(0);
            text.text("Please use both upper and lowe case letters");
        } else if (val.length < confLen) {
            meter.val(0);
            text.text("Please use at least 10 characters in your password");
        } else {
            let result = zxcvbn(val);
            if (result.feedback.warning) {
                text.text(result.feedback.warning);
                meter.val(0);
            } else {
                text.text("Strength: " + strength[result.score]);
                meter.val(result.score);
            }
        }
    }
}

function addTermsListener() {
    $("#terms-and-policy-input").on("change", (e) => {
        let SUButton = $("#sign-up");
        SUButton.prop("disabled", !e.target.checked);
        SUButton.prop("title", e.target.checked ? "Please confirm the terms and policy." : "Sign up");
    });
}

function jumpLinesListener() {
    $(".form-control").on('keydown', (e) => {
        if (e.which == 13) {
            e.preventDefault();
            let index = e.target.classList[1];
            if (index == 6) {
                if (!$("#sign-up").prop("disabled"))
                    $("#sign-up").click();
            } else
                $(".form-control." + (Number(index) + 1)).focus();
        }
    });
}

function signUpListener() {
    $("#sign-up").on("click", (e) => {
        e.preventDefault();
        if($("#password").val()===$("#password-redo").val()){
            let dontSend = false

            //send Request
        }
        console.log(1);
    })
}


function validateInput(input,type){
    switch (type){
        case "text":
            let nameRegEx = /^[a-zA-Z .'-]+$/;
            return nameRegEx.test(input);

        case "email":
            let emailRegEx =/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let domainRegEx= /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
            let XSSRegEx = /^[^<>&]*$/;
            if(!emailRegEx.test(input) || !domainRegEx.test(input) || !XSSRegEx.test(input));
            return true
            return false
        case "phone":
            let phoneRegEx =/^[0-9]{9}$/;
            return phoneRegEx.test(input);
    }
}




