import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { useResourcesUsage } from "../../hooks/useResourcesUsage";
import ResourcesUsageChart from "../ResourcesUsageChart";
import { getCoreContainers, getDesktopRunningApps } from "../../services/desktopsService";
import "../../styles/desktopDetails.css";


// This component displays the CPU/RAM usage of either a running pod
// or a running container inside a Desktop.
// The user can select a container or pod from a dropdown, and usage stats will be charted.
export default function ResourcesUsage({ desktopId, openToast, data, setRefreshCount = null }) {
  // State to hold the list of running objects (containers/pods)
  const [runningObjects, setRunningObjects] = useState([]);

  // State to hold the id of the currently selected container/pod
  const [selectedId, setSelectedId] = useState("");

  // Whenever "data" (desktop detail) changes, rebuild the list of running objects.
  useEffect(() => {
    async function fetchData() {
      const coreContainers = getCoreContainers(data);
      const desktopRunningApps = await getDesktopRunningApps(desktopId);
      const objects = [...coreContainers, ...desktopRunningApps];
      setRunningObjects(objects);
    }
  
    fetchData();
  }, [data]);

  // Select a default object automatically on load (if available).
  // Convention: if an object's image includes "oc.user", we consider it the default.
  useEffect(() => {
    if (runningObjects.length > 0) {
      const defaultObj = runningObjects.find(o =>
        o.image.includes("oc.user")
      );
      if (defaultObj) {
        setSelectedId(defaultObj.id); // auto-select default
      } else {
        setSelectedId(""); // none selected by default
      }
    }
  }, [runningObjects]);

  // Find the actual object based on the currently selectedId
  const selectedObject = runningObjects.find(o => o.id === selectedId);

  // Extract parameters for the usage hook
  const objectIdToUse = selectedObject?.id || null;
  const typeToUse = selectedObject?.type || null;

  // Main resources hook: fetches + computes CPU/RAM metrics periodically
  // desktopId → parent desktop identifier
  // typeToUse and objectIdToUse → used to identify the specific container/pod
  // openToast → error handler, passed down
  const { series: containerSeries, ramLimit: containerRamLimit } = 
    useResourcesUsage(desktopId, typeToUse, objectIdToUse, openToast, setRefreshCount);

  return (
    <Card>
      <Card.Header>
        <b className="desktop-detail-section-title">Resources Usage</b>
      </Card.Header>
      <Card.Body className="resources-usage-container">
        <Form.Select
          aria-label="Container resources usage select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Select a container or a pod --</option>
          {runningObjects.map((object) => (
            <option key={object.id} value={object.id}>
              {object.image.includes("oc.user")
                ? `${object.id} (default resources usage)` // highlight default
                : object.id}
            </option>
          ))}
        </Form.Select>

        {/* 
          Chart component displaying CPU/RAM history.
          Appears only when we have data (series.length > 0).
        */}
        <ResourcesUsageChart
          series={containerSeries}
          ramLimit={containerRamLimit}
          show={containerSeries.length > 0}
        />
      </Card.Body>
    </Card>
  );
}
