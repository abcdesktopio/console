import { PREFIX } from "./prefix";

// function that builds the table data
function buildData(output){
    var keys = Object.keys(output);
    var data = [];
    for(let i=0; i<keys.length; i++){
        // collecting the infos we want
        var ban_infos = {
            "ID" : output[keys[i]].id,
            "Ban date" : output[keys[i]].date,
            "Ban Expire After Seconds" : output[keys[i]].banexpireAfterSeconds
        }
        // pushing them into an array
        data.push(ban_infos);
    }
    return data;
}

// function that collects the initial data and build the ban table
export const getBanData = async (type) => {
    // send the GET command to pyos to get all the current banned 
    const response = await fetch(`${PREFIX}/API/manager/ban/${type}`, {
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

// function that bans a uset
export const postBan = async (id, type) => {
    const response = await fetch(`${PREFIX}/API/manager/ban/${type}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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


// function that unbans the user whose ip is passed in parameter
export const deleteBan = async (id, type) => {
    const response = await fetch(`${PREFIX}/API/manager/ban/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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
