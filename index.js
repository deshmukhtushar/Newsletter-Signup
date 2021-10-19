const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const secrets = require("secrets");
const { response } = require('express');

app = express();

app.use(express.static("static"));

app.use(bodyParser.urlencoded(
  { extended: true }
));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields:{
        FNAME:fname,
        LNAME:lname
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us5.api.mailchimp.com/3.0/lists/" + secrets['a7e4f146e3'],
    method: "POST",
    headers: {
      "Authorization": "itushardeshmukh" + secrets['26d6dd95ab6429ba9f68d4e93a91ba9e-us5']
    },
    body: jsonData
  };

  request(options, function (error, response, body) {
    if (error) {
      res.sendFile(__dirname+"/failure.html");
    }
    else {
      if(response.statusCode!=200){
        res.sendFile(__dirname+"/failure.html");
      }else{
        res.sendFile(__dirname+"/success.html");
      }
    }
  });
});

app.post("/backToMain", function (req,res){
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started at port 3000");
});