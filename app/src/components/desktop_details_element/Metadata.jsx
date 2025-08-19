import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import { buildMetadataData } from "../../services/desktopsService";
import "../../styles/desktopDetails.css";


// Component responsible for displaying the metadata of a desktop/container/etc.
// Uses Bootstrap Card for layout and shows individual metadata fields
// such as name, namespace, uid, resourceVersion, creationTimestamp, labels, and annotations.
export default function Metadata({ data }) {
    // Local state to hold processed metadata values
    const [metadata, setMetadata] = useState({});

    // Whenever "data" prop changes, we rebuild the metadata object
    // using a domain service (buildMetadataData).
    useEffect(() => {
        setMetadata(buildMetadataData(data));
    }, [data]);
    
    return (
        <Card>
            <Card.Header>
                <b className="desktop-detail-section-title">Metadata</b>
            </Card.Header>
            <Card.Body className="metadata-container">

                {/* Name */}
                <div className="metadata-element">
                    <span> Name </span>
                    <span className="mb-2 text-muted">{String(metadata.name)}</span>
                </div>

                {/* Namespace */}
                <div className="metadata-element">
                    <span> Namespace </span>
                    <span className="mb-2 text-muted">{String(metadata.namespace)}</span>
                </div>

                {/* UID */}
                <div className="metadata-element">
                    <span> UID </span>
                    <span className="mb-2 text-muted">{String(metadata.uid)}</span>
                </div>

                {/* Resource Version */}
                <div className="metadata-element">
                    <span> Resource Version </span>
                    <span className="mb-2 text-muted">{String(metadata.resourceVersion)}</span>
                </div>

                {/* Creation Timestamp */}
                <div className="metadata-element">
                    <span> Creation Timestamp </span>
                    <span className="mb-2 text-muted">{String(metadata.creationTimestamp)}</span>
                </div>

                {/* Labels */}
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

                {/* Annotations */}
                <div className="metadata-element">
                    <span> Annotations </span>
                    <div className="annotations-badges">
                        {Object.keys(metadata.annotations || {}).map((key) => (
                            <Badge bg="light" text="dark" key={key}>
                                <span> {key} : </span>
                                
                                {/* Special case: if annotation is "lastlogin_datetime",
                                    format it as a Date string instead of raw value */}
                                <span className="mb-2 text-muted">
                                  {key === "lastlogin_datetime" 
                                      ? String(Date(metadata.annotations[key])) 
                                      : String(metadata.annotations[key])}
                                </span>
                            </Badge>
                        ))}
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}