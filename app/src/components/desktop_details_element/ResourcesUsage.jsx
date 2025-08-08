import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { useResourcesUsage } from "../../hooks/useResourcesUsage";
import ResourcesUsageChart from "../ResourcesUsageChart";
import { getRunningcontainers } from "../../services/desktopsService";

export default function ResourcesUsage({ desktopId, openToast, data }) {
  const [runningContainers, setRunningContainers] = useState([]);
  const [selectedContainerId, setSelectedContainerId] = useState(""); 

  useEffect(() => {
    const containers = getRunningcontainers(data);
    setRunningContainers(containers);
  }, [data]);

  useEffect(() => {
    if (runningContainers.length > 0) {
      const defaultContainer = runningContainers.find(container =>
        container.image.includes("oc.user")
      );
      if (defaultContainer) {
        setSelectedContainerId(String(defaultContainer.id));
      } else {
        setSelectedContainerId("");
      }
    }
  }, [runningContainers]);

  const containerIdToUse = selectedContainerId || null;

  const { series: containerSeries, ramLimit: containerRamLimit } = useResourcesUsage(
    desktopId,
    containerIdToUse,
    openToast
  );

  return (
    <Card>
      <Card.Header>
        <b className="desktop-detail-section-title">Resources Usage</b>
      </Card.Header>
      <Card.Body className="resources-usage-container">
        <Form.Select
          aria-label="Container resources usage select"
          onChange={(e) => setSelectedContainerId(e.target.value)}
          value={selectedContainerId}
        >
          <option value="">-- Select a container --</option>
          {runningContainers.map(container => (
            <option
              key={container.id}
              value={String(container.id)} 
            >
              {container.image.includes("oc.user")
                ? `${container.id} (default resources usage)`
                : container.id}
            </option>
          ))}
        </Form.Select>

        <ResourcesUsageChart
          series={containerSeries}
          ramLimit={containerRamLimit}
          show={containerSeries.length > 0}
        />
      </Card.Body>
    </Card>
  );
}
