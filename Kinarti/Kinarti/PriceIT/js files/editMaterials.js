var myMaterials;
var materialsCost1, materialsCost2;
var myIronWorks, ironWorksCost1, ironWorksCost2;

$(document).ready(function () {

    ajaxCall("GET", "../api/materials", "", successGetMaterialsEdit, error);
    $("#editMatForm").hide();
    matMode = "new";
    $("#editMatForm").submit(addMaterial);
    buttonEvents();

});


function buttonEventsM() {
    $("#cancelSaveBTNMat").on("click", function () {
        item = null;
        $("#editMatForm").hide();
        if (mode === "new") $("#matForm").show();
        mode = "";
    });

    $("#newBTNMat").on("click", function () {
        item = null;
        mode = "new";
        $("#matForm").hide();
        $("#editMatForm").show();
        clearFieldsMat();
        $("#matEditDiv :input").prop("disabled", false); // new mode: enable all controls in the form
    });

    $(document).on("click", ".editBtnMat", function () {
        matMode = "edit";
        markSelectedMat(this);
        $("#editMatForm").show();
        $("#editMatForm :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-materialId'));
    });

    $(document).on("click", ".deleteBtnMat", function () {
        mode = "delete";
        markSelectedMat(this);
        var matId = this.getAttribute('data-materialId');
        swal({ // this will open a dialouge 
            title: "האם אתה בטוח ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteMaterial(matId);
                else swal("הפריט לא נמחק");
            });
    });

}

function DeleteMaterial(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/materials/?Id=" + id, "", deleteSuccessMat, errorDelMat);
}

function errorDelMat() {
    alert("שגיאה במחיקת חומר גלם")
}
function deleteSuccessMat(itemsdata) {

    uri = "../api/materials";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataMat, error); //get all relevant project's items from DB 
    buttonEventsM(); // after redrawing the table, we must wire the new buttons
    $("#matEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";

}

function addMaterial() {

    if (matMode === "edit") {
        Id = material.ID;
    }

    let materialtoSave = {

        Name: $("#mat").val(),
        Cost: $("#Cost").val(),
        Coefficient: $("#coef").val(),
        WorkCost: $("#wCost").val()

    };

    if (matMode === "edit")
        ajaxCall("PUT", "../api/materials/?Id=" + Id, JSON.stringify(materialtoSave), updateSuccessMat, error);

    else if ((mode === "new") || (mode === "duplicate")) // add a new item record to the server
        ajaxCall("POST", "../api/materials", JSON.stringify(materialtoSave), insertSuccessMat, error);

    return false;
}

function updateStatusSuccess() {
    swal("עודכן בהצלחה!", "סטטוס הפרויקט עודכן", "success");
}


function successGetMaterialsEdit(materialsdata) {// this function is activated in case of a success
    console.log(materialsdata);
    myMaterials = materialsdata;
    try {
        tbl = $('#matTable').DataTable({
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
            data: materialsdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return materialsdata.findIndex(i => i.ID === row.ID) + 1;
                    }
                },
                { data: "Name" },
                { data: "Type" },
                { data: "Coefficient" },
                { data: "WorkCost" },
                { data: "Cost" },

                {
                    render: function (data, type, row, meta) {
                        let dataMaterial = "data-materialId='" + row.ID + "'";
                        editBtnMat = "<button type='button' class = 'editBtnMat btn btn-success' " + dataMaterial + "> עריכה </button>";
                        deleteBtnMat = "<button type='button' class = 'deleteBtnMat btn btn-danger' " + dataMaterial + "> מחיקה </button>";
                        return editBtnMat + deleteBtnMat;
                    }
                }
            ],
        });
        buttonEventsM();
    }
    catch (err) {
        alert(err);
    }
}

function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}

function markSelectedMat(btn) {  // mark the selected row
    $("#matTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

function populateFields(materialId) {
    matMode = "edit";
    material = getMaterial(materialId);;
    $("#mat").val(material.Name);
    $("#coef").val(material.Coefficient);
    $("#wCost").val(material.WorkCost);
    $("#Cost").val(material.Cost);
}
    // fill the form fields
function clearFieldsMat() {
        $("#wCost").val("");
        $("#coef").val("");
        $("#type").val("");
        $("#mat").val("");
        $("#Cost").val("");
    }

    // get item according to its Id
function getMaterial(id) {
    console.log(myMaterials);
    for (i in myMaterials) {
        if (myMaterials[i].ID == id)
            return myMaterials[i];
    }
    return null;
}

function updateSuccessMat() {    // success callback function after update
    uri = "../api/materials";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataMat, error); //get all relevant project's items from DB 
    buttonEventsM();
    $("#editMatForm").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}



function insertSuccessMat(itemsdata) {  // success callback function after adding new item
    $("#matForm").show();
    uri = "../api/materials";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataMat, error); //get all relevant project's items from DB 
    buttonEventsM();
    $("#editMatForm").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

// success callback function after delete
function deleteSuccess(itemsdata) {
    //tbl.clear();
    //  redrawTable(tbl, itemsdata);
    uri = "../api/materials";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataMat, error); //get all relevant project's items from DB 
    buttonEvents(); // after redrawing the table, we must wire the new buttons
    $("#materialsEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedDataMat(materials) {
    var dataTable = $('#matTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetMaterialsEdit(materials);
}



