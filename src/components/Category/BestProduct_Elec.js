import React, { useEffect, useState } from 'react'
import '../../css/Category.css';
import  axios  from 'axios';
import defaultFileImg from '../../images/defaultFileImg.png';

const BestProduct_Elec = ({category}) => {

  const bucketName = process.env.REACT_APP_BUCKET_NAME;

  const [bestProducts, setBestProducts] = useState([]);

  useEffect(() => {
    const fetchBestProductsByCategory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/auction/best/전자제품`);
        console.log(response.data);


        if (!response.statusMessage === 'ok') {
          throw new Error('데이터를 가져오는 데 실패했습니다.');
        }
        const data = response.data;
        console.log(data.pageItems.content);
        setBestProducts(data.pageItems.content);
      } catch (error) {
        console.error('베스트 상품을 가져오는 중 오류 발생:', error);
      }
    };
  
    fetchBestProductsByCategory();
  }, [category]);

  const handleItemClick = (auctionIndex) => {
    window.location.href = `/category-itemdetail/${auctionIndex}`;
  };

  return (
    <div className='CTG_container3'>
    <div className='CTG_grid-container-elec'>
      {bestProducts.map((auction, index) => {

        const thumbnailImage = auction.auctionImageDtoList.find(image => image.thumbnail === true);
        const imageSrc = thumbnailImage && thumbnailImage.filetype === 'image'
          ? `https://kr.object.ncloudstorage.com/${bucketName}/${thumbnailImage.filepath}${thumbnailImage.filename}`
          : `${defaultFileImg}`;  // 이미지가 없거나 썸네일이 아닐 경우 기본 이미지

        return (
        <div key={index} className="CTG_grid-item-elec">
          
            <img 
            className='CTG_grid-img-elec'
            src={imageSrc} alt={auction.productName} 
            onClick={() => handleItemClick(auction.auctionIndex)}
            />
        </div>
        )
      }
    )}
    </div>
  </div>
  )
};

export default BestProduct_Elec