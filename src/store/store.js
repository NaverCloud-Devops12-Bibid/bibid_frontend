import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storageSession from 'redux-persist/es/storage/session';
import specialAuctionSlice from "../slices/specialAuction/specialAuctionSlice";
import searchSlice from '../slices/search/searchSlice';
import memberSlice from "../slices/member/memberSlice";
import notificationSlice from '../slices/notification/notificationSlice';
import paymentSlice from "../slices/payment/paymentSlice";


const reducers = combineReducers({
    memberSlice,
    specialAuctionSlice ,
    paymentSlice,
    auction: searchSlice,
    notificationSlice,
});

const persistConfig = {
    key: 'root',
    storage: storageSession,
    whitelist: ['memberSlice', 'notification'],
};

const persistreducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistreducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, PAUSE, PERSIST, PURGE, REHYDRATE, REGISTER]
            }
        })
});
