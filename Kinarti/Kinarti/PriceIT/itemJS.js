var myBoxes;
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
    ajaxCall("GET", uri2, "", successGetProject, error); //get project's details from DB

    ajaxCall("GET", "../api/materials", "", successGetMaterials, error); //get all materials from DB
    ajaxCall("GET", "../api/facades", "", successGetFacades, error);
    ajaxCall("GET", "../api/boxes", "", successGetBoxes, error);
    ajaxCall("GET", "../api/handles", "", successGetHandles, error);
    ajaxCall("GET", "../api/hinges", "", successGetHinges, error);
    ajaxCall("GET", "../api/constants", "", successGetConstants, error);
    ajaxCall("GET", "../api/ironWorks", "", successGetIronWorks, error);
    ajaxCall("GET", "../api/facadeMaterials", "", successGetFacadeMaterials, error);


    mode = "";

    $("#cancelSaveBTN").on("click", function () {
        item = null;
        $("#editDiv").hide();
        if (mode === "new") $("#pForm").show();
        mode = "";
    });

    $("#newBTN").on("click", function () {
        item = null;
        mode = "new";
        $("#pForm").hide();
        $("#editDiv").show();
        clearFields();
        $("#editDiv :input").prop("disabled", false); // new mode: enable all controls in the form
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

//function successGetItems2(itemsdata) {// this function is activated in case of a success            
//    console.log(itemsdata);
//    for (var i = 0; i < itemsdata.length; i++) {
//        //$('#accordion').append('<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse' + (i + 1) + '">פריט ' + (i + 1) + ': ' + itemsdata[i].Name + ', עלות: ' +
//        //    itemsdata[i].Cost + '   <button type="button" id=' + itemsdata[i].ID + ' onClick="goEditItem()" class = "editBtn btn btn-success editItem"> עריכה </button>' + '<button type="button" class = "deleteBtn btn btn-danger deleteItem"> מחיקה </button></a ></h4 ></div > <div id="collapse' + (i + 1) + '" class="panel-collapse collapse"><div class="panel-body">מחיצות:' + itemsdata[i].Partitions + '</div></div></div > ');
//        //"<button type='button' id=btn" + itemsdata.ID + " class = 'EditProjBtn btn btn-success'> עריכת פריט </button>";
//        console.log(itemsdata[i].Cost);
//        totalCost = totalCost + itemsdata[i].Cost;
//    }
//    $("#itemcost").val(totalCost);
//    console.log(totalCost);
//}

function updateStatusSuccess() {
    swal("עודכן בהצלחה!", "סטטוס הפרויקט עודכן", "success");
}


function successGetProject(projectdata) {// this function is activated in case of a success
    console.log(projectdata);
    $("#projectName").val(projectdata.project_name);
    $("#createDate").val(projectdata.create_date);
    $("#projectDescription").val(projectdata.description);
    $("#projectArchitect").val(projectdata.architect);
    $("#projectSupervisor").val(projectdata.supervisor);

    if (projectdata.status === 1) {
        //    $("#radio").value('done', 'checked');
        //$("input[name=status][value='done'").attr('checked', 'checked');
        $("#doneBtn").addClass("active");
        $("#inProgressBtn").removeClass("active");
    } else {
        $("#inProgressBtn").addClass("active");
        $("#doneBtn").removeClass("active");
    }


    uriCustomer = "../api/getCust/?customerID=" + projectdata.customer_id;
    ajaxCall("GET", uriCustomer, "", successGetCustomers, error);

    uri = "../api/items/?projectID=" + projectID;
    ajaxCall("GET", uri, "", successGetItems, error); //get all relevant project's items from DB  



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
    console.log(JSON.stringify(customersdata));

    $("#customerName").val((customersdata.first_name + " "  + customersdata.last_name));
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

var materialCoefficient;
var itemTotalSum = 0;




function calculateItem() {
    collectChoices();

    boxSquareMeter = (2 * height * depth + 2 * width * depth + height * width) / 10000;

    var boxCost = basicMaterialCoefficient * boxSquareMeter * materialCoefficient + boxWorkCost * boxSquareMeter + lacquerWorkCost * boxSquareMeter;

    var withPartitions = params.partitionsQuantity * (boxWorkCost * height * depth * 2 + lacquerWorkCost * height * depth * 2);

    var withShelves = (boxWorkCost * depth * width + lacquerWorkCost * height * width) * params.shelvesQuantity / (params.partitionsQuantity + 1);

    var plateSquareMeter = drawerCoefficientCost * (depth - 5) * (2 * + width * 2 * drawerCoefficientCost + (depth - 5) * width) / 10000;

    var withboxWoodDrawers = (plateSquareMeter * basicMaterialCoefficient * materialWoodDrawersCoefficient + plateSquareMeter * lacquerWorkCost + woodRailsCost + woodBoxDrawerWorkCost) * params.boxWoodDrawersQuantity;
    //debugger;

    var withInternalLegraBoxDrawers = (LegraBoxDrawerWork + LegraboxInternalRailsCost) * params.internalLegraBoxDrawersQuantity;
    var withExternalLegraBoxDrawers = (LegraBoxDrawerWork + LegraboxExternalRailsCost) * params.externalLegraBoxDrawersQuantity;

    var ScalaSquareMeter = ((depth - 5) * width + drawerCoefficientCost * width) / 1000;

    var withInternalScalaBoxDrawers = (ScalaSquareMeter * ScalaCoefficient * ScalaDrawerWork + ScalaInternalRailsCost) * params.internalScalaBoxDrawersQuantity;
    var withExternalScalaBoxDrawers = (ScalaSquareMeter * ScalaCoefficient * ScalaDrawerWork + ScalaExternalRailsCost) * params.externalScalaBoxDrawersQuantity;

    var withDistancedInternalDrawer = isDistanced * (woodBoxDrawerWorkCost * numberOfDistancedInternalDrawer + (depth - 7) * lacquerWorkCost) / 10000;  //not final

    var withFacade = plateSquareMeter * facadeMaterialWorkCost + facadeworkCostForSquareMeter + (plateSquareMeter * 2 * facadeColorWorkCoefficient * isColor + plateSquareMeter * 2 * facadeFRNWorkCoefficient + 12 * (height * 2 + width * 2) * (isColor + 1)); // kantim

    // basicMaterialCoefficient + boxWorkCost * height * depth + (height * width / 10000 * facadeColorWorkCoefficient + height * width / 10000 * 100) + facadeFRNWorkCoefficient * height * width / 10000 + height * width / 10000 * 100 + 12 * (height * 2 + width * 2)); //need to update according to material type params.extraWallTypeID)

    var withExtraWall = params.extraWallQuantity * (height * depth * basicMaterialCoefficient + boxWorkCost * height * depth + (height * width / 10000 * facadeColorWorkCoefficient + height * width / 10000 * 100) + facadeFRNWorkCoefficient * height * width / 10000 + height * width / 10000 * 100 + 12 * (height * 2 + width * 2)); //need to update according to material type params.extraWallTypeID)

    var withHinges1 = hingesCost1 * params.hingesQuantity1;
    var withHinges2 = hingesCost2 * params.hingesQuantity2;

    var withHandles = handlesCost * params.handlesQuantity;

    var withIronWorks1 = ironWorksCost1 * params.ironWorksQuantity1;
    var withIronWorks2 = ironWorksCost2 * params.ironWorksQuantity2;

    itemTotalSum = boxCost + withPartitions
        + withShelves + withboxWoodDrawers
        + withInternalLegraBoxDrawers + withExternalLegraBoxDrawers
        + withInternalScalaBoxDrawers + withExternalScalaBoxDrawers
        + withHinges1 + withHinges2 + withHandles
        + withIronWorks1 + withIronWorks2
        + withDistancedInternalDrawer + withExtraWall + withFacade + extraCostForItem;

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
    //$('#itemCost').val(Math.round(itemTotalSum));
    $('#itemCost').append("<strong> עלות פריט:" + Math.round(itemTotalSum) + "</strong>");

    return false; // the return false will prevent the form from being submitted, hence the page will not reload
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
    basicMaterialCoefficient = constants[2].Cost;

    for (i = 0; i < myMaterials.length; i++) {
        if (myMaterials[i].ID.toString() === params.materialID) { // this is the specific material cost
            materialCoefficient = myMaterials[i].Coefficient;
            //console.log("myMaterials: ", myMaterials);
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

        LegraBoxDrawerWork = constants[7].Cost;
        //LegraBoxDrawerWork = constants.find(function (item) { return item.constantName === "LegraboxDrawerWork"; });

        console.log(LegraBoxDrawerWork);

        ScalaDrawerWork = constants[8].Cost;
        drawerCoefficientCost = constants[3].Cost;
        //plateThickness = constants[4].Cost;
        ScalaCoefficient = constants[9].Cost;
        LegraboxInternalRailsCost = constants[10].Cost;
        LegraboxExternalRailsCost = constants[12].Cost;
        ScalaInternalRailsCost = constants[11].Cost;
        ScalaExternalRailsCost = constants[13].Cost;
        woodBoxDrawerWorkCost = constants[6].Cost;

        facadeFRNWorkCoefficient = constants[6].Cost;// 280

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
        mode = "edit";
        markSelected(this);
        $("#editDiv").show();
        $("#editDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-itemId')); // fill the form fields according to the selected row
    });

    ///////////duplicating
    $(document).on("click", ".duplicateBtn", function () {
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




<<<<<<< HEAD
<<<<<<< HEAD
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
function errorGetGetIronWorks(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור עלויות פרזולים");
}
function errorGetFacadeMaterials(err) { // this function is activated in case of a failure
    swal("שגיאה באחזור חומרי גלם לגמרי חוץ");
}
function errorUpdateStatus(err) { // this function is activated in case of a failure
    swal("שגיאה בעדכון סטטוס הפרויקט");
=======


>>>>>>> parent of 311c47c... 2
=======


>>>>>>> parent of 311c47c... 2
=======


>>>>>>> parent of 311c47c... 2
}



function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}

function ShowInfo() {
    $("#info").show();
}

function calculateProjectCost() {
    TC = tbl.column(4).data().sum();
    $("#projectCost").val(TC);
    console.log(TC);
}

//$("#pForm").submit(onSubmitFunc); 

function markSelected(btn) {  // mark the selected row
    $("#itemsTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}


function DeleteItem(id) {      // Delete a item from the server
    ajaxCall("DELETE", "../api/items/?Id=" + id, "", deleteSuccess, error);
}

function saveProject(id) {      // Delete a item from the server
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
        Type: 1, // 'type' will be always 1 untill we add a different kind of box
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
        cost: $("#projectCost").val()
        //customer_id: $("#itemName").val()

    };
    ajaxCall("PUT", "../api/projects/?Id=" + projectID, JSON.stringify(projecttoSave), updateProjectSuccess, error);

    return false;
}

function populateFields(itemId) {    // fill the form fields
    //debugger;
    item = getItem(itemId);
    console.log(item);
    //$("#image").attr("src", "images/" + item.Image);
    $("#itemName").val(item.Name);
    for (i = 0; i < myMaterials.length; i++) {
        if (myMaterials[i].ID.toString() === item.BoxMaterialID) { // this is the specific material cost
            $("#boxMaterial").val(myMaterials[i].Name);
        }
    }

    for (i = 0; i < myBoxes.length; i++) {
        if (myBoxes[i].ID.toString() === item.BoxMeasuresID) { // this is the specific material cost
            $("#boxMeasures").val(myBoxes[i].Name);
        }
    }
    //$("#boxMeasures").val(item.BoxMeasures);

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
    calculateItem(); // need to be checked
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
function getItem(id) {
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

function updateProjectSuccess() {    // success callback function after update

    buttonEvents();
    $("#editDiv").hide();
    swal("עודכן בהצלחה!", "הפרויקט נשמר בהצלחה", "success");
    mode = "";

    //window.location.href = 'projectsList.html';
}

function insertSuccess(itemsdata) {  // success callback function after adding new item
    $("#pForm").show();
    //tbl.clear();
    uri = "../api/items/?projectID=" + projectID;
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    //redrawTable(tbl, itemsdata);
    buttonEvents();
    $("#editDiv").hide();
    swal("נוסף בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

// success callback function after delete
function deleteSuccess(itemsdata) {
    //tbl.clear();
    //  redrawTable(tbl, itemsdata);
    uri = "../api/items/?projectID=" + projectID;
    ajaxCall("GET", uri, "", populateTableWithUpdatedData, error); //get all relevant project's items from DB 

    buttonEvents(); // after redrawing the table, we must wire the new buttons
    $("#editDiv").hide();
    swal("נמחק בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
}

function populateTableWithUpdatedData(items) {
    console.log("got into the new function!");
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
                data: itemsdata,
                pageLength: 5,
                columns: [
                    { data: "ID" },
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
                            deleteBtn = "<button type='button' class = 'deleteBtn btn btn-danger' " + dataItem + ">  <span class='glyphicon glyphicon-remove' aria-hidden='true'></span> מחיקה </button>";
                            return editBtn + /*viewBtn +*/ duplicateBtn + deleteBtn;
                        } 
                    },
                    
                ],
                //////////////////////////
                "footerCallback": function (row, data, start, end, display) {
                    var api = this.api(), data;
                    //console.log("######");
                    //console.log(api);
                    //console.log("######");
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
                    //TC = total; // presenting total cost above the dattable
                    $("#projectCost").val(total);
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
                        ' עלות :             ' + pageTotal + ' ש"ח ' + '(' + total + ' ש"ח ' +  ' סה"כ)'
                    );
                }
            });
            buttonEvents();
        }
        catch (err) {
            alert(err);
        }   
    }

    //function calculateAllItemsPrice(list) {

    //}


function saveProjectSuccess() {
    tbl.clear();
    buttonEvents(); // after redrawing the table, we must wire the new buttons
    $("#editDiv").hide();
    swal("הפרויקט נסגר בהצלחה!", "הפעולה בוצעה", "success");
    mode = "";
    parent.location = 'projectsList.html';

}
