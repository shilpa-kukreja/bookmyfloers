
import React from 'react'
import HomeSlider from '../Componant/HomeSlider'
import ShowCategory from './ShowCategory'
import AboutUs from '../Componant/AboutUs'
import ProductSlider from './ProductSlider'
import BestsellerSlide from './BestsellerSlide'
import Blog from '../Componant/Blog'
import MiddleBanner from './MiddleBanner'
import InstaSlider from './InstaSlider'

const Home = () => {
  return (
    <div>

       <div className="">

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