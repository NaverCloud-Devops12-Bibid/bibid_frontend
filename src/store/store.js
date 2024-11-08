import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE} from 'redux-persist';
import storageSession from 'redux-persist/es/storage/session';
import specialAuctionSlice from "../slices/specialAuction/specialAuctionSlice";
import searchSlice from '../slices/search/searchSlice';
import memberSlice from "../slices/member/memberSlice";
import notificationSlice from '../slices/notification/notificationSlice';

const reducers = combineReducers({
    memberSlice,
    specialAuctionSlice ,
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
