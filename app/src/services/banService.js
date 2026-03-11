import { PREFIX } from "../utils/constraints";


// ----------------------
// Helper: buildData
// ----------------------
// Converts raw backend ban data into an array of objects formatted for DataTable consumption.
function buildData(output) {
  const keys = Object.keys(output);
  const data = [];

  for (let i = 0; i < keys.length; i++) {
    const ban_infos = {
      "ID"                          : output[keys[i]].id,   // login name or IP address
      "Ban date"                    : output[keys[i]].date, // when the ban was applied
      "Ban Expire After Seconds"    : output[keys[i]].banexpireAfterSeconds // TTL
    };
    data.push(ban_infos);
  }

  return data;
}


// ----------------------
// GET Ban Data
// ----------------------
// Fetch current list of bans (IPs or Logins).
// Type = "ipaddr" or "login"
export const getBanData = async (type) => {
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
};


// ----------------------
// POST Ban (Add)
// ----------------------
// Bans a user/IP by sending a POST request.
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


// ----------------------
// DELETE Ban (Unban)
// ----------------------
// Removes a ban for the given login/IP.
// Endpoint: /API/manager/ban/{type}/{id}
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
