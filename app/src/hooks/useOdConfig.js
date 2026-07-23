import { useState, useCallback } from 'react';

/**
 * Manages a local editable copy of the parsed od.config.
 * All config keys live under config.global (the [global] section).
 */
export function useOdConfig() {
  const [config, setConfig] = useState(() => {
    const raw = window.ABCDESKTOP_OD_CONFIG;
    return raw ? JSON.parse(JSON.stringify(raw)) : null;
  });
  const [isDirty, setIsDirty] = useState(false);

  /** Read a top-level key from the global section */
  const get = useCallback((key) => config?.global?.[key], [config]);

  /** Write a top-level key in the global section */
  const set = useCallback((key, value) => {
    setConfig(prev => {
      const next = JSON.parse(JSON.stringify(prev ?? {}));
      if (!next.global) next.global = {};
      next.global[key] = value;
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
