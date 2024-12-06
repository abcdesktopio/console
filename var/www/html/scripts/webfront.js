const pyos_url = document.location.origin;

function checkApiKey(){
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/healtz`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        success : function(){
            getUsers();
        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        }
    })
}

function toggleFormatter(value, row) {
    return '<a class="infos" href="#" title="Infos" role="button" data-bs-toggle="collapse" data-bs-target="#profileInfos" aria-expanded="false" aria-controls="profileInfos" style="color: #6dc5ef;">'+row.user+'</a>';
}

// insert the apps icons based on the raw data
function ImgFormatter(value) {
    return "<img src=data:image/svg+xml;base64,"+value+">";
}

// formatter for ban operations
// source : https://examples.bootstrap-table.com/#view-source
function operateFormatter(value, row, index) {
    return [
      '<div class="operate-icons-container">',
      '<a class="remove" href="javascript:void(0)" title="remove">',
      '<i class="bi bi-trash-fill" style="color: #dc3545;"></i>',
      '</a>',
      '</div>'
    ].join('')
}

// source : https://examples.bootstrap-table.com/#view-source
window.operateEvents = {
    'click .infos': function (e, value, row, index) {
        // if(localStorage.getItem('username') !== row.name){
        //     toggleProfileInfo(2);
        // }
        // else{
        //     toggleProfileInfo(1);
        // }
        localStorage.setItem('username',row.user);
        getDockAppsdata();
    },
    'click .remove': function (e, value, row, index) {
        addOrRemoveAppToDock(row.name,"remove");
    }
}

// function that displays a toast message for updating an app from docks
function showPutToast(success){
    var user = localStorage.getItem("username");

    //success toast
    if(success){
        let toast = document.getElementById("toast-success-message");
        toast.innerHTML = `Successfully updated dock for user ${user}`;
        $('#toast-success').toast("show");
    }
  
    //not success toast
    else{
      let toast = document.getElementById("toast-failure-message");
      toast.innerHTML = `Error while removing app from ${user}'s dock`;
      $('#toast-failure').toast("show");
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
function initTableUsers(id,data,toolbar){
    // initilazing the table with data and options
    $(id).bootstrapTable({
        data: data,
        sortName : "user",
        sortOrder: "asc",
        search: true,
        toolbar: toolbar,
        pagination: true,
        paginationParts: ['pageList']
    });
}

// function that build the table (with options) whose id is passed in parameter
function initTableApps(id,data,toolbar){
    // initilazing the table with data and options
    $(id).bootstrapTable({
        data: data,
        sortName: "name",
        sortOrder: "asc",
        toolbar: toolbar,
        search: true
    });
}

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

// function toggleProfileInfo(times){
//     var profile_infos = document.getElementById("profileInfos");
//     for(let i=0;i<times;i++){
//         profile_infos.classList.toggle('collapsing');
//         setTimeout(profile_infos.classList.toggle('collapsing'),100);
//         profile_infos.classList.toggle('show');
//     }
// }

function fillSelectAppOptions(){
    var select = document.getElementById("addAppSelect");
    var fill = [
        '<option selected>Choose an application to add</option>'
    ];
    getApps().then(function(allApps) {
        var dock_data = getDock();
        var dockApps = dock_data[0].dock;
        var keys = Object.keys(allApps);
        for(let i=0; i<keys.length; i++){
            if(!dockApps.includes(allApps[keys[i]].launch)){
                fill.push(`<option value=${i+1}>${allApps[keys[i]].name}</option>`);
            }
        }
        select.innerHTML = fill.join('');
    })
    .catch(function(error) {
        console.error(error);
        showErrorToast(error.responseJSON.status,error.responseJSON.message);
    })
}

// function that builds the users table data
function buildUsersData(output){
    var data = [];
    for(let i=0; i<output.length; i++){
        // collecting the infos we want
        var desktop_infos = {
            "user" : output[i],
        }
        // pushing them into an array
        data.push(desktop_infos);
    }
    return data;
}

// function that builds the dock apps table data
function buildDockAppsData(output,dockApps){
    var keys = Object.keys(output);
    var data = [];
    for(let i=0; i<keys.length; i++){
        if(dockApps.includes(output[keys[i]].launch)){
            // collecting the infos we want
            var app_infos = {
                "name" : output[keys[i]].name,
                "icondata" : output[keys[i]].icondata
            }
            // pushing them into an array
            data.push(app_infos);
        }
    }
    return data;
}

function extractAppNameToUpdate(appName, data){
    var keys = Object.keys(data);
    for(let i=0; i<keys.length; i++){
        if(data[keys[i]].name === appName){
            return data[keys[i]].launch;
        }
    }
    throw new Error(`No app selected or unfindable app`);;
}

function addOrRemoveAppToDock(appName,operation){
    console.log(appName);

    // getting the data of all apps, the launch name of the app to remove and the dock apps data from the profile data
    getApps().then(function(allApps) {
        try{
            var appToUpdate = extractAppNameToUpdate(appName,allApps);
        }
        catch(e){
            console.error(e);
            showErrorToast("", e.message);
            return;
        }
        var dock_data = getDock();
        var dockApps = dock_data[0].dock;
        console.log(dockApps);
        console.log(appToUpdate);
        
        // performing specified action
        if(operation === "remove"){
            // getting the index of the app to remove
            var index = dockApps.indexOf(appToUpdate);
            // removing the app of the array
            dockApps.splice(index,1);
            
        }
        else if(operation === "add"){
            // add the selected app at the end of the dock apps list
            dockApps.push(appToUpdate);
        }
        console.log(dockApps);

        // sending the updated dock apps list to pyos
        updateDockApp(JSON.stringify(dockApps));
    })
    .catch(function(error) {
        console.error(error);
        showErrorToast(error.responseJSON.status,error.responseJSON.message);
    })
}

// function that collects the initial data and build the users table
function getUsers(){
    // send the GET command to pyos to get all the current users on the running session
    return new Promise((resolve, reject) => {
        $.ajax({
            method : 'GET',
            url : `${pyos_url}/API/manager/datastore/profiles`,
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
        var users = buildUsersData(output);
        refreshTableData('#usersTable',users);
    })
    .catch(function(error) {
        console.error(error);
        showErrorToast(error.responseJSON.status,error.responseJSON.message);
    })
}

// function that collects the profile data for a specific user and fill the dock apps table
function getDockAppsdata(){
    var user = localStorage.getItem("username");
    return new Promise((resolve, reject) => {
        $.ajax({
            method : 'GET',
            url : `${pyos_url}/API/manager/datastore/profiles/${user}/dock`,
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
        var dockApps = output[0].dock;
        getApps().then(function(allApps) {
            var dockApps_data = buildDockAppsData(allApps,dockApps);
            refreshTableData('#dockAppsTable',dockApps_data);
        })
        .catch(function(error) {
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        })
    })
    .catch(function(error) {
        console.error(error);
        showErrorToast(error.responseJSON.status,error.responseJSON.message);
    })
}

// function that returns all the data concerning the installed apps on the session
function getApps(){
    // send the GET command to pyos to get all the current apps on the running session
    return new Promise((resolve, reject) => {
        $.ajax({
            method : 'GET',
            url : `${pyos_url}/API/manager/buildapplist`,
            headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
            async : false,
            success : function(output){
                resolve(output);
            },
            error : function(error){
                reject(error);
            }
        })
    })
}

// function that returns the dock data for a specific user 
function getDock(){
    var user = localStorage.getItem("username");
    var dock_data = ""
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/datastore/profiles/${user}/dock`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        async : false,
        success : function(output){
            dock_data = output

        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        }
    })
    return dock_data
}

// function that updates the dock apps
function updateDockApp(data){
    var user = localStorage.getItem("username");
    return new Promise((resolve, reject) => {
        $.ajax({
            data : data,
            method : 'PUT',
            url : `${pyos_url}/API/manager/datastore/profiles/${user}/dock`,
            contentType : "text/javascript",
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
        console.log(data);
        console.log(output);
        showPutToast(true);
        getDockAppsdata();
    })
    .catch(function(error) {
        console.error(error);
        showErrorToast(error.responseJSON.status,error.responseJSON.message);
    })
}


$(document).ready(function() {
    // enable tooltips source : https://getbootstrap.com/docs/5.3/components/tooltips/
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    
    // initializing all tables
    initTableUsers('#usersTable',[],"#usersToolbar");
    initTableApps('#dockAppsTable',[],"#dockAppsToolbar");

    checkApiKey();

    // set api key
    $("#set-api-key-button").on('click',function(){
        var apiKey = $('#set-api-key').val();
        localStorage.setItem('apiKey',apiKey);
        checkApiKey();
    })

     // refresh the users table data on click 
     $('#refresh-users-table-button').on('click', function() {
        getUsers();
    });

    // refresh the dock apps table data on click 
    $('#refresh-dockApps-table-button').on('click', function() {
        getDockAppsdata();
    });

    $('#openAddModalButton').on('click', function() {
        fillSelectAppOptions();
    });

    $('#add-app-button').on('click', function() {
        var select = document.getElementById("addAppSelect");
        var appName = select.options[select.selectedIndex].text;
        addOrRemoveAppToDock(appName,"add");
    });
});