import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const COIN_API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=1h,24h,7d";

const CHART_API = (id) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`;

export const fetchAssets = createAsyncThunk("crypto/fetchAssets", async () => {
  const response = await axios.get(COIN_API_URL);
  return response.data;
});

export const fetchAssetChart = createAsyncThunk(
  "crypto/fetchAssetChart",
  async (id) => {
    const response = await axios.get(CHART_API(id));
    return {
      id,
      prices: response.data.prices.map(([timestamp, price]) => price),
    };
  }
);

export const updateAssets = createAsyncThunk(
  "crypto/updateAssets",
  async () => {
    const response = await axios.get(COIN_API_URL);
    return response.data;
  }
);

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: {
    assets: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assets = action.payload.map((asset) => ({
          ...asset,
          chartPrices: [],
        }));
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAssetChart.fulfilled, (state, action) => {
        const asset = state.assets.find((a) => a.id === action.payload.id);
        if (asset) asset.chartPrices = action.payload.prices;
      })
      .addCase(updateAssets.fulfilled, (state, action) => {
        state.assets = action.payload.map((newAsset) => {
          const old = state.assets.find((a) => a.id === newAsset.id);
          return old ? { ...old, ...newAsset } : newAsset;
        });
      });
  },
});

export default cryptoSlice.reducer;
