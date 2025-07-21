import { PREFIX } from "./prefix";

function buildData(output){
    var keys = Object.keys(output);
    var data = [];
    for(let i=0; i<keys.length; i++){
        // collecting the infos we want
        var desktop_infos = {
            "Desktop name" : output[keys[i]].name,
            "Status" : output[keys[i]].status,
            "IP" : output[keys[i]].ipAddr,
            "ID" : output[keys[i]].id,
            "Creation timestamp" : new Date(output[keys[i]].creation_timestamp),
            "Node" : output[keys[i]].nodehostname,
            "Container name" : output[keys[i]].container_name,
            "Container ID" : output[keys[i]].container_id
        }
        // pushing them into an array
        data.push(desktop_infos);
    }
    return(data);
}

// function that collects the initial data and build the desktop table
export const getDesktops = async () => {
    // send the GET command to pyos to get all the current desktops on the running session
    const response = await fetch(`${PREFIX}/API/manager/desktop`, {
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

// function that deletes the desktop whose id is passed in parameter
export const deleteDesktop = async (id) => {
    // sending command to pyos to delete the selected desktop(s) from the abcdesktop session
    const response = await fetch(`${PREFIX}/API/manager/desktop/${id}`, {
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