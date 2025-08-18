import React, { useState } from "react";
import Toolbar from "./Toolbar";
import ApiKeyModal from "./modals/ApiKeyModal";
import BanModal from "./modals/BanModal";
import GenericToast from "./generic/GenericToast";
import DataTable from "./DataTable";
import { useApiKey } from "../hooks/useApiKey";
import { useEntityManager } from "../hooks/useEntityManager";
import { getBanData, deleteBan } from "../services/banService";
import { FAILURE_ICON, SUCCESS_ICON } from "../utils/toastIconsClasses";


// Page template for managing bans.
// Can handle two kinds of bans depending on `banType`: "IP" or "Login".
// Integrates modals, toast notifications, and a generic DataTable.
export function BanPageTemplate({ banType }) {
    // Decide backend parameter key based on ban type
    const seriviceParam = banType === "IP" ? "ipaddr" : "login";

    // Hook managing API key interactions (prompt when missing/invalid key)
    const {
        showApiKeyModal,
        handleSetKey,
        closeApiKeyModal,
        apiKeyValid,
        apiKeyErrorMessage
    } = useApiKey();

    // Hook centralizing entity (ban list items) management:
    // - data fetching, reloading
    // - selection handling
    // - deletion
    // - toast notifications
    const {
        items: bannedUsers,
        selectedIds,
        setSelectedIds,
        setRefreshCount,
        searchTerm,
        setSearchTerm,
        loading,
        error,
        deleteById: deleteBanById,
        showToast,
        toastMessage,
        toastType,
        toastIcon,
        openToast,
        closeToast
    } = useEntityManager(getBanData, deleteBan, apiKeyValid, seriviceParam, seriviceParam);

    // Single deletion helper (with toast feedback)
    const handleSingleDeletion = async (id) => {
        try {
            await deleteBanById(id, seriviceParam);
            openToast(
              `Successfully unbanned user with ${seriviceParam} ${id}`,
              "success",
              SUCCESS_ICON
            );
        } catch (err) {
            openToast(err.message, "danger", FAILURE_ICON);
        }
    };

    // Modal state for adding new ban
    const [showBanModal, setShowBanModal] = useState(false);
    const openBanModal = () => setShowBanModal(true);
    const closeBanModal = () => {
        setShowBanModal(false);
        setRefreshCount((count) => count + 1); // refresh ban list after modal closes
    };

    // Define toolbar button actions: Add, Delete, Refresh
    const Toolbarbuttons = [
        {
            id: `add-ban-${banType}-button`,
            className: "btn btn-primary",
            iconClass: "bi bi-plus-circle",
            ariaLabel: `Add Ban (${banType})`,
            onClick: () => openBanModal()
        },
        {
            id: `delete-ban-${banType}-button`,
            className: "btn btn-danger",
            iconClass: "bi bi-trash3",
            ariaLabel: `Delete Ban(s) (${banType})`,
            onClick: () => {
                if (selectedIds.length > 0) {
                    // Loop over selected IDs for deletion
                    selectedIds.forEach((id) => {
                        handleSingleDeletion(id);
                    });
                    setSelectedIds([]); // reset selection
                } else {
                    openToast(
                      `Please select at least one ${banType} to delete`,
                      "warning",
                      FAILURE_ICON
                    );
                }
            }
        },
        {
            id: `refresh-ban-${banType}-table-button`,
            className: "btn btn-secondary",
            iconClass: "bi bi-arrow-clockwise",
            ariaLabel: `Refresh ban ${banType} table`,
            onClick: () => setRefreshCount((count) => count + 1)
        }
    ];

    return (
        <>
            {/* Toolbar with Add / Delete / Refresh + search field */}
            <Toolbar 
              buttons={Toolbarbuttons} 
              title={`Ban ${banType}`} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />

            {/* API key prompt modal (when key is invalid/missing) */}
            <ApiKeyModal 
              show={showApiKeyModal} 
              onClose={closeApiKeyModal} 
              onSetKey={handleSetKey} 
              apiKeyValid={apiKeyValid} 
              apiKeyErrorMessage={apiKeyErrorMessage} 
              openToast={openToast} 
            />

            {/* Modal to add a new ban (either Login or IP) */}
            <BanModal 
              show={showBanModal} 
              onClose={closeBanModal} 
              banType={banType} 
              openToast={openToast} 
            />

            {/* Global toast for success / error messages */}
            <GenericToast 
              show={showToast}  
              onClose={closeToast} 
              message={toastMessage} 
              type={toastType} 
              icon={toastIcon}
            />

            {/* Data table for banned entries */}
            <DataTable 
                data={{ nodes: bannedUsers }} 
                loading={loading} 
                error={error} 
                searchTerm={searchTerm} 
                handleSingleDeletion={handleSingleDeletion} 
                setSelectedIds={setSelectedIds}
                openToast={openToast}
            />
        </>
    );
}
