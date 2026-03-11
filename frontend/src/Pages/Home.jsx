
import React from 'react'
import HomeSlider from '../Componant/HomeSlider'
import ShowCategory from './ShowCategory'
import AboutUs from '../Componant/AboutUs'
import ProductSlider from './ProductSlider'
import BestsellerSlide from './BestsellerSlide'
import Blog from '../Componant/Blog'
import MiddleBanner from './MiddleBanner'
import InstaSlider from './InstaSlider'
import HeartShower from '../Componant/HeartShower'

const Home = () => {
  return (
    <div>

       <div className="">
        <HeartShower />
        <HomeSlider />
        <ShowCategory/>
        <ProductSlider/>
        <AboutUs/>
        <MiddleBanner/>
        <BestsellerSlide/>
        <Blog />
       <InstaSlider/>


             
                     
       </div>
    </div>
  )
}

export default Home