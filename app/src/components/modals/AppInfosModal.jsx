import React, { useEffect, useState } from 'react';
import GenericModal from '../generic/GenericModal';
import { Spinner, Card } from 'react-bootstrap';
import { prettyPrintJson } from '../../utils/prettyJson';
import { getAppInfos } from '../../services/appsService';
import { FAILURE_ICON, SUCCESS_ICON } from "../utils/toastIconsClasses";
import '../../styles/prettyJson.css';
import '../../styles/appInfosModal.css';


// Modal that fetches and displays detailed information about a specific app.
// It fetches app data from the backend when opened and renders it as pretty-formatted JSON.
export default function AppInfosModal({ show, onClose, appId, openToast }) {
  // Local state for fetched app data
  const [appInfos, setAppInfos] = useState(null);

  // Loading state to handle async fetch progress
  const [loading, setLoading] = useState(false);

  // Error state to capture fetch issues
  const [error, setError] = useState(null);

  // Effect: Every time modal is shown and appId changes,
  // trigger a fetch for the app information.
  useEffect(() => {
    if (show && appId) {
      setLoading(true);
      setError(null);

      getAppInfos(appId)
        .then((data) => setAppInfos(data))    // store response
        .catch((err) => setError(err.message)) // catch errors
        .finally(() => setLoading(false));     // reset loading state
    }
  }, [show, appId]);

  // Decide what to display based on loading/error/data state
  let modalBody;
  if (loading) {
    modalBody = <div className="loading-spinner"> <Spinner animation="border" variant="secondary" /> <span className="loading-text">Loading...</span> </div> ; 
  } else if (error) {
    openToast(error, "danger", FAILURE_ICON); // error feedback
  } else if (appInfos) {
    modalBody = (
      // Pretty print JSON with syntax highlighting
      // Using dangerouslySetInnerHTML since prettyPrintJson returns formatted HTML
      <pre
        className="prettyJson"
        dangerouslySetInnerHTML={{ __html: prettyPrintJson(appInfos) }}
      />
    );
  } else {
    modalBody = <Card><Card.Body className="no-data-container"> <span className="no-data-text">No data to display</span> </Card.Body></Card>;
  }

  return (
    <GenericModal
      id="AppInfosModal"
      show={show}
      onClose={onClose}
      title="App Infos"
      body={modalBody}
      customClass="app-infos-modal" // custom styling for better JSON readability
    />
  );
}
