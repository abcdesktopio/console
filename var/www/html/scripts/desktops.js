const pyos_url = document.location.origin;

// formatter for desktop operations
// source : https://examples.bootstrap-table.com/#view-source
function operateFormatter(value, row, index) {
    return [
      '<div class="operate-icons-container">',
      '<a class="infos" href="javascript:void(0)" title="Infos" role="button" data-bs-toggle="collapse" data-bs-target="#collapseInfos" aria-expanded="false" aria-controls="collapseInfos">',
      '<i class="bi bi-info-circle-fill" style="color: #6dc5ef;"></i>',
      '</a>',
      '<a class="remove" href="javascript:void(0)" title="Remove">',
      '<i class="bi bi-trash-fill" style="color: #dc3545;"></i>',
      '</a>',
      '</div>'
    ].join('')
}

// function that displays a toast message for the delete request
function showDeleteToast(status){
    switch (status) {
        case 0:
            //no desktops selected toast
            var toast = document.getElementById("toast-delete-failure-message");
            toast.innerHTML = 'Error, no desktop selected';
            $('#toast-delete-failure').toast("show");
            break;

        case 1:
            //success toast
            var toast = document.getElementById("toast-delete-success-message");
            toast.innerHTML = 'Successfully deleted selected desktop(s).';
            $('#toast-delete-success').toast("show");
            break;

        case 2:
            // server error toast
            var toast = document.getElementById("toast-delete-failure-message");
            toast.innerHTML = 'Error while deleting selected desktop(s).';
            $('#toast-delete-failure').toast("show");
            break;

        default:
            console.error("Not supposed to be here");
    }
}

// function that build the table (without options) whose id is passed in parameter
function initTable(id,data){
    // initilazing the table with data and options
    $(id).bootstrapTable({
        data: data,
        search: true
    });
}

// function that build the table (with options) whose id is passed in parameter
function initTable(id,data,toolbar){
    // initilazing the table with data and options
    $(id).bootstrapTable({
        data: data,
        sortName: "name",
        sortOrder: "asc",
        toolbar: toolbar,
        checkboxHeader: true,
        checkbox: true,
        search: true,
        fixedColumns: true,
        fixedNumber: 2,
        fixedRightNumber: 1
    });
}

function refreshTableData(id,data){
    $(id).bootstrapTable('refreshOptions',{
        data: data,
    });
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
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/desktop`,
        contentType : "text/javascript",
        success : function(output){
            var desktop_data = buildData(output);
            initTable('#desktopTable',desktop_data,"#desktopToolbar");
        },
        error : function(error){
            console.error(error)
        }
    })
}

// function that collects the initial data and build the desktop table
function updateDesktopData(){
    // send the GET command to pyos to get all the current desktops on the running session
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/desktop`,
        contentType : "text/javascript",
        success : function(output){
            var desktop_data = buildData(output);
            refreshTableData('#desktopTable',desktop_data);
        },
        error : function(error){
            console.error(error)
        }
    })
}

// function that deletes the desktop whose id is passed in parameter
function deleteDesktop(id){
    // sending command to pyos to delete the selected desktop(s) from the abcdesktop session
    $.ajax({
        method : 'DELETE',
        url : `${pyos_url}/API/manager/desktop/${id}`,
        contentType : "text/javascript",
        success : function(output){
            console.log(output);
            showDeleteToast(1);
            setTimeout(updateDesktopData, 100);
        },
        error : function(error){
            console.error(error);
            showDeleteToast(2);
        }
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////// Infos ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function that builds the general data
function buildGeneralData(output){
    // collecting the infos we want
    var data=[];
    var general_infos = {
        "name" : output.metadata.name,
        "namespace" : output.metadata.namespace,
        "creationTimestamp" : output.metadata.creationTimestamp,
        "lastlogin_datetime" : output.metadata.annotations.lastlogin_datetime
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
        contentType : "text/javascript",
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
            console.error(error)
        }
    })
}

// fuction that refreshes the table data
function updateContainerData(){
    var id = localStorage.getItem('desktopId');
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/desktop/${id}`,
        contentType : "text/javascript",
        success : function(output){
            var containers_data = buildContainersData(output);
            // refresh only the data option because the only one that changes
            refreshTableData('#containerTable',containers_data);
        },
        error : function(error){
            console.error(error);
        }
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$(document).ready(function() {
    getDesktopData();
    // initializing all the tables
    initTable('#containerTable',[],"#containerToolbar");
    initTable('#generalInfosTable',[]);
    initTable('#labelsInfosTable',[]);
    

    // refresh the table data on click 
    $('#refresh-desktop-table-button').on('click', function() {
        updateDesktopData();
    });

    // refresh the table data on click 
    $('#refresh-container-table-button').on('click', function() {
        updateContainerData();
    });

    // DELETE desktop from pyos 
    $('#delete-desktop-button').on('click',function(){  
        var ids = $.map($('#table').bootstrapTable('getSelections'), function (row) {
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

    // source : https://examples.bootstrap-table.com/#view-source
    window.operateEvents = {
        'click .infos': function (e, value, row, index) {
            localStorage.setItem('desktopId',row.id);
            getInfosData(row.id);
            document.getElementById("dId").innerHTML = row.id;
        },
        'click .remove': function (e, value, row, index) {
            deleteDesktop(row.id);
        }
      }
});