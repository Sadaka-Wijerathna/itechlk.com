const fs = require('fs');

const images = [
    "Amazon.png", "Capcut.png", "ChatGPT.png", "Gemini.png", 
    "Grok AI.png", "Learnado.png", "MS 365.png", "Netflix.png", 
    "Piscart.png", "Qulibot ai.png", "Spotify.png", "Windows 10.png", 
    "Youtube.png", "Zoom.png", "windows 11.png"
];

let content = fs.readFileSync('src/data/product-data.ts', 'utf8');

// Replace all occurrences of old product images
let globalImgIndex = 0;
content = content.replace(/\/assets\/img\/shop\/product\/product_\d+\.png/g, () => {
    let newImg = `/assets/img/shop/product/${images[globalImgIndex % images.length]}`;
    globalImgIndex++;
    return newImg;
});

// Also replace titles sequentially based on the images
const baseTitles = images.map(i => i.replace(/\.png$/i, ''));
let titleIndex = 0;
content = content.replace(/title:\s*['"]([^'"]+)['"]/g, (match) => {
    let newTitle = baseTitles[titleIndex % baseTitles.length];
    titleIndex++;
    return `title: '${newTitle}'`;
});

fs.writeFileSync('src/data/product-data.ts', content, 'utf8');
console.log('Updated product-data.ts replaced', globalImgIndex, 'images and', titleIndex, 'titles.');
