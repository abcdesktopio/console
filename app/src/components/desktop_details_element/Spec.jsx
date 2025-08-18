import React, { useState, useEffect } from "react";
import { Card, Badge, Accordion } from "react-bootstrap";
import { buildSpecData } from "../../services/desktopsService";
import "../../styles/desktopDetails.css";


// This component displays the "spec" 
// for a given desktop. It shows high-level spec attributes and
// a collapsible section for each container spec.
export default function Spec({ data }) {
    // Local state storing the processed spec object.
    const [spec, setSpec] = useState({});

    // Effect: rebuild the spec whenever the "data" prop changes.
    // Uses a service utility: buildSpecData (responsible for normalizing/parsing raw spec).
    useEffect(() => {
        setSpec(buildSpecData(data));
    }, [data]);
    
    return (
        <Card>
            <Card.Header>
                <b className="desktop-detail-section-title">Spec</b>
            </Card.Header>

            <Card.Body className="spec-container">

                {/* Node name */}
                <div className="spec-element">
                    <span> Node Name </span>
                    <span className="mb-2 text-muted">{String(spec.nodeName)}</span>
                </div>

                {/* Restart policy */}
                <div className="spec-element">
                    <span> Restart Policy </span>
                    <span className="mb-2 text-muted">{String(spec.restartPolicy)}</span>
                </div>

                {/* Service account name */}
                <div className="spec-element">
                    <span> Service Account </span>
                    <span className="mb-2 text-muted">{String(spec.serviceAccountName)}</span>
                </div>

                {/* Scheduler name */}
                <div className="spec-element">
                    <span> Scheduler </span>
                    <span className="mb-2 text-muted">{String(spec.schedulerName)}</span>
                </div>

                {/* Accordion for containers spec details */}
                <Accordion className="spec-accordion">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <b>Containers Spec</b>
                            <Badge bg="secondary" style={{ marginLeft: "5px" }}>
                                {Object.keys(spec.containersSpec || {}).length}
                            </Badge>
                        </Accordion.Header>

                        {/* Body of accordion: details for each container spec */}
                        <Accordion.Body className="spec-element">
                            {Object.keys(spec.containersSpec || {}).map((key) => (
                                <Card key={key}>
                                    <Card.Header>
                                        {/* Name of the container */}
                                        <b className="desktop-detail-section-title" style={{ fontSize: "0.9rem" }}>
                                            {spec.containersSpec[key].name}
                                        </b>
                                    </Card.Header>

                                    <Card.Body className="container-spec-container">
                                        {/* Container type */}
                                        <div className="spec-element">
                                            <span> Container Type </span>
                                            <span className="mb-2 text-muted">{String(spec.containersSpec[key].type)}</span>
                                        </div>

                                        {/* Image */}
                                        <div className="spec-element">
                                            <span> Image </span>
                                            <span className="mb-2 text-muted">{String(spec.containersSpec[key].image)}</span>
                                        </div>

                                        {/* Pull Policy */}
                                        <div className="spec-element">
                                            <span> Pull Policy </span>
                                            <span className="mb-2 text-muted">{String(spec.containersSpec[key].imagePullPolicy)}</span>
                                        </div>

                                        {/* Environment Variables */}
                                        <div className="spec-element">
                                            <span> Environment Variables </span>
                                            <div className="container-env-badges">
                                                {spec.containersSpec[key].env.map((env, index) => (
                                                    <Badge bg="light" text="dark" key={index}>
                                                        <span> {env.name} : </span>
                                                        <span className="mb-2 text-muted">{String(env.value)}</span>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Volumes Mounts */}
                                        <div className="spec-element">
                                            <span> Volumes Mounts </span>
                                            <div className="container-volumesMounts-badges">
                                                {spec.containersSpec[key].volumeMounts.map((volumeMount, index) => (
                                                    <Badge bg="light" text="dark" key={index}>
                                                        <span> {volumeMount.name} : </span>
                                                        <span className="mb-2 text-muted">{String(volumeMount.mountPath)}</span>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
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