import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import DataTable from "../DataTable";
import { buildVolumesData } from "../../services/desktopsService";

export default function Volumes({ data }) {
    const [volumes, setVolumes] = useState([]);

    useEffect(() => {
        setVolumes(buildVolumesData(data));
    }, [data]);

    return (
        <Card>
            <Card.Header> 
                <span className="desktop-detail-section-title-badge-container"> <b className="desktop-detail-section-title">Volumes</b> <Badge bg="secondary">{volumes.length}</Badge> </span>
            </Card.Header>
            <Card.Body className="volumes-container">
                <DataTable data={{nodes : volumes}} />
            </Card.Body>
        </Card>
    );
}