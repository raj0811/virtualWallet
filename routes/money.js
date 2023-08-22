const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const passport = require('passport');
const User= require('../models/user')
const crypto = require('crypto')
RAZORPAY_ID_KEY="rzp_test_EKuGtEbTppcZBh"
RAZORPAY_SECRET_KEY="GHPeK6Tw9PmROd7zuNvBnems"

const razorpay = new Razorpay({
    key_id: 'rzp_test_EKuGtEbTppcZBh',
    key_secret: 'GHPeK6Tw9PmROd7zuNvBnems',
  });


  router.post('/add',passport.checkAuthentication, async (req, res, next) => {
    const amount = req.body.amount;
  
    const payment_capture = 1;
    const currency = 'INR';
    
    const options = {
        amount: amount * 100,
        currency,
        receipt: 'receipt_order_123',
        payment_capture,
    };
    
    try {
        const response = await razorpay.orders.create(options);
        // console.log(response);
        console.log('Razorpay Order Response:', response);
        res.render('payment', { order: response,title:"ppp" });
    } catch (error) {
        console.error(error);
        res.send('Error creating Razorpay order');
    }
  });
  const receivedEventIds = new Set();
  const RAZORPAY_SECRET='rajwebhook'

  router.post('/razorpay-webhook00', (req, res) => {

    console.log('razorpayyyy');
    const { body } = req;
    
    const razorpaySignature = req.get('x-razorpay-signature');
  
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_SECRET)
      .update(JSON.stringify(body))
      .digest('hex');
  
    if (expectedSignature === razorpaySignature) {
      // Payment is verified, update the database here
      const paymentAmount = body.payload.payment.entity.amount / 100; // Convert to actual currency
      const userId = body.payload.payment.entity.notes.userId; // Assuming you send user ID as a note during payment
      console.log(paymentAmount);
      // Update the database with the payment amount
      // Example database update code (using a hypothetical database library)
      // updateWallet(userId, paymentAmount);
  
      res.status(200).send('Payment successful');
    } else {
      res.status(400).send('Invalid signature');
    }
  });



  router.post('/razorpay-webhook', async(req, res) => {
    const { body } = req;
    // console.log(body.payload);
    const razorpaySignature = req.get('x-razorpay-signature');
    console.log('webhook');
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_SECRET)
      .update(JSON.stringify(body))
      .digest('hex');
  
    if (expectedSignature === razorpaySignature) {
      // Check if the event ID has already been processed
      if (receivedEventIds.has(body.event_id)) {
        console.log('Duplicate event ID, ignoring:', body.event_id);
        res.status(200).send('Duplicate event');
      } else {
        receivedEventIds.add(body.event_id); // Add event ID to the set
        // Payment is verified, update the database here
        // ...
        const userId = body.payload.payment.entity.notes.userId;
        const paymentAmount = body.payload.payment.entity.amount / 100; // Convert to actual currency
        // const userId = body.payload.payment.entity.notes.userId; // Assuming you send user ID as a note during payment
       
    
        console.log(body.payload.payment.entity.notes);
        // console.log(userId);
        // const user = await User.findById(req.user._id)
        // user.walletBalance=user.walletBalance+paymentAmount
       
        res.status(200).send('Payment successful');
      }
    } else {
      res.status(400).send('Invalid signature');
    }
  });

 

  router.post('/verifyPayment', async (req, res) => {
    const { razorpay_amount, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    // Verify the payment using 
    razorpay.verifyPaymentSignature()
    // Update user's wallet balance in the database
    console.log('success');

    // Redirect or send response as needed
});

  router.post('/complete-payment',async(req,res)=>{
    console.log('ll');
    return res.render("complete",{title:"done"})
  })

  router.get('/add-money',async(req,res)=>{
    return res.render('addMoney',{
        title: "add"
    })
  })
module.exports = router;