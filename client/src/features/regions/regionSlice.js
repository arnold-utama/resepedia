import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../helpers/http-client";

const initialState = {
  list: [],
};

const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchRegions.pending, () => {
        console.log("Fetching regions...");
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        console.log("Failed to fetch regions", action.error);
      });
  },
});

export const fetchRegions = createAsyncThunk(
  "region/fetchRegions",
  async () => {
    const { data } = await api.get("/regions");
    return data;
  }
);

export default regionSlice.reducer;
