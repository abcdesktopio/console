import React from "react";
import { Spinner } from "react-bootstrap";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from "recharts";


// Component to render CPU and RAM usage for a container/desktop.
// Uses Recharts for visualization: two lines (CPU% and RAM MB) over time.
// Displays spinner when no series data is available yet.
export default function ResourcesUsageChart({ series, ramLimit }) {

  // If no time series has been collected yet, display a loading spinner.
  if (!series || series.length === 0) {
    return (
      <div 
        style={{ 
          width: "100%", 
          height: 300, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center"
        }}
      >
        <Spinner 
          animation="border" 
          role="status" 
          variant="secondary" 
          width={50} 
          height={50}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Render chart when series has data
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart 
          data={series} 
          margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
        >
          {/* X Axis is timestamp (collected every 5s) */}
          <XAxis 
            dataKey="timestamp"
            tick={{ fontSize: 12 }}
            label={{ 
              value: "Time (every 5 s)", 
              angle: 0, 
              position: "bottom" 
            }}
          />

          {/* CPU % axis (left) */}
          <YAxis
            yAxisId="cpu"
            orientation="left"
            domain={[0, 100]} // CPU always 0–100
            tickFormatter={(value) => `${value}%`}
            label={{ 
              value: "CPU (%)", 
              angle: -90, 
              position: "insideLeft" 
            }}
            tick={{ fontSize: 12 }}
          />

          {/* RAM MB axis (right) */}
          <YAxis
            yAxisId="ram"
            orientation="right"
            domain={[0, ramLimit]} // RAM limit varies depending on container
            label={{ 
              value: "RAM (Mo)", 
              angle: 90, 
              position: "insideRight" 
            }}
            tick={{ fontSize: 12 }}
          />

          {/* Tooltips and legend */}
          <Tooltip />
          <Legend verticalAlign="top" height={36} />

          {/* CPU line */}
          <Line
            yAxisId="cpu"
            type="monotone"
            dataKey="cpu"
            stroke="#8884d8"
            dot={false}
            isAnimationActive={false}
          />

          {/* RAM line */}
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
    </div>
  );
}
