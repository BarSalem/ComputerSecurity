const req = []
const numbers = []
const letters = []
$(document).ready(() => {
    //todo: delete
    createFakeReq()
    //todo: end delete
    addRowsToTable();
    addEventListeners();
})

function createFakeReq() {
    for (let i = 0; i < 10; i++) {
        numbers.push(i)
    }
    for (let i = 97; i <= 122; i++) {
        letters.push(String.fromCharCode(i))
    }
    for (let i = 0; i < 100; i++) {
        let r = {};
        r.firstName = createFakeObject(letters, 6);
        r.lastName = createFakeObject(letters, 6);
        r.phoneNum = createFakeObject(numbers, 10);
        r.userName = createFakeObject(letters, 6) + createFakeObject(numbers, 3);
        req.push(r);
    }
}

function createFakeObject(list, int) {
    let newString = "";
    for (let i = 0; i < 10; i++) {
        newString += list[Math.floor(Math.random() * list.length)];
    }
    return newString;
}

function addRowsToTable() {
    req.forEach(addRow);
}

function addRow(r) {
    let checkboxTD = createNewElement("td",null,null);
    let firstNameTD = createNewElement("td", null, r.firstName);
    let lastNameTD = createNewElement("td", null, r.lastName);
    let userNameTD = createNewElement("td", null, r.userName);
    let phoneNumTD = createNewElement("td", null, r.phoneNum);
    let checkbox = createNewElement("input", "form-check-input m-0 align-middle check-one", null);
    checkbox.type = "checkbox";
    $(checkboxTD).append(checkbox);
    let tdList = [checkboxTD, firstNameTD, lastNameTD, userNameTD, phoneNumTD];
    let tr = createNewElement("tr");
    tdList.forEach((td) => $(tr).append(td));
    $("#table-content").append(tr);


}

function createNewElement(tag, htmlClass, text) {
    let el = document.createElement(tag);
    if (htmlClass){
        let classes = htmlClass.split(" ");
        classes.forEach((c)=> {el.classList.add(c)});
        }
    if (text) $(el).text(text);
    return el;
}

function addEventListeners(){
    checkAllListener();
}

function checkAllListener(){
    $("select-all").on("change", (e) => {console.log("here");
        $("check-one").forEach((c)=> {c.prop("checked",e.target.prop("checked"))})
    });
}