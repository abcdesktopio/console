import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import GenericModal from "./GenericModal"
import AppSelect from './AppSelect';
import { addOrRemoveAppToDock } from '../services/webfrontService';
import { FAILURE_ICON, SUCCESS_ICON } from '../services/toastIconsClasses';

export default function AddAppToDockModal({show, onClose, openToast}){
    const [appToAdd, setAppToAdd] = useState('')

    const handleAddToDock = async () => {
        if (!appToAdd.trim()) return;
        try{
            await addOrRemoveAppToDock(appToAdd, "add");
            openToast(`Successfully add ${appToAdd} to dock`, "success", SUCCESS_ICON);
        }
        catch(err){
            openToast(err.message, "danger", FAILURE_ICON);
        }
        setAppToAdd('');
        onClose();
    };


    const body = (
        <Form>
          <Form.Group controlId="set-app-to-add-to-dock">
            <Form.Label>{`app to add`}</Form.Label>
            <AppSelect 
                show={show}
                onChange={setAppToAdd}
                openToast={openToast}
            />
          </Form.Group>
        </Form>
      );
    
      const actions = (
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddToDock}>
            Add
          </Button>
        </>
      );
    
      return (
        <GenericModal
          show={show}
          onClose={onClose}
          title={`Add application to Dock`}
          body={body}
          actions={actions}
        />
      );
}