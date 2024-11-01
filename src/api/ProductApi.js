import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 카테고리별 상품을 가져오는 API
export const getProductsByCategory = createAsyncThunk(
    'products/getByCategory',
    async (category, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/category/${category}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
                }
            });
            return response.data.item; // ResponseDto의 item에 접근
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
); 

// 검색하면 키워드와 조건을 통해 상품을 가져오는 API
export const getBoards = createAsyncThunk(
    'products/getBoards',
    async (searchObj, thunkApi) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/auction`, {
                // headers: {
                //     Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
                // },
                params: {
                    searchCondition: searchObj.searchCondition,
                    searchKeyword: searchObj.searchKeyword,
                    page: searchObj.page
                }
            });
            console.log("받아온 데이터:", response.data);
            return response.data;
        } catch(e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);