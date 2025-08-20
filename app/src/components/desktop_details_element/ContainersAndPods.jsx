import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import DataTable from "../DataTable";
import { buildContainersData, buildPodsData, deleteDesktopPod } from "../../services/desktopsService";
import { SUCCESS_ICON, FAILURE_ICON } from "../../utils/toastIconsClasses";
import "../../styles/desktopDetails.css";


// This component displays a list of containers inside a Card UI.
// It uses DataTable component to render the rows.
// The user can toggle filtering of terminated containers.
export default function ContainersAndPods({ desktopId, openToast, data, podsData, setPodsRefreshCount = null }) {
    // State holding the list of containers (already formatted for DataTable)
    const [containers, setContainers] = useState([]);

    // State holding the list of pods (already formatted for DataTable)
    const [pods, setPods] = useState([]);

    // Boolean state for whether to filter out terminated containers
    const [removeTerminated, setRemoveTerminated] = useState(false);

    // Whenever the "data" prop or the "removeTerminated" flag changes,
    // rebuild the container list by calling a domain service (buildContainersData).
    useEffect(() => {
        setContainers(buildContainersData(data, removeTerminated));
        setPods(buildPodsData(podsData, removeTerminated));
    }, [data, podsData, removeTerminated]);

    // Toggle function to include/exclude terminated containers
    const handleRemoveTerminated = () => {
        setRemoveTerminated(!removeTerminated);
    };

    // ---------- SINGLE DELETION ----------
    // Wraps delete with custom toast notifications
    const handleSingleDeletion = async (id) => {
        try {
            await deleteDesktopPod(desktopId, id);
            openToast(`Pod ${id} deleted successfully`, "success", SUCCESS_ICON);
            setPodsRefreshCount((c) => c + 1);
        } catch(err) {
            openToast(err.message, "danger", FAILURE_ICON);
        }
    }


    return (
        <Card>
            <Card.Header className="containers-table-card-header"> 
                <span className="desktop-detail-section-title-badge-container">
                    <b className="desktop-detail-section-title">Containers</b>
                    
                    {/* Displays the number of containers as a badge */}
                    <Badge bg="secondary">{containers.length}</Badge> 

                    <b className="desktop-detail-section-title">Pods</b>

                    {/* Displays the number of pods as a badge */}
                    <Badge bg="secondary">{pods.length}</Badge>
                </span>

                {/* Filter button that toggles removing terminated containers */}
                <button
                    id="filter-contrainers-button"
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleRemoveTerminated}
                    aria-label="filter displayed containers"
                >
                    <i className="bi bi-filter" style={{ fontSize: "1rem" }}></i>
                </button>
            </Card.Header>
            <Card.Body className="containers-container">
                <DataTable data={{nodes : containers}} />
                <DataTable data={{nodes : pods}} handleSingleDeletion={handleSingleDeletion}/>
            </Card.Body>
        </Card>
    );
}
