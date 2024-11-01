import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMember, checkLogin } from "../apis/etc2_memberapis/memberApis"; // fetchMember 액션 임포트
import axios from "axios";

function MemberInitializer() {

    const memberIndex = useSelector(state => state.memberSlice.memberIndex);

    const dispatch = useDispatch();

    useEffect(() => {
        const initializeMember = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/auth/checkLogin`, {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.item === "ROLE_USER") { 
                    dispatch(fetchMember());
                }
            } catch (error) {
                console.warn("로그인되지 않은 상태입니다.", error);
            }
        };

        initializeMember();
    }, [dispatch, memberIndex]);

    return null;
}

export default MemberInitializer;
