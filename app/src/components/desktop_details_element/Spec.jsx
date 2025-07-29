import React, { useState, useEffect } from "react";
import { Card, Badge, Accordion } from "react-bootstrap";
import { buildSpecData } from "../../services/desktopsService";

export default function Spec({data}) {
    const [spec, setSpec] = useState({});

    useEffect(() => {
        setSpec(buildSpecData(data));
    }, [data]);
    
    return (
        <Card>
            <Card.Header> <b className="desktop-detail-section-title">Spec</b> </Card.Header>
            <Card.Body className="spec-container">
                <div className="spec-element">
                    <span> Node Name </span>
                    <span className="mb-2 text-muted">{String(spec.nodeName)}</span>
                </div>
                <div className="spec-element">
                    <span> Restart Policy </span>
                    <span className="mb-2 text-muted">{String(spec.restartPolicy)}</span>
                </div>
                <div className="spec-element">
                    <span> Service Account </span>
                    <span className="mb-2 text-muted">{String(spec.serviceAccountName)}</span>
                </div>
                <div className="spec-element">
                    <span> Scheduler </span>
                    <span className="mb-2 text-muted">{String(spec.schedulerName)}</span>
                </div>
                <Accordion className="spec-accordion">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header> <b>Containers Spec</b> <Badge bg="secondary" style={{marginLeft: "5px"}}>{Object.keys(spec.containersSpec || {}).length}</Badge></Accordion.Header>
                        <Accordion.Body className="spec-element">
                            {Object.keys(spec.containersSpec || {}).map((key) => (
                                <Card>
                                    <Card.Header> <b className="desktop-detail-section-title" style={{fontSize: "0.9rem"}}>{spec.containersSpec[key].name}</b> </Card.Header>
                                    <Card.Body className="container-spec-container">
                                        <div className="spec-element">
                                            <span> Container Type </span>
                                            <span className="mb-2 text-muted">{String(spec.containersSpec[key].type)}</span>
                                        </div>
                                        <div className="spec-element">
                                            <span> Image </span>
                                            <span className="mb-2 text-muted">{String(spec.containersSpec[key].image)}</span>
                                        </div>
                                        <div className="spec-element">
                                            <span> Pull Policy </span>
                                            <span className="mb-2 text-muted">{String(spec.containersSpec[key].imagePullPolicy)}</span>
                                        </div>
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