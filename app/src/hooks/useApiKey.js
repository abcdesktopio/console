import { useEffect, useState } from "react";
import { checkApiKey } from "../services/apiKeyService"; 

export function useApiKey() {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [apiKeyErrorMessage, setApiKeyErrorMessage] = useState('');

  const openApiKeyModal = () => setShowApiKeyModal(true);
  const closeApiKeyModal = () => setShowApiKeyModal(false);

  const handleSetKey = (apiKey) => {
    console.log("Key entrée :", apiKey);
    localStorage.setItem("apiKey", apiKey);
    checkKey(); 
  };

  const checkKey = async () => {
    try {
      await checkApiKey();
      console.log("Clé valide");
      setApiKeyValid(true);
      setApiKeyErrorMessage('')
      closeApiKeyModal();
    } catch (error) {
      console.error("Clé invalide :", error);
      setApiKeyValid(false);
      setApiKeyErrorMessage(error.message);
      openApiKeyModal();
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  return {
    showApiKeyModal,
    openApiKeyModal,
    closeApiKeyModal,
    handleSetKey,
    apiKeyValid,
    apiKeyErrorMessage,
  };
}