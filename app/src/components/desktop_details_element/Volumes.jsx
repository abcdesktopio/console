import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import DataTable from "../DataTable";
import { buildVolumesData } from "../../services/desktopsService";
import "../../styles/desktopDetails.css";


// Component to display a list of "Volumes" attached to a desktop.
// Uses a Card + Badge for display and delegates table rendering
// to the reusable DataTable component.
export default function Volumes({ data }) {
    // Local state storing the processed list of volumes
    const [volumes, setVolumes] = useState([]);

    // Recalculate volumes whenever the incoming "data" prop changes.
    // Uses a domain service (buildVolumesData) to normalize raw backend data.
    useEffect(() => {
        setVolumes(buildVolumesData(data));
    }, [data]);

    return (
        <Card>
            <Card.Header>
                <span className="desktop-detail-section-title-badge-container">
                    <b className="desktop-detail-section-title">Volumes</b>
                    <Badge bg="secondary">{volumes.length}</Badge>
                </span>
            </Card.Header>
            <Card.Body className="volumes-container">
                <DataTable data={{ nodes: volumes }} />
            </Card.Body>
        </Card>
    );
}
