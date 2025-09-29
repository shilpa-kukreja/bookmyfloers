
import React from 'react'


import '../assets/Css/Header.css'


import middlebannerleft from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/middle1.jpg'
import middlebannerright from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/middle2.jpg'


const MiddleBanner = () => {
    return (
        <div className='middlebanner_section'>
            <div className="container">
               

                <div className="middle_banner_img" >

                    <div className="col-half">
                        <div className="img_wrapper">
                            <img src={middlebannerleft} width='100%' alt="banner1" />
                        </div>
                    </div>

                    <div className="col-half">
                        <div className="img_wrapper">
                            <img src={middlebannerright} width='100%' alt="banner2" />
                        </div>
                    </div>



                </div>

            </div>


        </div>
    )
}

export default MiddleBanner
