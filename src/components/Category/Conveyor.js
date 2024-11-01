import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import '../../css/Category.css';
import  axios  from 'axios';
import defaultFileImg from '../../images/defaultFileImg.png';

const bucketName = process.env.REACT_APP_BUCKET_NAME;

const View = styled.div`
    display: flex;
    width:1200px;
    flex-direction: column;
    overflow: hidden; // ⭐️ View의 경계를 넘어가는 것은 숨김
`;

const Slide = styled.ul`
    display: flex;
    position: relative;
    width: calc(165px * 20); // ⭐️ (original + clone)의 너비
    animation: autoPlay 15s linear infinite;
    animation-play-state: ${(props) => (props.isPaused ? 'paused' : 'running')};

    @keyframes autoPlay {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(calc(-165px * 10)); // ⭐️ original의 너비만큼 이동
        }
    }

    & > li {
        width: 165px;
        height: 165px;
        display: flex;
        justify-content: center; 
        align-items: center;
        // background-color: #3498db;
        border: solid 1px #BFBFBF;
        color: black;
        font-size: 24px;
        list-style-type: none;
        margin: 0 5px;
        cursor: pointer;
        border-radius: 5px;
    }
`;

const handleItemClick = (auctionIndex) => {
    window.location.href = `/category-itemdetail/${auctionIndex}`;
  };


function Conveyor() {
    const [bestProducts, setBestProducts] = useState([]);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchBestProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/auction/conveyor`);
                if (response.data.statusCode !== 200) {
                    throw new Error('데이터를 가져오는 데 실패했습니다.');
                }
                const data = response.data;
                console.log(data.pageItems.content);
                setBestProducts(response.data.pageItems.content);
            } catch (error) {
                console.error('상품을 가져오는 중 오류 발생:', error);
            }
        };

        fetchBestProducts();
    }, []);
    
    return (
        <View>
            <div className='CV_header'>
            <h2>마감임박 경매</h2>
            <p>경매 종료까지 시간이 얼마 남지 않은 경매입니다.</p>
            </div>
            <Slide isPaused={isPaused}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}>
                {bestProducts.concat(bestProducts).map((auction, index) => {
                    const thumbnailImage = auction.auctionImageDtoList.find(image => image.thumbnail === true);
                    const imageSrc = thumbnailImage && thumbnailImage.filetype === 'image'
                        ? `https://kr.object.ncloudstorage.com/${bucketName}/${thumbnailImage.filepath}${thumbnailImage.filename}`
                        : `${defaultFileImg}`;

                    return (
                        <li key={index}>
                            <img className='CV_conveyor-img' 
                                 src={imageSrc} 
                                 alt={auction.productName} 
                                 style={{ width: '100%', height: '100%', borderRadius: '5px' }} 
                                 onClick={() => handleItemClick(auction.auctionIndex)}
                                 />
                        </li>
                    );
                })}
            </Slide>
        </View>
    );
}

export default Conveyor;