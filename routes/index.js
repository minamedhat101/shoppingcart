var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/product');
var Cart = require('../models/cart');
var User = require('../models/user');
var csrf = require('csurf');


var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.find(function (err, products) {
    if (err) {
      console.log(err);
    } else {
      res.render('shop/index', {
        title: 'Express',
        csrfToken: req.csrfToken(),
        products: products
      });
    }
  });
});


router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    backURL = req.header('Referer') || '/';
    res.redirect(backURL);
    //res.redirect(req.originalUrl);
  });

});

router.get('/product/:id', function (req, res, next) {
  //var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(req.params.id, function (err, product) {
    if (err) {
      console.log(err);
    } else {
      res.render('shop/product-details', {
        title: 'Express',
        csrfToken: req.csrfToken(),        
        product: product
      });
    }
  });
});


router.get('/cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/cart', {
    products: cart.generateArray(),
    csrfToken: req.csrfToken(),            
    totalPrice: cart.totalPrice
  });
});



router.get('/checkout', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {
    products: cart.generateArray(),
    csrfToken: req.csrfToken(),    
    totalPrice: cart.totalPrice
  });
});

module.exports = router;