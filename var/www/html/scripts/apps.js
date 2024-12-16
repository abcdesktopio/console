const pyos_url = document.location.origin;

function checkApiKey(){
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/healtz`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        success : function(){
            getData();
        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        }
    })
}

function toggleFormatter(value, row) {
    return '<a class="infos" href="javascript:void(0)" title="Infos" data-bs-toggle="modal" data-bs-target="#AppInfosModal" style="color: #6dc5ef;">'+row.name+'</a>';
}

// insert the apps icons based on the raw data
function ImgFormatter(value) {
    return "<img src=data:image/svg+xml;base64,"+value+">";
}

// formatter for app operations
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
        getInfos(row.id);
    },
    'click .remove': function (e, value, row, index) {
        deleteApp(row.id)
    }
}

// source : https://jsfiddle.net/unLSJ/
if (!library)
   var library = {};

library.json = {
   replacer: function(match, pIndent, pKey, pVal, pEnd) {
      var key = '<span class=json-key>';
      var val = '<span class=json-value>';
      var str = '<span class=json-string>';
      var r = pIndent || '';
      if (pKey)
         r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
      if (pVal)
         r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
      return r + (pEnd || '');
      },
   prettyPrint: function(obj) {
      var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
      return JSON.stringify(obj, null, 3)
         .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
         .replace(/</g, '&lt;').replace(/>/g, '&gt;')
         .replace(jsonLine, library.json.replacer);
      }
};

// function that displays a toast message for the put request
function showPutToast(success){

    //success toast
    if(success){
        let toast = document.getElementById("toast-success-message");
        toast.innerHTML = 'Successfully added app to abcdesktop';
        $('#toast-success').toast("show");
    }
  
    //not success toast
    else{
      let toast = document.getElementById("toast-failure-message");
      toast.innerHTML = 'Error while adding app to abcdesktop';
      $('#toast-failure').toast("show");
    }
}

// function that displays a toast message for the delete request
function showDeleteToast(status){
    switch (status) {
        case 0:
            //no apps selected toast
            var toast = document.getElementById("toast-failure-message");
            toast.innerHTML = 'Error, no apps selected';
            $('#toast-failure').toast("show");
            break;

        case 1:
            //success toast
            var toast = document.getElementById("toast-success-message");
            toast.innerHTML = 'Successfully deleted selected app(s).';
            $('#toast-success').toast("show");
            break;

        case 2:
            // server error toast
            var toast = document.getElementById("toast-failure-message");
            toast.innerHTML = 'Error while deleting selected app(s).';
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
    if(split_message[0] === "403.1") {
        toast.innerHTML = `Error ${status} : API KEY incorrect or not set up`;
        $('#toast-failure').toast("show");
        showSetApiKeyModal();
    }
    else{
        toast.innerHTML = `Error ${status} : ${message}`;
        $('#toast-failure').toast("show");
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
        sortName: "name",
        sortOrder: "asc",
        toolbar: toolbar,
        checkboxHeader: true,
        checkbox: true,
        search: true,
        fixedColumns: true,
        fixedNumber: 2,
        fixedRightNumber: 1,
        pagination: true,
        paginationParts: ['pageSize', 'pageList']
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

// function that builds the table data
function buildData(output){
    var keys = Object.keys(output);
    var data = [];
    for(let i=0; i<keys.length; i++){
        // collecting the infos we want
        var app_infos = {
            "name" : output[keys[i]].name,
            "icondata" : output[keys[i]].icondata,
            "id" : (output[keys[i]].sha_id).slice(7)
        }
        // pushing them into an array
        data.push(app_infos);
    }
    return data;
}

// function that collects the initial data and build the table
function getData(){
    // send the GET command to pyos to get all the current apps on the running session
    return new Promise((resolve, reject) => {
        $.ajax({
            method : 'GET',
            url : `${pyos_url}/API/manager/buildapplist`,
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
        var app_data = buildData(output);
        refreshTableData('#table',app_data);
    })
    .catch(function(error) {
        console.error(error);
        showErrorToast(error.responseJSON.status,error.responseJSON.message);
    })
}

// fuction that shows the complete json file of an app
function getInfos(id){
    $.ajax({
        method : 'GET',
        url : `${pyos_url}/API/manager/image/${id}`,
        headers : { "X-API-KEY" : localStorage.getItem("apiKey") },
        success : function(output){
            // source : https://jsfiddle.net/unLSJ/
            $('#appInfos').html(library.json.prettyPrint(output));
        },
        error : function(error){
            console.error(error);
            showErrorToast(error.responseJSON.status,error.responseJSON.message);
        }
    })
}

// function that adds the app whose json is passed in parameter
function putApp(app) {
    return new Promise((resolve, reject) => {
        $.ajax({
            data: app,
            method: 'PUT',
            url: `${pyos_url}/API/manager/image`,
            contentType: "text/javascript",
            headers: { "X-API-KEY": localStorage.getItem("apiKey") },
            success : function(output){
                resolve(output);
            },
            error : function(error){
                reject(error);
            }   
        });
    })

    // once the ajax request is over, process the result
    .then(function(output) {
        console.log(output);
        showPutToast(true);
        getData();
    }).catch(function(error) {
        console.error(error);
        showErrorToast(error.responseJSON.status, error.responseJSON.message);
        showPutToast(false);
    })
}

// function that deletes the app whose id is passed in parameter
function deleteApp(id){
    // sending command to pyos to delete the selected app(s) from the abcdesktop session
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'DELETE',
            url: `${pyos_url}/API/manager/image/${id}`,
            contentType: "text/javascript",
            headers: { "X-API-KEY": localStorage.getItem("apiKey") },
            success : function(output){
                resolve(output);
            },
            error : function(error){
                reject(error);
            }   
        });
    })

    // once the ajax request is over, process the result
    .then(function(output) {
        console.log(output);
        showDeleteToast(1);
        getData();
    }).catch(function(error) {
        console.error(error);
        showErrorToast(error.responseJSON.status, error.responseJSON.message);
        showDeleteToast(2);
    })
}

$(document).ready(function() {
    // enable tooltips source : https://getbootstrap.com/docs/5.3/components/tooltips/
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    // initializing app table
    initTable('#table',[],'#toolbar');

    checkApiKey();

    // set api key
    $("#set-api-key-button").on('click',function(){
        var apiKey = $('#set-api-key').val();
        localStorage.setItem('apiKey',apiKey);
        checkApiKey();
    })

    // refresh the table data on click 
    $('#refresh-table-button').on('click', function() {
        getData();
    });
    
    // PUT application to pyos 
    $('#add-app-json-file-button').on('click', function() {
        var json_file = document.getElementById("json-file");

        console.log(json_file.files[0].name);

        // source : https://javascript.info/file#:~:text=We%20usually%20get%20File%20objects,ArrayBuffer%20(%20readAsArrayBuffer%20)
        let reader = new FileReader();

        reader.readAsText(json_file.files[0]);
        
        reader.onload = function() {
            putApp(reader.result)
        };

        reader.onerror = function() {
            console.error(reader.error);
            showPutToast(false);
        };
    });

    $('#add-app-raw-json-button').on('click', function() {
        var raw_json = $("#raw-json").val();
        putApp(raw_json)
    });

    // DELETE application from pyos 
    $('#delete-app-button').on('click',function(){  
        var ids = $.map($('#table').bootstrapTable('getSelections'), function (row) {
          return row.id
        })
        // if no app selected show an error toast
        if(ids.length == 0){
            showDeleteToast(0);
        }
        else{
            for(let i=0; i<ids.length; i++){
                deleteApp(ids[i]);
            }
        }
    });
});