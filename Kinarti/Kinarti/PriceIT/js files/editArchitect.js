﻿var  myArch;

$(document).ready(function () {
    ajaxCall("GET", "../api/architect", "", successGetArchEdit, error);
    $("#editArchForm").hide();
    $("#editSupForm").hide();
    $("#editArchForm").submit(addArch);
    mode = "";
    handleMode = "new";
    buttonEventsA();

});

function buttonEventsA() {

    $("#newBTNArch").on("click", function () {
        handleMode = "new";
        f5();

    });

    $("#cancelSaveBTNArch").on("click", function () {
        box = null;
        mode = "new";
        if (mode == "new") {
            $("#editArchForm").hide();
            $("#archForm").show();
            mode = "";
        }
        mode = "";
    });

    $(document).on("click", ".deleteBtnArch", function () {
        mode = "delete";
        markSelected(this);
        var arcId = this.getAttribute('data-archId');
        swal({ // this will open a dialouge 
            title: "האם אתה בטוח ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteArc(arcId);
                else swal("הפריט לא נמחק");
            });
    });


}
function DeleteArc(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/architect/?Id=" + id, "", deleteArcSuccess, error);
}

function successGetArchEdit(archdata) {// this function is activated in case of a success
    console.log(archdata);
    myArch = archdata;
    try {
        tbl = $('#archTable').DataTable({
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
            data: archdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return archdata.findIndex(i => i.arc_id === row.arc_id) + 1;
                    }
                },
                { data: "arc_name" },
                {
                    render: function (data, type, row, meta) {
                        let dataArch = "data-archId='" + row.arc_id + "'";
                        //deleteBtnArch = "<button type='button' class = 'deleteBtnArch btn btn-danger' " + dataArch + "> מחיקה </button>";
                        deleteBtnArch = "<button type='button' class = 'deleteBtnArch btn btn-danger' " + dataArch + ">  <span class='glyphicon glyphicon-trash' aria-hidden='true'></span> מחיקה </button>";

                        return  deleteBtnArch;
                    }
                }
            ],
        });
        buttonEventsA();
    }
    catch (err) {
        alert(err);
    }
}


function f5() {
    $("#archForm").hide();
    $("#editArchForm").show();
    clearFields();
    return false;
}

function addArch() {

    let ArchData = {
        arc_id: $("#archID").val(),
        arc_name: $("#archName").val()
    };
    ajaxCall("POST", "../api/architect", JSON.stringify(ArchData), insertArchSuccess, errorPostArch);
    return false;
}

function errorPostArch() {
    alert("שגיאה בשמירת אדריכל");
}
function clearFields() {
    $("#handleName").val("");
    $("#handleCost").val("");

}

function insertArchSuccess() {  // success callback function after adding new item
    uri = "../api/architect";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataAr, errorGetUpdateAr);
    buttonEventsA();
    $("#archEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
    $("#archForm").show();
}

function errorGetUpdateAr() {
    alert("שגיאה בשליפת אדריכלים");
}
function deleteArcSuccess(itemsdata) {
    uri = "../api/architect";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataAr, error); //get all relevant project's items from DB 
    buttonEventsAr(); // after redrawing the table, we must wire the new buttons
    $("#archEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function updateHandlesSuccess() {    // success callback function after update

    uri = "../api/handles";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataHd, error); //get all relevant project's items from DB 
    buttonEventsHd();
    $("#handlesEditDiv").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedDataAr(arc) {
    var dataTable = $('#archTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetArchEdit(arc);
}
function errorGetUpdatedAr() {
    alert("שגיאה בטעינת אדריכלים");
}

function populateFields(handleId) {    // fill the form fields
    //debugger;
    handle = getHandle(handleId);
    console.log(handle);
    $("#handleName").val(handle.Type);
    $("#handleCost").val(handle.Cost);
    mode = "edit";

}

function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}

function ShowInfo() {
    $("#info").show();
}

function markSelected(btn) {  // mark the selected row
    $("#handlesTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

// get item according to its Id
function getHandle(id) {
    console.log(myHandles);
    for (i in myHandles) {
        if (myHandles[i].ID == id)
            return myHandles[i];
    }
    return null;
}

