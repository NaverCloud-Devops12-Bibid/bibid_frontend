import React, { useEffect, useState, useCallback } from 'react';
import '../css/Category.css';
import Conveyor from '../components/Category/Conveyor';
import { useNavigate } from 'react-router-dom';
import CategoryMenu from '../components/Category/CategoryMenu';
import ProductLine from '../components/Category/ProductLine';
import axios from 'axios';

const DetailedCategory_Clothing = () => {
  const navi = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5; // 한 페이지에 표시할 아이템 수
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부

  const fetchBestProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/auction/category/의류, 잡화`, {
        params: { page: page }
      });

      if (response.status === 200) {
        const data = response.data.pageItems.content || [];
        
        // 이전 데이터에 새 데이터를 추가
        setProducts(prevProducts => [...prevProducts, ...data]);
        
        // 남은 데이터가 5개 미만이면 더 이상 불러오지 않도록 설정
        setHasMore(data.length === itemsPerPage);
        console.log(data)
      } else {
        console.error('상품 가져오기 실패');
        setHasMore(false);
      }
    } catch (error) {
      console.error('베스트 상품을 가져오는 중 오류 발생:', error);
      setHasMore(false);
    }
  }, [page]); // 페이지 변경 시 다시 호출

  useEffect(() => {
    fetchBestProducts();
  }, [fetchBestProducts, page]); // 컴포넌트 마운트 또는 페이지 변경 시 호출

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [hasMore]);

  const toCategory = () => navi('/categories', { replace: true });
  const toAll = () => navi('/categories/all', { replace: true });
  const toClothing = () => navi('/categories/clothing', { replace: true });
  const toHob = () => navi('/categories/hob', { replace: true });
  const toBook = () => navi('/categories/book', { replace: true });
  const toArt = () => navi('/categories/art', { replace: true });
  const toElec = () => navi('/categories/elec', { replace: true });
  const toPic = () => navi('/categories/pic', { replace: true });
  const toAntique = () => navi('/categories/antique', { replace: true });
  const [isLoading, setIsLoading] = useState(false); // 추가된 상태

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !isLoading) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          loadMore();
        }, 50);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  return (
    <div className='CTG_category'>
      <div className='blank' />
      <div className='CTG_container'>
        <CategoryMenu />
      </div>
      <div className='blank'/>
      <Conveyor />
      <div className='blank'/>
      <div className='DC_productContainer'>
      {products.length > 0 ? (
        <ProductLine products={products} />
      ) : (
        <p>상품이 없습니다.</p>
      )}
      </div>
      <div className='blank'/>
    </div>
  );
};

export default DetailedCategory_Clothing;