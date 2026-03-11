import React, { useState } from 'react';
import GenericModal from '../generic/GenericModal';
import { Nav, Tab, Form, Button } from 'react-bootstrap';
import { putApp } from '../../services/appsService';
import { FAILURE_ICON, SUCCESS_ICON } from '../../utils/toastIconsClasses';

// Modal for adding a new application to abcdesktop.io.
// Provides two input modes: uploading a .json file or pasting raw JSON.
// On submit, calls backend service "putApp" and displays toast feedback.
export default function AddAppModal({ show, onClose, openToast }) {
  // Track which tab is currently active: "jsonFile" or "rawJson"
  const [activeTab, setActiveTab] = useState('jsonFile');

  // Holds selected file when user chooses a JSON file
  const [jsonFile, setJsonFile] = useState(null);

  // Holds JSON string when user pastes/edits manually
  const [rawJson, setRawJson] = useState('');

  // Handler when user clicks "Add"
  const handleAdd = async () => {
    if (activeTab === 'jsonFile') {
      // Mode 1: JSON file has been uploaded
      console.log(jsonFile.name);

      let reader = new FileReader();
      reader.readAsText(jsonFile);

      // When file reading succeeds
      reader.onload = async function () {
        try {
          // Send file contents to backend
          await putApp(reader.result);
          openToast("App created successfully", "success", SUCCESS_ICON);
        } catch (err) {
          openToast(err.message, "danger", FAILURE_ICON);
        }
      };

      // If file reading fails
      reader.onerror = function () {
        console.error(reader.error);
      };

    } else {
      // Mode 2: User pasted raw JSON manually
      try {
        await putApp(rawJson);
        openToast("App created successfully", "success", SUCCESS_ICON);
      } catch (err) {
        openToast(err.message, "danger", FAILURE_ICON);
      }
    }

    // Reset state and close modal
    setJsonFile(null);
    setRawJson('');
    onClose();

    return true;
  };

  // Handler for file selection.
  // Stores the first file the user picked.
  const handleFileChange = (e) => {
    setJsonFile(e.target.files[0]);
  };

  // Modal body (tabbed interface)
  const modalBody = (
    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
      
      {/* Tab navigation */}
      <Nav variant="tabs" id="add-app-nav-tabs">
        <Nav.Item>
          <Nav.Link eventKey="jsonFile" id="jsonFile-tab">JSON File</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="rawJson" id="rawJson-tab">Raw JSON</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Content depending on selected tab */}
      <Tab.Content className="pt-3" id="add-app-tab-content">

        {/* File upload tab */}
        <Tab.Pane eventKey="jsonFile">
          <Form>
            <Form.Group controlId="jsonFile">
              <Form.Label>JSON File</Form.Label>
              <Form.Control
                type="file"
                accept=".json"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Tab.Pane>

        {/* Raw JSON paste tab */}
        <Tab.Pane eventKey="rawJson">
          <Form.Group controlId="raw-json">
            <Form.Label>Raw JSON</Form.Label>
            <Form.Control
              as="textarea"
              rows={200}
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              style={{ height: '65vh', width: '100%' }}
            />
          </Form.Group>
        </Tab.Pane>

      </Tab.Content>
    </Tab.Container>
  );

  // Footer actions for the modal 
  const modalActions = (
    <>
      <Button id="github-button" variant="light" onClick={() => window.open(`https://github.com/abcdesktopio/images/tree/main/artifact/${window.ABCDESKTOP_VERSION}`)}>
        <i className="bi bi-github" style={{ fontSize: "1rem" }}></i>
      </Button>
      <Button id="add-app-json-modal-close-button" variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleAdd}>
        Add
      </Button>
    </>
  );

  return (
    <GenericModal
      id="AddAppJsonModal"
      show={show}
      onClose={onClose}
      title="Add application"
      body={modalBody}
      actions={modalActions}
    />
  );
}
