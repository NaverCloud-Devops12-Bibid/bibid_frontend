import React from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./store/store";
import NotificationInitializer from "./context/NotificationInitializer";
import {Route, Routes} from "react-router-dom";

import Mainpage from "./pages/Mainpage";
import Search from "./pages/search/Search";
import Category from "./pages/Category";
import SpecialAuction from "./pages/SpecialAuction";
import Layout from "./pages/Layout";
import JoinRoutes from "./routes/etc2_join/JoinRoutes";
import Login from "./pages/etc2_login/Login";
import RegistrationForm from "./pages/RegistrationForm";
import FindMember from "./pages/etc2_find/FindMember";
import CategoryItemDetail from "./components/categoryItemDetail/CategoryItemDetail";
import DetailedCategory_All from "./pages/DetailedCategory_All";
import DetailedCategory_Hob from "./pages/DetailedCategory_Hob";
import DetailedCategory_Clothing from "./pages/DetailedCategory_Clothing";
import DetailedCategory_Book from "./pages/DetailedCategory_Book";
import DetailedCategory_Art from "./pages/DetailedCategory_Art";
import DetailedCategory_Elec from "./pages/DetailedCategory_Elec";
import DetailedCategory_Pic from "./pages/DetailedCategory_Pic";
import DetailedCategory_Antique from "./pages/DetailedCategory_Antique";
import ModifyPasswd from "./pages/etc2_find/ModifyPasswd";
import KakaoLogin from "./pages/oauth2test/KakaoLogin";
import Mypage_UserInfo from "./pages/mypage/Mypage_UserInfo";
import Mypage_AuctionInfo from "./pages/mypage/Mypage_AuctionInfo";
import Mypage_Wallet from "./pages/mypage/Mypage_Wallet";
import Mypage_UserInfoModify from "./pages/mypage/Mypage_UserInfoModify";
import Mypage_AuctionManagement from "./pages/mypage/Mypage_AuctionManagement";
import NaverLogin from "./pages/oauth2test/NaverLogin";
import KakaoLogout from "./pages/oauth2test/KakaoLogout";
import GoogleLogin from "./pages/oauth2test/GoogleLogin";
import FailPage from "./pages/Fail";
import TestApi2 from "./components/SpecialAuction/TestApi2";
import MemberInitializer from "./context/MemberInitializer";
import WidgetCheckoutPage from "./pages/payment/WidgetCheckout";
import WidgetSuccessPage from "./pages/payment/WidgetSuccess";

function App() {
    const persiststore = persistStore(store);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persiststore}>
                <NotificationInitializer />
                <MemberInitializer />
                <Routes>
                    {/* OAuth Routes */}
                    <Route path="/auth/kakao/callback" element={<KakaoLogin />} />
                    <Route path="/auth/kakao/logout" element={<KakaoLogout />} />
                    <Route path="/auth/naver/callback" element={<NaverLogin />} />
                    <Route path="/auth/google/callback" element={<GoogleLogin />} />

                    {/* Login and Registration Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/find" element={<FindMember />} />
                    <Route path="/modifyPasswd" element={<ModifyPasswd />} />

                    {/* Main Layout */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Mainpage />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/specialAuction" element={<SpecialAuction />} />
                        <Route path="/registration/*" element={<RegistrationForm />} />
                        <Route path="/category" element={<Category />} />
                        <Route path="/category/all" element={<DetailedCategory_All />} />
                        <Route path="/category/clothing" element={<DetailedCategory_Clothing />} />
                        <Route path="/category/hob" element={<DetailedCategory_Hob />} />
                        <Route path="/category/book" element={<DetailedCategory_Book />} />
                        <Route path="/category/art" element={<DetailedCategory_Art />} />
                        <Route path="/category/elec" element={<DetailedCategory_Elec />} />
                        <Route path="/category/pic" element={<DetailedCategory_Pic />} />
                        <Route path="/category/antique" element={<DetailedCategory_Antique />} />
                        <Route path="/category-itemdetail/:auctionNumber" element={<CategoryItemDetail />} />
                        <Route path="/testApi" element={<TestApi2/>} />
                        <Route path="join/*" element={<JoinRoutes />} />

                        {/* Mypage Routes */}
                        <Route path="/mypage/userinfo/" element={<Mypage_UserInfo />} />
                        <Route path="/mypage/userInfo/modify" element={<Mypage_UserInfoModify />} />
                        <Route path="/mypage/auctioninfo/" element={<Mypage_AuctionInfo />} />
                        <Route path="/mypage/wallet/" element={<Mypage_Wallet />} />
                        <Route path="mypage/auctionmanagement/" element={<Mypage_AuctionManagement/>}/>
                    </Route>

                    {/* Widget Routes */}
                    <Route path="/widget/checkout" element={<WidgetCheckoutPage />} />
                    <Route path="/widget/success" element={<WidgetSuccessPage />} />

                    {/* Fail Page */}
                    <Route path="/fail" element={<FailPage />} />
                </Routes>
            </PersistGate>
        </Provider>
    );
}

export default App;
