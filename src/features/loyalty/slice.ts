import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { newVisit } from "./api";
import { ILoyalty, ILoyaltyResponse } from "@/interfaces/loyalty";

const initialState: ILoyaltyResponse = {
  status: "idle",
  item: undefined,
  message: "",
};

export const newVisitAsync = createAsyncThunk(
  "loyalty/newVisit",
  async ({ siteId, documentId, role, idToken }: any) => {
    const response = await newVisit(siteId, documentId, role, idToken);
    return response;
  }
);

export const loyaltySlice = createSlice({
  name: "loyalty",
  initialState,
  reducers: {
    addLoyalty: (state, action) => {
      state = action.payload;
    },
    // update loyalty in site page
    updateSiteLoyalty: (state, action: PayloadAction<ILoyalty>) => {
      if (state.item?.siteId === action.payload.siteId)
        state.item = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newVisitAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(newVisitAsync.rejected, (state) => {
        state.status = "failed";
        state.message = "Upps!!!";
      })
      .addCase(newVisitAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.item = payload.item;
        state.message = payload.message;
      });
  },
});

export const { addLoyalty, updateSiteLoyalty } = loyaltySlice.actions;

export default loyaltySlice.reducer;
