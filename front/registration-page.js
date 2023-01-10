$(document).ready(() => {
    addEventListeners();
});

function addEventListeners(){
    addTermsListener();

}

function addTermsListener(){
    $("#terms-and-policy-input").on("change",(e) => {
        let SUButton = $("#sign-up");
        SUButton.prop("disabled",!e.target.checked);
        SUButton.prop("title", e.target.checked?"Please confirm the terms and policy.":"Sign up");
    });
}
