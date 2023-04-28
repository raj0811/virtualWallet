const MoneyRequest = require("../models/moneyRequest")
const Transaction = require("../models/transaction")
const User = require("../models/user")

// render signup
module.exports.signup = function (req, res) {

  if (req.isAuthenticated()) {
    return res.render('profile', {
      title: 'profile'
    })

  }
  return res.render('user_sign_up', {
    title: "Signup"
  })
}


module.exports.signin = function (req, res) {

  if (req.isAuthenticated()) {
    return res.render('home', {
      title: 'profile'
    })

  }
  return res.render('user_sign_in', {
    title: "Signin"
  })
}


// get signup data

module.exports.create = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect('back');
    }

    let wallet = 0;
    console.log(req.body.userType);
    if (req.body.userType === 'Premium') {
      wallet = 2500
    } else if (req.body.userType === 'Non-Premium') {
      wallet = 1000
    } else if (req.body.userType === 'Super-User') {
      wallet = 0
    }
    console.log(wallet);


    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const newUser = await User.create({ ...req.body, walletBalance: wallet });

      return res.redirect('/users/sign-in');
    } else {
      return res.redirect('back');
    }


  } catch (error) {
    console.log("error while signing up:", error);
    return res.redirect('back');
  }
}




// create session


module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in');
  return res.redirect('/');
}


module.exports.destroySession = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/')

  });

}

module.exports.redirectRequest = (req, res) => {
  return res.render('request', {
    title: "request"
  })
}

module.exports.renderPending1 = (req, res) => {
  return res.render('pendingReq', {
    title: "Pending"
  })
}



module.exports.sendmoney = async (req, res) => {
  // const { email, amount } = req.body;

  const email = req.body.email;
  const amount = parseInt(req.body.amount);

  console.log(typeof (amount));


  const recipient = await User.findOne({ email });

  // console.log(recipient);
  if (!recipient) {
    return res.send('User Not Found')
  } else if (recipient.userType === 'Super-User') {
    return res.send(`Can't send or recive money from Super user`)
  }

  if (amount >= req.user.walletBalance) {
    return res.status(400).send('Insufficient balance in wallet');

  }

  const reciver = await User.findById(recipient._id)
  const payeer = await User.findById(req.user._id)

  // console.log(payeer, 'ppp');


  if (payeer.userType === 'Premium') {
    psendMoneyCharge = 3
    preciveMoneyCharge = 1
  } else {
    psendMoneyCharge = 5
    preciveMoneyCharge = 3
  }

  if (reciver.userType === 'Premium') {
    sendMoneyCharge = 3
    reciveMoneyCharge = 1
  } else {
    sendMoneyCharge = 5
    reciveMoneyCharge = 3
  }

  let updatedRecBalance = reciver.walletBalance + amount - (amount * preciveMoneyCharge / 100)

  let updatePayBalance = payeer.walletBalance - amount - (amount * psendMoneyCharge / 100)

  console.log(reciver.walletBalance);
  console.log(amount + 3);


  const updateRec = {
    walletBalance: updatedRecBalance
  }

  const updatePay = {
    walletBalance: updatePayBalance

  }

  User.findByIdAndUpdate(reciver._id, updateRec, { new: true })
    .then(updatedUser => {
      console.log(updatedUser);
    })

  User.findByIdAndUpdate(payeer._id, updatePay, { new: true })
    .then(updatedUser => {
      console.log(updatedUser);
    })


  const transaction = new Transaction({
    sender: payeer._id,
    receiver: reciver._id,
    amount: amount,

  })
  await transaction.save();
  return res.redirect('back')


}

module.exports.requestmoney = async (req, res) => {
  try {
    const { email, amount } = req.body;

    const recipient = await User.findOne({ email });

    if (!recipient) {
      return res.send('User Not Found')
    } else if (recipient.userType === 'Super-User') {
      return res.send(`Can't send or recive money from Super user`)
    }

    const request = await MoneyRequest.create({
      from: req.user._id,
      to: recipient._id,
      amount: req.body.amount
    });

    console.log(recipient);
    return res.redirect('back')


  } catch (err) {
    console.log(err);
  }
}

module.exports.renderPending = async (req, res) => {

  try {
    const pendingRequests = await MoneyRequest.find({
      to: req.user._id,

    }).populate('from', 'name email');


    if (pendingRequests.length === 0) {
      return res.render('pendingReq', {
        message: 'You have no pending money requests',
        title: "req",
        requests: pendingRequests,
      });
    }


    return res.render('pendingReq', {
      requests: pendingRequests,
      title: "req"
    });
  } catch (error) {
    console.error(error);

  }

}








module.exports.accept = async (req, res) => {
  const id = req.query.id
  const request = await MoneyRequest.findById(id)



  const amount = request.amount
  const reciver = await User.findById(request.from)
  const payeer = await User.findById(request.to)


  if (amount >= payeer.walletBalance) {
    return res.status(400).send('Insufficient balance in wallet');
  }

  let sendMoneyCharge, reciveMoneyCharge



  if (payeer.userType === 'Premium') {
    psendMoneyCharge = 3
    preciveMoneyCharge = 1
  } else {
    psendMoneyCharge = 5
    preciveMoneyCharge = 3
  }

  if (reciver.userType === 'Premium') {
    sendMoneyCharge = 3
    reciveMoneyCharge = 1
  } else {
    sendMoneyCharge = 5
    reciveMoneyCharge = 3
  }



  let updatedRecBalance = reciver.walletBalance + amount - (amount * preciveMoneyCharge / 100)

  let updatePayBalance = payeer.walletBalance - amount - (amount * psendMoneyCharge / 100)


  const updateRec = {
    walletBalance: updatedRecBalance
  }

  const updatePay = {
    walletBalance: updatePayBalance

  }

  request.status = 'accepted';
  await request.save();

  console.log(request);


  User.findByIdAndUpdate(request.from, updateRec, { new: true })
    .then(updatedUser => {
      console.log(updatedUser);
    })

  User.findByIdAndUpdate(request.to, updatePay, { new: true })
    .then(updatedUser => {
      console.log(updatedUser);
    })

  const transaction = new Transaction({
    sender: payeer._id,
    receiver: reciver._id,
    amount: amount,

  })
  await transaction.save();

  console.log(transaction);
  return res.redirect('back')
}


module.exports.reject = async (req, res) => {
  try {
    const id = req.query.id
    const request = await MoneyRequest.findById(id)
    request.status = 'rejected';
    await request.save();

    return res.redirect('back')

  } catch (err) {
    console.log(err);
  }

}

module.exports.renderTransaction = async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }]
  })
    .populate('sender')
    .populate('receiver')
    .sort({ date: -1 });

  console.log(transactions);
  return res.render('transaction', {
    transactions: transactions,
    title: "Transaction"
  })
}

module.exports.rendersendmoney = async (req, res) => {
  return res.render('sendmoney', {
    title: "send"
  })
}


module.exports.wallet = async (req, res) => {
  return res.render('wallet', {
    title: "Wallet"
  })
}