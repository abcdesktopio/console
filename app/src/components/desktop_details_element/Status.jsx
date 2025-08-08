import React, { useState, useEffect } from "react";
import { Card, Badge, Accordion } from "react-bootstrap";
import { buildStatusData } from "../../services/desktopsService";
import "../../styles/desktopDetails.css";

export default function Status({data}) {
    const [status, setStatus] = useState({});

    useEffect(() => {
        setStatus(buildStatusData(data));
    }, [data]);
    
    return (
        <Card>
            <Card.Header> <b className="desktop-detail-section-title">Status</b> </Card.Header>
            <Card.Body className="status-container">
                <div className="status-element">
                    <span> Phase </span>
                    <span className="mb-2 text-muted">{String(status.phase) === "Running" ? <Badge bg="success">{String(status.phase)}</Badge> : <Badge bg="danger">{String(status.phase)}</Badge>}</span>
                </div>
                <div className="status-element">
                    <span> QoS Class </span>
                    <span className="mb-2 text-muted">{String(status.qosClass)}</span>
                </div>
                <div className="status-element">
                    <span> Host IP </span>
                    <span className="mb-2 text-muted">{String(status.hostIP)}</span>
                </div>
                <div className="status-element">
                    <span> Pod IP </span>
                    <span className="mb-2 text-muted">{String(status.podIP)}</span>
                </div>
                <div className="status-element">
                    <span> Start Time </span>
                    <span className="mb-2 text-muted">{String(status.startTime)}</span>
                </div>
                <Accordion className="status-accordion">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header> <b>Containers Statuses </b> <Badge bg="secondary" style={{marginLeft: "5px"}}>{Object.keys(status.containerStatuses || {}).length}</Badge></Accordion.Header>
                        <Accordion.Body className="status-element">
                            {Object.keys(status.containerStatuses || {}).map((key) => (
                                <Card>
                                    <Card.Header className="container-statuses-card-header"> <b className="desktop-detail-section-title" style={{fontSize: "0.9rem"}}>{status.containerStatuses[key].name}</b> <span><Badge bg="dark">{status.containerStatuses[key].ready === true ? "Ready" : "Not Ready"}</Badge> <Badge bg="light" text="dark">Restart Count {status.containerStatuses[key].restartCount}</Badge> </span> </Card.Header>
                                    <Card.Body className="container-status-container">
                                        <div className="status-element">
                                            <span> Container Type </span>
                                            <span className="mb-2 text-muted">{String(status.containerStatuses[key].type)}</span>
                                        </div>
                                        <div className="status-element">
                                            <span> Container ID </span>
                                            <span className="mb-2 text-muted">{String(status.containerStatuses[key].containerId)}</span>
                                        </div>
                                        <div className="status-element">
                                            <span> Current State </span>
                                            <span className="mb-2 text-muted">{String(status.containerStatuses[key].currentState).includes("Running") ? <Badge bg="success">{String(status.containerStatuses[key].currentState)}</Badge> : <Badge bg="danger">{String(status.containerStatuses[key].currentState)}</Badge>}</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion className="status-accordion">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header> <b>Conditions</b> <Badge bg="secondary" style={{marginLeft: "5px"}}>{Object.keys(status.conditions || {}).length}</Badge></Accordion.Header>
                        <Accordion.Body className="status-element">
                            {Object.keys(status.conditions || {}).map((key) => (
                                <Card>
                                    <Card.Body className="conditions-container">
                                        <div className="conditions-text-with-badge" style={{marginBottom: "5px"}}> <b>{status.conditions[key].type}</b> {status.conditions[key].status === "True" ? <Badge bg="success">{String(status.conditions[key].status)}</Badge> : <Badge bg="danger">{String(status.conditions[key].status)}</Badge>}</div>
                                        <div> Last transistion : <span className="mb-2 text-muted">{status.conditions[key].lastTransitionTime} </span> </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card.Body>
        </Card>
    )
}