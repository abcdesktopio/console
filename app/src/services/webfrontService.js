import { PREFIX } from "./prefix";
import  { getApps } from "./appsService";

// function that builds the users table data
function buildUsersData(output){
    var data = [];
    for(let i=0; i<output.length; i++){
        // collecting the infos we want
        var desktop_infos = {
            "ID" : output[i],
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
                "ID" : output[keys[i]].name,
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

export const addOrRemoveAppToDock = (appName,operation) => {
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
export const getUsers = async () => {
    // send the GET command to pyos to get all the current users on the running session
    const response = await fetch(`${PREFIX}/API/manager/datastore/profiles`, {
        headers: {
            "X-API-KEY": localStorage.getItem("apiKey"),
        },
    });
    if (!response.ok) {
        const errorJSON = await response.json();
        throw new Error(`${response.status} - ${errorJSON.message}`);
    }

    const json = await response.json();
    const builtData = buildUsersData(json);
    console.log(builtData);
    return builtData;
}

// function that collects the profile data for a specific user and fill the dock apps table
export const getDockAppsdata = async (user) => {
    const response = await fetch(`${PREFIX}/API/manager/datastore/profiles/${user}/dock`, {
        headers: {
            "X-API-KEY": localStorage.getItem("apiKey"),
        },
    });
    if (!response.ok) {
        const errorJSON = await response.json();
        throw new Error(`${response.status} - ${errorJSON.message}`);
    }

    const json = await response.json();
    const builtData = buildDockAppsData(json);
    console.log(builtData);
    return builtData;
}

// function that returns the dock data for a specific user 
export const getDock = async () => {
    const response = await fetch(`${PREFIX}/API/manager/datastore/profiles/${user}/dock`, {
        headers: {
            "X-API-KEY": localStorage.getItem("apiKey"),
        },
    });
    if (!response.ok) {
        const errorJSON = await response.json();
        throw new Error(`${response.status} - ${errorJSON.message}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
}

// function that updates the dock apps
export const updateDockApp = async (data) => {
    const response = await fetch(`${PREFIX}/API/manager/datastore/profiles/${user}/dock`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "X-API-KEY": localStorage.getItem("apiKey"),
        },
        body: data,
    });
    if (!response.ok) {
        const errorJSON = await response.json();
        throw new Error(`${response.status} - ${errorJSON.message}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
}