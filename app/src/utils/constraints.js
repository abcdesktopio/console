import { parseOdConfig } from './odConfigParser';

// URL prefix
export const PREFIX = window.location.origin;

// Get configMap constraints
fetch('console/config/versionConfig.json')
  .then(r => r.json())
  .then(data => {
    window.ABCDESKTOP_VERSION = data.ABCDESKTOP_VERSION;
    window.ABCDESKTOP_APPLICATIONS_LIST_URL = data.ABCDESKTOP_APPLICATIONS_LIST_URL;
});

fetch('console/config/od.config')
  .then(r => r.text())
  .then(text => {
    window.ABCDESKTOP_OD_CONFIG = parseOdConfig(text);
  });