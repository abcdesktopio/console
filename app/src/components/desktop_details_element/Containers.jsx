import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import DataTable from "../DataTable";
import { buildContainersData } from "../../services/desktopsService";

export default function Containers({ data }) {
    const [containers, setContainers] = useState([]);

    useEffect(() => {
        setContainers(buildContainersData(data));
    }, [data]);

    return (
        <Card>
            <Card.Header> <b className="desktop-detail-section-title">Containers</b> <Badge bg="secondary">{containers.length}</Badge></Card.Header>
            <Card.Body className="containers-container">
                <DataTable data={{nodes : containers}} />
            </Card.Body>
        </Card>
    );
}