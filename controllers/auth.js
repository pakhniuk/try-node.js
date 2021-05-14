const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: req.flash('error')[0],
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password!');
        return res.redirect('/login');
      }

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password!');
          res.redirect('/login');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignUp = (req, res, next) => {
  res.render('auth/singUp', {
    pageTitle: 'Sign Up',
    path: '/signup',
  });
};

exports.postSignUp = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then(user => {
      if (user) {
        req.flash('error', 'User with this email is already exist!');
        return res.redirect('/login');
      }

      bcrypt
        .hash(password, 12) // 12 high secure
        .then(hashedPassword => {
          const newUser = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then(result => {
          transporter.sendMail({
            to: email,
            from: 'Shop',
            subject: 'Sign up succeeded!',
            html: '<h1>You successfully signed up!</h1>',
          });
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.getResetPassword = (req, res, next) => {
  res.render('auth/resetPassword', {
    pageTitle: 'Reset Password',
    path: '/reset-password',
    errorMessage: req.flash('error')[0],
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.redirect('/reset-password');

    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with this email found!');
          return res.redirect('/reset-password');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        transporter.sendMail({
          to: email,
          from: 'Shop',
          subject: 'Sign up succeeded!',
          html: '<h1>You successfully signed up!</h1>',
        });
        res.redirect('/login');
      })
      .catch(err => console.log(err));
  });
};
