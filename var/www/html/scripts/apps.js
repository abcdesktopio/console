const pyos_url = document.location.origin;


// insert the apps icons based on the raw data
function ImgFormatter(value) {
    return "<img src=data:image/svg+xml;base64,"+value+">";
}

// formatter for app operations
// source : https://examples.bootstrap-table.com/#view-source
function operateFormatter(value, row, index) {
    return [
      '<div class="operate-icons-container">',
      '<a class="infos" href="javascript:void(0)" title="Infos" data-bs-toggle="modal" data-bs-target="#AppInfosModal">',
      '<i class="bi bi-info-circle-fill" style="color: #6dc5ef;"></i>',
      '</a>',
      '<a class="remove" href="javascript:void(0)" title="Remove">',
      '<i class="bi bi-trash-fill" style="color: #dc3545;"></i>',
      '</a>',
      '</div>'
    ].join('')
}

// function that displays a toast message for the put request
function showPutToast(success){

    //success toast
    if(success){
        let toast = document.getElementById("toast-put-success-message");
        toast.innerHTML = 'Successfully added app to abcdesktop';
        $('#toast-put-success').toast("show");
    }
  
    //not success toast
    else{
      let toast = document.getElementById("toast-put-failure-message");
      toast.innerHTML = 'Error while adding app to abcdesktop';
      $('#toast-put-failure').toast("show");
    }
}

// function that displays a toast message for the delete request
function showDeleteToast(status){
    switch (status) {
        case 0:
            //no apps selected toast
            var toast = document.getElementById("toast-delete-failure-message");
            toast.innerHTML = 'Error, no apps selected';
            $('#toast-delete-failure').toast("show");
            break;

        case 1:
            //success toast
            var toast = document.getElementById("toast-delete-success-message");
            toast.innerHTML = 'Successfully deleted selected app(s).';
            $('#toast-delete-success').toast("show");
            break;

        case 2:
            // server error toast
            var toast = document.getElementById("toast-delete-failure-message");
            toast.innerHTML = 'Error while deleting selected app(s).';
            $('#toast-delete-failure').toast("show");
            break;

        default:
            console.error("Not supposed to be here");
    }
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
function initTable(){
    // send the GET command to pyos to get all the current apps on the running session
    $.ajax({
        method : 'GET',
        url : ''+pyos_url+'/API/manager/images',
        contentType : "text/javascript",
        success : function(output){
            var app_data = buildData(output);
            // initilazing the table with data and options
            $('#table').bootstrapTable({
                data: app_data,
                sortName: "name",
                sortOrder: "asc",
                toolbar: "#toolbar",
                checkboxHeader: true,
                checkbox: true,
                search: true
            });
        },
        error : function(error){
            console.error(error)
        }
    })
}

// fuction that refreshes the table data
function updateData(){
    $.ajax({
        method : 'GET',
        url : ''+pyos_url+'/API/manager/images',
        contentType : "text/javascript",
        success : function(output){
            var app_data = buildData(output);
            // refresh only the data option because the only one that changes
            $('#table').bootstrapTable('refreshOptions',{
                data: app_data,
            });
        },
        error : function(error){
            console.error(error);
        }
    })
}

// fuction that shows the complete json file of an app
function getInfos(id){
    $.ajax({
        method : 'GET',
        url : ''+pyos_url+'/API/manager/image/'+id,
        contentType : "text/javascript",
        success : function(output){
            var infos = JSON.stringify(output, undefined, 4);
            document.getElementById("app-infos").innerHTML = "<pre>"+infos.replace(/\n/g, '<br>')+"</pre>";
        },
        error : function(error){
            console.error(error);
        }
    })
}

// function that adds the app whose json is passed in parameter
function putApp(app){
    $.ajax({
        data : app,
        method : 'PUT',
        url : ''+pyos_url+'/API/manager/image',
        contentType : "text/javascript",
        success : function(output){
            console.log(output);
            showPutToast(true);
            setTimeout(updateData, 100);
        },
        error : function(error){
            console.error(error);
            showPutToast(false);
        }
    })
}

// function that deletes the app whose id is passed in parameter
function deleteApp(id){
    // sending command to pyos to delete the selected app(s) from the abcdesktop session
    $.ajax({
        method : 'DELETE',
        url : ''+pyos_url+'/API/manager/image/'+id+'',
        contentType : "text/javascript",
        success : function(output){
            console.log(output);
            showDeleteToast(1);
            setTimeout(updateData, 100);
        },
        error : function(error){
            console.error(error);
            showDeleteToast(2);
        }
    })
}

$(document).ready(function() {
    // initializing table
    initTable();

    // refresh the table data on click 
    $('#refresh-table-button').on('click', function() {
        updateData();
    });
    
    // PUT application to pyos 
    $('#add-app-button').on('click', function() {
        var json_file = document.getElementById("json-file");

        console.log(json_file.files[0].name);

        // source : https://javascript.info/file#:~:text=We%20usually%20get%20File%20objects,ArrayBuffer%20(%20readAsArrayBuffer%20)
        let reader = new FileReader();

        reader.readAsText(json_file.files[0]);
        
        reader.onload = function() {
             putApp(reader.result);
        };

        reader.onerror = function() {
            console.error(reader.error);
            showPutToast(false);
        };
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

    // source : https://examples.bootstrap-table.com/#view-source
    window.operateEvents = {
        'click .infos': function (e, value, row, index) {
            getInfos(row.id);
        },
        'click .remove': function (e, value, row, index) {
            deleteApp(row.id);
        }
      }
});