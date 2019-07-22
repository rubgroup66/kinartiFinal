var myHinges, hingesCost1, hingesCost2;
var myExrtaWallTypeID;

$(document).ready(function () {
    ajaxCall("GET", "../api/hinges", "", successGetHingesEdit, error);
    $("#editHingesForm").hide();
    $("#editHandlesForm").hide();
    $("#editHingesForm").submit(addHinge);
    mode = "";
    hingeMode = "new";

    buttonEventsH();


});

function buttonEventsH() {

    $("#newBTN2").on("click", function () {
        hingeMode = "new";
        f3();

    });

    //$("#newBTN").on("click", function () {
    //    item = null;
    //    mode = "new";
    //    $("#hingesForm").hide();
    //    $("#hingesEditDiv").show();
    //    clearFields();
    //    $("#hingesEditDiv :input").prop("disabled", false); // new mode: enable all controls in the form
    //});

    $("#cancelSaveBTNhinges").on("click", function () {
        box = null;
        mode = "new";
        if (mode == "new") {
            $("#editHingesForm").hide();
            $("#hingesForm").show();
            mode = "";
        }
        mode = "";
    });


    $(document).on("click", ".editBtnHinges", function () {
        hingeMode = "edit";
        markSelected(this);
        $("#editHingesForm").show();
        $("#editHingesForm :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-hingeId'));
    });

    $(document).on("click", ".deleteBtnHinge", function () {
        mode = "delete";
        markSelected(this);
        var hingeId = this.getAttribute('data-hingeId');
        swal({ // this will open a dialouge 
            title: "האם אתה בטוח ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteHinge(hingeId);
                else swal("הפריט לא נמחק");
            });
    });
 
    
}
function DeleteHinge(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/hinges/?Id=" + id, "", deleteHingeSuccess, error);
}

function successGetHingesEdit(hingesdata) {// this function is activated in case of a success
    console.log(hingesdata);
    myHinges = hingesdata;
    try {
        tbl = $('#hingesTable').DataTable({
            data: hingesdata,
            pageLength: 5,
            columns: [
                { data: "ID" },
                { data: "Type" },
                { data: "Cost" },
                {
                    render: function (data, type, row, meta) {
                        let dataHinge = "data-hingeId='" + row.ID + "'";
                        editBtnHinges = "<button type='button' class = 'editBtnHinges btn btn-success' " + dataHinge + "> עריכה </button>";
                        //viewBtn = "<button type='button' class = 'viewBtn btn btn-info' " + dataHinge + "> צפייה </button>";
                        deleteBtnHinge = "<button type='button' class = 'deleteBtnHinge btn btn-danger' " + dataHinge + "> מחיקה </button>";
                        return editBtnHinges + /*viewBtn +*/  deleteBtnHinge;
                    }
                }
            ],
        });
        buttonEventsH();
    }
    catch (err) {
        alert(err);
    }
}


function f3() {
    $("#hingesForm").hide();
    $("#editHingesForm").show();
    clearFields();
    return false;
}


function addHinge() {
    if (hingeMode === "edit") {
        Id = hinge.ID;
    }

    let hingetoSave = {
        //ID: hinge.ID,
        Type: $("#hingeName").val(),
        Cost: $("#hingeCost").val()
    };

    if (hingeMode === "edit")
        ajaxCall("PUT", "../api/hinges/?Id=" + Id, JSON.stringify(hingetoSave), updateSuccess, error);

    else if ((hingeMode === "new") || (hingeMode === "duplicate")) // add a new item record to the server
        ajaxCall("POST", "../api/hinges", JSON.stringify(hingetoSave), insertSuccess, error);
    console.log(hingeMode);
    return false;
}

function clearFields() {
    $("#hingeName").val("");
    $("#hingeCost").val("");

}

function insertSuccess() {  // success callback function after adding new item
    uri = "../api/hinges";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, errorGetUpdatedH);
    buttonEventsH();
    $("#hingesEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
    $("#hingesForm").show();
}
function deleteHingeSuccess(itemsdata) {
    uri = "../api/hinges";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 
    buttonEventsH(); // after redrawing the table, we must wire the new buttons
    $("#hingesEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function updateSuccess() {    // success callback function after update

    uri = "../api/hinges";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 
    buttonEventsH();
    $("#hingesEditDiv").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedData(hinges) {
    var dataTable = $('#hingesTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetHingesEdit(hinges);
}
function errorGetUpdatedH() {
    alert("error");
}

function populateFields(hingeId) {    // fill the form fields
    //debugger;
    hinge = getHinge(hingeId);
    console.log(hinge);
    //$("#image").attr("src", "images/" + item.Image);
    $("#hingeName").val(hinge.Type);
    $("#hingeCost").val(hinge.Cost);
    mode = "edit";

}



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

function ShowInfo() {
    $("#info").show();
}


function markSelected(btn) {  // mark the selected row
    $("#hingesTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}


    // get item according to its Id
function getHinge(id) {
    console.log(myHinges);
    for (i in myHinges) {
        if (myHinges[i].ID == id)
            return myHinges[i];
    }
    return null;
}

