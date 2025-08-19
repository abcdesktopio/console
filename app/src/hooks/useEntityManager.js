import { useState, useEffect } from "react";

// Custom hook to manage a "list of entities" (apps, bans, desktops, etc.)
// Provides a standardized pattern for:
// - Fetching data (with parameters)
// - Deleting items (with parameters)
// - Refreshing data on demand
// - Managing loading/error state
// - Handling row selection
// - Integrating toast notifications
export function useEntityManager(
  fetchDataFn,            // function to fetch data (API call)
  deleteItemFn,           // function to delete a single item (API call)
  apiKeyValid,            // boolean: ensure API key is valid before fetching
  fetchDataFnParams = null,   // optional params for fetchDataFn
  deleteItemFnParams = null   // optional params for deleteItemFn
) {
  // State: list of items currently managed
  const [items, setItems] = useState([]);

  // Multi-select support: row IDs that are selected
  const [selectedIds, setSelectedIds] = useState([]);

  // Used to trigger re-fetching of data (increment counter → reload)
  const [refreshCount, setRefreshCount] = useState(0);

  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search/filter term used by DataTable / Toolbar
  const [searchTerm, setSearchTerm] = useState("");

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

  // -------- DATA LOADING --------
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = fetchDataFnParams 
        ? await fetchDataFn(fetchDataFnParams) 
        : await fetchDataFn();

      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // -------- ITEM DELETION --------
  async function deleteById(id) {
    setLoading(true);
    setError(null);
    try {
      // Call delete function with extra params if needed
      deleteItemFnParams 
        ? await deleteItemFn(id, deleteItemFnParams) 
        : await deleteItemFn(id);

      // Trigger refresh after deletion
      setRefreshCount((c) => c + 1);

      // Reset selection (avoid stale IDs)
      setSelectedIds([]); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Automatically fetch whenever refreshCount changes OR key becomes valid
  useEffect(() => {
    if (apiKeyValid) {
      load();
    }
  }, [refreshCount, apiKeyValid]);

  // -------- PUBLIC API RETURNED --------
  return {
    items, setItems,                 // entity list
    selectedIds, setSelectedIds,     // row selection
    setRefreshCount,                 // manual refresh trigger
    searchTerm, setSearchTerm,       // searching/filtering
    loading, error,                  // network state
    deleteById,                      // deletion helper
    showToast, toastMessage, toastType, toastIcon, // current toast state
    openToast, closeToast             // toast helpers
  };
}
