var myFacM;

$(document).ready(function () {
    ajaxCall("GET", "../api/facadeMaterials", "", successGetFacMEdit, error);
    ajaxCall("GET", "../api/facade", "", successGetFacList, error);

    $("#editFacForm").hide();
    $("#editFmatForm").hide();
    $("#editFmatForm").submit(addFacMat);
    FacMMode = "new";

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

    $(document).on("click", ".deleteBtnFacM", function () {
        mode = "delete";
        markSelectedFacM(this);
        var facMId = this.getAttribute('data-FacMatId');
        swal({ // this will open a dialouge 
            title: "האם אתה בטוח ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteFacM(facMId);
                else swal("הפריט לא נמחק");
            });
    });


}
function DeleteFacM(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/facadeMaterials/?Id=" + id, "", deleteFacMSuccess, error);
}

function successGetFacList(Facadetdata) {
    for (var i = 0; i < Facadetdata.length; i++) {
        $("#FacadeIDM").append($("<option></option>").val(Facadetdata[i].ID).html(Facadetdata[i].Type));
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

function addFacMat() {
    if (FacMMode === "edit") {
        Id = FacMat.ID;
        var selected = [];
        $('#FacadeIDM :selected').each(function () {
            selected.push($(this).val());
        });
    }

    let facMattoSave = {
        Name: $("#FmatName").val(),
        Cost: $("#FmatCost").val(),
        FacadeID: $("#FacadeIDM").val()
    };

    if (FacMMode === "edit")
        ajaxCall("PUT", "../api/facadeMaterials/?Id=" + Id, JSON.stringify(facMattoSave), updateFacMatSuccess, errorUpdateFacMat);

    else if ((FacMMode === "new") || (FacMMode === "duplicate")) // add a new item record to the server
        ajaxCall("POST", "../api/facadeMaterials", JSON.stringify(facMattoSave), insertFacMatSuccessFac, error);
    return false;
}
function errorUpdateFacMat() {
    alert("שגיאה בעדכון נתונים");
}
function clearFieldsFacM() {
    $("#FacCost").val("");
    $("#FacName").val("");

}

function insertFacMatSuccessFac() {  // success callback function after adding new item
    uri = "../api/facadeMaterials";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataFacMat, errorGetUpdateFacMat);
    buttonEventsFacMat();
    $("#FmatEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
    $("#FmatForm").show();
}
function deleteFacMSuccess(itemsdata) {
    uri = "../api/facadeMaterials";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataFacMat, error); //get all relevant project's items from DB 
    buttonEventsFacMat(); // after redrawing the table, we must wire the new buttons
    $("#FmatEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function updateFacMatSuccess() {    // success callback function after update

    uri = "../api/facadeMaterials";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataFacMat, error); //get all relevant project's items from DB 
    buttonEventsFacMat();
    $("#FmatEditDiv").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedDataFacMat(FacMat) {
    var dataTable = $('#FmatTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetFacMEdit(FacMat);
}
function errorGetUpdateFacMat() {
    alert("שגיאה בעדכון נתונים");
}

function populateFieldsFacM(FacMId) {    // fill the form fields
    FacMMode = "edit";
    FacMat = getFacMat(FacMId);
    $("#FmatName").val(FacMat.Name);
    $("#FmatCost").val(FacMat.Cost);
    mode = "edit";

}

function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}


function markSelectedFacM(btn) {  // mark the selected row
    $("#FmatTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
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

