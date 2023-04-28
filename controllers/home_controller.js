const User = require('../models/user')

module.exports.home = async function (req, res) {

  try {


    return res.render('home', {
      title: 'Virtual Wallet',




    });
  } catch (error) {
    console.log('Error rendering home page:', error);
    return res.redirect('back');
  }



}


