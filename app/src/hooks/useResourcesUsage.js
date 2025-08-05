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
    timerRef.current = setInterval(async () => {
      try {
        const curr = containerId
          ? await getContainerResourcesUsage(desktopId, containerId)
          : await getDesktopResourcesUsage(desktopId);

        if (prevStatsRef.current) {
          const deltaUsageNano = +curr["cpuacct.usage"] - +prevStatsRef.current["cpuacct.usage"];
          const deltaSec = +curr.timestamp - +prevStatsRef.current.timestamp;
          const quota = +curr["cpu.cfs_quota_us"];
          const cpuLimit = quota > 0 ? quota / 100000 : 1;
          let cpuPercent = 0;
          if (deltaSec > 0 && cpuLimit > 0) {
            cpuPercent = (deltaUsageNano / 1e9) / (deltaSec * cpuLimit) * 100;
          }
          const ramMo = +curr["memory.usage_in_bytes"] / 1024 / 1024;
          if (series.length === 0) setRamLimit(+curr["memory.limit_in_bytes"] / 1024 / 1024);

          setSeries(prev => [
            ...prev.slice(-59),
            {
              timestamp: new Date(curr.timestamp * 1000).toLocaleTimeString(),
              cpu: Math.round(cpuPercent * 10) / 10,
              ram: Math.round(ramMo),
            },
          ]);
        }
        prevStatsRef.current = curr;
      } catch (error) {
        if (openToast) openToast(error.message, "danger", "FAILURE_ICON");
      }
    }, 3000);

    return () => clearInterval(timerRef.current);
  }, [desktopId, containerId]); 

  return { series, ramLimit };
}
