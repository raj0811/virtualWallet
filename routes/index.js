const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const Razorpay = require('razorpay');
const User=require('../models/user')

RAZORPAY_ID_KEY="rzp_test_EKuGtEbTppcZBh"
RAZORPAY_SECRET_KEY="GHPeK6Tw9PmROd7zuNvBnems"

const razorpay = new Razorpay({
    key_id: 'rzp_test_EKuGtEbTppcZBh',
    key_secret: 'GHPeK6Tw9PmROd7zuNvBnems',
  });





// setv routes
router.get('/', homeController.home);

router.get('/add',async(req,res)=>{
    const userId= req.user._id
    const user= await User.findById(userId)
    res.render('tempadd',{
        title:"Add Money",
        user,
    })
})

router.get('/user',async(req,res)=>{
    const {amt}=req.query
    const amount = parseFloat(amt)
    const userId=req.user._id
    const user = await User.findById(userId)

    user.walletBalance=user.walletBalance+amount
    await user.save()
    res.redirect('/users/wallet')
})
router.use('/users', require('./users'));
router.use('/money',require('./money'))
router.get('/add')


module.exports = router; 