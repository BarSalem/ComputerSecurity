let req = [];
const numbers = [];
const letters = [];
let totalRows;
const itemsPerPage = 50;
let startPage = new URL(location.href).searchParams.get('page');
startPage = !startPage || Number(startPage) < 1 ? 1 : Number(startPage);
let searchVal = new URL(location.href).searchParams.get('search');
searchVal = searchVal?searchVal:"";
$(document).ready(() => {
    //todo: delete
    createFakeReq();
    //todo: end delete
    //todo: remove '//'

    //sendRequest(startPage,searchVal);// This request will get the data for the 50 rows in the page :)

    //todo: end remove '//'
    addRowsToTable();
    addTableNav();
    addEventListeners();
})

function sendRequest(start,search) {
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
    for (let i = 0; i < int; i++) {
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
    $("#search-bar").val(searchVal);
}

function removeData() {
    $("#table-content").empty();
    $("#page-nav").remove();
}

function addRow(r) {
    let checkboxTD = createNewElement("td", null, null);
    let firstNameTD = createNewElement("td", null, r.firstName,"first-name"+r.userName);
    let lastNameTD = createNewElement("td", null, r.lastName,"last-name"+r.userName);
    let userNameTD = createNewElement("td", null, r.userName,"username"+r.userName);
    let phoneNumTD = createNewElement("td", null, r.phoneNum,"phone-number"+r.userName);
    let checkbox = createNewElement("input", "form-check-input m-0 align-middle check-one", null,"checkbox"+r.userName);
    checkbox.type = "checkbox";
    $(checkboxTD).append(checkbox);
    let deleteTD = createNewElement("td", null, null);
    deleteTD.title="Delete User"
    let deleteIcon = createNewElement("button", "delete-user-btn", `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <circle cx="9" cy="7" r="4"></circle>
   <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
   <path d="M17 9l4 4m0 -4l-4 4"></path>
    </svg>`,"delete-btn"+r.userName);
    deleteTD.append(deleteIcon);
    let tdList = [checkboxTD, firstNameTD, lastNameTD, userNameTD, phoneNumTD, deleteTD];
    let tr = createNewElement("tr",null,null,r.userName);
    tdList.forEach((td) => $(tr).append(td));
    $("#table-content").append(tr);


}

function createNewElement(tag, htmlClass, html,id) {
    let el = document.createElement(tag);
    if (htmlClass) {
        let classes = htmlClass.split(" ");
        classes.forEach((c) => {
            el.classList.add(c)
        });
    }
    if (html) $(el).html(html);
    if(id) el.id = id;
    return el;

}

function addEventListeners() {
    checkAllListener();
    navListeners();
    deleteUsersListeners();
    searchBarListener();
}

function checkAllListener() {
    $("#select-all").on("change", (e) => {
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
                goToPage(startPage + 1,searchVal);
                break
            case "prev":
                goToPage(startPage - 1,searchVal);
                break;
            default:
                goToPage(Number(id.replace("page", "")),searchVal);
        }

    });
}
function deleteUsersListeners(){
    $(".delete-user-btn").on("click",(e)=>{
        e.stopPropagation();
        let buttonID = $(e.target).closest('button').attr('id');
        let username;
        let toDelete = [];
        if(buttonID == "delete-selected"){
            $(".check-one:checked").each(function() {
                username = $(this).closest("tr").attr("id");
                if(username === $(this).attr('id').replace("checkbox",""));
                toDelete.push(username);
            });
        }
        else{
            username=$(e.target).closest("tr").attr("id");
            if(username === buttonID.replace("delete-btn",""))
                toDelete.push(username);
        }
        deleteUsers(toDelete)
    })
}

function deleteUsers(list){
    //todo:send to backend list to delete :)
}

function searchBarListener(){
    $("#search-bar").on("keydown",(e) => {
        if(e.keyCode === 13)
            goToPage(1,$(e.target).val());

    });
}

// function sendSearchReq(startPage,input){
//     console.log(input+' '+startPage);
//     //todo:add url change
//     //add request FOR THE CORRECT PAGE AND INPUT
// }
function removeEventListeners(){
    $(".delete-user-btn").off("click");
    $("#search-bar").off("keydown");
}

function goToPage(num,searchValue) {
    startPage = num;
    searchVal = searchValue;
    //todo:add request instead of fake request
    // sendRequest(num,searchVal);
    //todo:delete fake req
    createFakeReq();
    removeData();
    addRowsToTable();
    addTableNav();
    removeEventListeners();
    addEventListeners();
    let currentUrl = new URL(window.location.href);
    let params = new URLSearchParams(currentUrl.search);
    if (startPage > 1)
        params.set("page", num);
    else if(params.get("page"))
        params.delete("page");
    if(searchVal)
        params.set("search", searchVal);
    else if(params.get("search"))
        params.delete("search");
    currentUrl.search = params.toString();
    window.history.replaceState({}, "", currentUrl.toString());
    $("#select-all").prop("checked", false);
    window.scrollTo(0, 0);
}