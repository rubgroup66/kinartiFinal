var  mySup;

$(document).ready(function () {
    ajaxCall("GET", "../api/supervisor", "", successGetSupEdit, error);
    $("#editArchForm").hide();
    $("#editSupForm").hide();
    $("#editSupForm").submit(addSup);

    buttonEventsS();


});

function buttonEventsS() {

    $("#newBTNSup").on("click", function () {
        f6();

    });

    $("#cancelSaveBTNSup").on("click", function () {

            $("#editSupForm").hide();
            $("#supForm").show();

    });

    $(document).on("click", ".deleteBtnSup", function () {
        mode = "delete";
        markSelected(this);
        var supId = this.getAttribute('data-supId');
        swal({ // this will open a dialouge 
            title: "האם אתה בטוח ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteSup(supId);
                else swal("הפריט לא נמחק");
            });
    });


}
function DeleteSup(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/supervisor/?Id=" + id, "", deleteSupSuccess, error);
}

function successGetSupEdit(supdata) {// this function is activated in case of a success
    console.log(supdata);
    mySup = supdata;
    try {
        tbl = $('#supTable').DataTable({
            data: supdata,
            pageLength: 5,
            columns: [
                { data: "sup_id" },
                { data: "sup_name" },
                { data: "sup_phone" },
                {
                    render: function (data, type, row, meta) {
                        let dataSup = "data-supId='" + row.sup_id + "'";
                        deleteBtnSup = "<button type='button' class = 'deleteBtnSup btn btn-danger' " + dataSup + "> מחיקה </button>";
                        return deleteBtnSup;
                    }
                }
            ],
        });
        buttonEventsS();
    }
    catch (err) {
        alert(err);
    }
}


function f6() {
    $("#supForm").hide();
    $("#editSupForm").show();
    clearFields();
    return false;
}

function addSup() {

    let SupData = {
        sup_id: $("#supID").val(),
        sup_name: $("#supName").val(),
        sup_phone: $("#supPnum").val()
    };
    ajaxCall("POST", "../api/supervisor", JSON.stringify(SupData), insertSupSuccess, errorPostSup);
    return false;
}

function errorPostSup() {
    alert("שגיאה בשמירת מפקחים");
}
//function clearFields() {
//    $("#handleName").val("");
//    $("#handleCost").val("");

//}

function insertSupSuccess() {  // success callback function after adding new item
    uri = "../api/supervisor";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataSup, errorGetUpdateSup);
    buttonEventsS();
    $("#supEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
    $("#supForm").show();
}

function errorGetUpdateSup() {
    alert("שגיאה בשליפת מפקחים");
}
function deleteSupSuccess(itemsdata) {
    uri = "../api/supervisor";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataSup, error); //get all relevant project's items from DB 
    buttonEventsS(); // after redrawing the table, we must wire the new buttons
    $("#supEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}



function populateTableWithUpdatedDataSup(sup) {
    var dataTable = $('#supTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetSupEdit(sup);
}
function errorGetUpdatedAr() {
    alert("שגיאה בטעינת אדריכלים");
}

//function populateFields(handleId) {    // fill the form fields
//    //debugger;
//    handle = getHandle(handleId);
//    console.log(handle);
//    $("#handleName").val(handle.Type);
//    $("#handleCost").val(handle.Cost);
//    mode = "edit";

//}



//function successGetMaterials(materialsdata) {// this function is activated in case of a success
//    myMaterials = materialsdata;
//    for (var i = 0; i < materialsdata.length; i++) {
//        $('#boxMaterial').append('<option value="' + materialsdata[i].ID + '" >' + materialsdata[i].Name + '</option>');
//    }
//    console.log(myMaterials);
//}

//function successGetFacades(facadesdata) {// this function is activated in case of a success
//    console.log(facadesdata);
//    myFacades = facadesdata;
//    for (var i = 0; i < facadesdata.length; i++) {
//        $('#facadeType').append('<option value="' + facadesdata[i].ID + '" >' + facadesdata[i].Type + '</option>');
//    }
//    for (i = 0; i < facadesdata.length; i++) {
//        $('#extraWallType').append('<option value="' + facadesdata[i].ID + '" >' + facadesdata[i].Type + '</option>');
//    }
//    console.log(myFacades);
//}

//function successGetBoxes(boxesdata) {// this function is activated in case of a success
//    myBoxes = boxesdata;
//    for (var i = 0; i < boxesdata.length; i++) {
//        $('#boxMeasures').append('<option value="' + boxesdata[i].ID + '" >' + boxesdata[i].Height + 'X' + boxesdata[i].Width + 'X' + boxesdata[i].Depth + '</option>');
//    }
//}

//function successGetHandles(handlesdata) {// this function is activated in case of a success
//    myHandles = handlesdata;
//    for (var i = 0; i < handlesdata.length; i++) {
//        $('#handlesType').append('<option value="' + handlesdata[i].ID + '" >' + handlesdata[i].Type + '</option>');
//    }
//}



//function successGetIronWorks(ironworksdata) {// this function is activated in case of a success
//    myIronWorks = ironworksdata;
//    for (var i = 0; i < ironworksdata.length; i++) {
//        $('#ironWorksType1').append('<option value="' + ironworksdata[i].ID + '" >' + ironworksdata[i].Type + '</option>');
//        $('#ironWorksType2').append('<option value="' + ironworksdata[i].ID + '" >' + ironworksdata[i].Type + '</option>');
//    }
//}

//function successGetFacadeMaterials(facadeMaterialsdata) {// this function is activated in case of a success
//    myFacadeMaterials = facadeMaterialsdata;
//    console.log("facade materials -> " + JSON.stringify(facadeMaterialsdata));
//    for (var i = 0; i < facadeMaterialsdata.length; i++) {
//        $('#facadeMaterialType').append('<option value="' + facadeMaterialsdata[i].ID + '" >' + facadeMaterialsdata[i].Name + '</option>');
//    }

//}
//// עצרתי בטעינת הצצבעים של החזיתות (גמר + קיר נוסף)



function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}


function markSelected(btn) {  // mark the selected row
    $("#supTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

