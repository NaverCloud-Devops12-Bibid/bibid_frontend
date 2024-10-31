import React, { useState } from 'react';
import CategoryItemDetailInfo from './CatItDetInfo';
import CategoryItemDetailInquiry from './CatItDetInquiry';
import CategoryItemDetailReturn from './CatItDetReturn';
import CategoryItemDetailMain from './CatItDetMain';
import CatItDetAxios from './CatItDetAxios';

const CategoryItemDetail = () => {
    const [auctionItem, setAuctionItem] = useState(null);
    const [auctionBidInfo, setAuctionBidInfo] = useState(null);
    const [seller, setSeller] = useState(null);
    const [biddingMember, setBiddingMember] = useState(null);
    const [infoExtension, setInfoExtension] = useState(null);
    const [sellerDetailInfo, setSellerDetailInfo] = useState(null);
    const [auctionImages, setAuctionImages] = useState(null);
    const [qnAList, setQnAList] = useState(null);

    return (
        <div className='CID-item-block'>
            
            <CatItDetAxios
                setAuctionItem={setAuctionItem}
                setAuctionBidInfo={setAuctionBidInfo}
                setSeller={setSeller}
                setBiddingMember={setBiddingMember}
                setInfoExtension={setInfoExtension}
                setSellerDetailInfo={setSellerDetailInfo}
                setAuctionImages={setAuctionImages}
                setQnAList={setQnAList}
            />

            <CategoryItemDetailMain auctionItem = {auctionItem} auctionBidInfo = {auctionBidInfo} seller = {seller} biddingMember = {biddingMember} infoExtension = {infoExtension} sellerDetailInfo = {sellerDetailInfo} auctionImages = {auctionImages}/>
            <CategoryItemDetailInfo auctionItem = {auctionItem} auctionBidInfo = {auctionBidInfo} seller = {seller} biddingMember = {biddingMember} auctionImages = {auctionImages}/>
            <CategoryItemDetailInquiry auctionItem = {auctionItem} auctionBidInfo = {auctionBidInfo} seller = {seller} biddingMember = {biddingMember} qnAList = {qnAList}/>
            <CategoryItemDetailReturn/>
        </div>
    );
};

export default CategoryItemDetail;