import React, { useState, useEffect } from "react";
import Toolbar from "../components/Toolbar";
import ApiKeyModal from "../components/ApiKeyModal";
import AddAppToDockModal from "../components/AddAppToDockModal";
import DataTable from "../components/DataTable";
import GenericToast from "../components/GenericToast";
import { useApiKey } from "../hooks/useApiKey";
import { useEntityManager } from "../hooks/useEntityManager";
import { getUsers, addOrRemoveAppToDock} from "../services/webfrontService";
import { FAILURE_ICON, SUCCESS_ICON } from "../services/toastIconsClasses";

export function Webfront(){
    const {
        showApiKeyModal,
        handleSetKey,
        closeApiKeyModal,
        apiKeyValid
    } = useApiKey();

    const {
        items: users,
        selectedIds,
        setSelectedIds,
        setRefreshCount,
        searchTerm,
        setSearchTerm,
        loading,
        error,
        deleteById: deleteAppFromDock,
        showToast,
        toastMessage,
        toastType,
        toastIcon,
        openToast,
        closeToast
    } = useEntityManager(getUsers, addOrRemoveAppToDock, apiKeyValid);

    const handleSingleDeletion = async (appName) => {
        try{
            await deleteAppFromDock(appName, "remove");
            openToast(`Successfully removed ${appName} from dock`, "success", SUCCESS_ICON);
        }
        catch(err){
            openToast(err.message, "danger", FAILURE_ICON);
        }
    }

    const [showAddDockAppModal, setShowAddDockAppModal] = useState(false);

    const openDockAppModal = () => setShowAddDockAppModal(true);
    const closeDockAppModal = () => {
        setShowAddDockAppModal(false);
        setRefreshCount((count) => count + 1);
    }

    return(
        <React.Fragment> 
            <Toolbar title="Webfront" searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <ApiKeyModal show={showApiKeyModal} onClose={closeApiKeyModal} onSetKey={handleSetKey} />
            <AddAppToDockModal show={showAddDockAppModal} onClose={closeDockAppModal} openToast={openToast}/>
            <GenericToast show={showToast}  onClose={closeToast} message={toastMessage} type={toastType} icon={toastIcon}/>
            <DataTable 
                data={{ nodes: users }} 
                loading={loading} 
                error={error} 
                searchTerm={searchTerm} 
                expandable={true} 
                handleSingleDeletion={handleSingleDeletion} 
                setSelectedIds={setSelectedIds} 
                openToast={openToast}
                openDockAppModal={openDockAppModal} 
            />
        </React.Fragment>
    )
}