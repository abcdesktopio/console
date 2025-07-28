import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Accordion from 'react-bootstrap/Accordion';
import { getDesktopContainers, getDesktopVolumes, getDesktopMetadata, getDesktopSpec, getDesktopStatus, getDesktopRawJson } from "../services/desktopsService";
import { prettyPrintJson } from "../utils/prettyJson";

export default function DesktopDetails({ id }) {
    const [containers, setContainers] = useState([]);
    const [volumes, setVolumes] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [spec, setSpec] = useState({});
    const [status, setStatus] = useState({});
    const [rawJson, setRawJson] = useState(null);

    useEffect(() => {
        getDesktopContainers(id).then((data) => setContainers(data));
        getDesktopVolumes(id).then((data) => setVolumes(data));
        getDesktopMetadata(id).then((data) => setMetadata(data));
        getDesktopSpec(id).then((data) => setSpec(data));
        getDesktopStatus(id).then((data) => setStatus(data));
        getDesktopRawJson(id).then((data) => setRawJson(data));
    }, [id]);

    return (
        <div className="desktop-details">
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
            <Card>
                <Card.Header> <b className="desktop-detail-section-title">Containers</b> <Badge bg="secondary">{containers.length}</Badge></Card.Header>
                <Card.Body className="containers-container">
                    <DataTable 
                        data={{nodes : containers}}
                    />
                </Card.Body>
            </Card>
            <Card>
                <Card.Header> <b className="desktop-detail-section-title">Volumes</b> <Badge bg="secondary">{volumes.length}</Badge></Card.Header>
                <Card.Body className="volumes-container">
                    <DataTable 
                        data={{nodes : volumes}}
                    />
                </Card.Body>
            </Card>
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
                                        <Card.Header> <b className="desktop-detail-section-title" style={{fontSize: "0.9rem"}}>{status.containerStatuses[key].name}</b> <span><Badge bg="dark">{status.containerStatuses[key].ready === true ? "Ready" : "Not Ready"}</Badge> <Badge bg="light" text="dark">Restart Count {status.containerStatuses[key].restartCount}</Badge> </span> </Card.Header>
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
                                                <span className="mb-2 text-muted">{String(status.containerStatuses[key].currentState)}</span>
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
                                            <div style={{marginBottom: "5px"}}> <b>{status.conditions[key].type}</b> {status.conditions[key].status === "True" ? <Badge bg="success">{String(status.conditions[key].status)}</Badge> : <Badge bg="danger">{String(status.conditions[key].status)}</Badge>}</div>
                                            <div> Last transistion : <span className="mb-2 text-muted">{status.conditions[key].lastTransitionTime} </span> </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Body>
            </Card>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header> <b className="desktop-detail-section-title">Raw JSON</b> </Accordion.Header>
                    <Accordion.Body>
                    <pre
                        className='prettyJson'
                        dangerouslySetInnerHTML={{ __html: prettyPrintJson(rawJson) }}
                    />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}