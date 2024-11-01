import React, { useEffect, useState, useCallback } from 'react';
import '../css/Category.css';
import Conveyor from '../components/Category/Conveyor';
import CategoryMenu from '../components/Category/CategoryMenu';
import ProductLine from '../components/Category/ProductLine';
import axios from 'axios';

const DetailedCategory_All = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // 추가된 상태

  const fetchBestProducts = useCallback(async () => {
    try {
      setIsLoading(true); // 로딩 시작
      const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/auction/all`, {
        params: { page: page, size: itemsPerPage }
      });

      if (response.status === 200) {
        const data = response.data.pageItems.content || [];

        if (data.length === 0) {
          setHasMore(false);
        } else {
          console.log(data);
          setProducts(prevProducts => [...prevProducts, ...data]);
          setHasMore(data.length === itemsPerPage);
        }
      } else {
        console.error('상품 가져오기 실패');
        setHasMore(false);
      }
    } catch (error) {
      console.error('베스트 상품을 가져오는 중 오류 발생:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBestProducts();
  }, [fetchBestProducts, page]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) { 
      setTimeout(() => {
        setPage(prevPage => prevPage + 1);
      }, 50);
    }
  }, [hasMore, isLoading]);

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
      clearTimeout(timeoutId);
    };
  }, [loadMore, isLoading]);

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

export default DetailedCategory_All;