import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import React, {useCallback, useState} from "react";
import {Button} from "@mui/material";
import CheckBoxComponent from "../../components/join/CheckBoxComponent";
import {oauthLogin} from "../../apis/member/memberApis";
import {useDispatch, useSelector} from "react-redux";

const JoinBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 1200px;
    margin: 0 auto;
    height: 100vh;
    position: relative;
    padding: 60px 0; /* 상하 여백 추가 */
`;

const StyledText = styled.div`
    font-size: 3rem;
    color: #444;
    text-align: left;
    margin-top: 30px;
    border-bottom: 2px solid #444;
    padding-bottom: 5px;
`;

const HeaderTitle = styled.div`
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
`

const JoinToken = () => {

    const navi = useNavigate();
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(Array(7).fill(false));
    const [checkedIndices, setCheckedIndices] = useState([]);

    const handleCheckedChange = (indices) => {
        setCheckedIndices(indices);
    };

    const oauthToken = useSelector(state => state.memberSlice.oauthToken);

    const handleJoin = () => {

        // 체크된 인덱스가 [0, 1, 2, 3, 4]인지 확인
        const requiredIndices = [0, 1, 2, 3, 4];

        // checkedIndices가 requiredIndices와 정확히 일치하는지 확인
        const isValid = requiredIndices.every(index => checkedIndices.includes(index));

        if (isValid) {
            const userConfirmed = window.confirm("회원가입을 하시겠습니까?");

            if (userConfirmed) {
                // dispatch(oauthLogin());
                navi('/'); // 조건이 충족되면 네비게이션
            } else {
                return;
            }

        } else {
            alert("필수 항목에 동의해 주세요."); // 조건이 충족되지 않으면 경고 메시지
        }
    };


    return (
        <JoinBlock>
            <HeaderTitle>회원가입</HeaderTitle>
            <CheckBoxComponent checked={checked} setChecked={setChecked} onCheckedChange={handleCheckedChange}/>
            <Button
                name="transport-button"
                variant="contained"
                type="submit"
                style={{
                    backgroundColor: "#2196F3",
                    height: "43px",
                    fontSize: "18px",
                    width: "300px",
                    marginTop: "30px"
                }}

                id='emailButton'
                onClick={handleJoin}
            >
                회원가입
            </Button>
        </JoinBlock>
    );
};

export default JoinToken;