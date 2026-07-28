import { useState, useCallback } from 'react';

/**
 * Manages a local editable copy of od.config.
 * The API now returns od.config as a flat JSON object — all keys
 * (e.g. "server.socket_host", "desktop.pod", "logging"...) live at the top level.
 */
export function useOdConfig() {
  const [config, setConfig] = useState(() => {
    const raw = window.ABCDESKTOP_OD_CONFIG;
    return raw ? JSON.parse(JSON.stringify(raw)) : null;
  });
  const [isDirty, setIsDirty] = useState(false);

  /** Read a top-level key from the config */
  const get = useCallback((key) => config?.[key], [config]);

  /** Write a top-level key in the config */
  const set = useCallback((key, value) => {
    setConfig(prev => {
      const next = JSON.parse(JSON.stringify(prev ?? {}));
      next[key] = value;
      return next;
    });
    setIsDirty(true);
  }, []);


  /** Re-load state from whatever is currently in window (useful after the fetch completes) */
  const reinitialize = useCallback(() => {
    const raw = window.ABCDESKTOP_OD_CONFIG;
    if (raw) {
      setConfig(JSON.parse(JSON.stringify(raw)));
      setIsDirty(false);
    }
  }, []);

  /** Discard local edits and reset to the last fetched config */
  const reset = useCallback(() => {
    const raw = window.ABCDESKTOP_OD_CONFIG;
    setConfig(raw ? JSON.parse(JSON.stringify(raw)) : null);
    setIsDirty(false);
  }, []);

  return { config, get, set, reset, reinitialize, isDirty };
}
