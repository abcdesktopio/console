import React from 'react';
import {Toast, ToastContainer, Button} from 'react-bootstrap';

export default function GenericToast({ show, onClose, message, type, icon }) {
    return (
        <ToastContainer className="p-3" position="top-end">
            <Toast className="d-flex align-items-center" show={show} onClose={onClose} bg={type} delay={3000} autohide>
                <Toast.Body>
                    <i className={icon} style={{fontSize: '1rem', color: 'white', marginRight: '10px'}}></i>
                    <span id="toast-message" style={{color: 'white'}}>{message}</span>
                </Toast.Body>
                <Button className="btn-close btn-close-white me-2 m-auto" onClick={onClose}></Button>
            </Toast>
        </ToastContainer>
    );
}