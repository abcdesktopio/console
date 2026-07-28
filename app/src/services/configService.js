import { PREFIX } from '../utils/constraints';

// ----------------------
// GET current config
// ----------------------
// Fetches the current od.config from the backend and returns it as a JSON object.
export const getConfig = async () => {
  const response = await fetch(`${PREFIX}/API/manager/configure`, {
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
};

// ----------------------
// POST config 
// ----------------------
// Sends the edited config to the backend for saving. The backend will validate the config and return an error if invalid.
export const postConfig = async (config) => {
  const response = await fetch(`${PREFIX}/API/manager/configure`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': localStorage.getItem('apiKey'),
    },
    body: JSON.stringify(config), // raw JSON string
  });

  if (!response.ok) {
    const errorJSON = await response.json();
    throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
};

// Update configmap using current instance config as source. This is useful to update the configmap after a config change in the instance, so that the next instance will start with the updated config.
export const commitConfig = async () => {
  const response = await fetch(`${PREFIX}/API/manager/commit_config`, {
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
};

// Trigger rollout restart of pyos deployment. This is useful to apply the new configmap to the running instance, after a config change and commit.
export const triggerRollout = async () => {
  const response = await fetch(`${PREFIX}/API/manager/rollout`, {
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
};