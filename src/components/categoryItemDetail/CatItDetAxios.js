import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function CatItDetAxios({ setAuctionItem, setAuctionBidInfo, setSeller , setBiddingMember, setInfoExtension, setSellerDetailInfo, setAuctionImages, setQnAList}) {
 
  const bucketName = process.env.REACT_APP_BUCKET_NAME;
 
  const { auctionNumber } = useParams(); // URL에서 auctionNumber를 가져옴
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  console.log("== CatItDetAxios 실행 ==");
  // console.log("auctionNumber"+auctionNumber);

  useEffect(() => {
    axios.get(`http://localhost:8080/auctionDetail/category-item-detail/${auctionNumber}`)
      .then(response => {
        console.log(response.data.item);
        const { auctionItem, auctionBidInfo, seller, biddingMember, infoExtension, sellerDetailInfo, auctionImages, qnAList } = response.data.item;
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

        // auctionImages 배열에 URL을 추가하여 상태 설정
        const formattedAuctionImages = auctionImages.map(imageUrl => 
          `https://kr.object.ncloudstorage.com/${bucketName}/${imageUrl}`
        );
        setAuctionImages(formattedAuctionImages); // URL이 포함된 auctionImages 데이터 설정
        console.log(auctionImages);

        setQnAList(qnAList); // qna 옥션인덱스로 불러오기

        setLoading(false);
      })
      .catch(error => {
        // 오류 처리 로직 추가
        if (error.response && error.response.status === 400) {
          console.log("잘못된 접근입니다.");
          navigate('/');
        } else {
          setError(error);
        }
        setLoading(false);
      });
  }, [auctionNumber, setAuctionItem, setAuctionBidInfo, setSeller, setBiddingMember, setInfoExtension, setSellerDetailInfo, setAuctionImages, setQnAList]);

  if (loading) return <div>Loading..</div>;
  if (error) return <div>Error: {error.message}</div>;

  return null; // 데이터만 전달하고 렌더링할 내용 없음
}

export default CatItDetAxios;
