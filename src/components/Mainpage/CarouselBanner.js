import React, { useState, useEffect } from 'react';
import '../../css/CarouselBanner.css';
import { getAuctionData } from '../../apis/SpecialAuction/SAapis';
import { useSelector, useDispatch } from 'react-redux';
import {   formatDateTime , formatAuctionTimeRange  } from '../../util/utils';

const CarouselBanner = () => {

  const bucketName = process.env.REACT_APP_BUCKET_NAME;
  const dispatch = useDispatch();
  const { liveAuctionList } = useSelector((state) => state.specialAuctionSlice);
  const [carouselData, setCarouselData] = useState([]);
  const [images, setImages] = useState([]);

  const fetchCarouselData = () => 
    liveAuctionList.map((auction) => {
      const thumbnailImage = auction.auctionImageDtoList
        .filter((image) => image.thumbnail === true)
        .map((image) => `https://kr.object.ncloudstorage.com/${bucketName}/${image.filepath}${image.filename}`)[0]; // 첫 번째 썸네일만 선택
      return {
        url: thumbnailImage,
        title: auction.productName,
        auctionDate: formatDateTime(auction.startingLocalDateTime),
        auctionTime: formatAuctionTimeRange(auction.startingLocalDateTime, auction.endingLocalDateTime),
      };
    });

  useEffect(() => {
    dispatch(getAuctionData("realtime"));
  }, [dispatch]);

  useEffect(() => {
    const data = fetchCarouselData();
    console.log("Carousel Data: ", carouselData);
console.log("Images Array: ", images);
    setCarouselData(data);
    console.log(data);
    const imageUrls = data.map((item) => item.url);
    setImages(imageUrls);
  }, [liveAuctionList]);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(images.length - 2);
      }, 500);
    } else if (currentIndex === images.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 500);
    }
  }, [currentIndex, images.length]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const currentSlideNumber = currentIndex === 0 ? images.length - 2 : currentIndex === images.length - 1 ? 1 : currentIndex;

  return (
        <div className="CB_carousel">
          <div
            className="CB_carousel-inner"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
            }}
          >
            { carouselData &&

              carouselData.map((carousel, index) => {
                return (
                  <div
                    key={index}
                    className="CB_carousel-item"
                    style={{ backgroundImage: `url(${carousel.url})` }}
                  />
                )
              })
            }
          
          </div>
          <div className='CB_carousel-pad-container'>
                <div className='CB_carousel-pad1'>
                    <button className='CB_carousel-num'>{currentSlideNumber} / {images.length}</button>
                    <button className="CB_carousel-control prev" onClick={prevSlide}>❮</button>
                    <button className="CB_carousel-control next" onClick={nextSlide}>❯</button>
                    <button className="CB_carousel-toggle" onClick={togglePlayPause}>
                      <img
                          src={`${process.env.PUBLIC_URL}/images/${isPlaying ? 'MP_stop_icon.svg' : 'MP_play_icon.svg'}`}
                          alt={isPlaying ? 'Pause' : 'Play'}
                          style={{ width: '15px', height: '15px' }}
                        />
                    </button>
                </div>

                { carouselData &&

                  carouselData.map((carousel, index) => {
                    return (
                      <div className="CB_carousel_contents" key={index}>
                        <h2>{carousel.title}</h2>
                        <p>{carousel.auctionDate}</p>
                        <p>{carousel.auctionTime}</p>
                        <p>실시간 경매 진행 예정</p>
                        <button className="CB_enter_action-button">바로가기</button>
                      </div>
                    )
                  })
                  }
            </div>
        </div>

    );
  
};
export default CarouselBanner;