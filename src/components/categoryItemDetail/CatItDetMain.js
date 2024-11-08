import React, {useEffect, useState} from 'react';
import '../../css/CategoryItemDetail.css';
import Modal from 'react-modal';
// material ui 아이콘 불러오기
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import {IconButton} from '@mui/material';
import axios from 'axios';
import PlusIcon from '../../images/+_icon.svg';
import MinusIcon from '../../images/-_icon.svg';
import loadingImage from '../../images/로딩화면.gif'
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import { fetchMember } from '../../apis/member/memberApis';


const CatItDetMain = ({
                          auctionItem,
                          auctionBidInfo,
                          seller,
                          biddingMember,
                          infoExtension,
                          sellerDetailInfo,
                          auctionImages
                      }) => {

    const [mainImage, setMainImage] = useState(null);
    const [thumbnails, setThumbnails] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const dispatch = useDispatch();

    // auctionImages가 업데이트될 때 mainImage를 설정
    useEffect(() => {
        if (auctionImages && auctionImages.length > 0) {
            setMainImage(auctionImages[0]);
            setThumbnails(auctionImages.slice(1));
        }
    }, [auctionImages]);

    const handlePrevClick = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (currentIndex < thumbnails.length - 4) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleThumbnailClick = (clickedImage) => {
        setThumbnails((prevThumbnails) => {
            const updatedThumbnails = prevThumbnails.filter((img) => img !== clickedImage);
            return [mainImage, ...updatedThumbnails];
        });
        setMainImage(clickedImage);
    };

    // 판매자 정보 더 보기 모달창
    const [sellerModalOpen, setSellerModalOpen] = useState(false);
    const navi = useNavigate();

    const checkLoginState = useSelector(state => state.memberSlice.checkLoginState);
    const openSellerModal = () => {
        if (!checkLoginState) {
            alert("로그인 후 사용하시기 바랍니다.");
            navi("/login");
        } else {
            setSellerModalOpen(true);
        }
    };
    const closeSellerModal = () => {
        setSellerModalOpen(false);
    };

    // 입찰 기록 보기 모달창
    const [biddingRecordModalOpen, setBiddingRecordModalOpen] = useState(false);
    const openBiddingRecordModal = () => {
        setBiddingRecordModalOpen(true);
    };
    const closeBiddingRecordModal = () => {
        setBiddingRecordModalOpen(false);
    };


    // 희망 입찰가 상태 관리
    const [bidAmount, setBidAmount] = useState(0);

    useEffect(() => {
        // auctionItem이 업데이트될 때마다 bidAmount를 설정
        if (auctionItem && auctionItem.startingPrice) {
            setBidAmount(parseInt(infoExtension[1]) + parseInt(auctionItem.bidIncrement));
        }
    }, [auctionItem]); // auctionItem이 변경될 때마다 이 코드가 실행됨

    // 입찰가 증가 함수
    const increaseBid = (bidIncrement) => {
        setBidAmount((prevBid) => prevBid + bidIncrement);
    };
    // 입찰가 감소 함수
    const decreaseBid = (bidIncrement) => {
        setBidAmount((prevBid) => Math.max(prevBid - bidIncrement, parseInt(infoExtension[1]) + parseInt(bidIncrement)));
    };


    // 입찰하기 모달창
    const [biddingNowModalOpen, setBiddingNowModalOpen] = useState(false);


    const openBiddingNowModal = () => {
        if (!checkLoginState) {
            alert("로그인 후 사용하시기 바랍니다.");
            navi("/login");
        } else {
            setBiddingNowModalOpen(true);
        }
    };
    const closeBiddingNowModal = () => {
        setBiddingNowModalOpen(false);
    };

    const nowBiddingInfo = {
        userBiddingType: "bid",
        name: "auctionItem.productName",
        category: "아이템의 카테고리",
        bidPrice: bidAmount,
        purchaseFee: (bidAmount / 10), // 구매 수수료 는 구매가의 10퍼센트
    };
    // const totalPrice = nowBiddingInfo.bidPrice + nowBiddingInfo.purchaseFee;
    const totalPrice = parseInt(bidAmount + bidAmount / 10);

    // 입찰하기 데이터 전송 함수
    const handleBidNow = () => {
        if (!checkLoginState) {
            alert("로그인 후 사용하시기 바랍니다.");
            navi("/login");
        } else {
            const biddingData = {
                userBiddingType: "bid",
                userBiddingItemName: auctionItem.productName.toLocaleString(),
                userBiddingCategory: auctionItem.category.toLocaleString(),
                userBiddingPrice: bidAmount,
                userBiddingTotalPrice: totalPrice
            };


            // 백엔드로 데이터 전송
            axios.post(`${process.env.REACT_APP_BACK_SERVER}/auctionDetail/category-item-detail/${auctionItem.auctionIndex}`, biddingData, {
                headers: {
                    'Content-Type': 'application/json', // 요청의 콘텐츠 타입을 JSON으로 지정
                },
                withCredentials: true
            })
                .then((response) => {
                    alert('입찰이 성공적으로 전송되었습니다.');
                    dispatch(fetchMember());
                    closeBiddingNowModal();
                    window.location.href = `/category-itemdetail/${auctionItem.auctionIndex}`;
                })
                .catch((error) => {
                    console.error('Error:', error); // 오류 발생 시 오류 메시지 출력
                    alert('이미 최고 입찰자입니다.');
                    closeBiddingNowModal();
                });
        }
    };


    // 즉시구매가 설정
    const [buyNowPrice, setBuyNowPrice] = useState(0);

    useEffect(() => {
        // auctionItem이 업데이트될 때마다 bidAmount를 설정
        if (auctionItem && auctionItem.instantPurchasePrice) {
            setBuyNowPrice(auctionItem.instantPurchasePrice);
        }
    }, [auctionItem]); // auctionItem이 변경될 때마다 이 코드가 실행됨

    // 즉시구매 모달창
    const [buyingNowModalOpen, setBuyingNowModalOpen] = useState(false);


    const openBuyingNowModal = () => {
        if (!checkLoginState) {
            alert("로그인 후 사용하시기 바랍니다.");
            navi("/login");
        } else {
            setBuyingNowModalOpen(true);
        }
    };
    const closeBuyingNowModal = () => {
        setBuyingNowModalOpen(false);
    };
    // 즉시구매 모달의 아이템 현재 정보
    const nowBuyingInfo = {
        userBiddingType: "buyNow",
        name: "auctionItem.productName",
        category: "아이템의 카테고리",
        buyNowPrice: buyNowPrice,
        buyNowpurchaseFee: parseInt(buyNowPrice / 10),
    };
    const paymentAccount = parseInt(nowBuyingInfo.buyNowPrice + nowBuyingInfo.buyNowpurchaseFee);

    // 즉시 구매 데이터 전송 함수
    const handleBuyNow = () => {
        const buyingData = {
            userBiddingType: "buyNow",
            userBiddingItemName: auctionItem.productName,
            userBiddingCategory: auctionItem.category,
            userBiddingPrice: nowBuyingInfo.buyNowPrice,
            userBiddingTotalPrice: paymentAccount,
        };


        // 백엔드로 데이터 전송
        axios.post(`${process.env.REACT_APP_BACK_SERVER}/auctionDetail/category-item-detail/${auctionItem.auctionIndex}`, buyingData, {
            headers: {
                'Content-Type': 'application/json', // 요청의 콘텐츠 타입을 JSON으로 지정
            }
        })
            .then((response) => {
                alert('즉시 구매가 성공적으로 전송되었습니다.');
                closeBuyingNowModal();
            })
            .catch((error) => {
                console.error('Error:', error); // 오류 발생 시 오류 메시지 출력
            });
    };

    if (!auctionItem || !auctionBidInfo || !seller) {
        return <div className='loading_image'><img src={loadingImage}></img></div>; // 데이터를 받기 전에 로딩 처리
    }

    // 남은시간 에서 사용할 남은 시간을 계산하는 함수
    const now = new Date();
    const endDate = new Date(auctionItem.endingLocalDateTime);
    const diffTime = endDate - now; // 남은 시간 (밀리초)

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    // console.log("auctionBidInf0000 : " + auctionBidInfo[0].auctionInfoIndex);
    // console.log("auctionBidInf1111 : " + auctionBidInfo[1].auctionInfoIndex);
    // console.log("biddingMember 0 " + biddingMember[0].nickname);
    // console.log("biddingMember 1 " + biddingMember[1].nickname);
    // console.log("allImages : ", auctionImages);

    return (
        <div className="CID-item-block">
            <div className="CID-bid-item-container">

                <div className='CID-bid-item-container-left'>
                    {/* 이미지 섹션 */}
                    <div className="CID-image-section">
                        <img src={mainImage} alt="Main Image" className="CID-main-image"/>
                    </div>
                    <div className="CID-thumbnail-container">
                        <button
                            className="prev-button"
                            onClick={handlePrevClick}
                            disabled={currentIndex === 0}
                        >
                            &lt;
                        </button>

                        {thumbnails.slice(currentIndex, currentIndex + 4).map((imageUrl, index) => (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`Image ${index + 1}`}
                                className="CID-thumbnail"
                                onClick={() => handleThumbnailClick(imageUrl)}
                            />
                        ))}

                        <button
                            className="next-button"
                            onClick={handleNextClick}
                            disabled={currentIndex >= thumbnails.length - 4}
                        >
                            &gt;
                        </button>
                    </div>

                    {/* 판매자 섹션 */}
                    <div className="CID-merchant-section">
                        <div className="CID-merchant-info">
                            <p>판매자: {seller.nickname}</p>
                            <p>{seller.nickname}의 등록된 경매: {parseInt(infoExtension[2])}건</p>
                        </div>
                        <div className="CID-merchant-link">
                            <button className='CID-seller-more-info-hvr' onClick={openSellerModal}>
                                <p>판매자 {seller.nickname} 의 정보 더보기</p></button>
                            {/* 첫 번째 모달 - open-seller-modal : 판매자 정보 더 보기 */}
                            <Modal
                                isOpen={sellerModalOpen}
                                onRequestClose={closeSellerModal}
                                className="CID-seller-modal-content"
                                overlayClassName="CID-seller-modal-overlay"
                            >
                                {/* 모달 상단 부분 */}
                                <div className="CID-seller-modal-header">
                                    {/* <img src="../img/tmp-profile-icon.png" alt="판매자 아이콘" className="CID-seller-modal-icon" /> */}
                                    <h2>판매자 정보 더보기</h2>
                                    {/* <button className="CID-seller-modal-close" onClick={closeModal}>X</button> */}
                                </div>
                                <table className="CID-seller-modal-table">
                                    <tbody>
                                    <tr>
                                        <th>판매자 아이디</th>
                                        <td>{seller.memberId}</td>
                                    </tr>
                                    <tr>
                                        <th>전화번호</th>
                                        <td>{seller.memberPnum}</td>
                                    </tr>
                                    <tr>
                                        <th>E-mail</th>
                                        <td>{seller.email}</td>
                                    </tr>
                                    <tr>
                                        <th>상호명</th>
                                        <td>{sellerDetailInfo.businessName}</td>
                                    </tr>
                                    <tr>
                                        <th>사업자 구분</th>
                                        <td>{sellerDetailInfo.businessClassification}</td>
                                    </tr>
                                    <tr>
                                        <th>통판매업 신고</th>
                                        <td>{sellerDetailInfo.salesDeclaration}</td>
                                    </tr>
                                    <tr>
                                        <th>사업자등록번호</th>
                                        <td>{sellerDetailInfo.businessRegistrationNum}</td>
                                    </tr>
                                    <tr>
                                        <th>대표자</th>
                                        <td>{sellerDetailInfo.exponent}</td>
                                    </tr>
                                    <tr>
                                        <th>영업 소재지</th>
                                        <td>{sellerDetailInfo.businessLocation}</td>
                                    </tr>
                                    </tbody>
                                </table>

                                {/* 확인 버튼 */}
                                <div className='CID-seller-modal-confirm-button-box'>
                                    <button className="CID-seller-modal-confirm-button" onClick={closeSellerModal}>확인
                                    </button>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>

                {/* 입찰 섹션 */}
                <div className="CID-bid-section">
                    <div className="CID-bid-title">{auctionItem.productName}</div>

                    <div className='CID-bid-container'>
                        <div className='CID-bid-cotents-title'>
                            <h2>현재가: </h2>
                            <p>남은시간: </p>
                            <p>경매번호: </p>
                            <p>시작가: </p>
                            <p>입찰기록: </p>
                            <p>입찰단위: </p>
                            <p>입찰 희망가: </p>
                            <p>예상 구매가: </p>
                        </div>
                        <div className='CID-bid-cotents'>
                            <h2>{parseInt(infoExtension[1]).toLocaleString()} 원</h2>
                            <h3>{days}일 {hours}시간 {minutes}분 {seconds} 초</h3>
                            <p>No.{auctionItem.auctionIndex}</p>
                            <p>{parseInt(auctionItem.startingPrice).toLocaleString()} 원</p>
                            <p>{parseInt(infoExtension[0]).toLocaleString()}회
                                <span className="CID-hover-link" onClick={openBiddingRecordModal}>    [기록보기]</span>
                            </p>

                            {/* 두 번째 모달 - bidding-record-modal : 입찰 기록 보기 */}
                            <Modal
                                isOpen={biddingRecordModalOpen}
                                onRequestClose={closeBiddingRecordModal}
                                className="CID-bidding-record-modal-content"
                                overlayClassName="CID-bidding-record-modal-overlay"
                            >
                                <h2>입찰기록내역</h2>
                                <table className="CID-bidding-record-table">
                                    <thead>
                                    <tr>
                                        <th>입찰일시</th>
                                        <th>입찰자 닉네임</th>
                                        <th>입찰금액</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {auctionBidInfo.map((record, index) => (
                                        <tr key={index}>
                                            <td>{new Intl.DateTimeFormat('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            }).format(new Date(record.bidTime))}
                                            </td>
                                            <td>{biddingMember[index].nickname}</td>
                                            <td>{record.bidAmount}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div className="CID-bidding-record-pagination">
                                    <span>1</span>
                                </div>
                                <button className="CID-bidding-record-confirm-button"
                                        onClick={closeBiddingRecordModal}>확인
                                </button>
                            </Modal>

                            <p>{parseInt(auctionItem.bidIncrement).toLocaleString()}원</p>
                            <div className="CID-bid-input-wrapper">

                                <div className="CID-bid-input">
                                    <input
                                        type="text"
                                        id="bid-amount"
                                        value={parseInt(bidAmount).toLocaleString()}
                                        readOnly/>
                                </div>
                                원
                                {/* 백엔드 로직 : bidInfo테이블의 최신입찰가 */}
                                <div className="CID-bid-buttons-vertical">
                                    <button className="CID-bid-plus-button" sx={{width: "10px"}}
                                            onClick={() => increaseBid(Number(auctionItem.bidIncrement))}>
                                        <img src={PlusIcon}></img>
                                    </button>
                                    <button className="CID-bid-minus-button"
                                            onClick={() => decreaseBid(auctionItem.bidIncrement)}>
                                        <img src={MinusIcon}></img>
                                    </button>
                                </div>

                            </div>
                            <div className='CID-bid-expected-price'>
                                <h3>{parseInt(totalPrice).toLocaleString()} 원</h3>
                                <p>(입찰 희망가 {nowBiddingInfo.bidPrice.toLocaleString()} 원 +
                                    구매수수료 {parseInt(nowBiddingInfo.purchaseFee).toLocaleString()} 원)</p>
                            </div>
                        </div>
                    </div>

                    {/* 백엔드 로직 : bidInfo테이블의 최신입찰가 */}
                    {/* <div className="CID-divider"></div> */}

                    {/* 버튼 */}
                    <div className="CID-bid-buttons">
                        {/* 세 번째 모달 bidding-now-modal */}
                        <button className="CID-bid-button" onClick={openBiddingNowModal}><p>입찰하기</p></button>
                        <Modal
                            isOpen={biddingNowModalOpen}
                            onRequestClose={closeBiddingNowModal}
                            className="CID-bidding-now-modal-content"
                            overlayClassName="CID-bidding-now-modal-overlay"
                        >
                            <h2 className="CID-bidding-now-modal-title">입찰 {auctionItem.auctionStatus}</h2>
                            <div className="CID-bidding-now-modal-body">
                                <div className="CID-bidding-now-modal-image">
                                    <img src={auctionImages[0]} alt={`${auctionItem.productName}`}/>
                                </div>
                                <div className="CID-bidding-now-modal-details">
                                    <h3>{auctionItem.productName} 경매</h3>
                                    <p><strong className='bidding-now-modal-details-p'>경매 분류
                                        : </strong> {auctionItem.category}</p>
                                    <p><strong className='bidding-now-modal-details-p'>입찰 희망가 : </strong> <span
                                        className="CID-highlight-red">{nowBiddingInfo.bidPrice.toLocaleString()} 원</span>
                                    </p>
                                    <p><strong className='bidding-now-modal-details-p'>구매 예상가
                                        : </strong> {parseInt(totalPrice).toLocaleString()} 원</p>
                                    <p className='bidding-now-modal-price-info'>(입찰
                                        희망가 {nowBiddingInfo.bidPrice.toLocaleString()} 원 +
                                        구매수수료 {parseInt(nowBiddingInfo.purchaseFee).toLocaleString()} 원)</p>
                                </div>
                            </div>
                            <div className='CID-bidding-now-modal-bid-button-box'>
                                <button className="CID-bidding-now-modal-bid-button" onClick={handleBidNow}>
                                    입찰하기
                                </button>
                            </div>
                        </Modal>

                        {/* 네 번째 모달 buying-now-modal */}
                        {auctionItem.instantPurchasePrice !== null && (
                            <button className="CID-bid-button buy-button" onClick={openBuyingNowModal}>
                                <p>{nowBuyingInfo.buyNowPrice.toLocaleString()} 원으로 즉시 구매</p>
                            </button>
                        )}
                        <Modal
                            isOpen={buyingNowModalOpen}
                            onRequestClose={closeBuyingNowModal}
                            className="CID-bidding-now-modal-content"
                            overlayClassName="CID-bidding-now-modal-overlay"
                        >
                            <h2 className="CID-bidding-now-modal-title">구매 {auctionItem.auctionStatus}</h2>
                            <div className="CID-bidding-now-modal-body">
                                <div className="CID-bidding-now-modal-image">
                                    <img src={auctionImages[0]} alt={`${auctionItem.productName}`}/>
                                </div>
                                <div className="CID-bidding-now-modal-details">
                                    <h3>{auctionItem.productName} 경매</h3>
                                    <p><strong className='bidding-now-modal-details-p'>경매 분류
                                        : </strong> {auctionItem.category}</p>
                                    <p><strong className='bidding-now-modal-details-p'>즉시 구매가
                                        : </strong> {nowBuyingInfo.buyNowPrice.toLocaleString()} 원</p>
                                    <p><strong className='bidding-now-modal-details-p'>총 결재금액 : </strong><span
                                        className="CID-highlight-red"> {paymentAccount.toLocaleString()}</span> 원</p>
                                    <p className='biddng-now-modal-price-info'>(즉시
                                        구매가 {nowBuyingInfo.buyNowPrice.toLocaleString()} 원 + 구매
                                        수수료 {nowBuyingInfo.buyNowpurchaseFee.toLocaleString()} 원)</p>
                                </div>
                            </div>
                            <div className='CID-bidding-now-modal-bid-button-box'>
                                <button className="CID-bidding-now-modal-bid-button" onClick={handleBuyNow}>즉시 구매
                                </button>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatItDetMain;
