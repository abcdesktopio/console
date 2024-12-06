const pyos_url = document.location.origin;

function checkApiKey(){
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/healtz`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        success : function(){
            processDesktopData();
        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        }
    })
}

// source : https://stackoverflow.com/questions/55165440/bootstrap-table-sort-by-date-field
function datesSorter(a, b) {
    return(a.getTime() - b.getTime());
}


function dateFormatter(value, row){
    return row.creation_timestamp.toString().slice(0, 24);
}

function toggleFormatter(value, row) {
    return '<a class="infos" href="#showInfosAccordion" title="Infos" role="button" data-bs-toggle="collapse" data-bs-target="#collapseInfos" aria-expanded="false" aria-controls="collapseInfos" style="color: #6dc5ef;">'+row.name+'</a>';
}

// formatter for desktop operations
// source : https://examples.bootstrap-table.com/#view-source
function operateFormatter(value, row, index) {
    return [
      '<div class="operate-icons-container">',
      '<a class="remove" href="javascript:void(0)" title="Remove">',
      '<i class="bi bi-trash-fill" style="color: #dc3545;"></i>',
      '</a>',
      '</div>'
    ].join('')
}

// source : https://examples.bootstrap-table.com/#view-source
window.operateEvents = {
    'click .infos': function (e, value, row, index) {
        localStorage.setItem('desktopId',row.id);
        getInfosData(row.id);
    },
    'click .remove': function (e, value, row, index) {
        deleteDesktop(row.id);
    }
}

// function that displays a toast message for the delete request
function showDeleteToast(status){
    switch (status) {
        case 0:
            //no desktops selected toast
            var toast = document.getElementById("toast-failure-message");
            toast.innerHTML = 'Error, no desktop selected';
            $('#toast-failure').toast("show");
            break;

        case 1:
            //success toast
            var toast = document.getElementById("toast-success-message");
            toast.innerHTML = 'Successfully deleted selected desktop(s).';
            $('#toast-success').toast("show");
            break;

        case 2:
            // server error toast
            var toast = document.getElementById("toast-failure-message");
            toast.innerHTML = 'Error while deleting selected desktop(s).';
            $('#toast-failure').toast("show");
            break;

        default:
            console.error("Not supposed to be here");
    }
}

// function that displays a toast message in case of a server error
function showErrorToast(status, message){
    var toast = document.getElementById("toast-failure-message");
    // message format are always "substatus - message itself"
    var split_message = message.split(" - ");
    if(status != 403 && split_message[0] !== "403.1") {
        toast.innerHTML = `Error ${status} : ${message}`;
        $('#toast-failure').toast("show");
    }
    else{
        toast.innerHTML = `Error ${status} : API KEY incorrect or not set up`;
        $('#toast-failure').toast("show");
        showSetApiKeyModal();
    }
}

// function that show the set API KEY Modal
function showSetApiKeyModal(){
    var setApiKeyModal = new bootstrap.Modal(document.getElementById('setApiKeyModal'), {
        keyboard: false
    });
    setApiKeyModal.show();
}

// function that build the table (without options) whose id is passed in parameter
function initTableNoOpts(id,data){
    // initilazing the table with data and options
    $(id).bootstrapTable({
        data: data,
        search: true,
    });
}

// function that build the table (with options) whose id is passed in parameter
function initTableOpts(id,data,sortName,toolbar){
    // initilazing the table with data and options
    $(id).bootstrapTable({
        data: data,
        search: true,
        sortName: sortName,
        sortOrder: "desc",
        toolbar: toolbar,
        checkboxHeader: true,
        checkbox: true,
        fixedColumns: true,
        fixedNumber: 2,
        fixedRightNumber: 1,
        pagination: true,
        paginationParts: ['pageSize', 'pageList']
    });
}

// // function that build the table (with options) whose id is passed in parameter
// function initTable(id,data,toolbar,detailFormatter){
//     // initilazing the table with data and options
//     $(id).bootstrapTable({
//         data: data,
//         sortName: "name",
//         sortOrder: "asc",
//         toolbar: toolbar,
//         checkboxHeader: true,
//         checkbox: true,
//         search: true,
//         detailView: true,
//         detailViewByClick: true,
//         detailViewIcon: false,
//         detailFormatter: detailFormatter,
//         fixedColumns: true,
//         fixedNumber: 2,
//         fixedRightNumber: 1
//     });
// }

function refreshTableData(id,data){
    // refresh only the data option because the only one that changes
    $(id).bootstrapTable('refreshOptions',{
        data: data,
    });
}

function toogleMenu(){
    var chevron = document.getElementById("subMenuChevron");
    chevron.classList.toggle('closed');
}

//////////////////////////////////////////////////////////////////////// Desktops ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function that builds the table data
function buildData(output){
    var keys = Object.keys(output);
    var data = [];
    for(let i=0; i<keys.length; i++){
        // collecting the infos we want
        var desktop_infos = {
            "name" : output[keys[i]].name,
            "status" : output[keys[i]].status,
            "ipAddr" : output[keys[i]].ipAddr,
            "id" : output[keys[i]].id,
            "creation_timestamp" : new Date(output[keys[i]].creation_timestamp),
            "nodehostname" : output[keys[i]].nodehostname,
            "container_name" : output[keys[i]].container_name,
            "container_id" : output[keys[i]].container_id
        }
        // pushing them into an array
        data.push(desktop_infos);
    }
    return data;
}

// function that collects the initial data and build the desktop table
function getDesktopData(){
    // send the GET command to pyos to get all the current desktops on the running session
    return new Promise((resolve, reject) => {
        $.ajax({
            method : 'GET',
            url : `${pyos_url}/API/manager/desktop`,
            headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
            success : function(output){
                resolve(output);
            },
            error : function(error){
                reject(error);
            }
        })
    })
}

// function that deletes the desktop whose id is passed in parameter
function deleteDesktop(id){
    // sending command to pyos to delete the selected desktop(s) from the abcdesktop session
    return new Promise((resolve, reject) => {
        $.ajax({
            method : 'DELETE',
            url : `${pyos_url}/API/manager/desktop/${id}`,
            headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
            success : function(output){
                resolve(output);
            },
            error : function(error){
                reject(error);
            }
        })
    })

    // once the ajax request is over, process the result
    .then(function(output) {
        console.log(output);
        showDeleteToast(1);
        processDesktopData();
    })
    .catch(function(error) {
        console.error(error);
        showDeleteToast(2);
        showErrorToast(error.responseJSON.status,error.responseJSON.message);
    })
}

// function that retrieves the desktop data and process it to refresh the table
function processDesktopData(){
    getDesktopData()
        .then(function(data) {
            var desktop_data = buildData(data);
            refreshTableData('#desktopTable',desktop_data);
        })
        .catch(function(error) {
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        })
}

// function testFormatter(index, row) {
//     var id = row.id;
//     var html = ['<div id="genInfosTableContainer'+id+'">',
//                 '<table id="toto" class="table table-striped">',
//                 '<thead>',
//                 '<tr>',
//                 '<th data-field="name">name</th>',
//                 '<th data-field="namespace">namespace</th>',
//                 '<th data-field="creationTimestamp">creation time stamp</th>',
//                 '<th data-field="lastlogin_datetime">last login datetime</th>',
//                 '</tr>',
//                 '</thead>',
//                 '</table>',
//                 '</div>'
//                 ]
//     return html.join('');
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////// Infos ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function that builds the general data
function buildGeneralData(output){
    // collecting the infos we want
    var data=[];
    var general_infos = {
        "name" : output.metadata.name,
        "namespace" : output.metadata.namespace,
        "creationTimestamp" : output.metadata.creationTimestamp.replace("T", " ").replace("Z", ""),
        "lastlogin_datetime" : output.metadata.annotations.lastlogin_datetime.replace("T", " ")
    }
    data.push(general_infos)
    return data;
}

// function that builds the labels data
function buildLabelsData(output){
    var keys = Object.keys(output.metadata.labels);
    var data = [];
    for(let i=0; i<keys.length; i++){
        // collecting the infos we want
        var labels_infos = {
            "labelName": [keys[i]],
            "value": output.metadata.labels[keys[i]]
        };
        data.push(labels_infos);
    }
    return data;
}

// function that builds the containers data
function buildContainersData(output){
    var data = [];
    // main containers loop
    for(let i=0; i<output.status.containerStatuses.length; i++){
        // collecting the infos we want
        var status = Object.keys(output.status.containerStatuses[i].state);
        // if the container is not running, we dont put it in the table
        if(status[0]==="running"){
            var container_infos = {
                "name" : output.status.containerStatuses[i].name,
                "image" : output.status.containerStatuses[i].image,
                "status" : status[0]
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }
    var keys = Object.keys(output.status);
    if(keys.includes("ephemeralContainerStatuses")){
        // ephemeral containers loop
        for(let i=0; i<output.status.ephemeralContainerStatuses.length; i++){
            // collecting the infos we want
            var status = Object.keys(output.status.ephemeralContainerStatuses[i].state);
            // if the container is not running, we dont put it in the table
            if(status[0]==="running"){
                var container_infos = {
                    "name" : output.status.ephemeralContainerStatuses[i].name,
                    "image" : output.status.ephemeralContainerStatuses[i].image,
                    "status" : status[0]
                }
                // pushing them into an array
                data.push(container_infos);
            }
        }
    }   
    return data;
}

// function that collects all the data we need
function getInfosData(id){
    // send the GET command to pyos to get all the infos that concerns the desktop whose id is passed in parameter
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/desktop/${id}`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        success : function(output){
            // gereral table
            var general_data = buildGeneralData(output);
            refreshTableData('#generalInfosTable',general_data);
            // label table
            var labels_data = buildLabelsData(output);
            refreshTableData('#labelsInfosTable',labels_data);
            // container table
            var containers_data = buildContainersData(output);
            refreshTableData('#containerTable',containers_data);
        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        }
    })
}

// fuction that refreshes the table data
function updateContainerData(){
    var id = localStorage.getItem('desktopId');
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/desktop/${id}`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        success : function(output){
            var containers_data = buildContainersData(output);
            // refresh only the data option because the only one that changes
            refreshTableData('#containerTable',containers_data);
        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        }
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$(document).ready(function() {
    // enable tooltips source : https://getbootstrap.com/docs/5.3/components/tooltips/
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    // initializing all the tables
    initTableOpts('#desktopTable',[],"creation_timestamp","#desktopToolbar");
    initTableOpts('#containerTable',[],"name","#containerToolbar");
    initTableNoOpts('#generalInfosTable',[]);
    initTableNoOpts('#labelsInfosTable',[]);
    
    checkApiKey();

    // set api key
    $("#set-api-key-button").on('click',function(){
        var apiKey = $('#set-api-key').val();
        localStorage.setItem('apiKey',apiKey);
        checkApiKey();
    })

    // refresh the table data on click 
    $('#refresh-desktop-table-button').on('click', function() {
        processDesktopData();
    });

    // refresh the table data on click 
    $('#refresh-container-table-button').on('click', function() {
        updateContainerData();
    });

    // DELETE desktop from pyos 
    $('#delete-desktop-button').on('click',function(){  
        var ids = $.map($('#desktopTable').bootstrapTable('getSelections'), function (row) {
          return row.id
        })
        // if no desktop selected show an error toast
        if(ids.length == 0){
            showDeleteToast(0);
        }
        else{
            for(let i=0; i<ids.length; i++){
                deleteDesktop(ids[i]);
            }
        }
    });
});