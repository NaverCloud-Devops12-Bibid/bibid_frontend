import {createSlice} from '@reduxjs/toolkit';
import {join} from '../../apis/etc2_memberapis/memberApis';

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        memberIndex: 0,

    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(join.fulfilled, (state, action) => {
            alert(`${action.payload.memberId}님 가입 축하드립니다.`);
            return state;
        });
        builder.addCase(join.rejected, (state, action) => {
            alert('에러가 발생했습니다.');
            return state;

        });
    }});

export default paymentSlice.reducer;