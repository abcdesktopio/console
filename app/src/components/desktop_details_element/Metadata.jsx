import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import { buildMetadataData } from "../../services/desktopsService";
import "../../styles/desktopDetails.css";

export default function Metadata({data}) {
    const [metadata, setMetadata] = useState({});

    useEffect(() => {
        setMetadata(buildMetadataData(data));
    }, [data]);
    
    return (
        <Card>
            <Card.Header> <b className="desktop-detail-section-title">Metadata</b> </Card.Header>
            <Card.Body className="metadata-container">
                <div className="metadata-element">
                    <span> Name </span>
                    <span className="mb-2 text-muted">{String(metadata.name)}</span>
                </div>
                <div className="metadata-element">
                    <span> Namespace </span>
                    <span className="mb-2 text-muted">{String(metadata.namespace)}</span>
                </div>
                <div className="metadata-element">
                    <span> UID </span>
                    <span className="mb-2 text-muted">{String(metadata.uid)}</span>
                </div>
                <div className="metadata-element">
                    <span> Resource Version </span>
                    <span className="mb-2 text-muted">{String(metadata.resourceVersion)}</span>
                </div>
                <div className="metadata-element">
                    <span> Creation Timestamp </span>
                    <span className="mb-2 text-muted">{String(metadata.creationTimestamp)}</span>
                </div>
                <div className="metadata-element">
                    <span> Labels </span>
                    <div className="labels-badges">
                    {Object.keys(metadata.labels || {}).map((key) => (
                        <Badge bg="light" text="dark" key={key}>
                            <span> {key} : </span>
                            <span className="mb-2 text-muted">{String(metadata.labels[key])}</span>
                        </Badge>
                    ))}
                    </div>
                </div>
                <div className="metadata-element">
                    <span> Annotations </span>
                    <div className="annotations-badges">
                    {Object.keys(metadata.annotations || {}).map((key) => (
                        <Badge bg="light" text="dark" key={key}>
                            <span> {key} : </span>
                            <span className="mb-2 text-muted">{key === "lastlogin_datetime" ? String(Date(metadata.annotations[key])) : String(metadata.annotations[key])}</span>
                        </Badge>
                    ))}
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}