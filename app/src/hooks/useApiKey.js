import { useEffect, useState } from "react";
import { checkApiKey } from "../services/apiKeyService"; 

// Custom React hook to manage API key lifecycle in the frontend.
// Responsibilities:
// - Store/retrieve the key from localStorage
// - Validate the key with the backend
// - Control visibility of the "Enter API key" modal
// - Expose helpers to set/clear key and error messages
export function useApiKey() {
  // Controls the visibility of the API Key modal
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Whether the key has been validated successfully or not
  const [apiKeyValid, setApiKeyValid] = useState(false);

  // Error message returned from the server if the key is invalid
  const [apiKeyErrorMessage, setApiKeyErrorMessage] = useState('');

  // -------- Modal handlers --------
  const openApiKeyModal = () => setShowApiKeyModal(true);
  const closeApiKeyModal = () => setShowApiKeyModal(false);

  // Handle setting a new API key, called from ApiKeyModal
  const handleSetKey = (apiKey) => {
    console.log("Key entered:", apiKey);
    // persist key client-side
    localStorage.setItem("apiKey", apiKey);
    // validate immediately with backend
    checkKey(); 
  };

  // Validates the stored API key with backend service
  const checkKey = async () => {
    try {
      await checkApiKey(); // external service/API call
      console.log("Valid key");
      setApiKeyValid(true);
      setApiKeyErrorMessage('');
      closeApiKeyModal(); // close modal when validation succeeds
    } catch (error) {
      console.error("Invalid key:", error);
      setApiKeyValid(false);
      setApiKeyErrorMessage(error.message);
      openApiKeyModal();  // force modal so user can update key
    }
  };

  // On hook mount, check key immediately
  useEffect(() => {
    checkKey();
  }, []);

  // Return API key state + utilities for parent components
  return {
    showApiKeyModal,     // (bool) whether key modal is visible
    openApiKeyModal,     // (fn) show modal
    closeApiKeyModal,    // (fn) hide modal
    handleSetKey,        // (fn) store + validate new key
    apiKeyValid,         // (bool) if key is valid
    apiKeyErrorMessage,  // (string) last error message
  };
}
