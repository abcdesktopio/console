import React from "react";
import { Spinner } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ResourcesUsageChart({ series, ramLimit}) {

    return (
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
                domain={[0, ramLimit]}
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
    );
}