// URL prefix
export const PREFIX = window.location.origin;

// Get configMap constraints
fetch('console/config/versionConfig.json')
  .then(r => r.json())
  .then(data => {
    window.ABCDESKTOP_VERSION = data.ABCDESKTOP_VERSION;
    window.ABCDESKTOP_APPLICATIONS_LIST_URL = data.ABCDESKTOP_APPLICATIONS_LIST_URL;
});

// The API now returns the od.config content directly as JSON (no more text parsing needed)
fetch('API/manager/configure')
  .then(r => r.json())
  .then(data => {
    window.ABCDESKTOP_OD_CONFIG = data;
  });
