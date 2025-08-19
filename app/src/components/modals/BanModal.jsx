import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import GenericModal from "../generic/GenericModal"
import { postBan } from '../../services/banService';
import { FAILURE_ICON, SUCCESS_ICON } from '../../utils/toastIconsClasses';


// Modal for banning a user by IP address or login name.
// Uses GenericModal and adapts dynamically depending on the "banType" prop.
export default function BanModal({ show, onClose, banType, openToast }) {
    // Depending on banType, determine which parameter key to send to backend
    const seriviceParam = banType === "IP" ? "ipaddr" : "login";

    // Dynamic modal IDs for easier identification
    const customID = banType === "IP" ? "BanIpModal" : "BanLoginModal";
    const closeButtonID = banType === "IP" ? "close-ban-ip-modal" : "close-ban-login-modal";

    // State for input value: which user/IP to ban
    const [userToBan, setUserToBan] = useState('');

    // Handle ban request
    const handleBan = async () => {
        if (!userToBan.trim()) return; // avoid empty submissions

        try {
            // Call backend ban service
            await postBan(userToBan, seriviceParam);

            // On success → notify user via toast
            openToast(
              `Successfully banned user with ${seriviceParam} ${userToBan}`,
              "success",
              SUCCESS_ICON
            );
        } catch (err) {
            // On failure → notify user with error toast
            openToast(err.message, "danger", FAILURE_ICON);
        }

        // Reset form field and close modal
        setUserToBan('');
        onClose();
    };

    // Modal body → form input (text field)
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
    
    // Modal footer actions
    const actions = (
        <>
          <Button id={closeButtonID} variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleBan}>
            Ban
          </Button>
        </>
    );
    
    // Render GenericModal with dynamic IDs and props
    return (
        <GenericModal
          id={customID}
          show={show}
          onClose={onClose}
          title={`Ban user from ${banType}`}
          body={body}
          actions={actions}
        />
    );
}
