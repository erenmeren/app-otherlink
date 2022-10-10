import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getSiteById } from "./api";
import { ISite } from "@/interfaces/site";

export interface SiteState {
  item?: ISite;
  status?: "idle" | "loading" | "failed";
  message?: string;
}

const initialState: SiteState = {
  status: "idle",
};

export const getSiteAsync = createAsyncThunk(
  "site/getSiteById",
  async (id: string) => {
    const response = await getSiteById(id);
    return response.item;
  }
);

export const siteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    addSite: (state, action: PayloadAction<ISite>) => {
      state.item = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSiteAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSiteAsync.rejected, (state) => {
        state.status = "failed";
        state.message = "Upps!!!";
      })
      .addCase(getSiteAsync.fulfilled, (state, { payload }) => {
        // console.log("girdi sonunda");
        // console.log(payload);
        state.status = "idle";
        state.item = payload;
        // console.log(state.site);
      });
  },
});

export const { addSite } = siteSlice.actions;

export default siteSlice.reducer;
