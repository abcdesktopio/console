import React, { useState, useEffect } from "react";
import Toolbar from "../components/Toolbar";
import ApiKeyModal from "../components/ApiKeyModal";
import AddAppModal from "../components/AddAppModal";
import AppInfosModal from "../components/AppInfosModal";
import GenericToast from "../components/GenericToast";
import DataTable from "../components/DataTable";
import { useApiKey } from "../hooks/useApiKey";
import { useEntityManager } from "../hooks/useEntityManager";
import { getApps, deleteApp} from "../services/appsService";
import { FAILURE_ICON, SUCCESS_ICON } from "../services/toastIconsClasses";

export function Apps(){
    
    const {
        showApiKeyModal,
        handleSetKey,
        closeApiKeyModal,
        apiKeyValid,
        apiKeyErrorMessage
    } = useApiKey();

    const {
        items: apps,
        selectedIds,
        setSelectedIds,
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
    } = useEntityManager(getApps, deleteApp, apiKeyValid);

    const handleSingleDeletion = async (id) => {
        try{
            await deleteAppById(id);
            openToast("App deleted successfully", "success", SUCCESS_ICON);
        }
        catch(err){
            openToast(err.message, "danger", FAILURE_ICON);
        }
    }

    const [showAddAppModal, setShowAddAppModal] = useState(false);
    const [showAppInfosModal, setShowAppInfosModal] = useState(false);
    const [appInfosId, setAppInfosId] = useState(null);

    const openAddAppModal = () => setShowAddAppModal(true);
    const closeAddAppModal = () => {
        setShowAddAppModal(false);
        setRefreshCount((count) => count + 1);
    }

    const openAppInfosModal = () => setShowAppInfosModal(true);
    const closeAppInfosModal = () => setShowAppInfosModal(false);

    const handleAppInfos = (id) => {
        setAppInfosId(id);
        openAppInfosModal();
    }

    const Toolbarbuttons = [
        {
            id: "add-app-button",
            className: "btn btn-primary",
            iconClass: "bi bi-plus-circle",
            ariaLabel: "Add App",
            onClick: () => openAddAppModal()
        },
        {
            id: "delete-app-button",
            className: "btn btn-danger",
            iconClass: "bi bi-trash3",
            ariaLabel: "Delete App(s)",
            onClick: () => {
                if(selectedIds.length > 0){
                    selectedIds.forEach((id) => {
                        handleSingleDeletion(id);
                    });
                    setSelectedIds([]);
                }
                else{
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
        },
        {
            id: "github-button",
            className: "btn btn-light",
            iconClass: "bi bi-github",
            ariaLabel: "go to github",
            onClick: () => window.open("https://github.com/abcdesktopio/images/tree/main/artifact/")
        }
    ];

    return(
        <React.Fragment>   
            <Toolbar buttons={Toolbarbuttons} title="Applications" searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <ApiKeyModal show={showApiKeyModal} onClose={closeApiKeyModal} onSetKey={handleSetKey} apiKeyValid={apiKeyValid} apiKeyErrorMessage={apiKeyErrorMessage} openToast={openToast}/>
            <AddAppModal show={showAddAppModal} onClose={closeAddAppModal} openToast={openToast}/>
            <AppInfosModal show={showAppInfosModal} onClose={closeAppInfosModal} appId={appInfosId} />
            <GenericToast show={showToast}  onClose={closeToast}message={toastMessage} type={toastType} icon={toastIcon}/>
            <DataTable 
                data={{ nodes: apps }} 
                loading={loading} 
                error={error} 
                searchTerm={searchTerm} 
                handleSingleDeletion={handleSingleDeletion} 
                setSelectedIds={setSelectedIds} 
                openToast={openToast}
                handleAppInfos={handleAppInfos}
            />
        </React.Fragment>
    )
}