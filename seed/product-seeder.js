var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shopping', { useMongoClient: true });
mongoose.Promise = global.Promise;
var products =[ new Product
    ({
    imagePath: 'http://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c05474005.png',
    title: 'Microsoft - Xbox One X 1TB Console',
    description: 'Games play better on Xbox One X. With 40% more power than any other console, experience immersive true 4K gaming. Blockbuster titles look great, run smoothly, and load quickly even on a 1080p screen. Xbox One X also works with all your Xbox One games and accessories as well as Xbox Live, an extemely advanced multiplayer network, giving you more ways to play.',
    price: 949.99
}),

new Product({
    imagePath: 'https://pisces.bbystatic.com/BestBuy_US/images/products/5190/5190001_sa.jpg;maxHeight=460;maxWidth=460',
    title: 'Apple - MacBook Pro® - 13" Display',
    description: 'The new MacBook Pro is razor-thin, featherlight, and now even faster and more powerful than before. It has the brightest, most colorful Mac notebook display. And it has the revolutionary Touch Bar—a Multi-Touch–enabled strip of glass built into the keyboard for instant access to what you want to do, when you want to do it. The new MacBook Pro is built on groundbreaking ideas. And it’s ready for yours.',
    price: 1799.99
}),

new Product({
    imagePath: 'https://www3.lenovo.com/medias/lenovo-laptop-legion-y720-15-front.png?context=bWFzdGVyfGltYWdlc3wyNTQ5NXxpbWFnZS9wbmd8aW1hZ2VzL2g4Zi9oMjIvOTM1OTk5ODYxNTU4Mi5wbmd8YmQ2NzMzMzY1Mzc0MTE2YjMxMzVlOGMwMTk1ZThiNjFlOTlmOGYxMTEzZWEzNzRmNjY1NTA3NTMyMzkxZWQzMQ',
    title: 'Microsoft - Surface Pro – 12.3”',
    description: 'Better than ever, the new Surface Pro gives you a best-in-class laptop, plus the versatility of a studio and tablet. The stunning PixelSense™ Display supports Pen* and touch, while the refined design provides up to 13.5 hours of video playback — 50% more battery life than Surface Pro 4. A powerful Intel® Core™ processor runs full desktop software with ease, ensuring a smooth, productive workflow.!',
    price: 1299.00
}),
new Product({
    imagePath: 'https://i5.walmartimages.com/dfw/4ff9c6c9-2ac9/k2-_ed8b8f8d-e696-4a96-8ce9-d78246f10ed1.v1.jpg',
    title: 'DJI - Mavic Pro Quadcopter with Remote Controller',
    description: 'Capture aerial views smoothly in Ultra HD with this DJI Mavic Pro camera drone. Its FlightAutonomy technology uses ultrasonic range finders and vision sensors to proactively detect and avoid obstacles for safer, obstruction-free flight. This compact and foldable DJI Mavic Pro camera drone has a 7km transmission range thanks to its FCC-compliant remote controller.',
    price: 999.99
}),

];
let done = 0;
for (const product of products) {
    console.log('wwwweeeee');
    product.save(function (err, result){
        done++;
        if (done === products.length) {
            exit();
        }
    });
}
exit = () => mongoose.disconnect();