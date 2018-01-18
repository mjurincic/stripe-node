import express from 'express';
const router = express.Router();
import User from '../models/user.js';

const templateProps = { title: 'School of Knife Throwing' };

router.post('/create', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      templateProps.errors = [{ message: 'A user with that email already exists' }];
      templateProps.email = req.body.email;
      res.render('signup', templateProps);
    }
    else {
      console.log(req.body);
      var user = new User(req.body);
      user.save((err, user) => {
        if (err) {
          console.log(err);
          templateProps.errors = err.errors;
          templateProps.email = req.body.email;
          res.render('signup', templateProps);
        }
        else {
          req.session.userid = user._id;
          req.session.email = user.email;
          res.redirect('/');
        }
      });
    }
  });
});

router.post('/login', (req, res) => {
  templateProps.email = req.body.email;
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      templateProps.errors = err.errors;
      res.render('login', templateProps);
    }
    else if (!user) {
      templateProps.errors = [{ message: 'No user with that email' }];
      res.render('login', templateProps);
    }
    else if (!user.authenticate(req.body.password)) {
      templateProps.errors = [{ message: 'Incorrect password' }];
      res.render('login', templateProps);
    }
    else {
      req.session.userid = user._id;
      req.session.email = user.email;
      res.redirect('/');
    }
  });
});

export default router;
