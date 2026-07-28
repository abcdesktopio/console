import { useState, useCallback, useEffect } from 'react';
import { getConfig } from '../services/configService';

/**
 * Manages a local editable copy of od.config.
 */
export function useConfig() {

  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [config, setConfig] = useState(null);

  const [isDirty, setIsDirty] = useState(false);

  // -------- DATA LOADING --------
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const current_config = await getConfig();

      setConfig(current_config);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load the config once on mount
  useEffect(() => {
    load();
  }, [load]);

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
    load();
    setIsDirty(false);
  }, []);

  /** Discard local edits and reset to the last fetched config */
  const reset = useCallback(() => {
    load();
    setIsDirty(false);
  }, []);

  return { config, get, set, reset, reinitialize, isDirty, loading, error };
}
