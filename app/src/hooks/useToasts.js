import { useState, useEffect } from "react";
import { FAILURE_ICON } from "../utils/toastIconsClasses";

// Custom hook to manage toast notifications (success, error, warning, info)
export function useToasts(
    permitRequestErrorMessage,  // string: error message from permit request
) {

   // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [toastIcon, setToastIcon] = useState("");

  // -------- TOAST HELPERS --------

  // Open toast with message, type (success/danger/warning/info), and icon
  const openToast = (message, type, icon) => {
    setToastMessage(message);
    setToastType(type);
    setToastIcon(icon);
    setShowToast(true);
  };

  // Close toast + reset state
  const closeToast = () => {
    setShowToast(false);
    setToastMessage("");
    setToastType("");
    setToastIcon("");
  };

  useEffect(() => {
    if (permitRequestErrorMessage !== "") {
      openToast(permitRequestErrorMessage, "danger", FAILURE_ICON);
    }
  }, [permitRequestErrorMessage]);

  return {
    showToast, toastMessage, toastType, toastIcon,     // current toast state
    openToast, closeToast                              // toast helpers
  };
}