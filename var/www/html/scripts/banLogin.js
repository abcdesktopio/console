const pyos_url = document.location.origin;

function checkApiKey(){
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/healtz`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        success : function(){
            getLoginData();
        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        }
    })
}

// formatter for ban operations
// source : https://examples.bootstrap-table.com/#view-source
function operateFormatter(value, row, index) {
    return [
      '<div class="operate-icons-container">',
    //   '<a class="infos" href="javascript:void(0)" title="Infos">',
    //   '<i class="bi bi-info-circle-fill" style="color: #6dc5ef;"></i>',
    //   '</a>',
      '<a class="unban" href="javascript:void(0)" title="Unban">',
      '<i class="bi bi-trash-fill" style="color: #dc3545;"></i>',
      '</a>',
      '</div>'
    ].join('')
}

// source : https://examples.bootstrap-table.com/#view-source
window.operateEvents = {
    // 'click .infos': function (e, value, row, index) {
    //     alert("here are some infos");
    // },
    'click .unban': function (e, value, row, index) {
        deleteLogin(row.id);
    }
}

// function that displays a toast message for the post request
function showPostToast(success){

    //success toast
    if(success){
        let toast = document.getElementById("toast-success-message");
        toast.innerHTML = 'Successfully banned user';
        $('#toast-success').toast("show");
    }
  
    //not success toast
    else{
      let toast = document.getElementById("toast-failure-message");
      toast.innerHTML = 'Error while banning user';
      $('#toast-failure').toast("show");
    }
}

// function that displays a toast message for the delete request
function showDeleteToast(status){
    switch (status) {
        case 0:
            //no apps selected toast
            var toast = document.getElementById("toast-failure-message");
            toast.innerHTML = 'Error, no banned user selected';
            $('#toast-failure').toast("show");
            break;

        case 1:
            //success toast
            var toast = document.getElementById("toast-success-message");
            toast.innerHTML = 'Successfully unbanned user';
            $('#toast-success').toast("show");
            break;

        case 2:
            // server error toast
            var toast = document.getElementById("toast-failure-message");
            toast.innerHTML = 'Error while unbanning user';
            $('#toast-failure').toast("show");
            break;

        default:
            console.error("Not supposed to be here");
    }
}

// function that displays a toast message in case of a server error
function showErrorToast(status, message){
    var toast = document.getElementById("toast-failure-message");
    if(status != 403) {
        toast.innerHTML = `Error ${status} : ${message}`;
        $('#toast-failure').toast("show");
    }
    else{
        // message format are always "substatus - message itself"
        var split_message = message.split(" - ");
        if(split_message[0] === "403.1"){
            toast.innerHTML = `Error ${status} : API KEY incorrect or not set up`;
            $('#toast-failure').toast("show");
            showSetApiKeyModal();
        }
    }
}

// function that show the set API KEY Modal
function showSetApiKeyModal(){
    var setApiKeyModal = new bootstrap.Modal(document.getElementById('setApiKeyModal'), {
        keyboard: false
    });
    setApiKeyModal.show();
}

// function that build the table (with options) whose id is passed in parameter
function initTable(id,data,toolbar){
    // initilazing the table with data and options
    $(id).bootstrapTable({
        data: data,
        sortName: "id",
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
    // refresh only the data option because the only one that changes
    $(id).bootstrapTable('refreshOptions',{
        data: data,
    });
}

// function that builds the table data
function buildData(output){
    var keys = Object.keys(output);
    var data = [];
    for(let i=0; i<keys.length; i++){
        // collecting the infos we want
        var app_infos = {
            "id" : output[keys[i]].id,
            "date" : output[keys[i]].date,
            "banexpireAfterSeconds" : output[keys[i]].banexpireAfterSeconds
        }
        // pushing them into an array
        data.push(app_infos);
    }
    return data;
}

// function that collects the initial data and build the login table
function getLoginData(){
    // send the GET command to pyos to get all the current banned logins
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/ban/login`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        success : function(output){
            var login_data = buildData(output);
            refreshTableData('#loginTable',login_data)
        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        }
    })
}

// function that bans user whose login is passed in parameter
function postLogin(login){
    $.ajax({
        method : 'POST',
        url : `${pyos_url}/API/manager/ban/login/${login}`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        success : function(output){
            console.log(output);
            showPostToast(true);
            setTimeout(getLoginData, 100);
        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
            showPostToast(false);
        }
    })
}

// function that unbans the user whose login is passed in parameter
function deleteLogin(login){
    $.ajax({
        method : 'DELETE',
        url : `${pyos_url}/API/manager/ban/login/${login}`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        success : function(output){
            console.log(output);
            showDeleteToast(1);
            setTimeout(getLoginData, 100);
        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
            showDeleteToast(2);
        }
    })
}

$(document).ready(function() {
    // initializing login tables
    initTable('#loginTable',[],'#loginToolbar');

    checkApiKey();

    // set api key
    $("#set-api-key-button").on('click',function(){
        var apiKey = $('#set-api-key').val();
        localStorage.setItem('apiKey',apiKey);
        checkApiKey();
    })

    // refresh the login table data on click 
    $('#refresh-login-table-button').on('click', function() {
        getLoginData();
    });

    // ban users from login
    $("#ban-login-button").on('click',function(){
        var loginToBan = $('#ban-login').val();
        postLogin(loginToBan);
    })

    // unban users from login 
    $('#unban-login-button').on('click',function(){  
        var logins = $.map($('#loginTable').bootstrapTable('getSelections'), function (row) {
          return row.id
        })
        // if no user selected show an error toast
        if(logins.length == 0){
            showDeleteToast(0);
        }
        else{
            for(let i=0; i<logins.length; i++){
                deleteLogin(logins[i]);
            }
        }
    });
});