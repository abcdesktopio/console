import React, { useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import ApiKeyModal from "./ApiKeyModal";
import BanModal from "./BanModal";
import GenericToast from "./GenericToast";
import DataTable from "./DataTable";
import { useApiKey } from "../hooks/useApiKey";
import { useEntityManager } from "../hooks/useEntityManager";
import { getBanData, deleteBan } from "../services/banService";
import { FAILURE_ICON, SUCCESS_ICON } from "../services/toastIconsClasses";

export function BanPageTemplate({banType}){
    const seriviceParam = banType === "IP" ? "ipaddr" : "login";

    const {
        showApiKeyModal,
        handleSetKey,
        closeApiKeyModal,
        apiKeyValid
    } = useApiKey();

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

    const handleSingleDeletion = async (id) => {
        try{
            await deleteBanById(id, seriviceParam);
            openToast(`Successfully unbanned user with ${seriviceParam} ${id}`, "success", SUCCESS_ICON);
        }
        catch(err){
            openToast(err.message, "danger", FAILURE_ICON);
        }
    }

    const [showBanModal, setShowBanModal] = useState(false);

    const openBanModal = () => setShowBanModal(true);
    const closeBanModal = () => {
        setShowBanModal(false);
        setRefreshCount((count) => count + 1);
    }

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
                if(selectedIds.length > 0){
                    selectedIds.forEach((id) => {
                        handleSingleDeletion(id);
                    });
                    setSelectedIds([]);
                }
                else{
                    openToast(`Please select at least one ${banType} to delete`, "warning", FAILURE_ICON);
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

    return(
        <React.Fragment> 
            <Toolbar buttons={Toolbarbuttons} title={`Ban ${banType}`} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <ApiKeyModal show={showApiKeyModal} onClose={closeApiKeyModal} onSetKey={handleSetKey} />
            <BanModal show={showBanModal} onClose={closeBanModal} banType={banType} openToast={openToast}/>
            <GenericToast show={showToast}  onClose={closeToast} message={toastMessage} type={toastType} icon={toastIcon}/>
            <DataTable 
                data={{ nodes: bannedUsers }} 
                loading={loading} 
                error={error} 
                searchTerm={searchTerm} 
                handleSingleDeletion={handleSingleDeletion} 
                setSelectedIds={setSelectedIds}
                openToast={openToast}
            />
        </React.Fragment>
    )
}