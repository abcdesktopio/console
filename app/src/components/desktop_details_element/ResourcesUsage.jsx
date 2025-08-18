import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { useResourcesUsage } from "../../hooks/useResourcesUsage";
import ResourcesUsageChart from "../ResourcesUsageChart";
import { getRunningcontainers } from "../../services/desktopsService";
import "../../styles/desktopDetails.css";

export default function ResourcesUsage({ desktopId, openToast, data }) {
  const [runningObjects, setRunningObjects] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  // Charger la liste des objets (containers) à partir des données
  useEffect(() => {
    const objects = getRunningcontainers(data);
    setRunningObjects(objects);
  }, [data]);

  // Sélection par défaut : le container dont image contient 'oc.user'
  useEffect(() => {
    if (runningObjects.length > 0) {
      const defaultObj = runningObjects.find(o =>
        o.image.includes("oc.user")
      );
      if (defaultObj) {
        setSelectedId(defaultObj.id);
      } else {
        setSelectedId("");
      }
    }
  }, [runningObjects]);

  // Retrouver l'objet complet sélectionné
  const selectedObject = runningObjects.find(o => o.id === selectedId);

  // Variables pour le hook
  const objectIdToUse = selectedObject?.id || null;
  const typeToUse = selectedObject?.type || null;


  const { series: containerSeries, ramLimit: containerRamLimit } = useResourcesUsage(desktopId, typeToUse, objectIdToUse, openToast);

  return (
    <Card>
      <Card.Header>
        <b className="desktop-detail-section-title">Resources Usage</b>
      </Card.Header>
      <Card.Body className="resources-usage-container">
        {/* Select pour choisir le container */}
        <Form.Select
          aria-label="Container resources usage select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Select a container or a pod --</option>
          {runningObjects.map((object) => (
            <option key={object.id} value={object.id}>
              {object.image.includes("oc.user")
                ? `${object.id} (default resources usage)`
                : object.id}
            </option>
          ))}
        </Form.Select>

        {/* Graphique des ressources */}
        <ResourcesUsageChart
          series={containerSeries}
          ramLimit={containerRamLimit}
          show={containerSeries.length > 0}
        />
      </Card.Body>
    </Card>
  );
}