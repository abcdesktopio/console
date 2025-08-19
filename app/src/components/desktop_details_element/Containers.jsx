import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import DataTable from "../DataTable";
import { buildContainersData } from "../../services/desktopsService";
import "../../styles/desktopDetails.css";


// This component displays a list of containers inside a Card UI.
// It uses DataTable component to render the rows.
// The user can toggle filtering of terminated containers.
export default function Containers({ data }) {
    // State holding the list of containers (already formatted for DataTable)
    const [containers, setContainers] = useState([]);

    // Boolean state for whether to filter out terminated containers
    const [removeTerminated, setRemoveTerminated] = useState(false);

    // Whenever the "data" prop or the "removeTerminated" flag changes,
    // rebuild the container list by calling a domain service (buildContainersData).
    useEffect(() => {
        setContainers(buildContainersData(data, removeTerminated));
    }, [data, removeTerminated]);

    // Toggle function to include/exclude terminated containers
    const handleRemoveTerminated = () => {
        setRemoveTerminated(!removeTerminated);
    };

    return (
        <Card>
            <Card.Header className="containers-table-card-header"> 
                <span className="desktop-detail-section-title-badge-container">
                    <b className="desktop-detail-section-title">Containers</b>
                    
                    {/* Displays the number of containers as a badge */}
                    <Badge bg="secondary">{containers.length}</Badge> 
                </span>

                {/* Filter button that toggles removing terminated containers */}
                <button
                    id="filter-contrainers-button"
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleRemoveTerminated}
                    aria-label="filter displayed containers"
                >
                    <i className="bi bi-filter" style={{ fontSize: "1rem" }}></i>
                </button>
            </Card.Header>
            <Card.Body className="containers-container">
                <DataTable data={{nodes : containers}} />
            </Card.Body>
        </Card>
    );
}
