import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserInfo } from "./api";
import { IUserInfo } from "@/interfaces/user";
import { IDocument } from "@/interfaces/document";
import { ILoyalty } from "@/interfaces/loyalty";
// import Loyalty from "@/components/loyalty";

export interface UserInfoState {
  item?: IUserInfo;
  status?: "idle" | "loading" | "failed";
  message?: string;
}

const initialState: UserInfoState = {
  status: "idle",
};

export const getUserInfoAsync = createAsyncThunk(
  "user/getUserInfo",

  async (tokens: any) => {
    const { role, token } = tokens;
    const response = await getUserInfo(role, token);

    return response.item;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserInfo: (state, action: PayloadAction<IUserInfo>) => {
      state.item = action.payload;
    },
    deleteUserInfo: (state) => {
      state.item = undefined;
    },
    addDocumentToUser: (state, action: PayloadAction<IDocument>) => {
      state.item?.documents?.push(action.payload);
    },
    // update loyalty page's loyalties
    updateLoyalty: (state, action: PayloadAction<ILoyalty>) => {
      if (state.item?.loyalties?.length === 0)
        state.item?.loyalties?.push(action.payload);
      else
        state.item?.loyalties?.map((loyalty) => {
          if (loyalty.siteId === action.payload.siteId)
            loyalty.numberOfVisit = action.payload.numberOfVisit;
        });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfoAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserInfoAsync.rejected, (state) => {
        state.status = "failed";
        state.message = "Upps!!!";
      })
      .addCase(getUserInfoAsync.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.item = payload;
      });
  },
});

export const { addUserInfo, deleteUserInfo, addDocumentToUser, updateLoyalty } =
  userSlice.actions;

export default userSlice.reducer;
