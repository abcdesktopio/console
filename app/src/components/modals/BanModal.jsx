import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import GenericModal from "./GenericModal"
import { postBan } from '../../services/banService';
import { FAILURE_ICON, SUCCESS_ICON } from '../../services/toastIconsClasses';

export default function BanModal({show, onClose, banType, openToast}){
    const seriviceParam = banType === "IP" ? "ipaddr" : "login";

    const [userToBan, setUserToBan] = useState('')

    const handleBan = async () => {
        if (!userToBan.trim()) return;
        try{
            await postBan(userToBan, seriviceParam);
            openToast(`Successfully banned user with ${seriviceParam} ${userToBan}`, "success", SUCCESS_ICON);
        }
        catch(err){
            openToast(err.message, "danger", FAILURE_ICON);
        }
        setUserToBan('');
        onClose();
    };


    const body = (
        <Form>
          <Form.Group controlId="set-user-to-ban">
            <Form.Label>{`${banType} to ban`}</Form.Label>
            <Form.Control
              type="text"
              value={userToBan}
              onChange={e => setUserToBan(e.target.value)}
            />
          </Form.Group>
        </Form>
      );
    
      const actions = (
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleBan}>
            Ban
          </Button>
        </>
      );
    
      return (
        <GenericModal
          show={show}
          onClose={onClose}
          title={`Ban user from ${banType}`}
          body={body}
          actions={actions}
        />
      );
}