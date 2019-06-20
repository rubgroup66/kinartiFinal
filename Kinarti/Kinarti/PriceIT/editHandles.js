var myBoxes;
var myMaterials;
var myFacades;
var myHandles, handlesCost;
var myHandles, handlesCost1, handlesCost2;
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

    ajaxCall("GET", "../api/handles", "", successGetHandlesEdit, error);
    //ajaxCall("GET", "../api/materials", "", successGetMaterialsEdit, error); //get all materials from DB
    //ajaxCall("GET", "../api/facades", "", successGetFacadesEdit, error);
    //ajaxCall("GET", "../api/boxes", "", successGetBoxesEdit, error);
    //ajaxCall("GET", "../api/handles", "", successGetHandlesEdit, error);
    //ajaxCall("GET", "../api/constants", "", successGetConstantsEdit, error);
    //ajaxCall("GET", "../api/ironWorks", "", successGetIronWorksEdit, error);
    //ajaxCall("GET", "../api/facadeMaterials", "", successGetFacadeMaterialsEdit, error);

    mode = "";

    $("#cancelSaveBTN").on("click", function () {
        item = null;
        $("#handlesEditDiv").hide();
        if (mode === "new") $("#pForm").show();
        mode = "";
    });

    $("#newBTN").on("click", function () {
        item = null;
        mode = "new";
        $("#pForm").hide();
        $("#handlesEditDiv").show();
        clearFields();
        $("#handlesEditDiv :input").prop("disabled", false); // new mode: enable all controls in the form
    });

    $("#saveBTN").on("click", function () {
        onSubmitFunc();
    });

    $("#handlesEditDiv").hide();

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

function successGetHandlesEdit(handlesdata) {// this function is activated in case of a success
    console.log(handlesdata);
    myHandles = handlesdata;
    try {
        tbl = $('#handlesTable').DataTable({
            data: handlesdata,
            pageLength: 5,
            columns: [
                { data: "ID" },
                { data: "Type" },
                { data: "Cost" },
                {
                    render: function (data, type, row, meta) {
                        let dataHandle = "data-handleId='" + row.ID + "'";
                        editBtn = "<button type='button' class = 'editBtn btn btn-success' " + dataHandle + "> עריכה </button>";
                        viewBtn = "<button type='button' class = 'viewBtn btn btn-info' " + dataHandle + "> צפייה </button>";
                        //duplicateBtn = "<button type='button' class = 'duplicateBtn btn btn-info' " + dataHandle + "> שכפול + </button>";
                        deleteBtn = "<button type='button' class = 'deleteBtn btn btn-danger' " + dataHandle + "> מחיקה </button>";
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
        $("#handlesEditDiv").show();
        $("#handlesEditDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-handleId')); // fill the form fields according to the selected row
    });

    ///////////duplicating
    $(document).on("click", ".duplicateBtn", function () {
        mode = "duplicate";
        markSelected(this);
        $("#handlesEditditDiv").show();
        $("#handlesEditditDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-itemId')); // fill the form fields according to the selected row
    });

    $(document).on("click", ".viewBtn", function () {
        mode = "view";
        markSelected(this);
        $("#handlesEditDiv").show();
        row.className = 'selected';
        $("#handlesEditDiv :input").attr("disabled", "disabled"); // view mode: disable all controls in the form
        populateFields(this.getAttribute('data-itemId'));
    });

    $(document).on("click", ".deleteBtn", function () {
        mode = "delete";
        markSelected(this);
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
    $("#handlesTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}


function DeleteHandle(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/handles/?Id=" + id, "", deleteSuccess, error);
}

function saveProject(id) {      // Delete a item from the server
    ajaxCall("PUT", "../api/handles/?Id=" + projectID, JSON.stringify(handletoSave), saveHandleSuccess, error);
}

function onSubmitFunc() {
    var Id = -1;
    //var Image = "car.jpg"; // no image at this point
    if (mode === "edit") {
        Id = handle.ID;
        //Image = car.Image; // no image at this point
    }

    let handletoSave = {
        //ID: handle.ID,
        Type: $("#handleName").val(), 
        Cost: $("#handleCost").val() 
    };

    if (mode === "edit")
        ajaxCall("PUT", "../api/handles/?Id=" + Id, JSON.stringify(handletoSave), updateSuccess, error);
   
    else if ((mode === "new") || (mode === "duplicate")) // add a new item record to the server
        ajaxCall("POST", "../api/handles", JSON.stringify(handletoSave), insertSuccess, error);

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

function populateFields(handleId) {    // fill the form fields
    //debugger;
    handle = getHandle(handleId);
    console.log(handle);
    //$("#image").attr("src", "images/" + item.Image);
    $("#handleName").val(handle.Type);
   
    $("#handleCost").val(handle.Cost);

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
        $("#handlesQuantity1").val(0);
        //$("#handlesType1").val(0);
        $("#handlesQuantity2").val(0);
        //$("#handlesType1").val(itemsdata[i].HandlesType1);
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
function getHandle(id) {
    console.log(myHandles);
    for (i in myHandles) {
        if (myHandles[i].ID == id)
            return myHandles[i];
    }
    return null;
}

function updateSuccess() {    // success callback function after update
   // location.reload();
   //tbl.clear();
    uri = "../api/handles";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    //redrawTable(tbl, itemsdata);
    buttonEvents();
    $("#handlesEditDiv").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function updateProjectSuccess() {    // success callback function after update

    buttonEvents();
    $("#handlesEditDiv").hide();
    swal("עודכן בהצלחה!", "הפרויקט נשמר בהצלחה", "success");
    mode = "";

    //window.location.href = 'projectsList.html';
}

function insertSuccess(itemsdata) {  // success callback function after adding new item
    $("#pForm").show();
    //tbl.clear();
    uri = "../api/handles";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    //redrawTable(tbl, itemsdata);
    buttonEvents();
    $("#handlesEditDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

// success callback function after delete
function deleteSuccess(itemsdata) {
    //tbl.clear();
    //  redrawTable(tbl, itemsdata);
    uri = "../api/handles";
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    buttonEvents(); // after redrawing the table, we must wire the new buttons
    $("#handlesEditDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedData(handles) {
    console.log("got into the new function!");
    var dataTable = $('#handlesTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetHandlesEdit(handles);
}



