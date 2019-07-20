
    // will run when the document is ready
    $(document).ready(function () {
        // once the document is ready we fetch a list of materials from the server
        ajaxCall("GET", "../api/boxes", "", getSuccess, error);

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

        function populateFields(boxId) {        // fill the form fields
        box = getBox(boxId);
    $("#id").val(box.ID);
    $("#type").val(box.Type);
    $("#height").val(box.Height);
    $("#width").val(box.Width);
    $("#depth").val(box.Depth);
  //  $("#costForBasicMaterial").val(box.CostForBasicMaterial);
    $("#Description").val("");
}


        function clearFields() {        // clear the form fields
        // box = getBoxes("");
        $("#id").val("");
    $("#type").val("");
    $("#height").val("");
    $("#width").val("");
  //  $("#costForBasicMaterial").val("");
    $("#Description").val("");
}


        function getBox(id) {        // get a box according to its Id
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
        function getSuccess(boxdata) {
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
