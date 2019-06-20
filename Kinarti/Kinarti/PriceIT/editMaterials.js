var myBoxes;
var myMaterials;
var myFacades;
var myHandles, handlesCost;
var materialsCost1, materialsCost2;
//var constants;
//var params;
//var height, width, depth;
var myIronWorks, ironWorksCost1, ironWorksCost2;
//var numberOfDistancedInternalDrawer = 1;
//var facadeColorWorkCoefficient, facadeFRNWorkCoefficient;
//var woodBoxDrawerWorkCost;
//var isColor = 1;
//var projectID;

//var boxWorkCost;
//var isDistanced = 0;

//var plateWorkCostForSquareMeter;
//var plateSquareMeter;
//var drawerCoefficientCost;
//var materialWoodDrawersCoefficient;
//var myFacadeMaterials;

//var extraCostForItem;
//var myItems;
var myExrtaWallTypeID;
//var TC;
//var totalCost;

$(document).ready(function () {

    //ajaxCall("GET", "../api/materials", "", successGetMaterialsEdit, error);
    ajaxCall("GET", "../api/materials", "", successGetMaterialsEdit, error); //get all materials from DB
    //ajaxCall("GET", "../api/facades", "", successGetFacadesEdit, error);
    //ajaxCall("GET", "../api/boxes", "", successGetBoxesEdit, error);
    //ajaxCall("GET", "../api/handles", "", successGetHandlesEdit, error);
    //ajaxCall("GET", "../api/constants", "", successGetConstantsEdit, error);
    //ajaxCall("GET", "../api/ironWorks", "", successGetIronWorksEdit, error);
    //ajaxCall("GET", "../api/facadeMaterials", "", successGetFacadeMaterialsEdit, error);

    mode = "";

    $("#cancelSaveBTN").on("click", function () {
        item = null;
        $("#materialsEditDiv").hide();
        if (mode === "new") $("#pForm").show();
        mode = "";
    });

    $("#newBTN").on("click", function () {
        item = null;
        mode = "new";
        $("#pForm").hide();
        $("#materialsEditDiv").show();
        clearFields();
        $("#materialsEditDiv :input").prop("disabled", false); // new mode: enable all controls in the form
    });

    $("#saveBTN").on("click", function () {
        onSubmitFunc();
    });

    $("#materialsEditDiv").hide();

    $('input[type=radio][name=status]').change(function () {
        var radioValue = $("input[name='status']:checked").val();
        var isActive = radioValue == 'inProgress' ? 0 : 1; // replace with true value

        ajaxCall("PUT", "../api/projects/?isActive=" + isActive + "&ProjectID=" + projectID, "", updateStatusSuccess, error);
    });

});

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
        tbl = $('#materialsTable').DataTable({
            data: materialsdata,
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

function f2() {
   // addItem();
    return false; // the return false will prevent the form from being submitted, hence the page will not reload
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
        $("#materialsEditDiv").show();
        $("#materialsEditDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-hingeId')); // fill the form fields according to the selected row
    });

    ///////////duplicating
    $(document).on("click", ".duplicateBtn", function () {
        mode = "duplicate";
        markSelected(this);
        $("#materialsEditditDiv").show();
        $("#materialsEditditDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-itemId')); // fill the form fields according to the selected row
    });

    $(document).on("click", ".viewBtn", function () {
        mode = "view";
        markSelected(this);
        $("#materialsEditDiv").show();
        row.className = 'selected';
        $("#materialsEditDiv :input").attr("disabled", "disabled"); // view mode: disable all controls in the form
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
    $("#materialsTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}


function DeleteHinge(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/materials/?Id=" + id, "", deleteSuccess, error);
}

function saveProject(id) {      // Delete a item from the server
    ajaxCall("PUT", "../api/materials/?Id=" + projectID, JSON.stringify(hingetoSave), saveHingeSuccess, error);
}

function onSubmitFunc() {
    var Id = -1;
    //var Image = "car.jpg"; // no image at this point
    if (mode === "edit") {
        Id = hinge.ID;
        //Image = car.Image; // no image at this point
    }

    let hingetoSave = {
        //ID: hinge.ID,
        Type: $("#hingeName").val(), 
        Cost: $("#hingeCost").val() 
    };

    if (mode === "edit")
        ajaxCall("PUT", "../api/materials/?Id=" + Id, JSON.stringify(hingetoSave), updateSuccess, error);
   
    else if ((mode === "new") || (mode === "duplicate")) // add a new item record to the server
        ajaxCall("POST", "../api/materials", JSON.stringify(hingetoSave), insertSuccess, error);

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
        $("#materialsQuantity1").val(0);
        //$("#materialsType1").val(0);
        $("#materialsQuantity2").val(0);
        //$("#materialsType1").val(itemsdata[i].MaterialsType1);
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
    console.log(myMaterials);
    for (i in myMaterials) {
        if (myMaterials[i].ID == id)
            return myMaterials[i];
    }
    return null;
}

function updateSuccess() {    // success callback function after update
   // location.reload();
   //tbl.clear();
    uri = "../api/materials";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    //redrawTable(tbl, itemsdata);
    buttonEvents();
    $("#materialsEditDiv").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function updateProjectSuccess() {    // success callback function after update

    buttonEvents();
    $("#materialsEditDiv").hide();
    swal("עודכן בהצלחה!", "הפרויקט נשמר בהצלחה", "success");
    mode = "";

    //window.location.href = 'projectsList.html';
}

function insertSuccess(itemsdata) {  // success callback function after adding new item
    $("#pForm").show();
    //tbl.clear();
    uri = "../api/materials";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    //redrawTable(tbl, itemsdata);
    buttonEvents();
    $("#materialsEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

// success callback function after delete
function deleteSuccess(itemsdata) {
    //tbl.clear();
    //  redrawTable(tbl, itemsdata);
    uri = "../api/materials";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    buttonEvents(); // after redrawing the table, we must wire the new buttons
    $("#materialsEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedData(materials) {
    console.log("got into the new function!");
    var dataTable = $('#materialsTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetMaterialsEdit(materials);
}



