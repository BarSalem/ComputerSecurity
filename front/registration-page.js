$(document).ready(() => {
    addEventListeners();
});

function addEventListeners() {
    addTermsListener();
    jumpLinesListener();
    signUpListener();

}

function addTermsListener() {
    $("#terms-and-policy-input").on("change", (e) => {
        let SUButton = $("#sign-up");
        SUButton.prop("disabled", !e.target.checked);
        SUButton.prop("title", e.target.checked ? "Please confirm the terms and policy." : "Sign up");
    });
}

function jumpLinesListener(){
    $(".form-control").on('keydown',(e) =>{console.log(1);
        if (e.which == 13) {
            e.preventDefault();
            let index = e.target.classList[1];
            if(index == 6) {
                if (!$("#sign-up").prop("disabled"))
                    $("#sign-up").click();
            } else
                $(".form-control."+(Number(index)+1)+"").focus();
        }
    });
}
function signUpListener(){
    $("#sign-up").on("click",()=>{
        console.log(1);
    })
}