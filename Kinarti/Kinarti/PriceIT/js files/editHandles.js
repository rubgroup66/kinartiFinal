var myHandles, handlesCost;

$(document).ready(function () {
    ajaxCall("GET", "../api/handles", "", successGetHandlesEdit, error);
    $("#editHingesForm").hide();
    $("#editHandlesForm").hide();
    $("#editIronWForm").hide();
    $("#editHandlesForm").submit(addHandle);
    mode = "";
    handleMode = "new";
    buttonEventsHd();

});

function buttonEventsHd() {

    $("#newBTN3").on("click", function () {
        handleMode = "new";
        f4();
    });

    $("#cancelSaveBTNHandles").on("click", function () {
        box = null;
        mode = "new";
        if (mode == "new") {
            $("#editHandlesForm").hide();
            $("#HandlesForm").show();
            mode = "";
        }
        mode = "";
    });

    $(document).on("click", ".editBtnHandle", function () {
        handleMode = "edit";
        markSelectedHandles(this);
        $("#editHandlesForm").show();
        $("#editHandlesForm :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFieldsHandles(this.getAttribute('data-handleId'));
    });

    $(document).on("click", ".deleteBtnHandle", function () {
        mode = "delete";
        markSelectedHandles(this);
        var handleId = this.getAttribute('data-handleId');
        swal({ // this will open a dialouge 
            title: "האם אתה בטוח ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteHandle(handleId);
                else swal("הפריט לא נמחק");
            });
    });


}
function DeleteHandle(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/handles/?Id=" + id, "", deleteHandleSuccess, error);
}

function successGetHandlesEdit(handledata) {// this function is activated in case of a success
    console.log(handledata);
    myHandles = handledata;
    try {
        tbl = $('#handlesTable').DataTable({
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
            data: handledata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return handledata.findIndex(i => i.ID === row.ID) + 1;
                    }
                },
                { data: "Type" },
                { data: "Cost" },
                {
                    render: function (data, type, row, meta) {
                        let dataHandle = "data-handleId='" + row.ID + "'";
                        //editBtnHandle = "<button type='button' class = 'editBtnHandle btn btn-success' " + dataHandle + "> עריכה </button>";
                        //deleteBtnHandle = "<button type='button' class = 'deleteBtnHandle btn btn-danger' " + dataHandle + "> מחיקה </button>";
                        editBtnHandle = "<button type='button' class = 'editBtnHandle btn btn-success' " + dataHandle + ">  <span class='glyphicon glyphicon-edit' aria-hidden='true'></span>  עריכה </button>";
                        deleteBtnHandle = "<button type='button' class = 'deleteBtnHandle btn btn-danger' " + dataHandle + ">  <span class='glyphicon glyphicon-trash' aria-hidden='true'></span> מחיקה </button>";

                        return editBtnHandle + deleteBtnHandle;
                    }
                }
            ],
        });
        buttonEventsHd();
    }
    catch (err) {
        alert(err);
    }
}


function f4() {
    $("#HandlesForm").hide();
    $("#editHandlesForm").show();
    clearFields();
    return false;
}

function addHandle() {
    if (handleMode === "edit") {
        Id = handle.ID;
    }

    let handletoSave = {
        //ID: hinge.ID,
        Type: $("#handleName").val(),
        Cost: $("#handleCost").val()
    };

    if (handleMode === "edit")
        ajaxCall("PUT", "../api/handles/?Id=" + Id, JSON.stringify(handletoSave), updateHandlesSuccess, error);

    else if ((handleMode === "new") || (handleMode === "duplicate")) // add a new item record to the server
        ajaxCall("POST", "../api/handles", JSON.stringify(handletoSave), insertHandlesSuccess, error);
    return false;
}

function clearFields() {
    $("#handleName").val("");
    $("#handleCost").val("");
}

function insertHandlesSuccess() {  // success callback function after adding new item
    uri = "../api/handles";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataHd, errorGetUpdatedH);
    buttonEventsHd();
    $("#handlesEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
    $("#HandlesForm").show();
}
function deleteHandleSuccess(itemsdata) {
    uri = "../api/handles";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataHd, error); //get all relevant project's items from DB 
    buttonEventsHd(); // after redrawing the table, we must wire the new buttons
    $("#handlesEditDiv").hide();
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

function populateTableWithUpdatedDataHd(handles) {
    var dataTable = $('#handlesTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetHandlesEdit(handles);
}
function errorGetUpdatedH() {
    alert("שגיאה בעדכון");
}

function populateFieldsHandles(handleId) {    // fill the form fields
    handleMode = "edit";
    handle = getHandle(handleId);
    $("#handleName").val(handle.Type);
    $("#handleCost").val(handle.Cost);
    mode = "edit";

}


function error(err) { // this function is activated in case of a failure
    swal("שגיאה: " + err);
}

function ShowInfo() {
    $("#info").show();
}


function markSelectedHandles(btn) {  // mark the selected row
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

