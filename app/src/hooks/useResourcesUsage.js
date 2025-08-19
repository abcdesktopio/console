import { useEffect, useRef, useState } from "react";
import { getResourcesUsage } from "../services/desktopsService";

// Custom hook for tracking resource usage (CPU & RAM)
// of a Desktop or specific container inside it.
// Collects data periodically (every 5s), computes CPU %
export function useResourcesUsage(desktopId, objectType = null, objectId = null, openToast = null) {
  // Time series of resource usage { timestamp, cpu, ram }
  const [series, setSeries] = useState([]);

  // Memory limit in MB (used to bound RAM Y-axis in chart)
  const [ramLimit, setRamLimit] = useState(0);

  // Store previous stats to compute CPU usage difference over time
  const prevStatsRef = useRef(null);

  // Reference to the polling interval timer, so it can be cleared cleanly
  const timerRef = useRef(null);

  useEffect(() => {
    // Reset data each time desktop/container changes
    setSeries([]);
    prevStatsRef.current = null;
  
    const fetchAndUpdateStats = async () => {
      try {
        // Fetch metrics from backend service
        // - If objectId provided => fetch metrics for a particular container inside the desktop
        const curr = objectId
          ? await getResourcesUsage(desktopId, objectType, objectId)
          : null;
  
        if (!curr) return;
        const keys = Object.keys(curr);
        if (keys.length === 0) return;
  
        // Extract key metrics from response (raw cgroup metrics or similar)
        const cpuacct_usage = keys.includes("cpuacct.usage") ? curr["cpuacct.usage"] : 0;
        const cpu_cfs_quota_us = keys.includes("cpu.cfs_quota_us") ? curr["cpu.cfs_quota_us"] : 0;
        const memory_usage_in_bytes = keys.includes("memory.usage_in_bytes") ? curr["memory.usage_in_bytes"] : 0;
        const memory_limit_in_bytes = keys.includes("memory.limit_in_bytes") ? curr["memory.limit_in_bytes"] : 0;
  
        // Only compute deltas if we have a previous measurement
        if (prevStatsRef.current) {
          // CPU usage in nanoseconds since last measurement
          const deltaUsageNano = +cpuacct_usage - +prevStatsRef.current["cpuacct.usage"];
          // Time delta in seconds
          const deltaSec = +curr.timestamp - +prevStatsRef.current.timestamp;

          // Compute CPU "limit" based on quota (microseconds per 100ms => divide by 100000)
          const quota = +cpu_cfs_quota_us;
          const cpuLimit = quota > 0 ? quota / 100000 : 1; 

          let cpuPercent = 0;
          if (deltaSec > 0 && cpuLimit > 0) {
            // Convert nanoseconds usage into seconds, then normalize by time & cpuLimit
            cpuPercent = (deltaUsageNano / 1e9) / (deltaSec * cpuLimit) * 100;
          }

          // RAM usage in MB
          const ramMo = +memory_usage_in_bytes / 1024 / 1024;

          // On first datapoint, capture RAM limit in MB (once)
          if (series.length === 0) {
            setRamLimit(+memory_limit_in_bytes / 1024 / 1024);
          }
  
          // Add new point to time series,
          // keep only last 60 points (so 5 minutes history at 5s interval)
          setSeries(prev => [
            ...prev.slice(-59),
            {
              timestamp: new Date(curr.timestamp * 1000).toLocaleTimeString(), // convert epoch -> local time
              cpu: cpuPercent > 0 ? Math.round(cpuPercent * 10) / 10 : 0,         // rounded to 0.1%
              ram: ramMo > 0 ? Math.round(ramMo) : 0,                             // rounded MB
            },
          ]);
        }

        // Save last metrics as baseline for next cycle
        prevStatsRef.current = curr;

      } catch (error) {
        // Any error → show toast if parent handler available
        if (openToast) openToast(error.message, "danger", "FAILURE_ICON");
      }
    };
  
    // First call immediately on load
    fetchAndUpdateStats();
  
    // Then schedule polling every 5 seconds
    timerRef.current = setInterval(fetchAndUpdateStats, 5000);
  
    // Cleanup interval on unmount or dependency change
    return () => clearInterval(timerRef.current);
  }, [desktopId, objectId]); // re-run when desktop/container changes

  // Expose to consumers: series for chart, memory limit for Y-axis bounds
  return { series, ramLimit };
}
