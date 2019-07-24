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
            data: supdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return supdata.findIndex(i => i.sup_id === row.sup_id) + 1;
                    }
                },
                { data: "sup_name" },
                { data: "sup_phone" },
                {
                    render: function (data, type, row, meta) {
                        let dataSup = "data-supId='" + row.sup_id + "'";
                        //deleteBtnSup = "<button type='button' class = 'deleteBtnSup btn btn-danger' " + dataSup + "> מחיקה </button>";
                        deleteBtnSup = "<button type='button' class = 'deleteBtnSup btn btn-danger' " + dataSup + ">  <span class='glyphicon glyphicon-trash' aria-hidden='true'></span> מחיקה </button>";
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

function insertSupSuccess() { 
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
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataSup, error); 
    buttonEventsS(); 
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

function error(err) { // this function is activated in case of a failure
    swal("שגיאה: " + err);
}


function markSelected(btn) {  // mark the selected row
    $("#supTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

