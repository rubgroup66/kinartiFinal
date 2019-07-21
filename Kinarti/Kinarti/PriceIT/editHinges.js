var myHinges, hingesCost1, hingesCost2;
var myExrtaWallTypeID;

$(document).ready(function () {
    $("#hingesEditDiv").hide();
    $("#editHandlesForm").hide();
    ajaxCall("GET", "../api/hinges", "", successGetHingesEdit, error);
    mode = "";
    buttonEvents();

});
function buttonEvents() {

    $("#saveBTN").on("click", function () {
        onSubmitFunc();
    });

    $("#newBTN").on("click", function () {
        item = null;
        mode = "new";
        $("#hingesForm").hide();
        $("#hingesEditDiv").show();
        clearFields();
        $("#hingesEditDiv :input").prop("disabled", false); // new mode: enable all controls in the form
    });

    $("#cancelSave").on("click", function () {
        box = null;
        mode = "new";
        if (mode == "new") {
            $("#hingesEditDiv").hide();
            $("#hingesForm").show();
            mode = "";
        }
        mode = "";
    });
}



function f3() {
    $("#hingesForm").hide();
    $("#hingesEditDiv").show();
    return false;
}

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
                        editBtn = "<button type='button' class = 'editBtn btn btn-success' " + dataHinge + "> עריכה </button>";
                        viewBtn = "<button type='button' class = 'viewBtn btn btn-info' " + dataHinge + "> צפייה </button>";
                        //duplicateBtn = "<button type='button' class = 'duplicateBtn btn btn-info' " + dataHinge + "> שכפול + </button>";
                        deleteBtn = "<button type='button' class = 'deleteBtn btn btn-danger' " + dataHinge + "> מחיקה </button>";
                        return editBtn + /*viewBtn +*/  deleteBtn;
                    }
                }
            ],
        });
        buttonEvents();
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



function successGetConstants(constantsdata) {// this function is activated in case of a success
    constants = constantsdata;
    console.log(constants);
    //constants = (JSON.stringify(constantsdata));
}

//// this should be used when the active value is changed
function buttonEvents() {
    $(document).on("click", ".isDistanced", function () {
        isDistanced = $(this).is(':checked') ? 1 : 0; // replace with true value
        console.log("change made");
    });  

    $(document).on("click", ".editBtn", function () {
        mode = "edit";
        markSelected(this);
        $("#hingesEditDiv").show();
        $("#hingesEditDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-hingeId')); // fill the form fields according to the selected row
    });

    ///////////duplicating
    $(document).on("click", ".duplicateBtn", function () {
        mode = "duplicate";
        markSelected(this);
        $("#hingesEditditDiv").show();
        $("#hingesEditditDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-itemId')); // fill the form fields according to the selected row
    });

    $(document).on("click", ".viewBtn", function () {
        mode = "view";
        markSelected(this);
        $("#hingesEditDiv").show();
        row.className = 'selected';
        $("#hingesEditDiv :input").attr("disabled", "disabled"); // view mode: disable all controls in the form
        populateFields(this.getAttribute('data-itemId'));
    });

    $(document).on("click", ".deleteBtn", function () {
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

    $("#finish").on("click", function () {
        onSubmitFunc2();
    });



}



function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}

function ShowInfo() {
    $("#info").show();
}

//$("#pForm").submit(onSubmitFunc); 

function markSelected(btn) {  // mark the selected row
    $("#hingesTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}


function DeleteHinge(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/hinges/?Id=" + id, "", deleteSuccess, error);
}

function saveProject(id) {      // Delete a item from the server
    ajaxCall("PUT", "../api/hinges/?Id=" + projectID, JSON.stringify(hingetoSave), saveHingeSuccess, error);
}

function onSubmitFunc() {
    var Id = -1;
    //var Image = "car.jpg"; // no image at this point
    if (mode === "edit") {
        Id = hinge.ID;
    }

    let hingetoSave = {
        //ID: hinge.ID,
        Type: $("#hingeName").val(), 
        Cost: $("#hingeCost").val() 
    };

    if (mode === "edit")
        ajaxCall("PUT", "../api/hinges/?Id=" + Id, JSON.stringify(hingetoSave), updateSuccess, error);
   
    else if ((mode === "new") || (mode === "duplicate")) // add a new item record to the server
        ajaxCall("POST", "../api/hinges", JSON.stringify(hingetoSave), insertSuccess, error);

    return false;
}

function onSubmitFunc2() {
   
    let projecttoSave = {
        ID: getParameterByName("projectId"),
        project_name: $("#projectName").val(), 
        description: $("#projectDescription").val(),
        create_date: $("#createDate").val(), 
        //status: $("#status").val(),       
       
        architect: $("#projectArchitect").val(),
        supervisor: $("#projectSupervisor").val(),
        cost: $("#projectCost").val()
        //customer_id: $("#itemName").val()

    };
    ajaxCall("PUT", "../api/projects/?Id=" + projectID, JSON.stringify(projecttoSave), updateProjectSuccess, error);

    return false;
}

function populateFields(hingeId) {    // fill the form fields
    //debugger;
    hinge = getHinge(hingeId);
    console.log(hinge);
    //$("#image").attr("src", "images/" + item.Image);
    $("#hingeName").val(hinge.Type);
   
    $("#hingeCost").val(hinge.Cost);

}
    // fill the form fields
    function clearFields() {
        //$("#itemCost").val(item.Cost);
        $("#itemName").val("פריט כללי");
        //$("#boxMaterial").val("");
        //$("#boxMeasures").val("");
        $("#partitions").val(0),
            $("#shelves").val(0);
        //$("#isDistanced").is(':checked') ? 1 : 0,
        $("#boxWoodDrawers").val(0);
        $("#internalLegraBoxDrawers").val(0);
        $("#externalLegraBoxDrawers").val(0);
        $("#internalScalaBoxDrawers").val(0);
        $("#externalScalaBoxDrawers").val(0);
        // $("#facadeMaterialType").val(0);
        //$("#facade").val(itemsdata[i].FacadeID);
        $("#hingesQuantity1").val(0);
        //$("#hingesType1").val(0);
        $("#hingesQuantity2").val(0);
        //$("#hingesType1").val(itemsdata[i].HingesType1);
        $("#extraWallQuantity").val(0);
        //$("#extraWallType").val(itemsdata[i].ExtraWallTypeID);
        $("#handlesQuantity").val(0);
        //$("#handlesType").val(itemsdata[i].handlesType);
        $("#ironWorksQuantity1").val(0);
        //$("#ironWorksType1").val(itemsdata[i].ironWorksType1);
        $("#ironWorksQuantity2").val(0);
        //$("#ironWorksType2").val(itemsdata[i].IronWorksType2);
        //  $("#image").attr("src", "images/item.jpg");
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

function updateSuccess() {    // success callback function after update
   // location.reload();
   //tbl.clear();
    uri = "../api/hinges";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    //redrawTable(tbl, itemsdata);
    buttonEvents();
    $("#hingesEditDiv").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function updateProjectSuccess() {    // success callback function after update

    buttonEvents();
    $("#hingesEditDiv").hide();
    swal("עודכן בהצלחה!", "הפרויקט נשמר בהצלחה", "success");
    mode = "";

    //window.location.href = 'projectsList.html';
}

function insertSuccess(itemsdata) {  // success callback function after adding new item
    $("#hingesForm").show();
    //tbl.clear();
    uri = "../api/hinges";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    //redrawTable(tbl, itemsdata);
    buttonEvents();
    $("#hingesEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

// success callback function after delete
function deleteSuccess(itemsdata) {
    //tbl.clear();
    //  redrawTable(tbl, itemsdata);
    uri = "../api/hinges";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    buttonEvents(); // after redrawing the table, we must wire the new buttons
    $("#hingesEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedData(hinges) {
    console.log("got into the new function!");
    var dataTable = $('#hingesTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetHingesEdit(hinges);
}



