import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import ApiKeyModal from "../components/modals/ApiKeyModal";
import GenericToast from "../components/generic/GenericToast";
import Toolbar from "../components/Toolbar";
import OdConfigPreviewModal from "../components/modals/OdConfigPreviewModal";

import GeneralSection       from "../components/config/GeneralSection";
import AuthSection          from "../components/config/AuthSection";
import ExecuteClassesSection from "../components/config/ExecuteClassesSection";
import DesktopSection       from "../components/config/DesktopSection";
import DesktopPodSection    from "../components/config/DesktopPodSection";
import FrontendSection      from "../components/config/FrontendSection";
import ControllersSection   from "../components/config/ControllersSection";
import LoggingSection       from "../components/config/LoggingSection";

import { useConfig }      from "../hooks/useConfig";
import { usePermitRequest } from "../hooks/usePermitRequest";
import { useToasts }        from "../hooks/useToasts";

import { postConfig, commitConfig, triggerRollout } from "../services/configService";
import { FAILURE_ICON, SUCCESS_ICON, INFO_ICON } from "../utils/toastIconsClasses";

import "../styles/configEditor.css";

export function Config() {

    // ---------- API KEY MANAGEMENT ----------
    const {
        showApiKeyModal,
        handleSetKey,
        closeApiKeyModal,
        permitRequestErrorMessage
    } = usePermitRequest();

    // ---------- TOAST MANAGEMENT ----------
    const {
        showToast,
        toastMessage,
        toastType,
        toastIcon,
        openToast,
        closeToast
    } = useToasts(permitRequestErrorMessage);

    // ---------- CONFIG STATE ----------
    const { config, get, set, reset, reinitialize, isDirty, loading, error } = useConfig();

    // ---------- MODAL STATE ----------
    const [showPreview, setShowPreview] = useState(false);

    const handleConfigPush = async () => {
        try {
            await postConfig(config);
            openToast("Config successfully pushed to API", "success", SUCCESS_ICON);
            await commitConfig(); // update the configmap 
            openToast("Configmap updated", "info", INFO_ICON);
            await triggerRollout(); // trigger a rollout of the new config
            openToast("Pyos rollout restart triggered", "info", INFO_ICON);
        } catch (err) {
            openToast(`Failed to push config: ${err.message}`, "danger", FAILURE_ICON);
        }
    };
    // ---------- TOOLBAR ----------
    const toolbarButtons = [
        {
            id: "preview-config-button",
            className: "btn btn-secondary",
            iconClass: "bi bi-eye",
            ariaLabel: "Preview config JSON",
            onClick: () => setShowPreview(true),
        },
        {
            id: "reset-config-button",
            className: isDirty ? "btn btn-outline-warning" : "btn btn-outline-secondary",
            iconClass: "bi bi-arrow-counterclockwise",
            ariaLabel: "Discard changes",
            onClick: () => { reset(); openToast("Changes discarded", "info", INFO_ICON); },
        },
        {
            id: "push-config-button",
            className: "btn btn-primary",
            iconClass: "bi bi-cloud-upload",
            ariaLabel: "Push config to API",
            onClick: async () => {
                try {
                    await handleConfigPush();
                    reinitialize(); // re-fetch the fresh config from the API
                } catch (err) {
                    openToast(`Failed to push config: ${err.message}`, "danger", FAILURE_ICON);
                }
            },
        },
    ];

    // ---------- LOADING ----------
    if (loading || !config) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: "60vh" }}>
                <div className="text-center text-muted">
                    <div className="spinner-border mb-3" style={{ color: "#6dc5ef" }} />
                    <p>Loading od.config…</p>
                </div>
            </div>
        );
    }

    // ---------- ERROR ----------
    if (error) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: "60vh" }}>
                <div className="text-center text-danger">
                    <i className="bi bi-exclamation-triangle fs-1 d-block mb-3" />
                    <p>Failed to load od.config: {error}</p>
                </div>
            </div>
        );
    }

    // ---------- RENDER ----------
    return (
        <React.Fragment>
            <Toolbar
                id="toolbar-config"
                buttons={toolbarButtons}
                title={isDirty ? "Config ●" : "Config"}
            />

            <Tab.Container defaultActiveKey="general">
                <div className="config-editor-layout">

                    {/* Tab bar */}
                    <Nav variant="tabs" className="config-tabs">
                        <Nav.Item>
                            <Nav.Link eventKey="general">
                                <i className="bi bi-gear me-1" />General
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="controllers">
                                <i className="bi bi-sliders me-1" />Controllers
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="auth">
                                <i className="bi bi-shield-lock me-1" />Auth
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="executeclasses">
                                <i className="bi bi-cpu me-1" />Execute Classes
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="desktop">
                                <i className="bi bi-display me-1" />Desktop
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="pod">
                                <i className="bi bi-box me-1" />Pod
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="frontend">
                                <i className="bi bi-layout-sidebar me-1" />Frontend
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="logging">
                                <i className="bi bi-journal-text me-1" />Logging
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {/* Tab content */}
                    <Tab.Content className="tab-content">
                        <Tab.Pane eventKey="general">
                            <GeneralSection get={get} set={set} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="controllers">
                            <ControllersSection get={get} set={set} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="auth">
                            <AuthSection get={get} set={set} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="executeclasses">
                            <ExecuteClassesSection get={get} set={set} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="desktop">
                            <DesktopSection get={get} set={set} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="pod">
                            <DesktopPodSection get={get} set={set} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="frontend">
                            <FrontendSection get={get} set={set} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="logging">
                            <LoggingSection get={get} set={set} />
                        </Tab.Pane>
                    </Tab.Content>
                </div>
            </Tab.Container>

            {/* Modals */}
            <ApiKeyModal
                show={showApiKeyModal}
                onClose={closeApiKeyModal}
                onSetKey={handleSetKey}
            />
            <OdConfigPreviewModal
                show={showPreview}
                onClose={() => setShowPreview(false)}
                config={config}
                openToast={openToast}
            />
            <GenericToast
                show={showToast}
                onClose={closeToast}
                message={toastMessage}
                type={toastType}
                icon={toastIcon}
            />
        </React.Fragment>
    );
}

