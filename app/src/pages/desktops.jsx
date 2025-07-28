import React, { useState, useEffect } from "react";
import Toolbar from "../components/Toolbar";
import ApiKeyModal from "../components/modals/ApiKeyModal";
import GenericToast from "../components/GenericToast";
import DataTable from "../components/DataTable";
import { useApiKey } from "../hooks/useApiKey";
import { useEntityManager } from "../hooks/useEntityManager";
import { getDesktops, deleteDesktop } from "../services/desktopsService";
import { FAILURE_ICON, SUCCESS_ICON } from "../services/toastIconsClasses";

export function Desktops(){

    const {
        showApiKeyModal,
        handleSetKey,
        closeApiKeyModal,
        apiKeyValid,
        apiKeyErrorMessage
    } = useApiKey();

    const {
        items: desktops,
        selectedIds,
        setSelectedIds,
        setRefreshCount,
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
      } = useEntityManager(getDesktops, deleteDesktop, apiKeyValid);

    const handleSingleDeletion = async (id) => {
        try{
            await deleteDesktopById(id);
            openToast("Desktop deleted successfully", "success", SUCCESS_ICON);
        }
        catch(err){
            openToast(err.message, "danger", FAILURE_ICON);
        }
    }
    
    const Toolbarbuttons = [
        {
            id: "delete-desktop-button",
            className: "btn btn-danger",
            iconClass: "bi bi-trash3",
            ariaLabel: "Delete desktop(s)",
            onClick: () => {
                if(selectedIds.length > 0){
                    selectedIds.forEach((id) => {
                        handleSingleDeletion(id);
                    });
                    setSelectedIds([]);
                }
                else{
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

    return(
        <React.Fragment>   
            <Toolbar buttons={Toolbarbuttons} title="Desktops" searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <ApiKeyModal show={showApiKeyModal} onClose={closeApiKeyModal} onSetKey={handleSetKey} apiKeyValid={apiKeyValid} apiKeyErrorMessage={apiKeyErrorMessage} openToast={openToast}/>
            <GenericToast show={showToast}  onClose={closeToast} message={toastMessage} type={toastType} icon={toastIcon}/>
            <DataTable 
                data={{ nodes: desktops }} 
                loading={loading} 
                error={error} 
                searchTerm={searchTerm} 
                expandable={true} 
                handleSingleDeletion={handleSingleDeletion} 
                setSelectedIds={setSelectedIds}
                openToast={openToast}
            />
        </React.Fragment>
    )
}