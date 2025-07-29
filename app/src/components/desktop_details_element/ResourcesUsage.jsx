import React, { useEffect, useRef, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Spinner, Card } from "react-bootstrap";
import { getResourcesUsage } from "../../services/desktopsService";
import { FAILURE_ICON } from "../../utils/toastIconsClasses";

export default function ResourcesUsage({ id, openToast }) {
  const [series, setSeries] = useState([]);
  const prevStatsRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setSeries([]);
    prevStatsRef.current = null;

    timerRef.current = setInterval(async () => {
      try {
        const curr = await getResourcesUsage(id);
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

          setSeries((prev) => [
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
        openToast(error.message, "danger", FAILURE_ICON);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [id]);

  return (
    <Card>
      <Card.Header> <b className="desktop-detail-section-title">Resources Usage</b> </Card.Header>
      <Card.Body>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
              <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="cpu"
                orientation="left"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                label={{ value: "CPU (%)", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="ram"
                orientation="right"
                label={{ value: "RAM (Mo)", angle: 90, position: "insideRight" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line
                yAxisId="cpu"
                type="monotone"
                dataKey="cpu"
                stroke="#8884d8"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                yAxisId="ram"
                type="monotone"
                dataKey="ram"
                stroke="#82ca9d"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
          {series.length === 0 && <div className="loading-spinner"> <Spinner animation="border" variant="primary" /> <span className="loading-text">Loading resources usage data...</span> </div>}
        </div>
      </Card.Body>
    </Card>
  );
}
