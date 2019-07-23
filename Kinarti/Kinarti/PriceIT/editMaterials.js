﻿var myMaterials;
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
        clearFields();
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

//function addMaterial() {
//    alert(matMode);
//    console.log(matMode);
//    if (matMode === "edit") {
//        Id = material.ID;
//    }
    
//    let mattoSave = {
//        Name: $("#mat").val(),
//        Type: $("#type").val(),
//        Cost: $("#Cost").val(),
//        Coefficient: $("#coef").val(),
//        WorkCost: $("#wCost").val()
//    };

//    if (matMode === "edit")
//        ajaxCall("PUT", "../api/materials/?Id=" + Id, JSON.stringify(mattoSave), updateSuccessMat, error);

//    else if ((matMode === "new") || (matMode === "duplicate")) // add a new item record to the server
//        ajaxCall("POST", "../api/materials", JSON.stringify(mattoSave), insertSuccessMat, error);
//    console.log(matMode);
//    return false;
//}
function updateStatusSuccess() {
    swal("עודכן בהצלחה!", "סטטוס הפרויקט עודכן", "success");
}

function successGetMaterials(materialsdata) {// this function is activated in case of a success
    myMaterials = materialsdata;
    for (var i = 0; i < materialsdata.length; i++) {
        $('#boxMaterial').append('<option value="' + materialsdata[i].ID + '" >' + materialsdata[i].Name + '</option>');
    }
    console.log(myMaterials);
}

function successGetFacades(facadesdata) {// this function is activated in case of a success
    console.log(facadesdata);
    myFacades = facadesdata;
    for (var i = 0; i < facadesdata.length; i++) {
        $('#facadeType').append('<option value="' + facadesdata[i].ID + '" >' + facadesdata[i].Type + '</option>');
    }
    for (i = 0; i < facadesdata.length; i++) {
        $('#extraWallType').append('<option value="' + facadesdata[i].ID + '" >' + facadesdata[i].Type + '</option>');
    }
    console.log(myFacades);
}

function successGetBoxes(boxesdata) {// this function is activated in case of a success
    myBoxes = boxesdata;
    for (var i = 0; i < boxesdata.length; i++) {
        $('#boxMeasures').append('<option value="' + boxesdata[i].ID + '" >' + boxesdata[i].Height + 'X' + boxesdata[i].Width + 'X' + boxesdata[i].Depth + '</option>');
    }
}

function successGetHandles(handlesdata) {// this function is activated in case of a success
    myHandles = handlesdata;
    for (var i = 0; i < handlesdata.length; i++) {
        $('#handlesType').append('<option value="' + handlesdata[i].ID + '" >' + handlesdata[i].Type + '</option>');
    }
}

function successGetMaterialsEdit(materialsdata) {// this function is activated in case of a success
    console.log(materialsdata);
    myMaterials = materialsdata;
    try {
        tbl = $('#matTable').DataTable({
            data: materialsdata,
            pageLength: 5,
            columns: [
                { data: "ID" },
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

function successGetIronWorks(ironworksdata) {// this function is activated in case of a success
    myIronWorks = ironworksdata;
    for (var i = 0; i < ironworksdata.length; i++) {
        $('#ironWorksType1').append('<option value="' + ironworksdata[i].ID + '" >' + ironworksdata[i].Type + '</option>');
        $('#ironWorksType2').append('<option value="' + ironworksdata[i].ID + '" >' + ironworksdata[i].Type + '</option>');
    }
}

function successGetFacadeMaterials(facadeMaterialsdata) {// this function is activated in case of a success
    myFacadeMaterials = facadeMaterialsdata;
    console.log("facade materials -> " + JSON.stringify(facadeMaterialsdata));
    for (var i = 0; i < facadeMaterialsdata.length; i++) {
        $('#facadeMaterialType').append('<option value="' + facadeMaterialsdata[i].ID + '" >' + facadeMaterialsdata[i].Name + '</option>');
    }

}
// עצרתי בטעינת הצצבעים של החזיתות (גמר + קיר נוסף)

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
    function clearFields() {
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



