var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var multer = require('multer');
var path = require('path');
var User = require('../models/user');
var upload = require('../config/multer');

var csrfProtection = csrf();
router.use(csrfProtection);


/*
const storage = multer.diskStorage({
  destination: 'public/images/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');


// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}
*/

/* GET users listing. */
router.get('/signup', notLoggedIn, function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasError: messages.length > 0
  });
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/signin', notLoggedIn, function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasError: messages.length > 0
  });
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/',
  failureFlash: true
}));

router.get('/profile/:id', isLoggedIn, isyourProfile, csrfProtection, function (req, res, next) {
  res.render('user/profile', {
    csrfToken: req.csrfToken()

  });
});

router.post('/profile/:id', csrfProtection, isyourProfile, function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      res.render('user/profile', {
        csrfToken: req.csrfToken(),
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render('user/profile', {
          csrfToken: req.csrfToken(),
          msg: 'Error: No File Selected!'
        });
      } else {
        let user = {};
        user.image = req.file.filename;
        let query = {
          _id: req.params.id
        };
        User.update(query, user, function (err) {
          if (err) {
            console.log(err);
            return;
          } else {
            res.render('user/profile', {
              csrfToken: req.csrfToken(),
              msg: 'File Uploaded!',
              file: '../images/' + req.file.filename
            });
          }
        });

      }
    }
  });
});

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
  next();
});



module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/signin');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function isyourProfile(req, res, next) {
  if(req.isAuthenticated() && req.params.id == req.user._id){
    return next();
  }
  res.render('not authorized');
}