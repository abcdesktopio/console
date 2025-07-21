import { useEffect, useState } from "react";
import { checkApiKey } from "../services/apiKeyService"; 

export function useApiKey() {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(false);

  const openApiKeyModal = () => setShowApiKeyModal(true);
  const closeApiKeyModal = () => setShowApiKeyModal(false);

  const handleSetKey = (apiKey) => {
    console.log("Key entrée :", apiKey);
    localStorage.setItem("apiKey", apiKey);
    checkKey(); 
  };

  const checkKey = async () => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      openApiKeyModal();
      setApiKeyValid(false);
      return;
    }

    try {
      await checkApiKey();
      console.log("Clé valide");
      setApiKeyValid(true);
      closeApiKeyModal();
    } catch (error) {
      console.error("Clé invalide :", error);
      setApiKeyValid(false);
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
  };
}