var myFac;

$(document).ready(function () {
    ajaxCall("GET", "../api/facade", "", successGetFacEdit, error);
    $("#editFacForm").hide();
    $("#editFmatForm").hide();
    $("#editFacForm").submit(addFac);
    FacMode = "new";

    buttonEventsFac();


});

function buttonEventsFac() {

    $("#newBTNFac").on("click", function () {
        FacMode = "new";
        fnewFac();

    });

    $("#cancelSaveBTNFac").on("click", function () {
        mode = "new";
        if (mode == "new") {
            $("#editFacForm").hide();
            $("#facForm").show();
            mode = "";
        }
        mode = "";
    });

    $(document).on("click", ".editBtnFac", function () {
        FacMode = "edit";
        markSelectedFac(this);
        $("#editFacForm").show();
        $("#editFacForm :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFieldsFac(this.getAttribute('data-FacId'));
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

function successGetFacEdit(Facdata) {// this function is activated in case of a success
    console.log(Facdata);
    myFac = Facdata;
    try {
        tbl = $('#facTable').DataTable({
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
            data: Facdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return Facdata.findIndex(i => i.ID === row.ID) + 1;
                    }
                },
                { data: "Type" },
                { data: "Cost" },
                {
                    render: function (data, type, row, meta) {
                        let Facadedata = "data-FacId='" + row.ID + "'";
                        editBtnFac = "<button type='button' class = 'editBtnFac btn btn-success' " + Facadedata + "> עריכה </button>";
                        deleteBtnFac = "<button type='button' class = 'deleteBtnFac btn btn-danger' " + Facadedata + "> מחיקה </button>";
                        return editBtnFac + deleteBtnFac;
                    }
                }
            ],
        });
        buttonEventsFac();
    }
    catch (err) {
        alert(err);
    }
}


function fnewFac() {
    $("#facForm").hide();
    $("#editFacForm").show();
    clearFieldsFac();
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

function clearFieldsFac() {
    $("#FacCost").val("");
    $("#FacName").val("");

}

function insertFacSuccessFac() {  // success callback function after adding new item
    uri = "../api/facades";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataFac, errorGetUpdatedH);
    buttonEventsFac();
    $("#facEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
    $("#facForm").show();
}
function deleteFacSuccess(itemsdata) {
    uri = "../api/facade";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataFac, error); //get all relevant project's items from DB 
    buttonEventsFac(); // after redrawing the table, we must wire the new buttons
    $("#facEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function updateFacSuccess() {    // success callback function after update

    uri = "../api/facade";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataFac, error); //get all relevant project's items from DB 
    buttonEventsFac();
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

function populateFieldsFac(FacId) {    // fill the form fields
    FacMode = "edit";
    Fac = getFac(FacId);
    $("#FacName").val(Fac.Type);
    $("#FacCost").val(Fac.Cost);
    mode = "edit";

}

function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}


function markSelectedFac(btn) {  // mark the selected row
    $("#facTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}


// get item according to its Id
function getFac(id) {
    console.log(myFac);
    for (i in myFac) {
        if (myFac[i].ID == id)
            return myFac[i];
    }
    return null;
}

