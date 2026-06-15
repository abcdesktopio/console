import React, { useState } from "react";
import Toolbar from "../components/Toolbar";
import ApiKeyModal from "../components/modals/ApiKeyModal";
import AddAppJsonModal from "../components/modals/AddAppJsonModal";
import AppInfosModal from "../components/modals/AppInfosModal";
import AppStoreModal from "../components/modals/AppStoreModal";
import GenericToast from "../components/generic/GenericToast";
import DataTable from "../components/DataTable";

import { usePermitRequest } from "../hooks/usePermitRequest";
import { useEntityManager } from "../hooks/useEntityManager";

// Service functions for apps
import { getApps, deleteApp } from "../services/appsService";
import { FAILURE_ICON, SUCCESS_ICON } from "../utils/toastIconsClasses";


// Apps page responsible for listing, adding, deleting, and inspecting applications.
export function Apps() {
    
    // ---------- API KEY MANAGEMENT ----------
    // Ensures app cannot interact with backend until a valid API key is set
    const {
        showApiKeyModal,
        handleSetKey,
        closeApiKeyModal,
        apiKeyValid,
        ipValid,
        permitRequestErrorMessage
    } = usePermitRequest();

    // ---------- ENTITY MANAGEMENT ----------
    // useEntityManager handles all app entities (list, delete, refresh, search, toast notifications, etc.)
    const {
        items: apps,
        selectedIds,
        setSelectedIds,
        refreshCount,
        setRefreshCount,
        searchTerm,
        setSearchTerm,
        loading,
        error,
        deleteById: deleteAppById,
        showToast,
        toastMessage,
        toastType,
        toastIcon,
        openToast,
        closeToast
    } = useEntityManager(getApps, deleteApp, apiKeyValid, ipValid, permitRequestErrorMessage);

    // ---------- SINGLE DELETION ----------
    // Wraps delete with custom toast notifications
    const handleSingleDeletion = async (id) => {
        try {
            await deleteAppById(id);
            openToast("App deleted successfully", "success", SUCCESS_ICON);
            setRefreshCount((c) => c + 1); // Trigger refresh after deletion
        } catch(err) {
            openToast(err.message, "danger", FAILURE_ICON);
        }
    }

    // ---------- MODAL STATES ----------
    const [showAddAppJsonModal, setShowAddAppJsonModal] = useState(false);
    const [showAppStoreModal, setShowAppStoreModal] = useState(false);
    const [showAppInfosModal, setShowAppInfosModal] = useState(false);
    const [appInfosId, setAppInfosId] = useState(null);
    const [appStoreFetchApps, setAppStoreFetchApps] = useState(false);

    // Modal open/close handlers
    const openAddAppJsonModal = () => {
        setShowAddAppJsonModal(true);
        closeAppStoreModal();
    }
    const closeAddAppJsonModal = () => {
        setShowAddAppJsonModal(false);
        setRefreshCount((count) => count + 1); // refresh apps after new addition
    }

    // Modal open/close handlers
    const openAppStoreModal = () => {
        setShowAppStoreModal(true);
        setAppStoreFetchApps(true);
    }
    const closeAppStoreModal = () => {
        setShowAppStoreModal(false);
        setAppStoreFetchApps(false);
        setRefreshCount((count) => count + 1); // refresh apps after new addition
    }

    const openAppInfosModal = () => setShowAppInfosModal(true);
    const closeAppInfosModal = () => setShowAppInfosModal(false);

    const handleAppInfos = (id) => {
        setAppInfosId(id);
        openAppInfosModal();
    }

    // ---------- TOOLBAR BUTTONS ----------
    const Toolbarbuttons = [
        {
            id: "add-app-button",
            className: "btn btn-primary",
            iconClass: "bi bi-plus-circle",
            ariaLabel: "Add App",
            onClick: () => openAppStoreModal()
        },
        {
            id: "delete-app-button",
            className: "btn btn-danger",
            iconClass: "bi bi-trash3",
            ariaLabel: "Delete App(s)",
            onClick: async () => {
                if (selectedIds.length > 0) {
                    try {
                        for (const id of selectedIds) {
                            await deleteAppById(id); 
                        }
                        setSelectedIds([]); // reset selection
                        openToast("All selected apps have been deleted successfully", "success", SUCCESS_ICON);
                        setRefreshCount((c) => c + 1); // Trigger refresh after deletion
                    } catch (err) {
                        openToast(err.message, "danger", FAILURE_ICON);
                    }
                } else {
                    openToast("No app selected", "warning", FAILURE_ICON);
                }
            }
        },
        {
            id: "refresh-apps-table-button",
            className: "btn btn-secondary",
            iconClass: "bi bi-arrow-clockwise",
            ariaLabel: "Refresh apps table",
            onClick: () => setRefreshCount((count) => count + 1)
        }
    ];

    // ---------- RENDER ----------
    return(
        <React.Fragment>   
            {/* Toolbar with action buttons + search */}
            <Toolbar
                buttons={Toolbarbuttons}
                title="Applications"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* Prompt for entering/updating API key */}
            <ApiKeyModal
                show={showApiKeyModal}
                onClose={closeApiKeyModal}
                onSetKey={handleSetKey}
            />

            {/* Modal to open the app store */}
            <AppStoreModal
                show={showAppStoreModal}
                fetchApps={appStoreFetchApps}
                openAddAppJsonModal={openAddAppJsonModal}
                onClose={closeAppStoreModal}
                openToast={openToast}
            />

            {/* Modal to add a new app */}
            <AddAppJsonModal
                show={showAddAppJsonModal}
                onClose={closeAddAppJsonModal}
                openToast={openToast}
            />

            {/* Modal to show detailed app infos (JSON, metadata etc.) */}
            <AppInfosModal
                show={showAppInfosModal}
                onClose={closeAppInfosModal}
                appId={appInfosId}
            />

            {/* Toast notification handler for success/error messages */}
            <GenericToast
                show={showToast}
                onClose={closeToast}
                message={toastMessage}
                type={toastType}
                icon={toastIcon}
            />

            {/* Table of applications, supports search, delete, and inspect actions */}
            <DataTable 
                key={refreshCount}
                data={{ nodes: apps }} 
                loading={loading} 
                error={error} 
                searchTerm={searchTerm} 
                handleSingleDeletion={handleSingleDeletion} 
                setSelectedIds={setSelectedIds} 
                openToast={openToast}
                handleAppInfos={handleAppInfos} // used for opening AppInfos modal
            />
        </React.Fragment>
    )
}
