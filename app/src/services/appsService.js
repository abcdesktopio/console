import { PREFIX } from "./prefix";

function buildData(output){
    var keys = Object.keys(output);
    var data = [];
    for(let i=0; i<keys.length; i++){
        // collecting the infos we want
        var app_infos = {
            "App name" : output[keys[i]].name,
            "Icon" : output[keys[i]].icondata,
            "ID" : (output[keys[i]].sha_id).slice(7)
        }
        // pushing them into an array
        data.push(app_infos);
    }
    return data;
}

// function that collects the initial data and build the table
export const getApps = async () => {
    // send the GET command to pyos to get all the current apps on the running session
    const response = await fetch(`${PREFIX}/API/manager/buildapplist`, {
    headers: {
        "X-API-KEY": localStorage.getItem("apiKey"),
    },
    });
    if (!response.ok) {
        const errorJSON = await response.json();
        throw new Error(`${response.status} - ${errorJSON.message}`);
    }

    const json = await response.json();
    const builtData = buildData(json);
    console.log(builtData);
    return builtData;
}

// fuction that shows the complete json file of an app
export const getAppInfos = async (id) => {
    const response = await fetch(`${PREFIX}/API/manager/image/${id}`, {
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

// function that adds the app whose json is passed in parameter
export const putApp = async (app) => {
    const response = await fetch(`${PREFIX}/API/manager/image`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': localStorage.getItem('apiKey'),
      },
      body: app,
    });

    if (!response.ok) {
      const errorJSON = await response.json();
      throw new Error(`${response.status} - ${errorJSON.message}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
};

// function that deletes the app whose id is passed in parameter
export const deleteApp = async (id) => {
    // sending command to pyos to delete the selected app(s) from the abcdesktop session
    const response = await fetch(`${PREFIX}/API/manager/image/${id}`, {
      method: 'DELETE',
      headers: {
        'X-API-KEY': localStorage.getItem('apiKey'),
      },
    });

    if (!response.ok) {
        const errorJSON = await response.json();
        throw new Error(`${response.status} - ${errorJSON.message}`);
    }

    const data = await response.json();
    console.log(data);
    return data;

};