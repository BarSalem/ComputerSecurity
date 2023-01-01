let req = [];
const numbers = [];
const letters = [];
let totalRows;
const itemsPerPage = 50;
let startPage = new URL(location.href).searchParams.get('page');
startPage = !startPage||Number(startPage)<1 ? 1: Number(startPage);
$(document).ready(() => {
    //todo: delete
    createFakeReq();
    //todo: end delete
    //todo: remove '//'

    //sendRequest(startPage);

    //todo: end remove '//'
    addRowsToTable();
    addTableNav();
    addEventListeners();
})

function sendRequest(start) {
    let firstRow = (start - 1) * 50;
    //todo: add request;
}

function createFakeReq() {
    req = [];
    totalRows = 999;
    for (let i = 0; i < 10; i++) {
        numbers.push(i)
    }
    for (let i = 97; i <= 122; i++) {
        letters.push(String.fromCharCode(i))
    }
    for (let i = 0; i < 50; i++) {
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

function addTableNav() {
    let totalPages = Math.ceil(totalRows / itemsPerPage);
    let nav = '<ul id="page-nav" class="pagination m-0 ms-auto">';
    if (startPage > 1) {
        nav += '<li id="prev" class="page-item"><a class="page-link" href="#" data-page="' + (startPage - 1) + '">' +
            '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><polyline points="15 6 9 12 15 18"></polyline></svg>' +
            'prev' + '</a></li>';
    }
    let start = Math.max(1, startPage - 2);
    let end = Math.min(totalPages, startPage + 2);
    for (let i = start; i <= end; i++) {
        nav += '<li id="page' + i + '" class="page-item' + (i === startPage ? ' active' : '') + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>';
    }
    if (startPage < totalPages) {
        nav += '<li id="next" class="page-item"><a class="page-link" href="#" data-page="' + (startPage + 1) + '">' +
            'next' +
            '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><polyline points="9 6 15 12 9 18"></polyline></svg>' +
            '</a></li>';
    }
    nav += '</ul>';
    $('#table-nav').html($('#table-nav').html() + nav);
    let currStart = (startPage - 1) * 50 + 1;
    let currEnd = Math.min(currStart + 50, totalRows);
    $('.from-page').val(currStart);
    $('.to-page').val(currEnd);
}

function removeData() {
    $("#table-content").empty();
    $("#page-nav").remove();
}

function addRow(r) {
    let checkboxTD = createNewElement("td", null, null);
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
    if (htmlClass) {
        let classes = htmlClass.split(" ");
        classes.forEach((c) => {
            el.classList.add(c)
        });
    }
    if (text) $(el).text(text);
    return el;
}

function addEventListeners() {
    checkAllListener();
    navListeners();
}

function checkAllListener() {
    $("#select-all").on("change", (e) => {
        console.log("here");
        $(".check-one").prop("checked", $(e.target).prop("checked"));
    });

    $(".check-one").on("change", (e) => {
        $("#select-all").prop("checked", $('.check-one:checked').length == $('.check-one').length);
    });
}

function navListeners() {
    $(".page-item").on("click", (e) => {
        e.preventDefault();
        let id = e.target.id ? e.target.id : e.target.parentElement.id;
        switch (id) {
            case "next":
                goToPage(startPage + 1);
                break
            case "prev":
                goToPage(startPage - 1);
                break;
            default:
                goToPage(Number(id.replace("page", "")));
        }

    });

}

function goToPage(num) {
    console.log("going to page" + num);
    startPage = num;
    //todo:add request instead of fake request
    // sendRequest(num);
    createFakeReq();
    removeData();
    addRowsToTable();
    addTableNav();
    addEventListeners();// Get the current URL
    let currentUrl = new URL(window.location.href);
    let params = new URLSearchParams(currentUrl.search);
    params.set("page", num);
    currentUrl.search = params.toString();
    window.history.replaceState({}, "", currentUrl.toString());
    console.log(1);
    $("#select-all").prop("checked", false);
    window.scrollTo(0, 0);
}