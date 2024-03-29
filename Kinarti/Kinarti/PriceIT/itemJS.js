﻿var myBoxes;
var myMaterials;
var myFacades;
var myHandles, handlesCost;
var myHinges, hingesCost1, hingesCost2;
var constants;
var params;
var height, width, depth;
var myIronWorks, ironWorksCost1, ironWorksCost2;
var numberOfDistancedInternalDrawer = 1;
var facadeColorWorkCoefficient, facadeFRNWorkCoefficient;
var woodBoxDrawerWorkCost;
var isColor = 1;
var projectID;

var boxWorkCost;
var isDistanced = 0;

var plateWorkCostForSquareMeter;
var plateSquareMeter;
var drawerCoefficientCost;
var materialWoodDrawersCoefficient;
var myFacadeMaterials;

var extraCostForItem;
var myItems;
var myExrtaWallTypeID;
var TC;
var totalCost;

var myProject;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$(document).ready(function () {

    function loadProjectID() {    //load project name
        if (localStorage["storageProj_ID"] !== null) {
            //var proj_name = localStorage.getItem("storageProj_name");
            var projectID = JSON.parse(localStorage["storageProj_ID"]);
            projectID = JSON.parse(localStorage["storageProj_ID"]);
            document.getElementById("projectID").innerHTML = projectID;
            // $('#projectName').val(projectName);
            console.log(projectID);
        }
    }

    projectID = getParameterByName("projectId");

    uri2 = "../api/projects/?projectID=" + projectID;
    ajaxCall("GET", uri2, "", successGetProject, errorGetProject); //get project's details from DB

    ajaxCall("GET", "../api/materials", "", successGetMaterials, errorGetMaterials); //get all materials from DB
    ajaxCall("GET", "../api/facade", "", successGetFacades, errorGetFacades);
    ajaxCall("GET", "../api/boxes", "", successGetBoxes, errorGetBoxes);
    ajaxCall("GET", "../api/handles", "", successGetHandles, errorGetHandles);
    ajaxCall("GET", "../api/hinges", "", successGetHinges, errorGetHinges);
    ajaxCall("GET", "../api/constants", "", successGetConstants, errorGetConstants);
    ajaxCall("GET", "../api/ironWorks", "", successGetIronWorks, errorGetIronWorks);
    ajaxCall("GET", "../api/facadeMaterials", "", successGetFacadeMaterials, errorGetFacadeMaterials);


    mode = "";

    $("#cancelSaveBTN").on("click", function () {
        item = null;
        $("#editDiv").hide();
        if (mode === "new") $("#pForm").show();
        mode = "";
    });

    $("#newBTN").on("click", function () {

        //var showButton = '"<span class="glyphicon glyphicon-plus - sign" ></span> ביטול';
        //var hidebutton = '"<span class="glyphicon glyphicon-plus - sign" ></span> הוספת פריט';

        //$("#newBTN").text('value', '<span class="glyphicon glyphicon-plus-sign" ></span> ביטול'); 

        //var radioValue = $("input[name='status']:checked").val();
        var radioValue = $("input[name='status']:checked").val();
        var isActive = radioValue == 'inProgress' ? 0 : 1; // replace with true value

        if (isActive == 1) {
            swal("!לא ניתן להוסיף פריטים נוספים..", "כדי לאפשר הוספה נדרש להעביר את הפרויקט למצב 'בתהליך'", "info");
        }
        else {

            if ($("#editDiv").is(":visible")  ) {
                item = null;
                $("#editDiv").hide();
                if (mode === "new") $("#pForm").show();
                mode = "";
            }
            else {
                item = null;
                mode = "new";
                $("#pForm").hide();
                $("#editDiv").show();
                clearFields();
                $("#editDiv :input").prop("disabled", false); // new mode: enable all controls in the form
            }

        }
    });

    $("#saveBTN").on("click", function () {
        onSubmitFunc();
    });

    $("#editDiv").hide();

    $('input[type=radio][name=status]').change(function () {
        var radioValue = $("input[name='status']:checked").val();
        var isActive = radioValue == 'inProgress' ? 0 : 1; // replace with true value

        ajaxCall("PUT", "../api/projects/?isActive=" + isActive + "&ProjectID=" + projectID, "", updateStatusSuccess, error);
    });

});

function updateStatusSuccess() {

    var radioValue = $("input[name='status']:checked").val();
    var isActive = radioValue == 'inProgress' ? 0 : 1; // replace with true value
    if (isActive == 1) {
    $("#editDiv :input").attr("disabled", "disabled"); 
        $(".projectDetails :input").attr("disabled", "disabled"); 
        swal("סטטוס הפרויקט עודכן בהצלחה!", "ניתן לצפות בפרטי הפרויקט", "success");
    }
    else {
        $("#editDiv :input").attr("disabled", false);
        $(".projectDetails :input").attr("disabled", false);     
        swal("סטטוס הפרויקט עודכן בהצלחה!", "כעת ניתן להוסיף ולערוך פריטים", "success");
    }


}

function successGetProject(projectdata) {// this function is activated in case of a success
    console.log(projectdata);
    myProject = projectdata;
    $("#projectName").val(projectdata.project_name);

    var date = new Date(projectdata.create_date);

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    var formattedDate = day + '/' + month + '/' + year;

    $("#createDate").val(formattedDate);

    $("#projectCost").val(formatNumber(projectdata.cost));

    $("#projectDescription").val(projectdata.description);

    if (myProject.status === 1) {
        $("#doneBtn").addClass("active");
        $("#done").attr("checked", "checked");
        $("#inProgressBtn").removeClass("active");
        $("#editDiv :input").attr("disabled", "disabled"); // this needs to be disabled when status = 1
    }
    else {
        $("#inProgressBtn").addClass("active");
        $("#inProgress").attr("checked", "checked");
        $("#doneBtn").removeClass("active");
    }

    ajaxCall("GET", "../api/architect", "", successGetArchitect, errorGetArchitect);
    ajaxCall("GET", "../api/supervisor", "", successGetSupervisor, errorGetSupervisor);

    uriCustomer = "../api/getCust/?customerID=" + projectdata.customer_id;
    ajaxCall("GET", uriCustomer, "", successGetCustomers, error);

    uri = "../api/items/?projectID=" + projectID;
    ajaxCall("GET", uri, "", successGetItems, error); //get all relevant project's items from DB  

}

//$("#projectSupervisor").val(projectdata.supervisor);

function successGetSupervisor(supervisordata) {// this function is activated in case of a success
    console.log(supervisordata);
    for (var i = 0; i < supervisordata.length; i++) {
            if (myProject.supervisor == supervisordata[i].sup_id) {
            $("#projectSupervisor").val(supervisordata[i].sup_name);
            break;
        }
    }
   
}

function errorGetSupervisor(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור מפקח");
}
function successGetArchitect(architectdata) {// this function is activated in case of a success
    console.log(architectdata);
    for (var i = 0; i < architectdata.length; i++) {
        if (myProject.architect == architectdata[i].arc_id) {
            $("#projectArchitect").val(architectdata[i].arc_name);
            break;
        }
    }

}

function errorGetArchitect(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור אדריכל");
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
    console.log(myBoxes);
}

function successGetHandles(handlesdata) {// this function is activated in case of a success
    myHandles = handlesdata;
    for (var i = 0; i < handlesdata.length; i++) {
        $('#handlesType').append('<option value="' + handlesdata[i].ID + '" >' + handlesdata[i].Type + '</option>');
    }
}

function successGetHinges(hingesdata) {// this function is activated in case of a success
    myHinges = hingesdata;
    for (var i = 0; i < hingesdata.length; i++) {
        $('#hingesType1').append('<option value="' + hingesdata[i].ID + '" >' + hingesdata[i].Type + '</option>');
        $('#hingesType2').append('<option value="' + hingesdata[i].ID + '" >' + hingesdata[i].Type + '</option>');
    }
}

function successGetIronWorks(ironworksdata) {// this function is activated in case of a success
    myIronWorks = ironworksdata;
    for (var i = 0; i < ironworksdata.length; i++) {
        $('#ironWorksType1').append('<option value="' + ironworksdata[i].ID + '" >' + ironworksdata[i].Type + '</option>');
        $('#ironWorksType2').append('<option value="' + ironworksdata[i].ID + '" >' + ironworksdata[i].Type + '</option>');
    }
}

function successGetCustomers(customersdata) {// this function is activated in case of a success
    $("#customerName").val((customersdata.first_name + " " + customersdata.last_name));
}

function successGetFacadeMaterials(facadeMaterialsdata) {// this function is activated in case of a success
    myFacadeMaterials = facadeMaterialsdata;
    for (var i = 0; i < facadeMaterialsdata.length; i++) {
        $('#facadeMaterialType').append('<option value="' + facadeMaterialsdata[i].ID + '" >' + facadeMaterialsdata[i].Name + '</option>');
    }
}


// עצרתי בטעינת הצצבעים של החזיתות (גמר + קיר נוסף)


function successGetConstants(constantsdata) {// this function is activated in case of a success
    constants = constantsdata;
    console.log(constants);
}

var materialCoefficient;
var itemTotalSum = 0;

function calculateItem() {
    collectChoices();
    //var basicMaterialCoefficient boxWorkCost * height * depth + (height * width / 10000 * facadeColorWorkCoefficient + height * width / 10000 * 100) + facadeFRNWorkCoefficient * height * width / 10000 + height * width / 10000 * 100 + 12 * (height * 2 + width * 2); //need to update according to material type params.extraWallTypeID)
    var basicMaterialCoefficient = 8.5;
    boxSquareMeter = (2 * height * depth + 2 * width * depth + height * width) / 10000;

    var boxCost = basicMaterialCoefficient * boxSquareMeter * materialCoefficient + boxWorkCost * boxSquareMeter + lacquerWorkCost * boxSquareMeter;

    var withPartitions = params.partitionsQuantity * (boxWorkCost * height * depth * 2 + lacquerWorkCost * height * depth * 2);

    var withShelves = (boxWorkCost * depth * width + lacquerWorkCost * height * width) * params.shelvesQuantity / (params.partitionsQuantity + 1);

    var plateSquareMeter = (drawerCoefficientCost * (depth - 5) * (2 * + width * 2 * drawerCoefficientCost + (depth - 5) * width)) / 10000;

    var withboxWoodDrawers = (plateSquareMeter * basicMaterialCoefficient * materialWoodDrawersCoefficient + plateSquareMeter * lacquerWorkCost + woodRailsCost + woodBoxDrawerWorkCost) * params.boxWoodDrawersQuantity;
    
    var withInternalLegraBoxDrawers = (LegraBoxDrawerWork + LegraboxInternalRailsCost) * params.internalLegraBoxDrawersQuantity;
    var withExternalLegraBoxDrawers = (LegraBoxDrawerWork + LegraboxExternalRailsCost) * params.externalLegraBoxDrawersQuantity;

    var ScalaSquareMeter = ((depth - 5) * width + drawerCoefficientCost * width) / 1000;

    var withInternalScalaBoxDrawers = (ScalaSquareMeter * ScalaCoefficient * ScalaDrawerWork + ScalaInternalRailsCost) * params.internalScalaBoxDrawersQuantity;
    var withExternalScalaBoxDrawers = (ScalaSquareMeter * ScalaCoefficient * ScalaDrawerWork + ScalaExternalRailsCost) * params.externalScalaBoxDrawersQuantity;

    var withDistancedInternalDrawer = isDistanced * (woodBoxDrawerWorkCost * numberOfDistancedInternalDrawer + (depth - 7) * lacquerWorkCost) / 10000;  //not final

    var withFacade = plateSquareMeter * facadeMaterialWorkCost + facadeworkCostForSquareMeter + (plateSquareMeter * 2 * facadeColorWorkCoefficient * isColor + plateSquareMeter * 2 * facadeFRNWorkCoefficient + 12 * (height * 2 + width * 2) * (isColor + 1)); // kantim

    var withExtraWall = params.extraWallQuantity * (height * depth * basicMaterialCoefficient + boxWorkCost * height * depth + (height * width / 10000 * facadeColorWorkCoefficient + height * width / 10000 * 100) + facadeFRNWorkCoefficient * height * width / 10000 + height * width / 10000 * 100 + 12 * (height * 2 + width * 2)); //need to update according to material type params.extraWallTypeID)

    var withHinges1 = hingesCost1 * params.hingesQuantity1;
    var withHinges2 = hingesCost2 * params.hingesQuantity2;

    var withHandles = handlesCost * params.handlesQuantity;
    //debugger;
    var withIronWorks1 = ironWorksCost1 * params.ironWorksQuantity1;
    var withIronWorks2 = ironWorksCost2 * params.ironWorksQuantity2;

    itemTotalSum = boxCost + withPartitions/10
        + withShelves/10 + withboxWoodDrawers/10
        + withInternalLegraBoxDrawers/10 + withExternalLegraBoxDrawers/10
        + withInternalScalaBoxDrawers + withExternalScalaBoxDrawers/10
        + withHinges1 + withHinges2 + withHandles
        + withIronWorks1 + withIronWorks2
        + withDistancedInternalDrawer + withExtraWall/10 + withFacade/10 + extraCostForItem;

    // temporary ! dividing by 10

    console.log("withFacade +" + withFacade);
    console.log("withExtraWall +" + withExtraWall);
    console.log("withDistancedInternalDrawer +" + withDistancedInternalDrawer);  
    console.log("withPartitions +" + withPartitions);
    console.log("withShelves +" + withShelves);
    console.log("withboxWoodDrawers +" + withboxWoodDrawers);
    console.log("withInternalLegraBoxDrawers +" + withInternalLegraBoxDrawers);
    console.log("withExternalLegraBoxDrawers +" + withExternalLegraBoxDrawers);
    console.log("withInternalScalaBoxDrawers +" + withInternalScalaBoxDrawers);
    console.log("withExternalScalaBoxDrawers +" + withExternalScalaBoxDrawers);
    console.log("withHinges1 +" + withHinges1);
    console.log("withHinges2 +" + withHinges2);
    console.log("withHandles +" + withHandles);

    console.log(itemTotalSum);
    var formattedNumber = formatNumber(Math.round(itemTotalSum)); 
    $('#itemCostCalculation').html("<strong> עלות פריט: " + formattedNumber + "  שח " +"</strong>");

    return false; // the return false will prevent the form from being submitted, hence the page will not reload
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function collectChoices() {
    params = {
        boxID: $("#boxMeasures").val(),
        materialID: $("#boxMaterial").val(),
        partitionsQuantity: $("#partitions").val(),
        shelvesQuantity: $("#shelves").val(),
        boxWoodDrawersQuantity: $("#boxWoodDrawers").val(),
        internalLegraBoxDrawersQuantity: $("#internalLegraBoxDrawers").val(),
        externalLegraBoxDrawersQuantity: $("#externalLegraBoxDrawers").val(),
        internalScalaBoxDrawersQuantity: $("#internalScalaBoxDrawers").val(),
        externalScalaBoxDrawersQuantity: $("#externalScalaBoxDrawers").val(),
        facadeID: $("#facadeType").val(),
        facadeType: $("#facadeMaterialType").val(),
        hingesType1ID: $("#hingesType1").val(),
        hingesQuantity1: $("#hingesQuantity1").val(),
        hingesType2ID: $("#hingesType2").val(),
        hingesQuantity2: $("#hingesQuantity2").val(),
        extraWallTypeID: $("#extraWallType").val(),
        extraWallQuantity: $("#extraWallQuantity").val(),
        handlesTypeID: $("#handlesType").val(),
        handlesQuantity: $("#handlesQuantity").val(),
        ironWorksType1ID: $("#ironWorksType1").val(),
        ironWorksQuantity1: $("#ironWorksQuantity1").val(),
        ironWorksType2ID: $("#ironWorksType2").val(),
        ironWorksQuantity2: $("#ironWorksQuantity2").val()
    };

    for (i = 0; i < myBoxes.length; i++) {
        if (myBoxes[i].ID.toString() === params.boxID) { // this is the handles cost
            height = myBoxes[i].Height;
            width = myBoxes[i].Width;
            depth = myBoxes[i].Depth;
        }
    }

    boxWorkCost = constants[0].Cost;
    lacquerWorkCost = constants[1].Cost;
    //basicMaterialCoefficient = constants[2].Cost;

    for (i = 0; i < myMaterials.length; i++) {
        if (myMaterials[i].ID.toString() === params.materialID) { // this is the specific material cost
            materialCoefficient = myMaterials[i].Coefficient;
        }
    }

    numberOfDistancedInternalDrawer = height >= 70 ? 2 : 1;// if number height is less than 70 there is only one distanced drawer

    for (var i = 0; i < myFacades.length; i++) {
        if (myFacades[i].ID.toString() === params.facadeID) { // this is the handles cost
            facadesCost = myFacades[i].Cost;
        }
    }

    woodRailsCost = constants[5].Cost;

    for (i = 0; i < myHinges.length; i++) {
        if (myHinges[i].ID.toString() === params.hingesType1ID) { // this is hinges 1 cost
            hingesCost1 = myHinges[i].Cost;
        }
        else
            hingesCost1 = 0;

        if (myHinges[i].ID.toString() === params.hingesType2ID) { // this is hinges 2 cost
            hingesCost2 = myHinges[i].Cost;
        }
        else
            hingesCost2 = 0;
    }

    for (i = 0; i < myHandles.length; i++) {
        if (myHandles[i].ID.toString() === params.handlesTypeID) { // this is the handles cost
            handlesCost = myHandles[i].Cost;
        }
        else
            handlesCost = 0;
    }
    for (i = 0; i < myIronWorks.length; i++) {
        if (myIronWorks[i].ID.toString() === params.ironWorksType1ID) { // this is hinges 1 cost
            ironWorksCost1 = myIronWorks[i].Cost;
        }
        else {
            ironWorksCost1 = 0;
        }

        if (myIronWorks[i].ID.toString() === params.ironWorksType2ID) { // this is hinges 2 cost
            ironWorksCost2 = myIronWorks[i].Cost;
        }
        else { ironWorksCost2 = 0; }

        woodBoxDrawerWorkCost = constants[6].Cost;
        LegraBoxDrawerWork = constants[7].Cost;

        ScalaDrawerWork = constants[8].Cost;
        drawerCoefficientCost = constants[3].Cost;
        //plateThickness = constants[4].Cost;
        ScalaCoefficient = constants[9].Cost;
        LegraboxInternalRailsCost = constants[10].Cost;
        LegraboxExternalRailsCost = constants[12].Cost;
        ScalaInternalRailsCost = constants[11].Cost;
        ScalaExternalRailsCost = constants[4].Cost;

        facadeFRNWorkCoefficient = constants[15].Cost;// 280

        plateWorkCostForSquareMeter = constants[13].Cost;// 25
        facadeColorWorkCoefficient = constants[14].Cost; // 200;
        facadeworkCostForSquareMeter = plateWorkCostForSquareMeter / (height * width);

        plateSquareMeter = height * width / 10000;

        for (i = 0; i < myFacadeMaterials.length; i++) {
            if (myFacadeMaterials[i].ID.toString() === params.facadeType) { // this is facade cost
                facadeMaterialWorkCost = myFacadeMaterials[i].Cost;
            }
            else {
                facadeMaterialWorkCost = 47;
            }
        }
        materialWoodDrawersCoefficient = 2.64;
        //materialWoodDrawersCoefficient = params.materialWoodDrawersCoefficient;

        extraCostForItem = document.getElementById("extraCostForItem").value;
    }
}
//// this should be used when the active value is changed
function buttonEvents() {
    $(document).on("click", ".isDistanced", function () {
        isDistanced = $(this).is(':checked') ? 1 : 0; // replace with true value
        console.log("change made");
    });

    $(document).on("click", ".editBtn", function () {
        mode = "edit";        // edit mode: enable all controls in the form
        markSelected(this);
        $("#editDiv").show();

        if (myProject.status === 1) {
            $("#editDiv :input").prop("disabled", "disabled");
        }
        else {
            $("#editDiv :input").prop("disabled", false);
        }

        populateFields(this.getAttribute('data-itemId')); // fill the form fields according to the selected row
    });

    $(document).on("click", ".duplicateBtn", function () {///////////duplicating
        mode = "duplicate";
        markSelected(this);
        $("#editDiv").show();
        $("#editDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-itemId')); // fill the form fields according to the selected row
    });

    $(document).on("click", ".viewBtn", function () {
        mode = "view";
        markSelected(this);
        $("#editDiv").show();
        row.className = 'selected';
        $("#editDiv :input").attr("disabled", "disabled"); // view mode: disable all controls in the form
        populateFields(this.getAttribute('data-itemId'));
    });

    $(document).on("click", ".deleteBtn", function () {
        mode = "delete";
        markSelected(this);
        var itemId = this.getAttribute('data-itemId');
        swal({ // this will open a dialouge 
            title: "האם אתה בטוח ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteItem(itemId);
                else swal("הפריט לא נמחק");
            });
    });

    //////return to projects
    //$(document).on("click", "#finish", function () {
    //    markSelected(this);
    //    var itemId = this.getAttribute('data-itemId');
    //    swal({ // this will open a dialouge 
    //        title: "האם ברצונך לסגור את הפרויקט ?",
    //        text: "",
    //        icon: "warning",
    //        buttons: true,
    //        dangerMode: true
    //    })
    //        .then(function (willClose) {
    //            if (willClose) CloseProject(projectID);
    //            else swal("הפריט נותר פתוח לעריכה");
    //            parent.location = 'projectsList.html';
    //        });
    //});
    ////////////////////////////////////////////////////////

    $("#finish").on("click", function () {
        onSubmitFunc2();
    });
}
function errorGetBoxes(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור מידות ארגזות");
}
function errorGetMaterials(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור חומרי גלם");
}
function errorGetProject(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור הפרויקט");
}
function errorGetFacades(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור ציפויים חיצוניים");
}
function errorGetHandles(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור הפרויקט");
}
function errorGetConstants(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור פרמטרי חישוב");
}
function errorGetHinges(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור צירים");
}
function errorGetIronWorks(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור עלויות פרזולים");
}
function errorGetFacadeMaterials(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור חומרי גלם לגמרי חוץ");
}
function errorUpdateStatus(err) { // this function is activated in case of a failure
    swal("שגיאה בעדכון סטטוס הפרויקט");
}
function error(err) { // this function is activated in case of a failure
    swal("שגיאה: " + err);
}

function ShowInfo() {
    $("#info").show();
}

function markSelected(btn) {  // mark the selected row
    $("#itemsTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

function DeleteItem(id) {      // Delete item from the server
    ajaxCall("DELETE", "../api/items/?Id=" + id, "", deleteSuccess, error);
}

function saveProject() {      // save the project
    ajaxCall("PUT", "../api/projects/?Id=" + projectID, JSON.stringify(projecttoSave), saveProjectSuccess, error);
}

function onSubmitFunc() {
    var Id = -1;
    //var Image = "car.jpg"; // no image at this point
    if (mode === "edit") {
        Id = item.ID;
        //Image = car.Image; // no image at this point
    }
    console.log(projectID);
    calculateItem();
    let itemtoSave = {
        ProjectID: getParameterByName("projectId"),
        Type: "ארגזת", // 'type' will be always 1 untill we add a different kind of box
        Cost: itemTotalSum, /*$("#itemCost").val()*/
        Name: $("#itemName").val(),
        BoxMaterialID: $("#boxMaterial").val(),
        BoxMeasuresID: $("#boxMeasures").val(),
        Partitions: $("#partitions").val(),
        Shelves: $("#shelves").val(),
        IsDistanced: $("#isDistanced").is(':checked') ? 1 : 0,
        BoxWoodDrawers: $("#boxWoodDrawers").val(),
        InternalLegraBoxDrawers: $("#internalLegraBoxDrawers").val(),
        ExternalLegraBoxDrawers: $("#externalLegraBoxDrawers").val(),
        InternalScalaBoxDrawers: $("#internalScalaBoxDrawers").val(),
        ExternalScalaBoxDrawers: $("#externalScalaBoxDrawers").val(),
        FacadeMaterialTypeID: $("#facadeMaterialType").val(),
        FacadeID: $("#facadeType").val(),
        HingesQuantity1: $("#hingesQuantity1").val(),
        HingesType1ID: $("#hingesType1").val(),
        HingesQuantity2: $("#hingesQuantity2").val(),
        HingesType2ID: $("#hingesType1").val(),
        ExtraWallQuantity: $("#extraWallQuantity").val(),
        ExtraWallTypeID: $("#extraWallType").val(),
        HandlesQuantity: $("#handlesQuantity").val(),
        HandlesTypeID$: $("#handlesType").val(),
        IronWorksQuantity1: $("#ironWorksQuantity1").val(),
        IronWorksType1ID: $("#ironWorksType1").val(),
        IronWorksQuantity2: $("#ironWorksQuantity2").val(),
        IronWorksType2ID: $("#ironWorksType2").val(),
        ExtraCostForItem: $("#extraCostForItem").val()
    };

    if (mode === "edit")
        ajaxCall("PUT", "../api/items/?Id=" + Id, JSON.stringify(itemtoSave), updateSuccess, error);

    else if ((mode === "new") || (mode === "duplicate")) // add a new item record to the server
        ajaxCall("POST", "../api/items", JSON.stringify(itemtoSave), insertSuccess, error);

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
        //cost: $(int(TC)).val()
        cost: TC
    };
    ajaxCall("PUT", "../api/projects/?Id=" + projectID, JSON.stringify(projecttoSave), updateProjectSuccess, error);

    return false;
}

function populateFields(itemId) {    // fill the form fields
    item = getItem(itemId);
    console.log(item);
    //$("#image").attr("src", "images/" + item.Image);
    $("#itemName").val(item.Name);
    for (i = 0; i < myMaterials.length; i++) {
        if (myMaterials[i].ID.toString() === item.BoxMaterialID) { // this is the specific material cost
            $("#boxMaterial").val(myMaterials[i].Name);
        }
    }
        //$("#boxMeasures").val(item.BoxMeasures);
    for (i = 0; i < myBoxes.length; i++) {
        if (myBoxes[i].ID.toString() === item.BoxMeasuresID) { // this is the specific material cost
            $("#boxMeasures").val(myBoxes[i].Name);
        }
    }


    $("#partitions").val(item.Partitions);
    $("#shelves").val(item.Shelves);
    $("#isDistanced").is(':checked') ? 1 : 0;
    $("#boxWoodDrawers").val(item.BoxWoodDrawers);
    $("#internalLegraBoxDrawers").val(item.InternalLegraBoxDrawers);
    $("#externalLegraBoxDrawers").val(item.ExternalLegraBoxDrawers);
    $("#internalScalaBoxDrawers").val(item.InternalScalaBoxDrawers);
    $("#externalScalaBoxDrawers").val(item.ExternalScalaBoxDrawers);

    for (i = 0; i < myFacadeMaterials.length; i++) {
        if (myFacadeMaterials[i].ID.toString() === item.FacadeMaterialTypeID) { // this is the specific material cost
            $("#facadeMaterialType").val(item.FacadeMaterialTypeID);
        }
    }

    for (i = 0; i < myFacades.length; i++) {
        if (myFacades[i].ID.toString() === item.FacadeTypeID) { // this is the specific material cost
            $("#facade").val(item.FacadeID);
        }
    }

    $("#hingesQuantity1").val(item.HingesQuantity1);
    //$("#hingesType1").val(item.HingesType1);
    for (i = 0; i < myHinges.length; i++) {
        if (myHinges[i].ID.toString() === item.HingesType1ID) {
            $("#hingesType1").val(item.HingesType1ID);
        }
    }

    $("#hingesQuantity2").val(item.HingesQuantity2);
    //$("#hingesType1").val(item.HingesType1);
    for (i = 0; i < myHinges.length; i++) {
        if (myHinges[i].ID.toString() === item.HingesType2ID) {
            $("#hingesType1").val(item.HingesType2ID);
        }
    }

    $("#extraWallQuantity").val(item.ExtraWallQuantity);

    for (i = 0; i < myFacades.length; i++) {
        if (myFacades[i].ID.toString() === item.ExtraWallTypeID) { // this is the specific material cost
            $("#extraWallType").val(item.ExtraWallTypeID);
        }
    }

    $("#handlesQuantity").val(item.HandlesQuantity);

    //$("#handlesType").val(item.handlesType);
    for (i = 0; i < myHandles.length; i++) {
        if (myHandles[i].ID.toString() === item.HandlesTypeID) { // this is the specific material cost
            $("#handlesType").val(item.HandlesTypeID);
        }
    }

    $("#ironWorksQuantity1").val(item.IronWorksQuantity1);

    //$("#ironWorksType1").val(item.ironWorksType1);
    for (i = 0; i < myIronWorks.length; i++) {
        if (myIronWorks[i].ID.toString() === item.IronWorksType1ID) { // this is the specific material cost
            $("#ironWorksType1").val(item.IronWorksType1ID);
        }
    }

    $("#ironWorksQuantity2").val(item.IronWorksQuantity2);

    //$("#ironWorksType2").val(item.IronWorksType2);
    for (i = 0; i < myIronWorks.length; i++) {
        if (myIronWorks[i].ID.toString() === item.IronWorksType2ID) { // this is the specific material cost
            $("#ironWorksType2").val(item.IronWorksType2ID);
        }

        $("#extraCostForItem").val(item.ExtraCostForItem);
    }

    $("#itemCost").val(item.Cost);
    calculateItem();
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

function getItem(id) { // get item according to its Id
    console.log(myItems);
    for (i in myItems) {
        if (myItems[i].ID == id)
            return myItems[i];
    }
    return null;
}

function updateSuccess() {    // success callback function after update
    // location.reload();
    //tbl.clear();
    uri = "../api/items/?projectID=" + projectID;
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 
    //redrawTable(tbl, itemsdata);
    buttonEvents();
    $("#editDiv").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function updateProjectSuccess(data) {
    swal({ // this will open a dialouge
        title: "הפרויקט נשמר !",
        text: "עודכן בהצלחה!",
        icon: "success",
        button: "אישור"
    })
        .then(function (create) {

                window.location.href = 'projectsList.html';

        });

}











function insertSuccess(itemsdata) {  // success callback function after adding new item
    $("#pForm").show();
    //tbl.clear();
    uri = "../api/items/?projectID=" + projectID;
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 
    buttonEvents();
    $("#editDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

// success callback function after delete
function deleteSuccess(itemsdata) {
    uri = "../api/items/?projectID=" + projectID;
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    buttonEvents(); // after redrawing the table, we must wire the new buttons
    $("#editDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedData(items) {
    //console.log("got into the new function!");
    var dataTable = $('#itemsTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetItems(items);
}

function success(data) {
    swal("הפריט נוסף בהצלחה!", "ניתן להמשיך בתמחור פריטים נוספים", "success");
}

//// redraw a datatable with new data
//function redrawTable(tbl, itemsdata) {
//    tbl.clear();
//    for (var i = 0; i < itemsdata.length; i++) {
//        tbl.row.add(itemsdata[i]);
//    }
//    tbl.draw();
//}

function successGetItems(itemsdata) {    // this function is activated in case of a success
    console.log(itemsdata);
    myItems = itemsdata;
    //console.log(itemsdata[i].Cost); // **need to be fetched when the price is final!!
    //totalCost = totalCost + itemsdata[i].Cost;
    try {
        tbl = $('#itemsTable').DataTable({

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
            data: itemsdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return itemsdata.findIndex(i => i.ID === row.ID) + 1;
                    }
                },
                //{ data: "ID" },
                { data: "Name" },
                {
                    //data: "BoxMeasuresID" 
                    render: function (data, type, row, meta) {
                        let theRightBoxMeasures = myBoxes.find(function (item) {
                            return item.ID === row.BoxMeasuresID;
                        });
                        if (theRightBoxMeasures) {
                            return theRightBoxMeasures.Height + 'X' + theRightBoxMeasures.Width + 'X' + theRightBoxMeasures.Depth;
                        }
                    }
                },
                { data: "Cost" },
                {
                    render: function (data, type, row, meta) {
                        let dataItem = "data-itemId='" + row.ID + "'";
                        editBtn = "<button type='button' class = 'editBtn btn btn-success' " + dataItem + ">  <span class='glyphicon glyphicon-edit' aria-hidden='true'></span>  עריכה </button>";
                        //viewBtn = "<button type='button' class = 'viewBtn btn btn-info' " + dataItem + ">  <span class='glyphicon glyphicon-edit' aria-hidden='true'></span>  צפייה </button>";
                        duplicateBtn = "<button type='button' class = 'duplicateBtn btn btn-info' " + dataItem + ">  <span class='glyphicon glyphicon-duplicate' aria-hidden='true'></span>  שכפול  </button>";
                        deleteBtn = "<button type='button' class = 'deleteBtn btn btn-danger' " + dataItem + ">  <span class='glyphicon glyphicon-trash' aria-hidden='true'></span> מחיקה </button>";
                        return editBtn + /*viewBtn +*/ duplicateBtn + deleteBtn;
                    }
                }
            ],
            "footerCallback": function (row, data, start, end, display) {
                var api = this.api();

                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // Total over all pages
                total = api
                    .column(3)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
                TC = total; 
                //$("#projectCost").val(total);  // presenting total cost above the dattable
                console.log(total);

                // Total over this page
                pageTotal = api
                    .column(3, { page: 'current' })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
                // Update footer
                $(api.column(3).footer()).html(
                    '           עלות כוללת עדכנית :   ' + formatNumber(pageTotal) + ' ש"ח ' + '(' + formatNumber(total) + ' ש"ח ' + ' סה"כ)'
                );
            }
        });
        buttonEvents();
    }
    catch (err) {
        alert(err);
    }
}
//var formattedNumber = formatNumber(Math.round(itemTotalSum));
function saveProjectSuccess() {
    tbl.clear();
    buttonEvents(); // after redrawing the table, we must wire the new buttons
    $("#editDiv").hide();
    swal("הפרויקט נשמר בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
    parent.location = 'projectsList.html';
}
