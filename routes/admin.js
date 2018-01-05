var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var User = require('../models/user');
var passport = require('passport');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/', needsGroup(true), function (req, res, next) {
	Product.find({}, function (err, products) {
		if (err) {
			console.log(err);
		} else{
			res.render('admin/index',{
				products:products
			});
		}
	});
});


router.get('/add-product', needsGroup(true), csrfProtection,function (req, res, next) {
	res.render('admin/add-product');
});

router.post('/add-product', needsGroup(true), csrfProtection, function (req, res, next) {
	
  //req.checkBody('imagePath','Image is required').notEmpty();
	req.checkBody('title','Title is required').notEmpty();
  req.checkBody('description','Description is required').notEmpty();
  req.checkBody('price','Price is required').notEmpty();
	
  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('admin/add-product', {
      errors:errors
    });
  } else {
		let product = new Product();
		//product.imagePath = req.body.imagePath;		
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;

    product.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','product Added');
        res.redirect('/admin');
      }
    });
  }
});

router.get('/edit-product/:id', needsGroup(true), csrfProtection, function (req, res, next) {
	Product.findById(req.params.id, function(err, product){
    res.render('admin/edit-product', {
      product:product
    });
  });
});


router.post('/edit-product/:id', needsGroup(true), csrfProtection, function(req, res, next){
  let product = {};
  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price;

  let query = {_id:req.params.id};

  Product.update(query, product, function(err){
    if(err){
      console.log(err);
      return;
    } else {
			req.flash('success', 'product Updated');
			res.redirect('/admin');
    }
  });
});

// Delete Article
router.get('/delete-product/:id',needsGroup(true), csrfProtection, function(req, res){
  let query = {_id:req.params.id};
  Product.findById(req.params.id, function(err, product){
		Product.remove(query, function(err){
        if(err){
          console.log(err);
        }
				req.flash('success', 'product Updated');
        res.redirect('/admin');
      });
  });
});



module.exports = router;

function needsGroup(group) {
	return function (req, res, next) {
		if (req.isAuthenticated() && req.user.privilege === group)
			return next();
		else
			res.redirect('/');
	};
}