import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import GenericModal from "../generic/GenericModal"
import { FAILURE_ICON, SUCCESS_ICON } from '../../utils/toastIconsClasses';

export default function ApiKeyModal({show, onClose, onSetKey, apiKeyValid, apiKeyErrorMessage, openToast}){
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
      if(!apiKeyValid && apiKeyErrorMessage !== '') {
        openToast(apiKeyErrorMessage, "danger", FAILURE_ICON);
      }
    }, [apiKeyValid, apiKeyErrorMessage]);

    const handleSetKey = () => {
        if (!apiKey.trim()) return;
        onSetKey(apiKey);
        setApiKey('');
        onClose();
    };


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