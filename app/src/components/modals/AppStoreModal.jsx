import React, { useState, useEffect } from "react";
import GenericModal from "../generic/GenericModal";
import SearchBar from "../SearchBar";
import { Button, Spinner, Card } from "react-bootstrap";
import { putApp, getAvailableAppsList } from "../../services/appsService";
import { FAILURE_ICON, SUCCESS_ICON, INFO_ICON } from "../../utils/toastIconsClasses";
import "../../styles/appStoreModal.css";

export default function AppStoreModal({ show, fetchApps=false, openAddAppJsonModal, onClose, openToast }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [appListToShow, setAppListToShow] = useState([]);
    const [vanillaAppList, setVanillaAppList] = useState([]);
    const [selectedApps, setSelectedApps] = useState([]);
    const [selectedCardIds, setSelectedCardIds] = useState([]);
    const [filterAppName, setFilterAppName] = useState("");
    const [allSelected, setAllSelected] = useState(false);

    const resetAllStates = () => {
        setAppListToShow([]);
        setVanillaAppList([]);
        setSelectedApps([]);
        setSelectedCardIds([]);
        setFilterAppName("");
        setAllSelected(false);
    }

    useEffect(() => {
        if (show && fetchApps) {
            setLoading(true);
            setError(null);
            resetAllStates();

            getAvailableAppsList()
            .then((data) => {setAppListToShow(data); setVanillaAppList(data);})    // store response
            .catch((err) => setError(err.message)) // catch errors
            .finally(() => setLoading(false));     // reset loading state
        }
    }, [show, fetchApps]);

    useEffect(() => {
        if (filterAppName === "") {
            setAppListToShow(vanillaAppList);
            return
        }

    const filteredAppList = vanillaAppList.filter((app) => app.Config.Labels["oc.name"].toLowerCase().includes(filterAppName));
        setAppListToShow(filteredAppList);        
    }, [filterAppName]);

    const handleSearchBarChange = (e) => {
        const lowerCaseFilterAppName = e.target.value.toLowerCase();
        setFilterAppName(lowerCaseFilterAppName);
    }

    const toggleSelectedCard = (cardId) => {
        if (selectedCardIds.includes(cardId)) {
        setSelectedCardIds(selectedCardIds.filter((id) => id !== cardId));
        } else {
            setSelectedCardIds([...selectedCardIds, cardId]);
        }
    }

    const toggleSelectedApp = (app) => {
        const isInList = selectedApps.some(a => a.Config.Labels["oc.name"] === app.Config.Labels["oc.name"]);

        if (isInList) {
        setSelectedApps(selectedApps.filter(a => a.Config.Labels["oc.name"] !== app.Config.Labels["oc.name"]));
        } else {
            setSelectedApps([...selectedApps, app]);
        }
    }

    const handleSelectedApp = (cardId, app) => {
        toggleSelectedCard(cardId);
        toggleSelectedApp(app);
    }

    const handleSelectAllApps = () => {
        if (allSelected) {
        setSelectedApps([]);
        setSelectedCardIds([]);
        } else {
            const allCardIds = vanillaAppList.map((app) => `app-card-${app.Config.Labels["oc.name"]}`);
            setSelectedApps(vanillaAppList);
            setSelectedCardIds(allCardIds);
        }
        setAllSelected(!allSelected);
    }

    const handleAddApp = async () => {
        // If no app has been selected then return
        if(selectedApps.length === 0) {
            openToast("No app selected", "danger", FAILURE_ICON); // error feedback
            return;
        }
        try {
            openToast("Adding app(s)...", "info", INFO_ICON); // feedback
            // Send app file contents to backend
            await putApp(JSON.stringify(selectedApps));
            openToast("App created successfully", "success", SUCCESS_ICON);
            onClose();
        } catch (err) {
            openToast(err.message, "danger", FAILURE_ICON);
        }
    }

    // Decide what to display based on loading/error/data state
    let modalBody;
    if (loading) {
        modalBody = <div className="loading-spinner"> <Spinner animation="border" variant="secondary" /> <span className="loading-text">Loading...</span> </div> ;
    } else if (error) {
        openToast(error, "danger", FAILURE_ICON); // error feedback
    } else {
        modalBody = (

        <div className="app-store-container">
            {appListToShow.map((app) => {
                let appName = app.Config.Labels["oc.name"];
                let appIcon = app.Config.Labels["oc.icondata"];
                let cardId = `app-card-${appName}`
                return (
                    <Card id={cardId} key={app.id} className={`app-card ${selectedCardIds.includes(cardId) ? 'app-card-selected' : ''}`} onClick={() => handleSelectedApp(cardId, app)}>
                        <Card.Body>
                            <Card.Title className="app-card-title">{appName}</Card.Title>
                            <div className="app-card-image-container">
                                <img className="app-card-image" src={`data:image/svg+xml;base64,${appIcon}`} />
                            </div>
                        </Card.Body>
                    </Card>
                );
            })}
        </div>
        )
    }

    const modalAdditionalHeaderElements = (
        <React.Fragment>
            <SearchBar id="app-store-search-bar" placeholder="Search..." onChange={handleSearchBarChange} />
        </React.Fragment>
    )

    // Footer actions for the modal
    const modalActions = (
        <React.Fragment>
            <Button id="select-all-apps-button" variant="light" onClick={() => handleSelectAllApps()}>
                Select All
            </Button>
            <Button id="add-app-json-modal-open-button" variant="light" onClick={openAddAppJsonModal}>
                JSON
            </Button>
            <Button id="app-store-modal-close-button" variant="secondary" onClick={onClose}>
                Close
            </Button>
            <Button variant="primary" onClick={() => handleAddApp()}>
                Add
            </Button>
        </React.Fragment>
    );

    return (
        <GenericModal
            id="AppStoreModal"
            show={show}
            onClose={onClose}
            title="Applications store"
            body={modalBody}
            actions={modalActions}
            closeButton={false}
            additionalHeaderElements={modalAdditionalHeaderElements}
        />
    );
}