import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getDocumentById } from "./api";
import { IDocumentResponse } from "@/interfaces/document";

const initialState: IDocumentResponse = {
  status: "idle",
};

export const getDocumentAsync = createAsyncThunk(
  "document/getDocumentById",
  async (id: string) => {
    const response = await getDocumentById(id);
    return response;
  }
);

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    clearDocument: (state) => {
      state.item = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDocumentAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDocumentAsync.rejected, (state) => {
        state.status = "failed";
        state.message = "Upps!!!";
      })
      .addCase(getDocumentAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.item = payload.item;
        state.message = payload.message;
      });
  },
});

export const { clearDocument } = documentSlice.actions;

// export const selectSite = (state: AppState) => state.site;

export default documentSlice.reducer;
