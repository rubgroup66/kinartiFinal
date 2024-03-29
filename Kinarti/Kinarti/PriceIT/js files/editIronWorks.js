﻿var myIronW;

$(document).ready(function () {
    ajaxCall("GET", "../api/IronWorks", "", successGetIronWEdit, error);
    $("#editHingesForm").hide();
    $("#editHandlesForm").hide();
    $("#editIronWForm").hide();
    $("#editIronWForm").submit(addIronW);

    ironWMode = "new";
    mode = "";
    buttonEventsI();

});

function buttonEventsI() {

    $("#newBTNironW").on("click", function () {
        hingeMode = "new";
        fnew();

    });

    //$("#newBTN").on("click", function () {
    //    item = null;
    //    mode = "new";
    //    $("#hingesForm").hide();
    //    $("#hingesEditDiv").show();
    //    clearFields();
    //    $("#hingesEditDiv :input").prop("disabled", false); // new mode: enable all controls in the form
    //});

    $("#cancelSaveBTNIronW").on("click", function () {
        box = null;
        ironWMode = "new";
        if (ironWMode == "new") {
            $("#editIronWForm").hide();
            $("#ironWForm").show();
            ironWMode = "";
            mode = "";
        }
        ironWMode = "";
        mode = "";
    });


    $(document).on("click", ".editBtnIronW", function () {
        ironWMode = "edit";
        markSelectedironW(this);
        $("#editIronWForm").show();
        $("#editIronWForm :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFieldsIronW(this.getAttribute('data-ironWId'));
        mode = "";
    });

    $(document).on("click", ".deleteBtnIronW", function () {
        mode = "delete";
        markSelectedironW(this);
        var ironWId = this.getAttribute('data-ironWId');
        swal({  
            title: "האם אתה בטוח ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteIronW(ironWId);
                else swal("הפריט לא נמחק");
            });
    });
 
    
}
function DeleteIronW(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/IronWorks/?Id=" + id, "", deleteIronWSuccess, error);
}

function successGetIronWEdit(ironWdata) {// this function is activated in case of a success
    console.log(ironWdata);
    myIronW = ironWdata;
    try {
        tbl = $('#ironWTable').DataTable({
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
            data: ironWdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return ironWdata.findIndex(i => i.ID === row.ID) + 1;
                    }
                },
                { data: "Type" },
                { data: "Cost" },
                {
                    render: function (data, type, row, meta) {
                        let dataIronW = "data-ironWId='" + row.ID + "'";
                        //editBtnIronW = "<button type='button' class = 'editBtnIronW btn btn-success' " + dataIronW + "> עריכה </button>";
                        //deleteBtnIronW = "<button type='button' class = 'deleteBtnIronW btn btn-danger' " + dataIronW + "> מחיקה </button>";
                        editBtnIronW = "<button type='button' class = 'editBtnIronW btn btn-success' " + dataIronW + ">  <span class='glyphicon glyphicon-edit' aria-hidden='true'></span>  עריכה </button>";
                        deleteBtnIronW = "<button type='button' class = 'deleteBtnIronW btn btn-danger' " + dataIronW + ">  <span class='glyphicon glyphicon-trash' aria-hidden='true'></span> מחיקה </button>";

                        return editBtnIronW + deleteBtnIronW;
                    }
                }
            ],
        });
        buttonEventsI();
    }
    catch (err) {
        alert(err);
    }
}


function fnew() {
    $("#ironWForm").hide();
    $("#editIronWForm").show();
    clearFields();
    return false;
}


function addIronW() {
    if (ironWMode === "edit") {
        Id = ironW.ID;
    }

    let ironWtoSave = {
        Type: $("#ironWType").val(),
        Cost: $("#ironWCost").val()
    };

    if (ironWMode === "edit")
        ajaxCall("PUT", "../api/IronWorks/?Id=" + Id, JSON.stringify(ironWtoSave), updateSuccessIronW, error);

    else if ((ironWMode === "new") || (ironWMode === "duplicate")) // add a new item record to the server
        ajaxCall("POST", "../api/IronWorks", JSON.stringify(ironWtoSave), insertSuccessIronW, error);
    return false;
}

function clearFields() {
    $("#ironWType").val("");
    $("#ironWCost").val("");

}

function insertSuccessIronW() {  // success callback function after adding new item
    uri = "../api/IronWorks";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataIronW, errorGetUpdatedI);
    buttonEventsI();
    $("#ironWEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
    $("#ironWForm").show();
}
function deleteIronWSuccess(itemsdata) {
    uri = "../api/IronWorks";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataIronW, error); //get all relevant project's items from DB 
    buttonEventsI(); // after redrawing the table, we must wire the new buttons
    $("#ironWEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function updateSuccessIronW() {    // success callback function after update

    uri = "../api/IronWorks";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataIronW, error); //get all relevant project's items from DB 
    buttonEventsI();
    $("#ironWEditDiv").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedDataIronW(ironW) {
    var dataTable = $('#ironWTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetIronWEdit(ironW);
    mode = "";
    ironWMode = "";
}
function errorGetUpdatedI() {
    alert("שגיאה בשמירת פרזול");
}

function populateFieldsIronW(ironWId) {
    ironWMode = "edit";
    ironW = getIronW(ironWId);
    $("#ironWCost").val(ironW.Cost);
    $("#ironWType").val(ironW.Type);


}




function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}


function markSelectedironW(btn) {  // mark the selected row
    $("#ironWTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}


    // get item according to its Id
function getIronW(id) {
    console.log(myIronW);
    for (i in myIronW) {
        if (myIronW[i].ID == id)
            return myIronW[i];
    }
    return null;
}

