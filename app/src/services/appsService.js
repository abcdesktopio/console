import { PREFIX } from "../utils/constraints";


// ----------------------
// Helper: buildData
// ----------------------
// Converts raw backend output into a frontend-friendly array of app objects.
// Each entry contains only the relevant fields (Icon, App name, and ID).
function buildData(output) {
  const keys = Object.keys(output);
  const data = [];

  for (let i = 0; i < keys.length; i++) {
    const app_infos = {
      "Icon"     : output[keys[i]].icondata,           // base64-encoded icon (SVG/PNG)
      "App name" : output[keys[i]].name,               // app display name
      "ID"       : (output[keys[i]].sha_id).slice(7),  // shortened sha_id (remove prefix)
    };
    data.push(app_infos);
  }

  return data;
}


// ----------------------
// GET All Apps
// ----------------------
// Fetches the list of apps from the backend session and builds table data.
export const getApps = async () => {
  const apiKey = localStorage.getItem("apiKey");

  const headers = {
    ...(apiKey && { "X-API-KEY": apiKey }),
  }

  const response = await fetch(`${PREFIX}/API/manager/buildapplist`, {
    headers: headers,
  });

  if (!response.ok) {
    const errorJSON = await response.json();
    throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  const json = await response.json();
  const builtData = buildData(json);  // transform raw → table rows
  console.log(builtData);
  return builtData;
};


// ----------------------
// GET App Infos (Detailed JSON)
// ----------------------
// Fetches and returns the full JSON describing a specific app configuration.
export const getAppInfos = async (id) => {
    const apiKey = localStorage.getItem("apiKey");

    const headers = {
      ...(apiKey && { "X-API-KEY": apiKey }),
    }

  const response = await fetch(`${PREFIX}/API/manager/image/${id}`, {
    headers: headers,
  });

  if (!response.ok) {
    const errorJSON = await response.json();
    throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  const json = await response.json();
  console.log(json);
  return json;
};


// ----------------------
// PUT App (Add new)
// ----------------------
// Sends a new application spec (JSON, either file content or textarea input) to the backend for creation.
export const putApp = async (app) => {
  const apiKey = localStorage.getItem("apiKey");

  const headers = {
    'Content-Type': 'application/json',
    ...(apiKey && { 'X-API-KEY': apiKey }),
  };

  const response = await fetch(`${PREFIX}/API/manager/image`, {
    method: 'PUT',
    headers: headers,
    body: app, // raw JSON string
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
// DELETE App
// ----------------------
// Deletes a given application by ID from the backend session.
export const deleteApp = async (id) => {
  const apiKey = localStorage.getItem("apiKey");

  const headers = {
    ...(apiKey && { "X-API-KEY": apiKey }),
  };

  const response = await fetch(`${PREFIX}/API/manager/image/${id}`, {
    method: 'DELETE',
    headers: headers,
  });

  if (!response.ok) {
    const errorJSON = await response.json();
    throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
};

export const getAvailableAppsList = async () => {
  const response = await fetch(window.ABCDESKTOP_APPLICATIONS_LIST_URL);

  if (!response.ok) {
    const errorJSON = await response.json();
    throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  const data = await response.json();
  return data;
}