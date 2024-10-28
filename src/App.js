import Mainpage from './pages/Mainpage';
import Search from './pages/search/Search';
import Category from './pages/Category';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SpecialAuction from './pages/SpecialAuction';
import Layout from './pages/Layout';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {store} from './store/store';
import {PersistGate} from 'redux-persist/integration/react';
import JoinRoutes from "./routes/etc2_join/JoinRoutes";
import Login from "./pages/etc2_login/Login";
import Mypage_info from './components/Mypage/Mypage_info';
import Mypage_info_update from './components/Mypage/Mypage_info_update';
import Mypage_bids_history from './components/Mypage/Mypage_bids_history';
import Mypage_wallet_management from './components/Mypage/Mypage_wallet_management';
import Mypage_bids_progress from './components/Mypage/Mypage_bids_progress';
import Mypage_qna from './components/Mypage/Mypage_qna';
import RegistrationForm from './pages/RegistrationForm';
import useFCM from './util/useFCM';
import FindMember from './pages/etc2_find/FindMember';
import CategoryItemDetail from './components/categoryItemDetail/CategoryItemDetail';
import CheckNcloudApi from './components/SpecialAuction/CheckNcloudApi';
import DetailedCategory_All from './pages/DetailedCategory_All';
import DetailedCategory_Hob from './pages/DetailedCategory_Hob';
import DetailedCategory_Clothing from './pages/DetailedCategory_Clothing';
import DetailedCategory_Book from './pages/DetailedCategory_Book';
import DetailedCategory_Art from './pages/DetailedCategory_Art';
import DetailedCategory_Elec from './pages/DetailedCategory_Elec';
import DetailedCategory_Pic from './pages/DetailedCategory_Pic';
import DetailedCategory_Antique from './pages/DetailedCategory_Antique';
import ModifyPasswd from "./pages/etc2_find/ModifyPasswd";
import Loginpage from "./pages/oauth2test/Loginpage";
import KakaoLogin from "./pages/oauth2test/KakaoLogin";
import Mypage_UserInfo from './pages/mypage/Mypage_UserInfo';
import Mypage_AuctionInfo from './pages/mypage/Mypage_AuctionInfo';
import Mypage_Wallet from './pages/mypage/Mypage_Wallet';
import Mypage_UserInfoModify from './pages/mypage/Mypage_UserInfoModify';
import NaverLogin from "./pages/oauth2test/NaverLogin";
import KakaoLogout from "./pages/oauth2test/KakaoLogout";
import GoogleLogin from "./pages/oauth2test/GoogleLogin";
import React from "react";
import { NotificationProvider } from './context/NotificationContext';

function App() {

    const persiststore = persistStore(store);

    return (
        <NotificationProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persiststore}>
                    <Routes>
                        <Route path="/loginpage" element={<Loginpage/>} />
                        <Route path="/auth/kakao/callback" element={<KakaoLogin/>} />
                        <Route path="/auth/kakao/logout" element={<KakaoLogout/>} />
                        <Route path="/auth/naver/callback" element={<NaverLogin/>}/>
                        <Route path="/auth/google/callback" element={<GoogleLogin/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/find' element={<FindMember/>}/>
                        <Route path='/modifyPasswd' element={<ModifyPasswd/>}/>
                        <Route path='/' element={<Layout/>}>
                            <Route index element={<Mainpage/>}/>
                            <Route path='/search' element={<Search/>}/>
                            <Route path='/specialAuction' element={<SpecialAuction/>}/>
                            <Route path='/registration/*' element={<RegistrationForm/>}/>
                            <Route path='/category' element={<Category/>}/>
                            <Route path='/category/all' element={<DetailedCategory_All/>}/>
                            <Route path='/category/clothing' element={<DetailedCategory_Clothing/>}/>
                            <Route path='/category/hob' element={<DetailedCategory_Hob/>}/>
                            <Route path='/category/book' element={<DetailedCategory_Book/>}/>
                            <Route path='/category/art' element={<DetailedCategory_Art/>}/>
                            <Route path='/category/elec' element={<DetailedCategory_Elec/>}/>
                            <Route path='/category/pic' element={<DetailedCategory_Pic/>}/>
                            <Route path='/category/antique' element={<DetailedCategory_Antique/>}/>
                            <Route path='/category-itemdetail/:auctionNumber' element={<CategoryItemDetail/>}/>
                            <Route path='/checkNcloudApi' element={<CheckNcloudApi/>}/>
                            {/* mypage 에서 지정한 mui 버튼 스타일 충돌 */}
                            <Route path="join/*" element={<JoinRoutes/>}/>
                            <Route path='/mypage/userinfo/' element={<Mypage_UserInfo/>}/>
                            <Route path='/mypage/userInfo/modify' element={<Mypage_UserInfoModify/>}/>
                            <Route path='/mypage/auctioninfo/' element={<Mypage_AuctionInfo/>}/>
                            <Route path='/mypage/wallet/' element={<Mypage_Wallet/>}/>
                                {/* <Route path='info' element={<Mypage_info/>}/>
                                <Route path='update' element={<Mypage_info_update/>}/>
                                <Route path='bids_history' element={<Mypage_bids_history/>}/>
                                <Route path='wallet_management' element={<Mypage_wallet_management/>}></Route>
                                <Route path='bids_progress' element={<Mypage_bids_progress/>}></Route>
                                <Route path='qna' element={<Mypage_qna/>}></Route>
                            </Route> */}
                        </Route>
                    </Routes>
                </PersistGate>
            </Provider>
        </NotificationProvider>
    );
}

export default App;


