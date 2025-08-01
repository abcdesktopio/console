import React from 'react';
import { Modal } from 'react-bootstrap';

export default function GenericModal({ id, show, onClose, title, body, actions = null, size = 'md', centered = true, customClass = '' }) {
  return (
    <Modal id={id} className={customClass} show={show} onHide={onClose} size={size} centered={centered}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{body}</Modal.Body>

      {actions && <Modal.Footer>{actions}</Modal.Footer>}
    </Modal>
  );
}