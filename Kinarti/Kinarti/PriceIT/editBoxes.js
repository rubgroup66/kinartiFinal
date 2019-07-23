    
    // will run when the document is ready
    $(document).ready(function () {
        // once the document is ready we fetch a list of materials from the server
        ajaxCall("GET", "../api/boxes", "", getSuccess, errorGetBoxes);
        $("#CreateboxesForm").submit(CreateNewBox);
        $("#boxEditDiv").hide();
        mode = "";

        buttonEvents();
    });
       


    // wire all the buttons to their functions
function buttonEvents() {

    $("#cancelSaveBTNbox").on("click", function () {
        box = null;
        mode = "new";
        if (mode == "new") {
            $("#boxEditDiv").hide();
            $("#boxForm").show();
            mode = "";
        }
        mode = "";
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
            title: "האם אתה בטוח שברצונך למחוק ארגזת?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then(function (willDelete) {
                if (willDelete) DeleteBox(boxId);
                else swal("ארגזת לא נמחקה");
            });
    });
}

function CreateNewBox() {
    Box = { // Note that the name of the fields must be identical to the names of the properties of the object in the server
        Depth: $("#depth").val(),
        Width: $("#width").val(),
        Height: $("#height").val(),
        Type: 'ארגזת'
    }
    ajaxCall("POST", "../api/boxes", JSON.stringify(Box), successNewBox, errorNewBox);
    return false;
}
function errorGetBoxes() {
    alert("error fetting boxes");
}
function successNewBox(boxdata) {
    tbl.clear();
    buttonEvents();
    $("#CreateboxesForm").hide();
    swal({ // this will open a dialouge
        title: "ארגזת נוספה בהצלחה",
        icon: "info",
    })
        .then(function () {
            window.location.reload();
        });
}
function errorDeleteBox() {
    swal({ // this will open a dialouge
        title: "שגיאה במחיקת ארגזת",
        icon: "info",
    })
        .then(function () {
            window.location.reload();
        });
}

function errorNewBox() {
    alert("error");
}

// mark the selected row
function markSelected(btn) {
    $("#boxesTable").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

// Delete a box from the server
function DeleteBox(id) {
    ajaxCall("DELETE", "../api/boxes/" + id, "", deleteSuccess, errorDeleteBox);
    return false;
}


function f2() {
    $("#boxForm").hide();
    $("#boxEditDiv").show();
    return false;
}


function populateFields(boxId) {        // fill the form fields
    box = getBox(boxId);
    $("#height2").val(box.Height);
    $("#width2").val(box.Width);
    $("#depth2").val(box.Depth);
}


function clearFields() {// clear the form fields// box = getBoxes("");
    $("#id").val("");
    $("#type").val("");
    $("#height").val("");
    $("#width").val("");
    $("#Description").val("");
}


function getBox(id) {        // get a box according to its Id
     for (i in boxes) {
       if (boxes[i].ID == id)
        return boxes[i];
}
return null;
}



// success callback function after delete
function deleteSuccess(boxdata) {
    tbl.clear();
    buttonEvents();
    swal({ // this will open a dialouge
        title: "ארגזת נמחקה בהצלחה",
        icon: "info",
    })
        .then(function () {
            window.location.reload();
        }); 
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
            retrieve: true,
            paging: false,
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
            data: boxdata,
            pageLength: 6,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return boxdata.findIndex(i => i.ID === row.ID) + 1;
                    }
                },
                //{ data: "ID" },
                { data: "Type" },
                { data: "Height" },
                { data: "Width" },
                { data: "Depth" },
                {
                    render: function (data, type, row, meta) {
                        let dataBox = "data-boxId='" + row.ID + "'";
                        //deleteBtn = "<button type='button' class = 'deleteBtn btn btn-danger' " + dataBox + "> מחק ארגזת </button>";

                        deleteBtn = "<button type='button' class = 'deleteBtn btn btn-danger' " + dataBox + ">  <span class='glyphicon glyphicon-remove' aria-hidden='true'></span> מחיקה </button>";

                        return deleteBtn;
                    }
                },
            ],
        });
        buttonEvents();
    }
    catch (err) {
        alert("error in create table");
    }

}
