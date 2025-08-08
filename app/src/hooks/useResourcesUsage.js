import { useEffect, useRef, useState } from "react";
import { getDesktopResourcesUsage, getContainerResourcesUsage } from "../services/desktopsService";

export function useResourcesUsage(desktopId, containerId = null, openToast = null) {
  const [series, setSeries] = useState([]);
  const [ramLimit, setRamLimit] = useState(0);
  const prevStatsRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setSeries([]);
    prevStatsRef.current = null;
  
    const fetchAndUpdateStats = async () => {
      try {
        const curr = containerId
          ? await getContainerResourcesUsage(desktopId, containerId)
          : null;
  
        if (!curr) return;
        var keys = Object.keys(curr);
        if (keys.length === 0) return;
  
        var cpuacct_usage = keys.includes("cpuacct.usage") ? curr["cpuacct.usage"] : 0;
        var cpu_cfs_quota_us = keys.includes("cpu.cfs_quota_us") ? curr["cpu.cfs_quota_us"] : 0;
        var memory_usage_in_bytes = keys.includes("memory.usage_in_bytes") ? curr["memory.usage_in_bytes"] : 0;
        var memory_limit_in_bytes = keys.includes("memory.limit_in_bytes") ? curr["memory.limit_in_bytes"] : 0;
  
        if (prevStatsRef.current) {
          const deltaUsageNano = +cpuacct_usage - +prevStatsRef.current["cpuacct.usage"];
          const deltaSec = +curr.timestamp - +prevStatsRef.current.timestamp;
          const quota = +cpu_cfs_quota_us;
          const cpuLimit = quota > 0 ? quota / 100000 : 1;
          let cpuPercent = 0;
          if (deltaSec > 0 && cpuLimit > 0) {
            cpuPercent = (deltaUsageNano / 1e9) / (deltaSec * cpuLimit) * 100;
          }
          const ramMo = +memory_usage_in_bytes / 1024 / 1024;
          if (series.length === 0) setRamLimit(+memory_limit_in_bytes / 1024 / 1024);
  
          setSeries(prev => [
            ...prev.slice(-59),
            {
              timestamp: new Date(curr.timestamp * 1000).toLocaleTimeString(),
              cpu: cpuPercent > 0 ? Math.round(cpuPercent * 10) / 10 : 0,
              ram: ramMo > 0 ? Math.round(ramMo) : 0,
            },
          ]);
        }
        prevStatsRef.current = curr;
      } catch (error) {
        if (openToast) openToast(error.message, "danger", "FAILURE_ICON");
      }
    };
  
    // first call at loading 
    fetchAndUpdateStats();
  
    // then call every 5s
    timerRef.current = setInterval(fetchAndUpdateStats, 5000);
  
    // cleanup
    return () => clearInterval(timerRef.current);
  }, [desktopId, containerId]);

  return { series, ramLimit };
}
