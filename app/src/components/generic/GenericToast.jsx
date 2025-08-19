import React from 'react';
import { Toast, ToastContainer, Button } from 'react-bootstrap';

// Reusable toast notification component.
// Displays a small non-intrusive popup with a message, icon, and auto-hide behavior.
export default function GenericToast({
  show,     // boolean: whether the toast is visible
  onClose,  // function: closing handler (usually updates state in parent)
  message,  // string: text content of the toast
  type,     // string: bootstrap contextual background variant (e.g. 'success', 'danger', 'warning')
  icon      // string: CSS class for an icon (e.g. "bi bi-check-circle") for visual feedback
}) {
  return (
    <ToastContainer className="p-3" position="top-end">
      {/* Toast body: flexible layout allowing icon + message */}
      <Toast
        className="d-flex align-items-center"
        show={show}
        onClose={onClose}
        bg={type}
        delay={3000}     // Auto-hide after 3 seconds
        autohide
      >
        <Toast.Body>
          {/* Custom icon (e.g. checkmark, warning, error) */}
          <i
            className={icon}
            style={{ fontSize: '1rem', color: 'white', marginRight: '10px' }}
          />
          {/* Actual message text */}
          <span id="toast-message" style={{ color: 'white' }}>
            {message}
          </span>
        </Toast.Body>

        {/* Close button (manually dismiss toast) */}
        <Button
          className="btn-close btn-close-white me-2 m-auto"
          onClick={onClose}
        />
      </Toast>
    </ToastContainer>
  );
}
