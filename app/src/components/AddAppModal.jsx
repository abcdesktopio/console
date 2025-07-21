import React, { useState } from 'react';
import GenericModal from './GenericModal';
import { Nav, Tab, Form, Button } from 'react-bootstrap';
import { putApp } from '../services/appsService';
import { FAILURE_ICON, SUCCESS_ICON } from '../services/toastIconsClasses';

export default function AddAppModal({ show, onClose, openToast }) {
  const [activeTab, setActiveTab] = useState('jsonFile');
  const [jsonFile, setJsonFile] = useState(null);
  const [rawJson, setRawJson] = useState('');

  const handleAdd = async () => {
    if (activeTab === 'jsonFile') {
        console.log(jsonFile.name);

        let reader = new FileReader();
        reader.readAsText(jsonFile);

        reader.onload = async function() {
            try{
                await putApp(reader.result);
                openToast("App created successfully", "success", SUCCESS_ICON);
            }
            catch(err){
                openToast(err.message, "danger", FAILURE_ICON);
            }
        };

        reader.onerror = function() {
            console.error(reader.error);
        };
    } else {
        try{
            await putApp(rawJson);
            openToast("App created successfully", "success", SUCCESS_ICON);
        }
        catch(err){
            openToast(err.message, "danger", FAILURE_ICON);
        }
    }
    setJsonFile(null);
    setRawJson('');
    onClose();

    return true;
  };

  const handleFileChange = (e) => {
    setJsonFile(e.target.files[0]);
  };

  const modalBody = (
    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
      {/* Onglet navigation */}
      <Nav variant="tabs" id="add-app-nav-tabs">
        <Nav.Item>
          <Nav.Link eventKey="jsonFile" id="jsonFile-tab">JSON File</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="rawJson" id="rawJson-tab">Raw JSON</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Contenu de l'onglet actif */}
      <Tab.Content className="pt-3" id="add-app-tab-content">
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

  const modalActions = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleAdd}>
        Add
      </Button>
    </>
  );

  return (
    <GenericModal
      show={show}
      onClose={onClose}
      title="Add application to abcdesktop.io"
      body={modalBody}
      actions={modalActions}
    />
  );
}
