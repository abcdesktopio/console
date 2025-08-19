import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import GenericModal from "../generic/GenericModal"
import { FAILURE_ICON, SUCCESS_ICON } from '../../utils/toastIconsClasses';

// Modal to allow the user to input or update an API key required for accessing the console.
// Uses GenericModal for consistency and displays error messages as toasts when key validation fails.
export default function ApiKeyModal({
  show,                // boolean: modal visibility
  onClose,             // function: called when modal should be closed
  onSetKey,            // function: callback triggered when user submits API key
  apiKeyValid,         // boolean: indicates if last key check was valid
  apiKeyErrorMessage,  // string: optional error message returned on invalid key
  openToast            // function: toast handler to display success/failure messages
}) {
  
    // Local state for controlled form input
    const [apiKey, setApiKey] = useState('');

    // Side effect: On every validation check,
    // if the key is invalid and an error message exists, display a toast.
    useEffect(() => {
      if (!apiKeyValid && apiKeyErrorMessage !== '') {
        openToast(apiKeyErrorMessage, "danger", FAILURE_ICON);
      }
    }, [apiKeyValid, apiKeyErrorMessage]);

    // Handler for "Set" button
    // Calls parent callback with entered key, resets input, and closes modal.
    const handleSetKey = () => {
        if (!apiKey.trim()) return; // prevent submitting empty keys
        onSetKey(apiKey);
        setApiKey('');
        onClose();
    };

    // Modal body: simple Bootstrap form with an input field for API key
    const body = (
        <Form>
          <Form.Group controlId="set-api-key">
            <Form.Label>API-KEY</Form.Label>
            <Form.Control
              type="text"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Enter API-KEY"
            />
          </Form.Group>
        </Form>
    );

    // Modal actions: Close + Set buttons
    const actions = (
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSetKey}>
            Set
          </Button>
        </>
    );

    return (
        <GenericModal
          id="setApiKeyModal"
          show={show}
          onClose={onClose}
          title="Please enter a valid API KEY to access console"
          body={body}
          actions={actions}
        />
    );
}
