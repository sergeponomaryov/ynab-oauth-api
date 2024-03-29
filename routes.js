const axios = require('axios');
var routes = function(app) {

  app.post("/token", function(req, res) {
    console.log("Client id: " + process.env.CLIENT_ID);
    if(!req.body.code || !req.body.redirect_url) {
      return res.status(400).send({"status": "error", "message": "Code and redirect url are required"});
    } else {
      axios.post(`https://app.youneedabudget.com/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${req.body.redirect_url}&grant_type=authorization_code&code=${req.body.code}`)
      .then(response => {
        return res.send(response.data);
      }).catch(err => {
        return res.status(err.response.status).send({"status": "error", "message": err.response.data.error_description});
      })
    }
  });
  
  app.post("/refresh", function(req, res) {
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