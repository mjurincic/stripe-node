import express from 'express';
const router = express.Router();

const templateProps = { title: 'School of Knife Throwing' };

router.get('/', (req, res, next) => {
  if (req.session && req.session.userid) {
  	templateProps.email = req.session.email;
  	return res.render('account', templateProps);
  }
  res.render('signup', templateProps);
});

router.get('/login', (req, res, next) => {
  if (req.session && req.session.userid) { return res.redirect('/'); }
  res.render('login', templateProps);
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.render('login', templateProps);
})


export default router;
