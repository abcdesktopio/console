import { useState, useEffect } from "react";

export function useEntityManager(fetchDataFn, deleteItemFn, apiKeyValid, fetchDataFnParams = null, deleteItemFnParams = null) {
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [toastIcon, setToastIcon] = useState("");

  const openToast = (message, type, icon) => {
    setToastMessage(message);
    setToastType(type);
    setToastIcon(icon);
    setShowToast(true);
  };

  const closeToast = () => {
    setShowToast(false);
    setToastMessage("");
    setToastType("");
    setToastIcon("");
  };

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = fetchDataFnParams ? await fetchDataFn(fetchDataFnParams) :  await fetchDataFn();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteById(id) {
    setLoading(true);
    setError(null);
    try {
      deleteItemFnParams ? await deleteItemFn(id, deleteItemFnParams) : await deleteItemFn(id);
      setRefreshCount((c) => c + 1);
      setSelectedIds([]); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (apiKeyValid) {
      load();
    }
  }, [refreshCount, apiKeyValid]);

  return {
    items,
    setItems,
    selectedIds,
    setSelectedIds,
    setRefreshCount,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    deleteById,
    showToast,
    toastMessage,
    toastType,
    toastIcon,
    openToast,
    closeToast
  };
}
