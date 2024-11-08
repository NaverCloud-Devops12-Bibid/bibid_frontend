import React, { useEffect, useState } from 'react';

function SellerInfoPopup({ auction, handleClosePopup }) {

    const sellerIndex = auction.memberIndex;

    // 백엔드에서 sellerInfoDto와 memberDto 정보를 가져오는 API 호출을 가정
    const [sellerInfoDto, setSellerInfoDto] = useState({});
    const [seller, setSeller] = useState({});

    useEffect(() => {
        // 여기서 sellerIndex를 이용해 API 호출 후 sellerInfoDto와 seller 데이터를 가져옴
        // 예시 API 호출:
        // fetch(`/api/seller/${sellerIndex}`).then(res => res.json()).then(data => {
        //   setSellerInfoDto(data.sellerInfoDto);
        //   setSeller(data.sellerDto);
        // });

        // 백엔드 완성 전, 일단은 더미 데이터로 작업
        setSellerInfoDto({
            businessName: '크라운비드',
            businessClassification: '일반사업자',
            businessRegistrationNum: '875-12-10239',
            exponent: '홍길동',
            businessLocation: '경기도 안양시 만안구 시민대로 35번길 41(안양동)'
        });

        setSeller({
            memberId: 'Crown_Bid',
            memberPnum: '010-9578-2453',
            email: 'bit@bitcamp.com'
        });

    }, [sellerIndex]);

    return (
        <div className="SAoverlay">
            <div className="SAsellerInfoPopup">
                <h2>판매자 정보 더보기</h2>
                <table>
                    <tbody>
                    <tr>
                        <td>판매자 아이디</td>
                        <td>{seller.memberId}</td>
                    </tr>
                    <tr>
                        <td>전화번호</td>
                        <td>{seller.memberPnum}</td>
                    </tr>
                    <tr>
                        <td>E-mail</td>
                        <td>{seller.email}</td>
                    </tr>
                    <tr>
                        <td>상호명</td>
                        <td>{sellerInfoDto.businessName}</td>
                    </tr>
                    <tr>
                        <td>사업자 구분</td>
                        <td>{sellerInfoDto.businessClassification}</td>
                    </tr>
                    <tr>
                        <td>사업
                            자등록번호</td>
                        <td>{sellerInfoDto.businessRegistrationNum}</td>
                    </tr>
                    <tr>
                        <td>대표자</td>
                        <td>{sellerInfoDto.exponent}</td>
                    </tr>
                    <tr>
                        <td>영업 소재지</td>
                        <td>{sellerInfoDto.businessLocation}</td>
                    </tr>
                    </tbody>
                </table>
                <button className='SAendOkbttn' onClick={handleClosePopup}>확인</button>
            </div>
        </div>
    );
}

export default SellerInfoPopup;