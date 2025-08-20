import { PREFIX } from "./prefix";


// ---------------
// HELPERS

// ---------------
// Build a list of desktops formatted for DataTable display.
function buildData(output) {
  const keys = Object.keys(output);
  const data = [];

  for (let i = 0; i < keys.length; i++) {
    const desktop = output[keys[i]];
    const desktop_infos = {
      "Desktop name": desktop.name,
      "Status": desktop.status,
      "Pod IP": desktop.ipAddr,
      "ID": desktop.id,
      "Node": desktop.nodehostname,
      "Creation timestamp": new Date(desktop.creation_timestamp),
    };
    data.push(desktop_infos);
  }

  return data;
}


// ---------------
// Build containers data for display tables.
// Optionally filter out terminated containers.
export function buildContainersData(output, removeTerminated) {
  const data = [];
  const keys = Object.keys(output.status);

  // Init containers
  if (keys.includes("initContainerStatuses")) {
    for (let i = 0; i < output.status.initContainerStatuses.length; i++) {
      const init_container = output.status.initContainerStatuses[i];
      const status = Object.keys(init_container.state);
      if (removeTerminated && status[0] === "terminated") continue;

      data.push({
        "Name": init_container.name,
        "Status": status,
        "Type": "Init container",
        "Image": init_container.image,
        "ID": init_container.containerID.slice(9),
      });
    }
  }

  // Standard containers
  if (keys.includes("containerStatuses")) {
    for (let i = 0; i < output.status.containerStatuses.length; i++) {
      const standard_container = output.status.containerStatuses[i];
      const status = Object.keys(standard_container.state);
      if (removeTerminated && status[0] === "terminated") continue;

      data.push({
        "Name": standard_container.name,
        "Status": status,
        "Type": "Standard container",
        "Image": standard_container.image,
        "ID": standard_container.containerID.slice(9),
      });
    }
  }

  // Ephemeral containers
  if (keys.includes("ephemeralContainerStatuses")) {
    for (let i = 0; i < output.status.ephemeralContainerStatuses.length; i++) {
      const ephemeral_container = output.status.ephemeralContainerStatuses[i];
      const status = Object.keys(ephemeral_container.state);
      if (removeTerminated && status[0] === "terminated") continue;

      data.push({
        "Name": ephemeral_container.name,
        "Status": status,
        "Type": "Ephemeral container",
        "Image": ephemeral_container.image,
        "ID": ephemeral_container.containerID.slice(9),
      });
    }
  }

  return data;
}

// ---------------
// Get pods information from desktop data
export function buildPodsData(output, removeTerminated) {
  const data = [];
  const keys = Object.keys(output);

  for (let i = 0; i < keys.length; i++) {
    const pod = output[keys[i]];
    if (pod.type !== "pod_application") continue;
    if (removeTerminated && pod.status !== "Running") continue;

    data.push({
      "Name": pod.id,
      "Status": pod.status,
      "Type": "Pod Application",
      "Image": pod.image,
      "ID": pod.id,
    });
  }

  return data;
}


// ---------------
// Extract running containers only (status = running)
export function getRunningContainers(output) {
  const data = [];
  const keys = Object.keys(output.status);

  // Core containers
  if (keys.includes("containerStatuses")) {
    for (let i = 0; i < output.status.containerStatuses.length; i++) {
      const standard_container = output.status.containerStatuses[i];
      const status = Object.keys(standard_container.state);
      if (status[0] !== "running") continue;

      data.push({
        "id": standard_container.name,
        "image": standard_container.image,
        "type": "container",
      });
    }
  }

  // Ephemeral containers
  if (keys.includes("ephemeralContainerStatuses")) {
    for (let i = 0; i < output.status.ephemeralContainerStatuses.length; i++) {
      const ephemeral_container = output.status.ephemeralContainerStatuses[i];
      const status = Object.keys(ephemeral_container.state);
      if (status[0] !== "running") continue;

      data.push({
        "id": ephemeral_container.name,
        "image": ephemeral_container.image,
        "type": "container",
      });
    }
  }

  return data;
}


// ---------------
// Get running pods information from desktop data
function getRunningPods(output) {
  const data = [];
  const keys = Object.keys(output);

  for (let i = 0; i < keys.length; i++) {
    const pod = output[keys[i]];
    if (pod.status !== "Running") continue;

    data.push({
      "id": pod.id,
      "image": pod.image,
      "type": "pod",
    });
  }

  return data;
}

// ---------------
// Recursive helper to extract values at all nested levels of an object
function getValuesRecursively(obj) {
  if (obj === null || obj === undefined) return [];
  if (typeof obj !== "object") return [obj];
  if (Array.isArray(obj)) return obj.flatMap(getValuesRecursively);
  return Object.values(obj).flatMap(getValuesRecursively);
}


// ---------------
// Build volume information for display
export function buildVolumesData(output) {
  const data = [];
  const keys = Object.keys(output.spec);

  if (keys.includes("volumes")) {
    for (let i = 0; i < output.spec.volumes.length; i++) {
      const volume = output.spec.volumes[i];
      const volume_keys = Object.keys(volume);

      data.push({
        "Name": volume.name,
        "Type": volume_keys[1], // assumes second key holds type
        "Details": getValuesRecursively(volume[volume_keys[1]]).join(", "),
      });
    }
  }

  return data;
}


// ---------------
// Build metadata info for display section/panel
export function buildMetadataData(output) {
  return {
    "name": output.metadata.name,
    "namespace": output.metadata.namespace,
    "uid": output.metadata.uid,
    "resourceVersion": output.metadata.resourceVersion,
    "creationTimestamp": new Date(output.metadata.creationTimestamp),
    "labels": output.metadata.labels,
    "annotations": output.metadata.annotations,
  };
}


// ---------------
// Build container spec details for display
function buildContainersSpecData(output) {
  const data = [];
  const keys = Object.keys(output);

  // Init containers spec
  if (keys.includes("initContainers")) {
    for (let i = 0; i < output.initContainers.length; i++) {
      const init_container = output.initContainers[i];
      data.push({
        "name": init_container.name,
        "type": "Init container",
        "image": init_container.image,
        "imagePullPolicy": init_container.imagePullPolicy,
        "env": init_container.env,
        "volumeMounts": init_container.volumeMounts,
      });
    }
  }

  // Standard containers spec
  if (keys.includes("containers")) {
    for (let i = 0; i < output.containers.length; i++) {
      const standard_container = output.containers[i];
      data.push({
        "name": standard_container.name,
        "type": "Standard container",
        "image": standard_container.image,
        "imagePullPolicy": standard_container.imagePullPolicy,
        "env": standard_container.env,
        "volumeMounts": standard_container.volumeMounts,
      });
    }
  }

  // Ephemeral containers spec
  if (keys.includes("ephemeralContainers")) {
    for (let i = 0; i < output.ephemeralContainers.length; i++) {
      const ephemeral_container = output.ephemeralContainers[i];
      data.push({
        "name": ephemeral_container.name,
        "type": "Ephemeral container",
        "image": ephemeral_container.image,
        "imagePullPolicy": ephemeral_container.imagePullPolicy,
        "env": ephemeral_container.env,
        "volumeMounts": ephemeral_container.volumeMounts,
      });
    }
  }

  return data;
}


// ---------------
// Build overall spec data for a desktop
export function buildSpecData(output) {
  return {
    "nodeName": output.spec.nodeName,
    "restartPolicy": output.spec.restartPolicy,
    "serviceAccountName": output.spec.serviceAccountName,
    "schedulerName": output.spec.schedulerName,
    "containersSpec": buildContainersSpecData(output.spec),
  };
}


// ---------------
// Build containers status information for desktop status tab
function buildContainersStatusData(output) {
  const data = [];
  const keys = Object.keys(output);

  // Init container statuses
  if (keys.includes("initContainerStatuses")) {
    for (let i = 0; i < output.initContainerStatuses.length; i++) {
      const init_container = output.initContainerStatuses[i];
      const status = Object.keys(init_container.state);
      const currentState =
        status[0] === "running"
          ? `Running since ${new Date(init_container.state.running.startedAt)}`
          : `Terminated since ${new Date(init_container.state.terminated.finishedAt)}`;
      data.push({
        "name": init_container.name,
        "type": "Init container",
        "status": status[0],
        "containerId": init_container.containerID.slice(9),
        "currentState": currentState,
        "ready": init_container.ready,
        "restartCount": init_container.restartCount,
      });
    }
  }

  // Standard container statuses
  if (keys.includes("containerStatuses")) {
    for (let i = 0; i < output.containerStatuses.length; i++) {
      const standard_container = output.containerStatuses[i];
      const status = Object.keys(standard_container.state);
      const currentState =
        status[0] === "running"
          ? `Running since ${new Date(standard_container.state.running.startedAt)}`
          : `Terminated since ${new Date(standard_container.state.terminated.finishedAt)}`;
      data.push({
        "name": standard_container.name,
        "type": "Stndard container", // typo: should be "Standard container"
        "containerId": standard_container.containerID.slice(9),
        "currentState": currentState,
        "ready": standard_container.ready,
        "restartCount": standard_container.restartCount,
      });
    }
  }

  // Ephemeral container statuses
  if (keys.includes("ephemeralContainerStatuses")) {
    for (let i = 0; i < output.ephemeralContainerStatuses.length; i++) {
      const ephemeral_container = output.ephemeralContainerStatuses[i];
      const status = Object.keys(ephemeral_container.state);
      const currentState =
        status[0] === "running"
          ? `Running since ${new Date(ephemeral_container.state.running.startedAt)}`
          : `Terminated since ${new Date(ephemeral_container.state.terminated.finishedAt)}`;
      data.push({
        "name": ephemeral_container.name,
        "type": "Ephemeral container",
        "containerId": ephemeral_container.containerID.slice(9),
        "currentState": currentState,
        "ready": ephemeral_container.ready,
        "restartCount": ephemeral_container.restartCount,
      });
    }
  }

  return data;
}


// ---------------
// Build the overall status data object used in the UI
export function buildStatusData(output) {
  const data = {
    "phase": output.status.phase,
    "qosClass": output.status.qosClass,
    "hostIP": output.status.hostIP,
    "podIP": output.status.podIP,
    "startTime": new Date(output.status.startTime),
    "conditions": output.status.conditions,
    "containerStatuses": buildContainersStatusData(output.status),
  };
  console.log(data);
  return data;
}


// ---------------
// API calls

// GET list of desktops
export const getDesktops = async () => {
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
};

// GET raw JSON for a specific desktop by ID
export const fetchDesktopRaw = async (id) => {
  const response = await fetch(`${PREFIX}/API/manager/desktop/${id}`, {
    headers: {
      "X-API-KEY": localStorage.getItem("apiKey"),
    },
  });

  if (!response.ok) {
    const errorJSON = await response.json();
    throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  return await response.json();
};

// GET global resource usage data for a desktop
export const getDesktopResourcesUsage = async (id) => {
  const response = await fetch(`${PREFIX}/API/manager/desktop/${id}/resources_usage`, {
    headers: {
      "X-API-KEY": localStorage.getItem("apiKey"),
    },
  });

  if (!response.ok) {
    const errorJSON = await response.json();
    throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  const data = await response.json();
  return data;
};

// GET application pods inside a desktop
export const getDesktopPods = async (id, getRunning) => {
  const response = await fetch(`${PREFIX}/API/manager/desktop/${id}/pod`, {
    headers: {
      "X-API-KEY": localStorage.getItem("apiKey"),
    },
  });

  if (!response.ok) {
    const errorJSON = await response.json();
    throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  const data = await response.json();
  const builtData = getRunning ? getRunningPods(data) : data;
  return builtData;
};

// GET resource usage for a specific container or pod inside a desktop
// objectType = "container" or "pod"
export const getResourcesUsage = async (desktopId, objectType, objectId) => {
  const response = await fetch(`${PREFIX}/API/manager/desktop/${desktopId}/${objectType}/${objectId}/resources_usage`, {
    headers: {
      "X-API-KEY": localStorage.getItem("apiKey"),
    },
  });

  if (!response.ok) {
    const errorJSON = await response.json();
    throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  const data = await response.json();
  return data;
};

// DELETE a desktop by ID
export const deleteDesktop = async (id) => {
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

// DELETE a pod application 
export const deleteDesktopPod = async (desktopId, podId) => {
  const response = await fetch(`${PREFIX}/API/manager/desktop/${desktopId}/pod/${podId}`, {
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