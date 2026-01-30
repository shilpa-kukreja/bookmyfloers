
import React from 'react'
import '../assets/Css/About.css'
import { useLocation } from 'react-router-dom'



import aboutus from '../assets/Image/bookmyshow/logo/mainbanner/aboutleftImg.jpg'

import aboutuspage from '../assets/Image/bookmyshow/logo/mainbanner/about-page.jpg'


const AboutUs = () => {


  const location = useLocation()
  const isAboutPage = location.pathname === "/about-us";


  return (
    <div className='aboutus_section' >

      <div className="container">
        <div className='category_section ' style={{ marginTop: '0px', paddingTop: '0px'}}>
            <h2 className='about_bmf '> About Book My Flowers </h2>
                    <p className='category_para '>
                        Love is a universal language, and throughout history, flowers have spoken it beautifully. At BMF, we believe that emotions come first — and there's no better way to express them than with nature’s most elegant creations.

                        Welcome to our online flower boutique, where each bouquet is thoughtfully crafted to help you say what words sometimes can’t. Whether you're celebrating love, gratitude, or simply making someone’s day, we’re here to help your gestures bloom.

                        Because memories last forever — fill them with fragrance, color, and flowers curated just for you, with you, by us.
                    </p>

        </div>
      
        <div className="about_wrapper">
          <div className="col-half">
            <img src={isAboutPage ? aboutuspage : aboutus} width="400px" height="auto" alt="aboutus" />
          </div>
          <div className="col-half">
            <div className="feature_content">
              {
                isAboutPage ? (
                  <p   className='about_us_para'>
                    At the heart of Book my Flowers is our founder, Alok Yadav, a passionate creator with a lifelong love for flowers, flavors, and the joy they bring to people’s lives. What began as a small dream to blend the art of floral design with the comfort of freshly baked cakes has blossomed into a trusted destination for celebrations, surprises, and everyday beauty.
                    Alok has  started the journey with a simple belief: that every occasion—big or small—deserves something fresh, thoughtful, and handcrafted. With a background in floral design, pastry, event , they combined their talents to open , offering customers a one-stop shop for elegantly arranged blooms and decadent treats.
                    Whether you're celebrating love, expressing sympathy, or simply brightening someone’s day, Book My Flowers team are here to make it unforgettable—one flower and one bite at a time.
                  </p>

                ) : (

                  <>
                    <h2 className='wanofont_heading'>Pure Fragrance</h2>

                    <h4>Customer Satisfaction</h4>
                    <p>
                      At BookMyFlower, every bouquet is crafted with care to make your special moments unforgettable. We go the extra mile to ensure each delivery brings joy, beauty, and heartfelt emotions to your doorstep. Your happiness is our top priority.
                    </p>
                    <h4>Fresh & Natural Blooms</h4>
                    <p>
                      We handpick the freshest flowers straight from trusted growers to create stunning arrangements. Our blooms are vibrant, fragrant, and all-natural — a perfect blend of nature’s charm and elegant design.
                    </p>
                    <h4>Quality You Can Trust</h4>
                    <p>
                      From the selection of each stem to the final wrap, every bouquet is handled with precision and love. Our florists follow high standards to ensure that every bouquet arrives fresh, beautiful, and exactly as promised.
                    </p>

                  </>
                )


              }
             
            </div>

          </div>
        </div>





      </div>


    </div>
  )
}

export default AboutUs