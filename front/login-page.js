

$(document).ready( () => {
    addEventListeners();
})
function addEventListeners(){
    $("#show-password").on("click",togglePW);
    $(".form-control").on("keypress",inputFlow);
    $("#login").on("click",sendForms);
}

function togglePW(){
    let password = document.getElementById("password");
    let toggle = document.getElementById("show-password");
    if(password.type == "password"){
        password.type="text";
        toggle.title = "Hide password"
    }
    else{
        password.type="password";
        toggle.title="Show password";
    }
}

function inputFlow(e){
    let password=$("#password");
    let login=$("#login");
    if(e.charCode == 13){
        if(e.target.id=="email") {
            password.focus()
        }
        else if(e.target.id =="password"){
            login.click()
        }
    }
}

function sendForms(){
    // todo:fill form
    console.log(`todo todo
todo todo todo 
todo todo
todododo`);
}