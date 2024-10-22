import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import './css/landingpage.css'

const Slideshow = () => {
  return (
    <Swiper
      modules={[Pagination, Autoplay, EffectFade]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 2000 }}
      effect="fade"
      loop={true}
      className="mySwiper"
    >
      <SwiperSlide><img src="slide1.jpg" alt="Slide 1" /></SwiperSlide>
      <SwiperSlide><img src="slide2.jpg" alt="Slide 2" /></SwiperSlide>
      <SwiperSlide><img src="slide3.jpg" alt="Slide 3" /></SwiperSlide>
    </Swiper>
  );
};

export default Slideshow;
