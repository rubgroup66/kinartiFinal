var myMConst;


$(document).ready(function () {

    ajaxCall("GET", "../api/constants", "", successGetConstantsEdit, errorGetConstantsEdit);
    $("#editParForm").hide();
    $("#editParForm").submit(UpdatePar);
    buttonEventsP();

});

function errorGetConstantsEdit() {
    alert("error")
}
function buttonEventsP() {
    $("#cancelSaveBTNPar").on("click", function () {
        $("#editParForm").hide();
        $("#parForm").show();
        m
    });

    $(document).on("click", ".editBtnPar", function () {
        markSelectedPar(this);
        $("#editParForm").show();
        $("#editParForm :input").prop("disabled", false); // edit mode: enable all controls in the form
        populateFieldsPar(this.getAttribute('data-parId'));
    });
}

function UpdatePar() {
     Id = par.ID;

    let ParToSave = {
        ID: 1,
        Cost: $("#ParCost").val(),
    };

    ajaxCall("PUT", "../api/constants/?Id=" + Id, JSON.stringify(ParToSave), updateSuccessPar, errorUpdatePAr);
    return false;
}
function updateSuccessPar() {
    uri = "../api/constants";
    ajaxCall("GET", uri, "", populateTableWithUpdatedDataPar, error); //get all relevant project's items from DB 
    buttonEventsP();
    $("#editParForm").hide();
    swal("עודכן בהצלחה!", "הפעולה בוצעה", "success");
}
function errorUpdatePAr() {
    alert("error")
}

function successGetConstantsEdit(constsdata) {
    console.log(constsdata);
    myMConst = constsdata;
    try {
        tbl = $('#parTable').DataTable({
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
            data: constsdata,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return constsdata.findIndex(i => i.ID === row.ID) + 1;
                    }
                },
                {
                    render: function (data, type, row, meta) {
                        let dataConst = "data-parId='" + row.ID + "'";
                        let DataName = row.constantName;
                        if (DataName == 'boxWorkCost') { DataName ="עלות עבודה על ארגז"}
                        if (DataName == 'lacquerWorkCost') { DataName = "עלות עבודה - לקה פורניר" }
                        if (DataName == 'basicMaterialCoefficient') { DataName = "עלות עבודה על חומר בסיס" }
                        if (DataName == 'drawerCoefficientCost') { DataName = "מקדם למגירה" }
                        if (DataName == 'ScalaExternalRailsCost') { DataName = "עלות מסילות Scala חיצוניות" }
                        if (DataName == 'railsCost') { DataName = "עלות מסילות" }
                        if (DataName == 'woodBoxDrawersWorkCost') { DataName = "עלות עבודה למגירות עץ" }
                        if (DataName == 'LegraboxDrawerWork') { DataName = "עלות עבודה למגירות Legrabox" }
                        if (DataName == 'ScalaDrawerWork') { DataName = "עלות עבודה למגירות Scala" }
                        if (DataName == 'ScalaCoefficient') { DataName = "מקדם מגירות Scala" }
                        if (DataName == 'LegraboxInternalRailsCost') { DataName = "עלות מסילות Legrabox פנימיות" }
                        if (DataName == 'ScalaInternalRailsCost') { DataName = "עלות מסילות Scala פנימיות" }
                        if (DataName == 'LegraboxExternalRailsCost') { DataName = "עלות מסילות Legrabox חיצוניות" }
                        if (DataName == 'plateWorkCostForSquareMeter') { DataName = "עובי פלטה (סנטימטר)" }
                        if (DataName == 'facadeColorWorkCoefficient') { DataName = "חזית-צבע(עבודה+צבע)" }
                        if (DataName == 'facadeFRNWorkCoefficient') { DataName = "חזית-פורניר(עבודה+לקה+קנטים גושנים)" }
                        return DataName ;
                    }
                },
                { data: "Cost" },
                {
                    render: function (data, type, row, meta) {
                        let dataConst = "data-parId='" + row.ID + "'";
                        editBtnPar = "<button type='button' class = 'editBtnPar btn btn-success' " + dataConst + "> עריכה </button>";
                        return editBtnPar;
                    }
                }
            ],
        });
        buttonEventsP();
    }
    catch (err) {
        alert(err);
    }
}

function error(err) { // this function is activated in case of a failure
    swal("Error: " + err);
}

function markSelectedPar(btn) {  // mark the selected row
    $("#parTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

function populateFieldsPar(parId) {
    par = getPar(parId);;
    $("#ParCost").val(par.Cost);
}

// get item according to its Id
function getPar(id) {
    console.log(myMConst);
    for (i in myMConst) {
        if (myMConst[i].ID == id)
            return myMConst[i];
    }
    return null;
}

function populateTableWithUpdatedDataPar(par) {
    var dataTable = $('#parTable').DataTable();
    dataTable.destroy();
    dataTable.clear();
    successGetConstantsEdit(par);
}



