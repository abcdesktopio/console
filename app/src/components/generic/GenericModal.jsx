import React from 'react';
import { Modal } from 'react-bootstrap';

// Reusable, generic modal component based on React-Bootstrap's Modal.
// Accepts props to control visibility, content, actions, and styling.
// This allows consistent modal use across the application.
export default function GenericModal({
  id,            // optional DOM id for the modal (useful for testing / DOM targeting)
  show,          // boolean: whether the modal should be visible
  onClose,       // function: called when modal is dismissed (close button or background click)
  title,         // string or JSX: modal title displayed in header
  body,          // JSX element: modal body content
  actions = null, // optional JSX for footer actions (buttons, etc.)
  size = 'md',   // Bootstrap modal size: 'sm', 'md', 'lg', 'xl'
  centered = true, // boolean: whether the modal is vertically centered
  customClass = '', // optional additional CSS class for custom styling
  closeButton = true, // boolean: whether to show the close button
  additionalHeaderElements = null // optional JSX for custom header elements
}) {
  return (
    <Modal
      id={id}
      className={customClass}
      show={show}
      onHide={onClose}
      size={size}
      centered={centered}
    >
      {/* Header with close button or not */}
      <Modal.Header closeButton={closeButton}>
        <Modal.Title>{title}</Modal.Title>
        {additionalHeaderElements}
      </Modal.Header>

      {/* Body content passed from props */}
      <Modal.Body>{body}</Modal.Body>

      {/* Footer is rendered only if "actions" were provided (ex. confirm / cancel buttons) */}
      {actions && <Modal.Footer>{actions}</Modal.Footer>}
    </Modal>
  );
}
