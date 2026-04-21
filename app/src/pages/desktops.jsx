import React from "react";
import Toolbar from "../components/Toolbar";
import ApiKeyModal from "../components/modals/ApiKeyModal";
import GenericToast from "../components/generic/GenericToast";
import DataTable from "../components/DataTable";

import { usePermitRequest } from "../hooks/usePermitRequest";
import { useEntityManager } from "../hooks/useEntityManager";
import { getDesktops, deleteDesktop } from "../services/desktopsService";
import { FAILURE_ICON, SUCCESS_ICON } from "../utils/toastIconsClasses";

import "../styles/desktopDetails.css";


// Page responsible for listing current desktops in abcdesktop.
// Provides CRUD-like operations: refresh list, delete (single/bulk), 
// expand desktop rows for details (via DataTable expandable feature).
export function Desktops() {

    // ---------- API KEY MANAGEMENT ----------
    const {
        showApiKeyModal,
        handleSetKey,
        closeApiKeyModal,
        apiKeyValid,
        ipValid,
        permitRequestErrorMessage
    } = usePermitRequest();

    // ---------- ENTITY MANAGEMENT ----------
    const {
        items: desktops,        // list of desktops
        selectedIds,            // selected row IDs
        setSelectedIds,  
        refreshCount,       
        setRefreshCount,        // trigger to refresh data
        searchTerm,
        setSearchTerm,
        loading,
        error,
        deleteById: deleteDesktopById,
        showToast,
        toastMessage,
        toastType,
        toastIcon,
        openToast,
        closeToast
    } = useEntityManager(getDesktops, deleteDesktop, apiKeyValid, ipValid, permitRequestErrorMessage);

    // ---------- SINGLE DELETION ----------
    const handleSingleDeletion = async (id) => {
        try {
            await deleteDesktopById(id); // backend call
            openToast("Desktop deleted successfully", "success", SUCCESS_ICON);
        } catch (err) {
            openToast(err.message, "danger", FAILURE_ICON);
        }
    };

    // ---------- TOOLBAR BUTTONS ----------
    const Toolbarbuttons = [
        {
            id: "delete-desktop-button",
            className: "btn btn-danger",
            iconClass: "bi bi-trash3",
            ariaLabel: "Delete desktop(s)",
            onClick: () => {
                if (selectedIds.length > 0) {
                    // Delete all selected desktops
                    selectedIds.forEach((id) => {
                        handleSingleDeletion(id);
                    });
                    setSelectedIds([]); // reset selection
                } else {
                    openToast("No desktop selected", "warning", FAILURE_ICON);
                }
            }
        },
        {
            id: "refresh-desktop-table-button",
            className: "btn btn-secondary",
            iconClass: "bi bi-arrow-clockwise",
            ariaLabel: "Refresh desktops table",
            onClick: () => setRefreshCount((count) => count + 1)
        }
    ];

    // ---------- RENDER ----------
    return (
        <React.Fragment>   
            {/* Toolbar with delete + refresh */}
            <Toolbar
                buttons={Toolbarbuttons}
                title="Desktops"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* API key modal (forced if key invalid/missing) */}
            <ApiKeyModal
                show={showApiKeyModal}
                onClose={closeApiKeyModal}
                onSetKey={handleSetKey}
            />

            {/* Global toast notifications */}
            <GenericToast
                show={showToast}
                onClose={closeToast}
                message={toastMessage}
                type={toastType}
                icon={toastIcon}
            />

            {/* Data table of desktops (expandable rows → DesktopDetails) */}
            <DataTable
                key={refreshCount}
                data={{ nodes: desktops }}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                expandable={true} // enables row expansion to show DesktopDetails
                handleSingleDeletion={handleSingleDeletion}
                setSelectedIds={setSelectedIds}
                openToast={openToast}
                setRefreshCount={setRefreshCount}
            />
        </React.Fragment>
    );
}
