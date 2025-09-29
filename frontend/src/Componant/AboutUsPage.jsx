
import React from 'react'







import aboutbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/aboutbanner.jpg'

import AboutUs from './AboutUs'
import GalleryGrid from '../Pages/GalleryGrid'

const AboutUsPage = () => {
  return (
    <div className='aboutus_page'>
                  
                  <img src={aboutbanner} width='100%'  alt="aboutus banner" />
 
            <AboutUs/>
           <GalleryGrid/>
                 
    </div>
  )
}

export default AboutUsPage
