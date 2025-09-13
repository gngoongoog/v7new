import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FeaturedProductsSlider = () => {
  const { getFeaturedProducts, loading, error } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    if (!loading && !error) {
      setFeaturedProducts(getFeaturedProducts());
    }
  }, [loading, error, getFeaturedProducts]);

  if (loading) return <div className="text-center py-8">جاري تحميل المنتجات المميزة...</div>;
  if (error) return <div className="text-center py-8 text-red-600">خطأ في تحميل المنتجات المميزة: {error}</div>;
  if (featuredProducts.length === 0) return null; // لا تعرض السلايدر إذا لم تكن هناك منتجات مميزة

  return (
    <section className="py-12 bg-gray-100 animate-fade-in-up">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          منتجات مميزة
        </h2>
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          className="mySwiper"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedProductsSlider;


