



//  product img


// import blogImg from '../assets/Image/bookmyshow/logo/dummyImg/blogImg.jpg'
import blogImg from '../assets/Image/bookmyshow/logo/dummyImg/blog.jpg'
import blogImg2 from '../assets/Image/bookmyshow/logo/dummyImg/blog2.jpg'
import blogImg3 from '../assets/Image/bookmyshow/logo/dummyImg/blog3.jpg'
import blogImg4 from '../assets/Image/bookmyshow/logo/dummyImg/blog4.jpg'






// product img 

// src/assets/Image/bookmyshow/logo/dummyImg/occassion1.webp


import occassion1 from '../assets/Image/bookmyshow/logo/dummyImg/ocassion1.webp'
import occassion2 from '../assets/Image/bookmyshow/logo/dummyImg/ocassion2.webp'
import occassion3 from '../assets/Image/bookmyshow/logo/dummyImg/ocassion3.webp'
import occassion4 from '../assets/Image/bookmyshow/logo/dummyImg/ocassion4.webp'


import flower1 from '../assets/Image/bookmyshow/logo/dummyImg/flower1.webp'
import flower2 from '../assets/Image/bookmyshow/logo/dummyImg/flower2.webp'
import flower3 from '../assets/Image/bookmyshow/logo/dummyImg/flower3.webp'
import flower4 from '../assets/Image/bookmyshow/logo/dummyImg/flower4.webp'


import gifting1 from '../assets/Image/bookmyshow/logo/dummyImg/gifting1.webp'
import gifting2 from '../assets/Image/bookmyshow/logo/dummyImg/gifting2.webp'
import gifting3 from '../assets/Image/bookmyshow/logo/dummyImg/gifting3.webp'
import gifting4 from '../assets/Image/bookmyshow/logo/dummyImg/gifting4.webp'

import delivery1 from '../assets/Image/bookmyshow/logo/dummyImg/delivery1.webp'
import delivery2 from '../assets/Image/bookmyshow/logo/dummyImg/delivery2.webp'
import delivery3 from '../assets/Image/bookmyshow/logo/dummyImg/delivery3.webp'
import delivery4 from '../assets/Image/bookmyshow/logo/dummyImg/delivery4.webp'




// category src/assets/Image/bookmyshow/category/bhirthday.jpg

import aniversary from '../assets/Image/bookmyshow/category/anniversary.jpg'
import cake from '../assets/Image/bookmyshow/category/cake.jpg'
import bhirthday from '../assets/Image/bookmyshow/category/bhirthday.jpg'
import decoration from '../assets/Image/bookmyshow/category/decoration.jpg'
import gift from '../assets/Image/bookmyshow/category/gift.jpg'


export const category = [

   {
      id: 1,
      img: occassion1,
      name: "Occasion Based",
      slug: "occasion-based"
   },
   {
      id: 2,
      img: flower1,
      name: "Flower Type",
      slug: "flower-type"
   },
   {
      id: 3,
      img: gift,
      name: "Gifting and Themes",
      slug: "gifting-themes"
   },
   {
      id: 4,
      img: decoration,
      name: "Decoration",
      slug: "decoration"
   },
   {
      id: 5,
      img: aniversary,
      name: "Anniversary",
      slug: "anniversary"
   },
   {
      id: 6,
      img: bhirthday,
      name: "Birthday",
      slug: "birthday"
   },
   {
      id: 7,
      img: cake,
      name: "Cake",
      slug: "cake"
   },
  
   {
      id: 8,
      img: gift,
      name: "Combo Offers",
      slug: "combo-offers"
   },

   {
      id: 9,
      img: delivery1,
      name: "Festival",
      slug: "festival"
   },
]


export const subcategory = [
   
   {
   id: 1 ,
   name: "flower Bouquet ",
   slug: "flower-bouquet",

   categoryId:["1"]
},

 {
   id: 2,
   name: "Anniversary Flowers",
   slug: "anniversary-flowers",
   categoryId:["2"]
},

 {
   id: 3,
   name: "Anniversary Gifts ",
   slug: "anniversary-gifts",
   categoryId:["5"]
},
 {
   id: 4,
   name: " Anniversary Cakes",
   slug: "anniversary-cakes",
   categoryId:["5"]
},
 
 {
   id: 5,
   name: "Bhirthday Cake",
   slug: "bhirthday-cake",
   categoryId:["6"]
},
 {
   id: 6,
   name: "Anniversary Cake",
   slug: "anniversary-cake",   
   categoryId:["7"]
},
{
   id: 7,
   name: "Valentine Gift",
   slug: "valentine-gift",
   categoryId:["3"]
},
{
   id: 8,
   name: "Bhirthday Flower",
   slug: "bhirthday-flower",
   categoryId:["6"]
},
{
   id: 9,
   name: "Car Decoration",
   slug: "car-decoration",
   categoryId:["4"]
},
{
   id: 10,
   name: "Home Flower Decoration",
   slug: "home-flower-decoration",
   categoryId:["4"]
},
















]


export const product = [

   {
      id: '1',
      name: 'Red rose bouquet ',
      slug: "red-rose-bouquet",
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: " show additinal information ",
      thumbImg: occassion1,
      productType: 'simple',
      galleryImg: [occassion2, occassion3, occassion4],
      stock: '8',
      section: 'bestseller',
      categoryId: ["1"],
      subcategoryId:["1"],
      sku: 'dlkfj123',
      actualPrice: '200',
      discountPrice: '150',

   },
   {
      id: '2',
      name: 'lotus bouquet',
      slug: 'lotus-bouquet',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: " show additinal information ",
      thumbImg: occassion1,
      productType: 'variable',
      galleryImg: [occassion2, occassion3, occassion4],
      stock: '8',
      variant: [
         { variantName: 'rose', actualPrice: '100', discountPrice: '80' },
         { variantName: 'sandal', actualPrice: '200', discountPrice: '101' },
         { variantName: 'lavender', actualPrice: '140', discountPrice: '100' }
      ],

      section: 'bestseller',
      categoryId: ["1"],
      subcategoryId: [""],
      sku: 'dlkfj123',
   },
   {
      id: '3',
      name: 'flower type aa',
      slug: 'flower-type-aa',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: " show additinal information ",
      thumbImg: flower1,
      galleryImg: [flower2, flower3, flower4],
      stock: '8',
      section: 'bestseller',
      // category: "Flower Type",
      // subcategory:[" "],



      categoryId:["2"],
      subcategoryId:["2"],
      sku: 'dlkfj123',

      productType: 'variable',
      variant: [
         { variantName: 'rose', actualPrice: '100', discountPrice: '80' },
         { variantName: 'sandal', actualPrice: '200', discountPrice: '101' },
         { variantName: 'lavender', actualPrice: '140', discountPrice: '100' }
      ],
   },

   {
      id: '4',
      name: 'Gifting',
      slug: 'Gifting1',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.',
      description: "put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis,molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet,consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.",
      additionalInformation: "show additinal information ",
      thumbImg: gifting1,
      galleryImg: [gifting2, gifting3, gifting4],
      stock: '8',
      section: 'bestseller',
      productType: 'simple',

      category: "Gifting and Themes",
      subcategory: [""],

      categoryId:["3"],
      subcategoryId:["7"],

      sku: 'dlkfj123',
      actualPrice: '200',
      discountPrice: '150',
   },
   {
      id: '5',
      name: 'bhirthday gift flower',
      slug: 'bhirthday-gift-flower',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: " show additinal information ",
      thumbImg: gifting1,
      galleryImg: [gifting2, gifting3, gifting4],
      stock: '8',
      section: 'bestseller',
      productType: 'simple',
      category: "Gifting and Themes",
      subcategory: [""],


      categoryId:["3"],
      subcategoryId:["7"],


      sku: 'dlkfj123',
      actualPrice: '200',
      discountPrice: '150',
   },
   {
      id: '6',
      name: 'Delivery Based',
      slug: 'delivery-based',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: " show additinal information ",
      thumbImg: delivery1,
      galleryImg: [delivery2, delivery3, delivery4],
      stock: '8',
      section: 'bestseller',
      productType:'simple',
      category: "Decoration",
      subcategory: [""],


      categoryId:["4"],
      subcategoryId:["9","10"],

      sku: 'dlkfj123',
      actualPrice: '200',
      discountPrice: '150',
   },

   {
      id: '7',
      name: 'Delivery',
      slug: 'delivery-based2',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: " show additinal information ",
      thumbImg: delivery1,
      galleryImg: [delivery2, delivery3, delivery4],
      stock: '8',
      section: 'bestseller',
      productType: 'simple',
      category: "Decoration",
      subcategory: [""],

       categoryId:["4"],
      subcategoryId:["9","10"],

      sku: 'dlkfj123',
      actualPrice: '200',
      discountPrice: '150',
   },
   {
      id: '8',
      name: 'flower type bouquet ',
      slug: 'flower-type-bougque',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: " show additinal information ",
      thumbImg: flower1,
      galleryImg: [flower2, flower3, flower4],
      stock: '8',
      section: 'bestseller',
      // category: "Flower Type",
      // subcategory: [""],

      categoryId:["2"],
      subcategoryId:["2"],
      sku: 'dlkfj123',
      productType: 'simple',
      actualPrice: '200',
      discountPrice: '150',
   },


   {
      id: '9',
      name: 'Gifting',
      slug: 'Gifting-1',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.',
      description: "put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis,molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet,consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.",
      additionalInformation: "show additinal information ",
      thumbImg: gifting1,
      galleryImg: [gifting2, gifting3, gifting4],
      stock: '8',
      section: 'bestseller',
      productType: 'variable',
      category: "Gifting and Themes",
      subcategory: [""],

        categoryId:["3"],
      subcategoryId:["7"],



      sku: 'dlkfj123',
      variant: [
         { variantName: 'rose', actualPrice: '100', discountPrice: '80' },
         { variantName: 'sandal', actualPrice: '200', discountPrice: '101' },
         { variantName: 'lavender', actualPrice: '140', discountPrice: '100' }
      ],
   },

   {
      id: '10',
      name: 'flower red rose',
      slug: 'flower-red-rose',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: " show additinal information ",
      thumbImg: flower1,
      galleryImg: [flower2, flower3, flower4],
      stock: '8',
      section: 'bestseller',
      // category: "Flower Type",
        categoryId:["2"],
      subcategoryId:["2"],
      sku: 'dlkfj123',

      productType: 'variable',
      variant: [

         { variantName: 'rose', actualPrice: '100', discountPrice: '80' },
         { variantName: 'sandal', actualPrice: '200', discountPrice: '101' },
         { variantName: 'lavender', actualPrice: '140', discountPrice: '100' }

      ],
   },
   {
      id: '11',
      name: 'flower rose bouquet ',
      slug: 'flower-rose-bouquets',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: " show additinal information ",
      thumbImg: flower1,
      galleryImg: [flower2, flower3, flower4],
      stock: '8',
      section: 'bestseller',
      // category: "Flower Type",
      // subcategory: [""],

        categoryId:["2"],
      subcategoryId:["2"],

      sku: 'dlkfj123',
      productType: 'simple',
      actualPrice: '200',
      discountPrice: '150',
   },

   {
      id: '12',
      name: 'flower yellow rose',
      slug: 'flower-yellow-rose',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: "show additinal information ",
      thumbImg: flower1,
      galleryImg: [flower2, flower3, flower4],
      stock: '8',
      section: 'bestseller',
      // category: "Flower Type",
        categoryId:["2"],
       subcategoryId:["2"],

      sku: 'dlkfj123',
      productType: 'variable',
      variant: [
         { variantName: 'rose', actualPrice: '100', discountPrice: '80' },
         { variantName: 'sandal', actualPrice: '200', discountPrice: '101' },
         { variantName: 'lavender', actualPrice: '140', discountPrice: '100' }
      ],
   },

    {
      id: '13',
      name: 'Bhirthday Special',
      slug: 'bhirthday-special',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: "show additinal information ",
      thumbImg: flower1,
      galleryImg: [flower2, flower3, flower4],
      stock: '8',
      section: 'bestseller',
      // category: "Flower Type",
        categoryId:["6"],
       subcategoryId:["8"],

      sku: 'dlkfj123',
      productType: 'variable',
      variant: [
         { variantName: 'rose', actualPrice: '100', discountPrice: '80' },
         { variantName: 'sandal', actualPrice: '200', discountPrice: '101' },
         { variantName: 'lavender', actualPrice: '140', discountPrice: '100' }
      ],
   },

    {
      id: '14',
      name: 'Bhirthday Cake',
      slug: 'bhirthday-cake',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: "show additinal information ",
      thumbImg: flower1,
      galleryImg: [flower2, flower3, flower4],
      stock: '8',
      section: 'bestseller',
      // category: "Flower Type",
        categoryId:["7"],
       subcategoryId:["6"],

      sku: 'dlkfj123',
      productType: 'variable',
      variant: [
         { variantName: 'rose', actualPrice: '100', discountPrice: '80' },
         { variantName: 'sandal', actualPrice: '200', discountPrice: '101' },
         { variantName: 'lavender', actualPrice: '140', discountPrice: '100' }
      ],
   },

   {
      id: '15',
      name: 'Festival Flowers',
      slug: 'festival-flower',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: "show additinal information ",
      thumbImg: flower1,
      galleryImg: [flower2, flower3, flower4],
      stock: '8',
      section: 'bestseller',
      // category: "Flower Type",
        categoryId:["9"],
      //  subcategoryId:["6"],

      sku: 'dlkfj123',
      productType: 'variable',
      variant: [
         { variantName: 'rose', actualPrice: '100', discountPrice: '80' },
         { variantName: 'sandal', actualPrice: '200', discountPrice: '101' },
         { variantName: 'lavender', actualPrice: '140', discountPrice: '100' }
      ],
   },

      {
      id: '16',
      name: 'Combo Products',
      slug: 'combo-product',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: "show additinal information ",
      thumbImg: flower1,
      galleryImg: [flower2, flower3, flower4],
      stock: '8',
      section: 'bestseller',
      // category: "Flower Type",
        categoryId:["8"],
      //  subcategoryId:["6"],

      sku: 'dlkfj123',
      productType: 'variable',
      variant: [
         { variantName: 'rose', actualPrice: '100', discountPrice: '80' },
         { variantName: 'sandal', actualPrice: '200', discountPrice: '101' },
         { variantName: 'lavender', actualPrice: '140', discountPrice: '100' }
      ],
   },


    {
      id: '17',
      name: 'Anniversary Gifts',
      slug: 'anniversary-gifts',
      shortDescription: 'Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. ',
      description: " put product descriptio  Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias. Lorem ipsum dolor sit  amet, consectetur adipisicing elit. Facilis, molestias. amet, consectetur adipisicing elit. Facilis, molestias.  ",
      additionalInformation: "show additinal information ",
      thumbImg: flower1,
      galleryImg: [flower2, flower3, flower4],
      stock: '8',
      section: 'bestseller',
      // category: "Flower Type",
        categoryId:["5"],
       subcategoryId:["3","4"],

      sku: 'dlkfj123',
      productType: 'variable',
      variant: [
         { variantName: 'rose', actualPrice: '100', discountPrice: '80' },
         { variantName: 'sandal', actualPrice: '200', discountPrice: '101' },
         { variantName: 'lavender', actualPrice: '140', discountPrice: '100' }
      ],
   },

]















 






export const blog = [

   {
      id: '1',
      slug:'blog-1',
      blogImg: blogImg,
      blogDate: 'july 13,2026',
      metaTitle: "Lorem, ipsum dolor sit amet consectetur adipisicing elit",
      metaKeyword: "Lorem, ipsum, dolor, sit, amet, consectetur, adipisicing, elit.",
      metaDescription: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      title: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. ',
      subtitle: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.'
   },
   {
      id: '2',
      slug:'blog-2',
      blogImg: blogImg2,
      blogDate: 'july 13,2026',
      title: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. ',
      subtitle: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.'
   },
   {
      id: '3',
      slug:'blog-3',
      blogImg: blogImg3,
      blogDate: 'july 13,2026',
      title: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. ',
      subtitle: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.'
   },
   {
      id: '4',
      slug:'blog-4',
      blogImg: blogImg4,
      blogDate: 'july 13,2026',
      title: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. ',
      subtitle: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.'
   },
   {
      id: '5',
      slug:'blog-4',
      blogImg: blogImg2,
      blogDate: 'july 13,2026',
      title: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. ',
      subtitle: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.'
   },
   {
      id: '6',
      slug:'blog-6',
      blogImg: blogImg3,
      blogDate: 'july 13,2026',
      title: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. ',
      subtitle: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint minus rem alias non repellendus, error eum, eligendi cupiditate molestiae est mollitia? Quae, placeat! Accusamus non eos ratione quibusdam reprehenderit accusantium.'
   },





]