import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssets,
  fetchAssetChart,
  updateAssets,
} from "../store/CryptoSlice";
import MiniChart from "./Minicharts";

const CryptoDashboard = () => {
  const dispatch = useDispatch();
  const { assets, status, error } = useSelector((state) => state.crypto);

  useEffect(() => {
    dispatch(fetchAssets()).then((action) => {
      if (action.payload) {
        action.payload.forEach((asset) => {
          dispatch(fetchAssetChart(asset.id));
        });
      }
    });

    const interval = setInterval(() => {
      dispatch(updateAssets());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (status === "loading")
    return <div className="text-center p-4">Loading...</div>;
  if (status === "failed") return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full text-sm text-left table-auto">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th>#</th>
            <th>Logo</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>1h %</th>
            <th>24h %</th>
            <th>7d %</th>
            <th>Market Cap</th>
            <th>24h Volume</th>
            <th>Circulating Supply</th>
            <th>Chart</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <tr key={asset.id} className="border-b">
              <td>{index + 1}</td>
              <td>
                <img src={asset.image} alt={asset.name} className="w-6 h-6" />
              </td>
              <td>{asset.name}</td>
              <td>{asset.symbol.toUpperCase()}</td>
              <td>${asset.current_price.toLocaleString()}</td>
              <td
                className={
                  asset.price_change_percentage_1h_in_currency > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {asset.price_change_percentage_1h_in_currency?.toFixed(2)}%
              </td>
              <td
                className={
                  asset.price_change_percentage_24h_in_currency > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {asset.price_change_percentage_24h_in_currency?.toFixed(2)}%
              </td>
              <td
                className={
                  asset.price_change_percentage_7d_in_currency > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {asset.price_change_percentage_7d_in_currency?.toFixed(2)}%
              </td>
              <td>${asset.market_cap.toLocaleString()}</td>
              <td>${asset.total_volume.toLocaleString()}</td>
              <td>{asset.circulating_supply?.toLocaleString()}</td>
              <td className="w-80">
                <MiniChart prices={asset.chartPrices} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoDashboard;
