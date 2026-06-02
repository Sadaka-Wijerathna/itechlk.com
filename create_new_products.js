const fs = require('fs');

const images = [
  "Amazon.png", "Capcut.png", "ChatGPT.png", "Gemini.png", 
  "Grok AI.png", "Learnado.png", "MS 365.png", "Netflix.png", 
  "Piscart.png", "Qulibot ai.png", "Spotify.png", "Windows 10.png", 
  "Youtube.png", "Zoom.png", "windows 11.png"
];

const newProducts = images.map((img, index) => {
  const title = img.replace(/\.[^/.]+$/, "");
  return `  {
    id: ${index + 1},
    img: '/assets/img/shop/product/${img}',
    trending: true,
    related_images: [
      '/assets/img/shop/product/${img}'
    ],
    thumb_img: '/assets/img/shop/product/${img}',
    parentCategory: 'Software & Subscriptions',
    category: 'Subscriptions',
    brand: 'Digital',
    title: '${title}',
    price: 99,
    rating: 5,
    quantity: 100,
    sm_desc: 'Get access to premium features and elevate your experience with ${title}.',
    sizes: ['Standard'],
    colors: ['Default'],
    weight: 0,
    dimension: 'Digital Delivery',
    reviews: [
      {
        img: '/assets/img/blog/comments/avater-1.png',
        name: 'Verified Buyer',
        time: '1 Month Ago',
        rating: 5,
        review_desc: 'Excellent service and instant delivery. Highly recommended!'
      }
    ],
    details: {
      details_text: 'Instant digital delivery. Fully guaranteed working subscription.',
      details_list: [
        'Instant delivery via email',
        '24/7 Premium Support',
        '100% money back guarantee'
      ],
      details_text_2: 'We pride ourselves on offering the best digital products with maximum reliability.'
    }
  }`;
});

let content = `import { IProduct } from "../types/product-d-t";

const product_data:IProduct[] = [
${newProducts.join(',\n')}
];

export default product_data;
`;

fs.writeFileSync('src/data/product-data.ts', content, 'utf8');
console.log('Successfully generated new product-data.ts with ' + images.length + ' products.');
