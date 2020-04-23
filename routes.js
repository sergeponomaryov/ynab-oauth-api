const axios = require('axios');
var cors = require('cors');
var whitelist = ['https://currency-converter-for-ynab.glitch.me/', 'https://cc.lisik.dev']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

var routes = function(app) {

  app.post("/token", cors(corsOptions), function(req, res) {
    if(!req.body.code) {
      return res.status(400).send({"status": "error", "message": "Code is required"});
    } else {
      axios.post(`https://app.youneedabudget.com/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URL}&grant_type=authorization_code&code=${req.body.code}`)
      .then(response => {
        return res.send(response.data);
      }).catch(err => {
        return res.status(err.response.status).send({"status": "error", "message": err.response.data.error_description});
      })
    }
  });
  
  app.post("/refresh", cors(corsOptions), function(req, res) {
    if(!req.body.refresh_token) {
      return res.status(400).send({"status": "error", "message": "Refresh token is required"});
    } else {
      axios.post(`https://app.youneedabudget.com/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${req.body.refresh_token}`)
      .then(response => {
        return res.send(response.data);
      }).catch(err => {
        return res.status(err.response.status).send({"status": "error", "message": err.response.data.error_description});
      })
    }
  });
};
 
module.exports = routes;