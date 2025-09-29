import React from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

// ✅ Import images correctly
// import banner1 from '../assets/Image/dummyImg/middlebanner1.jpeg';


import banner1 from '../assets/Image/bookmyshow/logo/dummyImg/flower1.webp' 
//  import flower2 from '../assets/Image/bookmyshow/logo/dummyImg/flower2.webp' 
//  import flower3 from '../assets/Image/bookmyshow/logo/dummyImg/flower3.webp' 
//  import flower4 from '../assets/Image/bookmyshow/logo/dummyImg/flower4.webp' 


import colarge from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/about-colarge.jpeg'



const GalleryGrid = () => {
    const images = [
        {
            src: banner1, // ✅ use imported variable
            thumb: banner1,
        },
        {
            src: banner1,
            thumb: banner1,
        },
        {
            src: banner1,
            thumb: banner1,
        },
        {
            src: banner1,
            thumb: banner1,
        },
        {
            src: banner1,
            thumb: banner1,
        },
        {
            src: banner1,
            thumb: banner1,
        },
        {
            src: banner1,
            thumb: banner1,
        },
        {
            src: banner1,
            thumb: banner1,
        },
    ];

    const openGallery = (index) => {
        Fancybox.show(
            images.map(img => ({ src: img.src, type: 'image' })),
            { startIndex: index }
        );
    };

    return (

         <div className='gallery_section'>
         
        <div className="container">

            <div className='common_headline'>
                <div>
                    <div className='agarbatti_img'>
                       
                        <h2> Blooming Beautifully in Noida</h2>
                    </div>
                    <p>
                        {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt facere quasi corrupti! */}
                    </p>
                </div>
            </div>



            {/* <div className="gallery-grid">
                {images.map((img, i) => (
                    <div
                        key={i}
                        className="image-box"
                        onClick={() => openGallery(i)}

                    >
                        <img src={img.thumb} alt={`Image ${i + 1}`} style={{ width: '100%', borderRadius: '8px' }} />
                    </div>
                ))}
            </div> */}

            <img src={colarge} width='100%' alt="img" />



        </div>
        </div>
    );
};

export default GalleryGrid;
