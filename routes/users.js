const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const passport = require('passport');




router.get('/sign-up', usersController.signup);
router.get('/sign-in', usersController.signin);
router.post('/create', usersController.create);


router.post('/create-session', passport.authenticate(
    'local', { failureRedirect: '/users/sign-in' }
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);


router.get('/requestpage', usersController.redirectRequest)
router.get('/pending', usersController.renderPending)

router.post('/requestmoney', usersController.requestmoney)
// router.get('/users/pending', usersController.pending)
router.get('/accept', usersController.accept)
router.get('/reject', usersController.reject)
router.get('/transaction', usersController.renderTransaction)
router.get('/sendmoney', usersController.rendersendmoney)
router.post('/send', usersController.sendmoney)
router.get('/wallet', usersController.wallet)
module.exports = router;