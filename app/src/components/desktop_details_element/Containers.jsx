import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import DataTable from "../DataTable";
import { buildContainersData } from "../../services/desktopsService";
import "../../styles/desktopDetails.css";

export default function Containers({ data }) {
    const [containers, setContainers] = useState([]);
    const [removeTerminated, setRemoveTerminated] = useState(false);

    useEffect(() => {
        setContainers(buildContainersData(data, removeTerminated));
    }, [data, removeTerminated]);

    const handleRemoveTerminated = () => {
        setRemoveTerminated(!removeTerminated);
    };

    return (
        <Card>
            <Card.Header className="containers-table-card-header"> 
                <span className="desktop-detail-section-title-badge-container"> <b className="desktop-detail-section-title">Containers</b> <Badge bg="secondary">{containers.length}</Badge> </span>
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