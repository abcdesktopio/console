import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import { prettyPrintJson } from "../../utils/prettyJson";

export default function RawJson({ data }) {
    const [rawJson, setRawJson] = useState(null);

    useEffect(() => {
        setRawJson(data);
    }, [data]);

    return (
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
    );
}