import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CatItDetAxios({ setAuctionItem, setAuctionBidInfo, setSeller , setBiddingMember, setInfoExtension, setSellerDetailInfo, setAuctionImages}) {
  const { auctionNumber } = useParams(); // URL에서 auctionNumber를 가져옴
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log("== CatItDetAxios 실행 ==");
  // console.log("auctionNumber"+auctionNumber);

  useEffect(() => {
    axios.get(`http://localhost:8080/auctionDetail/category-item-detail/${auctionNumber}`)
      .then(response => {
        // console.log(response);
        const { auctionItem, auctionBidInfo, seller, biddingMember, infoExtension, sellerDetailInfo, auctionImages } = response.data.item; // 응답에서 각각의 필드를 추출
        setAuctionItem(auctionItem); // auctionItem 데이터 설정
        // console.log("auctionItem :: " + auctionItem.auctionType);
        
        setAuctionBidInfo(auctionBidInfo); // auctionBidInfo 데이터 설정
        // console.log("auctionBidInfo :: " + auctionBidInfo);

        setSeller(seller); // seller 데이터 설정
        // console.log("seller :: " + seller);

        setBiddingMember(biddingMember); // biddingMember 데이터
        // console.log("biddingMember :: " + biddingMember)

        setInfoExtension(infoExtension); // 현재 경매의 총 입찰수 , 최고가, 판매자의 진행경매수, 판매자 정보 더보기
        // console.log(infoExtension);

        setSellerDetailInfo(sellerDetailInfo); // 판매자의 상호명 등의 정보
        // console.log(sellerDetailInfo);

        setAuctionImages(auctionImages); // 옥션이미지 가져오기
        console.log(auctionImages);

        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [auctionNumber, setAuctionItem, setAuctionBidInfo, setSeller, setBiddingMember, setInfoExtension, setSellerDetailInfo, setAuctionImages]);

  if (loading) return <div>Loading..</div>;
  if (error) return <div>Error: {error.message}</div>;

  return null; // 데이터만 전달하고 렌더링할 내용 없음
}

export default CatItDetAxios;
