import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAuctionData = createAsyncThunk(
  'specialAuction/getAuctionData',
  async (auctionType, thunkApi) => {
    try {

      const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/specialAuction/list`, {
        params: {
          auctionType: auctionType,
        }
      });

      console.log("getAuctionData: ", response.data);
      return response.data;
    } catch (e) {
      return thunkApi.rejectWithValue(e);
    }
  }
);



