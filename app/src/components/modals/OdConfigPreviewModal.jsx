import React, { useEffect, useState } from 'react';
import GenericModal from '../generic/GenericModal';
import { Spinner } from 'react-bootstrap';
import { prettyPrintJson } from '../../utils/prettyJson';
import { FAILURE_ICON, SUCCESS_ICON } from "../../utils/toastIconsClasses";

import '../../styles/odConfigPreviewModal.css';
import '../../styles/prettyJson.css';


// Modal that displays the current (possibly edited) od.config as pretty JSON.
// Accepts an optional `config` prop; falls back to window.ABCDESKTOP_OD_CONFIG.
export default function OdConfigPreviewModal({ show, onClose, openToast, config: configProp }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    if (show) {
      setConfig(configProp ?? window.ABCDESKTOP_OD_CONFIG ?? null);
    }
  }, [show, configProp]);

  let modalBody = config
    ? (
      // Pretty print JSON with syntax highlighting
      // Using dangerouslySetInnerHTML since prettyPrintJson returns formatted HTML
      <pre
        className="prettyJson"
        dangerouslySetInnerHTML={{ __html: prettyPrintJson(config) }}
      />
    )
    :<div className="loading-spinner"> <Spinner animation="border" variant="secondary" /> <span className="loading-text">Loading config...</span> </div>  ;

  return (
    <GenericModal
      id="OdConfigPreviewModal"
      show={show}
      onClose={onClose}
      title="Config Preview"
      body={modalBody}
      customClass="od-config-preview-modal" // custom styling for better JSON readability
    />
  );
}
