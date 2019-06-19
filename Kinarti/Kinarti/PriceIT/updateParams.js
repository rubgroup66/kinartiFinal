$(document).ready(function () {    // will run when the document is ready
        // once the document is ready we fetch a list of materials from the server
    ajaxCall("GET", "../api/boxes", "", getSuccessBoxes, error);

    ajaxCall("GET", "../api/constants", "", successGetConstants, error);//get all constants from DB

    //  $("#pForm").submit(f1);

    $("#pForm").submit(f1); // wire the submit event to a function called f1
    $("#editDiv").hide();

    mode = "";

            $("#cancelSaveBTN").on("click", function () {
        box = null;
    $("#editDiv").hide();
    if (mode == "new")/* $("#pForm").show();*/
        mode = "";
});
            $("#newBTN").on("click", function () {
        box = null;
    mode = "new";
    //$("#pForm").hide();
    $("#editDiv").show();
    clearFields();
    $("#editDiv :input").prop("disabled", false); // new mode: enable all controls in the form
});
});

        function updateBox() { //this function will insert new material to DB or update existing one by mode status
        Box = { // Note that the name of the fields must be identical to the names of the properties of the object in the server
            Height: $("#height").val(),
            Type: $("#type").val(),
            // CostForBasicMaterial: $("#costForBasicMaterial").val(),
            Width: $("#width").val(),
            Depth: $("#depth").val(),
        }
            if (mode == "new") {
        ajaxCall("POST", "../api/boxes", JSON.stringify(Box), success, error);
    }
    else
                if (mode == "edit") {
        ajaxCall("PUT", "../api/boxes/?Id=" + boxID, JSON.stringify(Box), successUpdate, error1);
    }
}

        function success(data) {
        swal("Added Successfuly!", "Good luck in finding a partner", "success");
    }
        function error(err) {
        alert("שגיאה בהזנת ארגז");
    }

        function error1() {
        swal("שגיאה בעדכון הארגז!");
    }

        function successUpdate(data) {
        swal("Updated Successfuly!", "Good luck in finding a partner", "success");
    }

    // wire all the buttons to their functions
        function buttonEvents() {

        $(document).on("click", ".editBtn", function () {
            markSelected(this);
            $("#editDiv").show();
            $("#editDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
            populateFields(this.getAttribute('data-boxId')); // fill the form fields according to the selected row
        });

    $(document).on("click", ".viewBtn", function () {
        markSelected(this);
    $("#editDiv").show();
    row.className = 'selected';
    $("#editDiv :input").attr("disabled", "disabled"); // view mode: disable all controls in the form ***
    populateFields(this.getAttribute('data-boxId'));
});

            $(document).on("click", ".deleteBtn", function () {
        markSelected(this);
    var boxId = this.getAttribute('data-boxId');
                swal({ // this will open a dialouge
        title: "האם אתה בטוח??",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true
})
                    .then(function (willDelete) {
                        if (willDelete) DeleteBox(boxId);
    else swal("Not Deleted!");
});
});
}

// mark the selected row
        function markSelected(btn) {
        $("#boxesTable").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

// Delete a box from the server
        function DeleteBox(id) {
        ajaxCall("DELETE", "../api/boxes/" + id, "", deleteSuccess, error);
    }

  
        function f1() {
        updateBox();
    return false; // the return false will prevent the form from being submitted
    // hence the page will not reload
}

// fill the form fields
        function populateFields(boxId) {
        box = getBox(boxId);
    $("#id").val(box.ID);
    $("#type").val(box.Type);
    $("#height").val(box.Height);
    $("#width").val(box.Width);
    $("#depth").val(box.Depth);
  //  $("#costForBasicMaterial").val(box.CostForBasicMaterial);
    $("#Description").val("");
}

// fill the form fields
        function clearFields() {
        // box = getBoxes("");
        $("#id").val("");
    $("#type").val("");
    $("#height").val("");
    $("#width").val("");
  //  $("#costForBasicMaterial").val("");
    $("#Description").val("");
}

// get a car according to its Id
        function getBox(id) {
            for (i in boxes) {
                if (boxes[i].ID == id)
        return boxes[i];
}
return null;
}

// success callback function after update
        function updateSuccess(boxdata) {
        tbl.clear();
    redrawTable(tbl, boxdata);
    buttonEvents();
    //$("#editDiv").hide();
    swal("עודכן בהצלחה!", "הפריט עודכן", "הצלחה");
}

// success callback function after delete
        function deleteSuccess(boxdata) {
        tbl.clear();
    redrawTable(tbl, boxdata);
    buttonEvents(); // after redrawing the table, we must wire the new buttons
    //$("#editDiv").hide();
    swal("הפריט הוסר בהצלחה", "נשמר בהצלחה", "הפעולה בוצעה");
}

// redraw a datatable with new data
        function redrawTable(tbl, data) {
        tbl.clear();
    for (var i = 0; i < data.length; i++) {
        tbl.row.add(data[i]);
    }
    tbl.draw();
}

// this function is activated in case of a success
        function getSuccessBoxes(boxdata) {
        console.log(boxdata);
    boxes = boxdata; // keep the cars array in a global variable;
            try {
        tbl = $('#boxesTable').DataTable({
            data: boxdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        let dataBox = "data-boxId='" + row.ID + "'";
                        deleteBtn = "<button type='button' class = 'deleteBtn btn btn-danger' " + dataBox + "> מחק </button>";
                        editBtn = "<button type='button' class = 'editBtn btn btn-success' " + dataBox + "> עדכן </button>";
                        // viewBtn = "<button type='button' class = 'viewBtn btn btn-info' " + dataBox + "> הצג </button>";

                        return editBtn + deleteBtn;
                    }
                },
                { data: "Depth" },
                { data: "Width" },
                { data: "Height" },
                { data: "Type" },
                { data: "ID" },
            ],
        });
    buttonEvents();
}

            catch (err) {
        alert(err);
    }
}
// this function is activated in case of a failure
        function error(err) {
        swal("Error: " + err);
    }
         //function updateBox() {
        //    let boxAfterEdit = {
        //        Id: box.Id,
        //        Depth: $("#depth").val(),
        //        Width: $("#width").val(),
        //        Height: $("#height").val(),
        //        Type: $("#type").val(),

        //     //   CostForBasicMaterial: $("#costForBasicMaterial").val(),
        //     //   Description: $("#Description").val(),
        //    }

        //    // update a new Box record to the server
        //    ajaxCall("PUT", "../api/boxes"+ boxId, JSON.stringify(boxAfterEdit), updateSuccess, error);
        //    return false;
        //}
        $('#myTabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        })
$(document).ready(function () {

    ajaxCall("GET", "../api/constants", "", successGetConstants, error);//get all constants from DB

    //  $("#pForm").submit(f1);
});

function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}
function successGetConstants(constantsdata) {// this function is activated in case of a success
    constants = constantsdata;
    console.log(constants);

    $('#boxWorkCost').val(constants[0].Cost);
    $('#laquerWorkCost').val(constants[1].Cost);
    $('#basicMaterialCoefficient').val(constants[2].Cost);
    $('#drawerCoefficientCost').val(constants[3].Cost);
    $('#plateThickness').val(constants[4].Cost);
    $('#railsCost').val(constants[5].Cost);
    $('#woodBoxDrawersWorkCost').val(constants[6].Cost);
    $('#LegraboxDrawerWork').val(constants[7].Cost);
    $('#ScalaDrawerWork').val(constants[8].Cost);
    $('#ScalaCoefficient').val(constants[9].Cost);
    $('#LegraboxInternalRailsCost').val(constants[10].Cost);
    $('#ScalaInternalRailsCost').val(constants[11].Cost);
    $('#LegraboxExternalRailsCost').val(constants[12].Cost);
    $('#ScalaExternalRailsCost').val(constants[13].Cost);
}

function updateConstants() {

    constants = {
        boxWorkCost: $("#boxWorkCost").val(),
        laquerWorkCost: $("#laquerWorkCost").val(),
        //Age: parseFloat($("#age").val()),
        basicMaterialCoefficient: $("#basicMaterialCoefficient").val(),
        drawerCoefficientCost: $("#drawerCoefficientCost").val(),
        plateThickness: $("#plateThickness").val(),
        woodBoxDrawersWorkCost: $("#woodBoxDrawersWorkCost").val(),
        LegraboxDrawerWork: $("#LegraboxDrawerWork").val(),
        ScalaDrawerWork: $("#ScalaDrawerWork").val(),
        ScalaCoefficient: $("#ScalaCoefficient").val(),
        LegraboxInternalRailsCost: $("#LegraboxInternalRailsCost").val(),
        ScalaInternalRailsCost: $("#ScalaInternalRailsCost").val(),
        LegraboxExternalRailsCost: $("#LegraboxExternalRailsCost").val(),
        ScalaExternalRailsCost: $("#ScalaExternalRailsCost").val()
    }
    ajaxCall("PUT", "../api/constants/?Id=" + personId, JSON.stringify(Person), successUpdate, error1);
}


// will run when the document is ready
$(document).ready(function () {

    // once the document is ready we fetch a list of materials from the server
    ajaxCall("GET", "../api/materials", "", getSuccessMaterials, error);

    $("#form").submit(f1); // wire the submit event to a function called f1
    //$("#form").submit(onSubmitFunc); 
    //$("#editDiv").hide();

    mode = "";

    $("#cancelSaveBTN").on("click", function () {
        material = null;
        //$("#editDiv").hide();
        if (mode == "new")/* $("#pForm").show();*/
            mode = "";
    });

    $("#newBTN").on("click", function () {
        material = null;
        mode = "new";
        //$("#pForm").hide();
        //$("#editDiv").show();
        clearFields();
        $("#editDiv :input").prop("disabled", false); // new mode: enable all controls in the form
    });

});

function updateMaterial() { //this function will insert new material to DB or update existing one by mode status

    var radioVal = $("input[name='Premium']:checked").val();
    if (radioVal == "1")
        var prem = true;
    else
        var prem = false;
    Material = { // Note that the name of the fields must be identical to the names of the properties of the object in the server
        Name: $("#name").val(),
        Category: $("#category").val(),
        Size: $("#size").val(),
        Price: parseInt($("#price").val()),
    }


    if (mode == "new") {

        ajaxCall("POST", "../api/person", JSON.stringify(Material), success, error);
    }
    else
        if (mode == "edit") {
            ajaxCall("PUT", "../api/materials/?Id=" + materialId, JSON.stringify(Material), successUpdate, error1);
        }

}
function success(data) {
    swal("Added Successfuly!", "Good luck in finding a partner", "success");
}
function error(err) {
    alert("error in insert");
}


function error1() {
    swal("Error in editing");
}

function successUpdate(data) {
    swal("Updated Successfuly!", "Good luck in finding a partner", "success");
}

// wire all the buttons to their functions
function buttonEvents() {

    $(document).on("click", ".editBtn", function () {
        markSelected(this);
        $("#editDiv").show();
        $("#editDiv :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFields(this.getAttribute('data-materialId')); // fill the form fields according to the selected row
    });

    $(document).on("click", ".viewBtn", function () {
        markSelected(this);
        $("#editDiv").show();
        row.className = 'selected';
        $("#editDiv :input").attr("disabled", "disabled"); // view mode: disable all controls in the form ***
        populateFields(this.getAttribute('data-materialId'));
    });

    $(document).on("click", ".deleteBtn", function () {
        markSelected(this);
        var materialId = this.getAttribute('data-materialId');
        swal({ // this will open a dialouge 
            title: "Are you sure ??",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteMaterial(materialId);
                else swal("Not Deleted!");
            });
    });
}

// mark the selected row
function markSelected(btn) {
    $("#MaterialsTable").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

// Delete a car from the server
function DeleteMaterial(id) {
    ajaxCall("DELETE", "../api/materials/" + id, "", deleteSuccess, error);
}

function onSubmitFunc() {
    let materialAfterEdit = {
        Id: material.Id,
        /*Image: material.Image, */// for now we do not change the image
        Name: $("#Name").val(),
        Category: $("#Category").val(),
        Size: $("#Measures").val(),
        Price: $("#Price").val(),
        Description: $("#Description").val(),

        //Automatic: $("#automatic").is(":checked")
    }

    // update a new Car record to the server
    ajaxCall("PUT", "../api/materials", JSON.stringify(materialAfterEdit), updateSuccess, error);
    return false;
}

function f1() {
    updateMaterial();
    return false; // the return false will prevent the form from being submitted
    // hence the page will not reload
}

// fill the form fields
function populateFields(materialId) {
    material = getMaterial(materialId);
    $("#ID").val(material.ID);
    $("#Name").val(material.Name);
    $("#Category").val(material.Category);
    $("#Size").val(material.Size);
    $("#Price").val(material.Price);
    //$("#automatic").prop('checked', car.Automatic);
    //$("#image").attr("src", "images/" + car.Image);
}

// fill the form fields
function clearFields() {
    material = getMaterial("");
    $("#ID").val("");
    $("#Name").val("");
    $("#Category").val("");
    $("#Size").val("");
    $("#Price").val("");
    $("#Description").val("");
}

// get a car according to its Id
function getMaterial(id) {
    for (i in materials) {
        if (materials[i].ID == id)
            return materials[i];
    }
    return null;
}

// success callback function after update
function updateSuccess(materialsdata) {
    tbl.clear();
    redrawTable(tbl, materialsdata);
    buttonEvents();
    //$("#editDiv").hide();
    swal("Updated Successfuly!", "Great Job", "success");
}

// success callback function after delete
function deleteSuccess(materialsdata) {
    tbl.clear();
    redrawTable(tbl, materialsdata);
    buttonEvents(); // after redrawing the table, we must wire the new buttons
    //$("#editDiv").hide();
    swal("Deleted Successfuly!", "Great Job", "success");
}

//// redraw a datatable with new data
//function redrawTable(tbl, data) {
//    tbl.clear();
//    for (var i = 0; i < data.length; i++) {
//        tbl.row.add(data[i]);
//    }
//    tbl.draw();
//}

// this function is activated in case of a success
function getSuccessMaterials(materialsdata) {
    console.log(materialsdata);
    materials = materialsdata; // keep the cars array in a global variable;
    try {
        tbl = $('#materialsTable').DataTable({
            data: materialsdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        let dataMaterial = "data-materialId='" + row.ID + "'";

                        editBtn = "<button type='button' class = 'editBtn btn btn-success' " + dataMaterial + "> עדכן </button>";
                        viewBtn = "<button type='button' class = 'viewBtn btn btn-info' " + dataMaterial + "> הצג </button>";
                        deleteBtn = "<button type='button' class = 'deleteBtn btn btn-danger' " + dataMaterial + "> מחק </button>";
                        return editBtn + viewBtn + deleteBtn;
                    }
                },
                { data: "Price" },
                { data: "Size" },
                { data: "Category" },
                { data: "Name" },
                { data: "ID" },
            ],
        });
        buttonEvents();
    }
    catch (err) {
        alert(err);
    }
}

// this function is activated in case of a failure
function error(err) {
    swal("Error: " + err);
}



function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}
function successGetConstants(constantsdata) {// this function is activated in case of a success
    constants = constantsdata;
    console.log(constants);

    $('#boxWorkCost').val(constants[0].Cost);
    $('#laquerWorkCost').val(constants[1].Cost);
    $('#basicMaterialCoefficient').val(constants[2].Cost);
    $('#drawerCoefficientCost').val(constants[3].Cost);
    $('#plateThickness').val(constants[4].Cost);
    $('#railsCost').val(constants[5].Cost);
    $('#woodBoxDrawersWorkCost').val(constants[6].Cost);
    $('#LegraboxDrawerWork').val(constants[7].Cost);
    $('#ScalaDrawerWork').val(constants[8].Cost);
    $('#ScalaCoefficient').val(constants[9].Cost);
    $('#LegraboxInternalRailsCost').val(constants[10].Cost);
    $('#ScalaInternalRailsCost').val(constants[11].Cost);
    $('#LegraboxExternalRailsCost').val(constants[12].Cost);
    $('#ScalaExternalRailsCost').val(constants[13].Cost);
}

function updateConstants() {

    constants = {
        boxWorkCost: $("#boxWorkCost").val(),
        laquerWorkCost: $("#laquerWorkCost").val(),
        //Age: parseFloat($("#age").val()),
        basicMaterialCoefficient: $("#basicMaterialCoefficient").val(),
        drawerCoefficientCost: $("#drawerCoefficientCost").val(),
        plateThickness: $("#plateThickness").val(),
        woodBoxDrawersWorkCost: $("#woodBoxDrawersWorkCost").val(),
        LegraboxDrawerWork: $("#LegraboxDrawerWork").val(),
        ScalaDrawerWork: $("#ScalaDrawerWork").val(),
        ScalaCoefficient: $("#ScalaCoefficient").val(),
        LegraboxInternalRailsCost: $("#LegraboxInternalRailsCost").val(),
        ScalaInternalRailsCost: $("#ScalaInternalRailsCost").val(),
        LegraboxExternalRailsCost: $("#LegraboxExternalRailsCost").val(),
        ScalaExternalRailsCost: $("#ScalaExternalRailsCost").val()
    }
    ajaxCall("PUT", "../api/constants/?Id=" + personId, JSON.stringify(Person), successUpdate, error1);
}