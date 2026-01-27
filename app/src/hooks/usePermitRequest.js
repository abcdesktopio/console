import { useEffect, useState } from "react";
import { checkPermitRequest } from "../services/permitRequestService"; 

// Custom React hook to manage API key lifecycle in the frontend.
// Responsibilities:
// - Store/retrieve the key from localStorage
// - Validate the key with the backend
// - Control visibility of the "Enter API key" modal
// - Control if client IP is permitted
// - Expose helpers to set/clear key and error messages
export function usePermitRequest() {
  // Controls the visibility of the API Key modal
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Whether the key has been validated successfully or not
  const [apiKeyValid, setApiKeyValid] = useState(false);

  // Whether the client ip has been validated successfully or not
  const [ipValid, setIpValid] = useState(false);

  // Error message returned from the server if the key is invalid
  const [permitRequestErrorMessage, setPermitRequestErrorMessage] = useState('');

  // Whether the request is currently being validated
  const [checking, setChecking] = useState(false);

  // -------- Modal handlers --------
  const openApiKeyModal = () => setShowApiKeyModal(true);
  const closeApiKeyModal = () => setShowApiKeyModal(false);

  // Handle setting a new API key, called from ApiKeyModal
  const handleSetKey = (apiKey) => {
    console.log("Key entered:", apiKey);
    // persist key client-side
    localStorage.setItem("apiKey", apiKey);
    // validate immediately with backend
    checkRequest(); 
  };

  // Validates the stored API key with backend service
  const checkRequest = async () => {
    if (checking) return;
    setChecking(true);

    try {
      await checkPermitRequest(); // external service/API call
      console.log("Valid key and IP");
      setApiKeyValid(true);
      setIpValid(true);
      setPermitRequestErrorMessage('');
      closeApiKeyModal(); // close modal when validation succeeds
    } catch (error) {
      if(error.message.includes("403.1")) {
        console.error("Invalid key:", error);
        setApiKeyValid(false);
        setPermitRequestErrorMessage(error.message);
        openApiKeyModal();  // force modal so user can update key
      }
      else if(error.message.includes("403.7")) {
        console.error("IP rejected:", error);
        setIpValid(false);
        setPermitRequestErrorMessage(error.message);
      }
      else {
        console.error(error);
      }
    } finally {
      setChecking(false);
    }
  };

  // On hook mount, check request immediately
  useEffect(() => {
    checkRequest();
  }, []);

  // Return API key state + utilities for parent components
  return {
    showApiKeyModal,     // (bool) whether key modal is visible
    openApiKeyModal,     // (fn) show modal
    closeApiKeyModal,    // (fn) hide modal
    handleSetKey,        // (fn) store + validate new key
    apiKeyValid,         // (bool) if key is valid
    ipValid,             // (bool) if client IP is valid
    permitRequestErrorMessage,  // (string) last error message
  };
}
