import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import { prettyPrintJson } from "../../utils/prettyJson"; 
import "../../styles/desktopDetails.css";
import '../../styles/prettyJson.css';


// Component responsible for displaying the raw JSON data of a desktop.
// Uses Bootstrap Accordion to allow toggling visibility.
// Formats the JSON using a custom "prettyPrintJson" utility for better readability.
export default function RawJson({ data }) {
    // Local state that holds the JSON to be displayed.
    // Storing it in state ensures the component re-renders when "data" changes.
    const [rawJson, setRawJson] = useState(null);

    // Whenever the "data" prop updates, propagate the new JSON into state.
    useEffect(() => {
        setRawJson(data);
    }, [data]);

    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <b className="desktop-detail-section-title">Raw JSON</b>
                </Accordion.Header>

                <Accordion.Body>
                    <pre
                        className="prettyJson"
                        dangerouslySetInnerHTML={{ __html: prettyPrintJson(rawJson) }}
                    />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
