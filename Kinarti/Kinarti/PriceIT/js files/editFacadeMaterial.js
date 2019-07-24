var myFacM;

$(document).ready(function () {
    ajaxCall("GET", "../api/facadeMaterials", "", successGetFacMEdit, error);
    $("#editFacForm").hide();
    $("#editFmatForm").hide();
    $("#editFacForm").submit(addFac);
    FacMode = "new";

    buttonEventsFacMat();


});

function buttonEventsFacMat() {

    $("#newBTNFmat").on("click", function () {
        FacMMode = "new";
        fnewFacM();

    });

    $("#cancelSaveBTNAFmat").on("click", function () {
        mode = "new";
        if (mode == "new") {
            $("#editFmatForm").hide();
            $("#FmatForm").show();
            mode = "";
        }
        mode = "";
    });

    $(document).on("click", ".editBtnFacM", function () {
        FacMMode = "edit";
        
        markSelectedFacM(this);
        $("#editFmatForm").show();
        $("#editFmatForm :input").prop("disabled", false); 
        populateFieldsFacM(this.getAttribute('data-FacMatId'));
    });

    $(document).on("click", ".deleteBtnFac", function () {
        mode = "delete";
        markSelectedFac(this);
        var facId = this.getAttribute('data-FacId');
        swal({ // this will open a dialouge 
            title: "האם אתה בטוח ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteFac(facId);
                else swal("הפריט לא נמחק");
            });
    });


}
function DeleteFac(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/facade/?Id=" + id, "", deleteFacSuccess, error);
}

function fillDrop() {
    ajaxCall("GET", "../api/facade", "", successGetFacList, error);
    return false;
}

function successGetFacList(Facadetdata) {
    //FacMat = getFacMat(this);
    //console.log(FacMat.FacadeID);
    //let TheID = FacMat.FacadeID;
    alert("success");
    for (var i = 0; i < Facadetdata.length; i++) {
        $("#FacadeID").append($("<option></option>").val(Facadetdata[i].ID).html(Facadetdata[i].Type));
        if (Facadetdata[i].ID == Fac.ID) {
            alert("success2");
            let name = Fac.Type;
            $("#FacadeID").append($("<option selected='selected'></option>").val(name));
        }
    }
}
function successGetFacMEdit(FacMdata) {// this function is activated in case of a success
    console.log(FacMdata);
    myFacM = FacMdata;
    try {
        tbl = $('#FmatTable').DataTable({
            retrieve: true,
            paging: false,
            language: {
                'search': 'חיפוש:',
                "lengthMenu": "הצג _MENU_ רשומות",
                "info": "מציג _START_ עד _END_ מתוך _TOTAL_ רשומות",
                "paginate": {
                    "previous": "הקודם",
                    "next": "הבא"
                },
                "emptyTable": "לא קיימות רשומות, אפשר להתחיל להוסיף :)"
            },
            data: FacMdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return FacMdata.findIndex(i => i.ID === row.ID) + 1;
                    }
                },
                { data: "FacadeID" },
                { data: "Name" },
                { data: "Cost" },
                {
                    render: function (data, type, row, meta) {
                        let FacadeMatdata = "data-FacMatId='" + row.ID + "'";
                        editBtnFacM = "<button type='button' class = 'editBtnFacM btn btn-success' " + FacadeMatdata + "> עריכה </button>";
                        deleteBtnFacM = "<button type='button' class = 'deleteBtnFacM btn btn-danger' " + FacadeMatdata + "> מחיקה </button>";
                        return editBtnFacM + deleteBtnFacM;
                    }
                }
            ],
        });
        buttonEventsFacMat();
    }
    catch (err) {
        alert(err);
    }
}


function fnewFacM() {
    $("#FmatForm").hide();
    $("#editFmatForm").show();
    clearFieldsFacM();
    return false;
}

function addFac() {
    if (FacMode === "edit") {
        Id = Fac.ID;
    }

    let factoSave = {
        Type: $("#FacName").val(),
        Cost: $("#FacCost").val()
    };

    if (FacMode === "edit")
        ajaxCall("PUT", "../api/facade/?Id=" + Id, JSON.stringify(factoSave), updateFacSuccess, error);

    else if ((FacMode === "new") || (FacMode === "duplicate")) // add a new item record to the server
        ajaxCall("POST", "../api/facade", JSON.stringify(factoSave), insertFacSuccessFac, error);
    return false;
}

function clearFieldsFacM() {
    $("#FacCost").val("");
    $("#FacName").val("");

}

function insertFacSuccessFac() {  // success callback function after adding new item
    uri = "../api/facades";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataFac, errorGetUpdatedH);
    buttonEventsFacMat();
    $("#facEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
    $("#facForm").show();
}
function deleteFacSuccess(itemsdata) {
    uri = "../api/facade";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataFac, error); //get all relevant project's items from DB 
    buttonEventsFacMat(); // after redrawing the table, we must wire the new buttons
    $("#facEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function updateFacSuccess() {    // success callback function after update

    uri = "../api/facade";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataFac, error); //get all relevant project's items from DB 
    buttonEventsFacMat();
    $("#facEditDiv").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedDataFac(Fac) {
    var dataTable = $('#facTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetFacEdit(Fac);
}
function errorGetUpdatedH() {
    alert("error");
}

function populateFieldsFacM(FacMId) {    // fill the form fields
    FacMMode = "edit";
    FacMat = getFacMat(FacMId);
    Fac = getFac2(FacMId);
    fillDrop();
    $("#FmatName").val(FacMat.Name);
    $("#FmatCost").val(FacMat.Cost);
    mode = "edit";

}

function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}


function markSelectedFacM(btn) {  // mark the selected row
    $("#facTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}


// get item according to its Id
function getFacMat(id) {
    console.log(myFacM);
    for (i in myFacM) {
        if (myFacM[i].ID == id)
            return myFacM[i];
    }
    return null;
}

function getFac2(id) {
    console.log(myFacM);
    for (i in myFacM) {
        if (myFacM[i].ID == id)
            return myFacM[i];
    }
    return null;
}

