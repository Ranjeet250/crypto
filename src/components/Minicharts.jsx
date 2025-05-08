import React from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const MiniChart = ({ prices }) => {
  const chartData = prices.map((price, index) => ({ index, price }));

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
export default MiniChart;
