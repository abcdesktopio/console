import { PREFIX } from "./prefix";

function buildData(output){
    var keys = Object.keys(output);
    var data = [];
    for(let i=0; i<keys.length; i++){
        // collecting the infos we want
        var desktop = output[keys[i]];
        var desktop_infos = {
            "Desktop name" : desktop.name,
            "Status" : desktop.status,
            "Pod IP" : desktop.ipAddr,
            "ID" : desktop.id,
            "Node" : desktop.nodehostname,
            "Creation timestamp" : new Date(desktop.creation_timestamp),
        }
        // pushing them into an array
        data.push(desktop_infos);
    }
    return(data);
}

// function that builds the containers data
export function buildContainersData(output, removeTerminated){
    var data = [];
    var keys = Object.keys(output.status);
    if(keys.includes("initContainerStatuses")){
        // init containers loop
        for(let i=0; i<output.status.initContainerStatuses.length; i++){
            // collecting the infos we want
            var init_container = output.status.initContainerStatuses[i];
            var status = Object.keys(init_container.state);
            // if filter is applied and the container is terminated, we skip it
            if(removeTerminated && status[0] === "terminated") continue;
            var container_infos = {
                "Name" : init_container.name,
                "Status" : status[0],
                "Type" : "Init container",
                "Image" : init_container.image,
                "ID" : init_container.containerID.slice(9)
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }
    if(keys.includes("containerStatuses")){
        // main containers loop
        for(let i=0; i<output.status.containerStatuses.length; i++){
            // collecting the infos we want
            var standard_container = output.status.containerStatuses[i];
            var status = Object.keys(standard_container.state);
            // if filter is applied and the container is terminated, we skip it
            if(removeTerminated && status[0] === "terminated") continue;
            var container_infos = {
                "Name" : standard_container.name,
                "Status" : status[0],
                "Type" : "Standard container",
                "Image" : standard_container.image,
                "ID" : standard_container.containerID.slice(9)
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }
    if(keys.includes("ephemeralContainerStatuses")){
        // ephemeral containers loop
        for(let i=0; i<output.status.ephemeralContainerStatuses.length; i++){
            // collecting the infos we want
            var ephemeral_container = output.status.ephemeralContainerStatuses[i];
            var status = Object.keys(ephemeral_container.state);
            // if filter is applied and the container is terminated, we skip it
            if(removeTerminated && status[0] === "terminated") continue;
            var container_infos = {
                "Name" : ephemeral_container.name,
                "Status" : status[0],
                "Type" : "Ephemeral container",
                "Image" : ephemeral_container.image,
                "ID" : ephemeral_container.containerID.slice(9)

            }
            // pushing them into an array
            data.push(container_infos);
        }
    }   
    return data;
}

export function getRunningcontainers(output){
    var data = [];
    var keys = Object.keys(output.status);
    if(keys.includes("initContainerStatuses")){
        // init containers loop
        for(let i=0; i<output.status.initContainerStatuses.length; i++){
            // collecting the infos we want
            var init_container = output.status.initContainerStatuses[i];
            var status = Object.keys(init_container.state);
            // if filter is applied and the container is terminated, we skip it
            if(status[0] !== "running") continue;
            var container_infos = {
                "id" : init_container.name,
                "image" : init_container.image
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }
    if(keys.includes("containerStatuses")){
        // main containers loop
        for(let i=0; i<output.status.containerStatuses.length; i++){
            // collecting the infos we want
            var standard_container = output.status.containerStatuses[i];
            var status = Object.keys(standard_container.state);
            // if filter is applied and the container is terminated, we skip it
            if(status[0] !== "running") continue;
            var container_infos = {
                "id" : standard_container.name,
                "image" : standard_container.image
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }
    if(keys.includes("ephemeralContainerStatuses")){
        // ephemeral containers loop
        for(let i=0; i<output.status.ephemeralContainerStatuses.length; i++){
            // collecting the infos we want
            var ephemeral_container = output.status.ephemeralContainerStatuses[i];
            var status = Object.keys(ephemeral_container.state);
            // if filter is applied and the container is terminated, we skip it
            if(status[0] !== "running") continue;
            var container_infos = {
                "id" : ephemeral_container.name,
                "image" : ephemeral_container.image

            }
            // pushing them into an array
            data.push(container_infos);
        }
    }   
    return data;
}

function getValuesRecursively(obj) {
    if (obj === null || obj === undefined) return [];
    if (typeof obj !== "object") return [obj];
  
    if (Array.isArray(obj)) {
      return obj.flatMap(getValuesRecursively);
    }
  
    return Object.values(obj).flatMap(getValuesRecursively);
  }

export function buildVolumesData(output){
    var data = [];
    var keys = Object.keys(output.spec);
    if(keys.includes("volumes")){
        // init containers loop
        for(let i=0; i<output.spec.volumes.length; i++){
            // collecting the infos we want
            var volume = output.spec.volumes[i];
            var volume_keys = Object.keys(volume);
            var volumes_infos = {
                "Name" : volume.name,
                "Type" : volume_keys[1],
                "Details" : getValuesRecursively(volume[volume_keys[1]]).join(", ")
            }
            // pushing them into an array
            data.push(volumes_infos);
        }
    }
    return data;
}

export function buildMetadataData(output){
    var data = {
        "name" : output.metadata.name,
        "namespace" : output.metadata.namespace,
        "uid" : output.metadata.uid,
        "resourceVersion" : output.metadata.resourceVersion,
        "creationTimestamp" : new Date(output.metadata.creationTimestamp), 
        "labels" : output.metadata.labels,
        "annotations" : output.metadata.annotations
    }
    return data;
}

function buildContainersSpecData(output){
    var data = [];
    var keys = Object.keys(output);
    if(keys.includes("initContainers")){
        // init containers loop
        for(let i=0; i<output.initContainers.length; i++){
            // collecting the infos we want
            var init_container = output.initContainers[i];
            var container_infos = {
                "name" : init_container.name,
                "type" : "Init container",
                "image" : init_container.image,
                "imagePullPolicy" : init_container.imagePullPolicy,
                "env" : init_container.env,
                "volumeMounts" : init_container.volumeMounts
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }
    if(keys.includes("containers")){
        // main containers loop
        for(let i=0; i<output.containers.length; i++){
            // collecting the infos we want
            var standard_container = output.containers[i];
            var container_infos = {
                "name" : standard_container.name,
                "type" : "Standard container",
                "image" : standard_container.image,
                "imagePullPolicy" : standard_container.imagePullPolicy,
                "env" : standard_container.env,
                "volumeMounts" : standard_container.volumeMounts
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }
    if(keys.includes("ephemeralContainers")){
        // ephemeral containers loop
        for(let i=0; i<output.ephemeralContainers.length; i++){
            // collecting the infos we want
            var ephemeral_container = output.ephemeralContainers[i];
            var container_infos = {
                "name" : ephemeral_container.name,
                "type" : "Ephemeral container",
                "image" : ephemeral_container.image,
                "imagePullPolicy" : ephemeral_container.imagePullPolicy,
                "env" : ephemeral_container.env,
                "volumeMounts" : ephemeral_container.volumeMounts
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }
    return data;
}

export function buildSpecData(output){
    var data = {
        "nodeName" : output.spec.nodeName,
        "restartPolicy" : output.spec.restartPolicy,
        "serviceAccountName" : output.spec.serviceAccountName,
        "schedulerName" : output.spec.schedulerName,
        "containersSpec" : buildContainersSpecData(output.spec),
    }
    return data;
}

function buildContainersStatusData(output){
    var data = [];
    var keys = Object.keys(output);
    if(keys.includes("initContainerStatuses")){
        // init containers loop
        for(let i=0; i<output.initContainerStatuses.length; i++){
            // collecting the infos we want
            var init_container = output.initContainerStatuses[i];
            var status = Object.keys(init_container.state);
            var currentState = status[0] === "running" ? `Running since ${new Date(init_container.state.running.startedAt)}` : `Terminated since ${new Date(init_container.state.terminated.finishedAt)}`;
            var container_infos = {
                "name" : init_container.name,
                "type" : "Init container",
                "status" : status[0],
                "containerId" : init_container.containerID.slice(9),
                "currentState" : currentState,
                "ready" : init_container.ready,
                "restartCount" : init_container.restartCount,
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }
    if(keys.includes("containerStatuses")){
        // main containers loop
        for(let i=0; i<output.containerStatuses.length; i++){
            // collecting the infos we want
            var standard_container = output.containerStatuses[i];
            var status = Object.keys(standard_container.state);
            var currentState = status[0] === "running" ? `Running since ${new Date(standard_container.state.running.startedAt)}` : `Terminated since ${new Date(standard_container.state.terminated.finishedAt)}`;
            var container_infos = {
                "name" : standard_container.name,
                "type" : "Stndard container",
                "containerId" : standard_container.containerID.slice(9),
                "currentState" : currentState,
                "ready" : standard_container.ready,
                "restartCount" : standard_container.restartCount,
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }
    if(keys.includes("ephemeralContainerStatuses")){
        // ephemeral containers loop
        for(let i=0; i<output.ephemeralContainerStatuses.length; i++){
            // collecting the infos we want
            var ephemeral_container = output.ephemeralContainerStatuses[i];
            var status = Object.keys(ephemeral_container.state);
            var currentState = status[0] === "running" ? `Running since ${new Date(ephemeral_container.state.running.startedAt)}` : `Terminated since ${new Date(ephemeral_container.state.terminated.finishedAt)}`;
            var container_infos = {
                "name" : ephemeral_container.name,
                "type" : "Ephemeral container",
                "containerId" : ephemeral_container.containerID.slice(9),
                "currentState" : currentState,
                "ready" : ephemeral_container.ready,
                "restartCount" : ephemeral_container.restartCount,
            }
            // pushing them into an array
            data.push(container_infos);
        }
    }   
    return data;
}

export function buildStatusData(output){
    var data = {
        "phase" : output.status.phase,
        "qosClass" : output.status.qosClass,
        "hostIP" : output.status.hostIP,
        "podIP" : output.status.podIP,
        "startTime" : new Date(output.status.startTime),
        "conditions" : output.status.conditions,
        "containerStatuses" : buildContainersStatusData(output.status),
    }
    console.log(data);
    return data;
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
}

export const getContainerResourcesUsage = async (desktopId, containerId) => {
    const response = await fetch(`${PREFIX}/API/manager/desktop/${desktopId}//container/${containerId}/resources_usage`, {
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