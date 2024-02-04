const express = require('express');
const fs = require('fs');
const app = express();
const mysql = require('mysql');
const CryptoJS = require("crypto-js");
const nodemailer = require('nodemailer');
let session = require('express-session');
let cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());

app.use(cookieParser());
app.use(session(
  {secret: "Shh, its a secret!"}, 
  {cookie: 30 * 24 * 60 * 60 * 1000}, 
  {saveUninitialized: true}, 
  {resave: true}, 
));

app.listen(8080);

let i = 0;
let j = 0;
const key = "donkey123";
let username = "";
let currentMovie = [];
let warningMessage = "";
let successMessage = "";
let country = "United Kingdom";
let currentPage = "/";
const host = "mydb.crqoq4kyy2iw.eu-west-2.rds.amazonaws.com";
const port = 3306;
const mySQLUser = "admin";
const mysSQLPassword = "Nintendomario100!!";
const database = "mydb";

function sendMail(name, email, subject, message) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'recommendmeamovie1@gmail.com',
        pass: 'kvke jgpo iniv mspe'
    }
   });
   var mailOptions = {
       from: '"Recommend Me a Movie" recommendmeamovie1@gmail.com',
       to: email,
       subject: subject,
       html: '<!DOCTYPE html>'+
       '<html><head><title>Customer Feedback</title>'+
       '</head><body><div>'+
       '<p>' + name + '</p>' +
       '<p>' + message + '</p>' +
       '</div></body></html>'
   };
   transporter.sendMail(mailOptions, function(error, info){
       if(error){
           console.log(error);
       }else{
           console.log('Message sent: ' + info.response);
       };
   });
}

function checkAdminSignIn(req, res, next){
  if(req.session.user && req.session.user.username == "GreyShadow46"){
    next()
  }
  else {
    res.send("You are not authorised to view this page")
  }
}

function checkSignIn(req, res, next){
  if(req.session.user){
    username = req.session.user.username;
    next()
  }
  else {
    warningMessage = "You need to sign in to view that page"
    res.redirect('/signin')
    setTimeout(() => {
      warningMessage = ""
    }, 2000)
  }
}

function tempSignIn(req, res, next){
  if(username){
    next()
  }
  else {
    warningMessage = "Something went wrong!"
    res.redirect('/forgotyourpassword')
    setTimeout(() => {
      warningMessage = ""
    }, 2000)
  }
}

app.get('/', function (req, res) {
  currentPage = '/';
  fs.readFile('index.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.get('/unitedkingdom', function (req, res) {
  country = "United Kingdom"
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    if(username){
      con.query("SELECT * FROM country WHERE userName = '" + username + "'", function (err, result, fields) {
          if(result.length === 0){
            con.query("INSERT INTO country (userName, country) VALUES ('" + username + "', '" + country + "')", function (err, result, fields) {
              if (err) throw err;
              console.log("1 record inserted");
            })
          } else {
            con.query("UPDATE country SET country = '" + country + "' WHERE userName = '" + username + "'", function (err, result, fields) {
              if(err) throw err
              console.log("1 record updated");
            })
          }
      })
    }
  })
  console.log(country);
  res.redirect(currentPage);
})

app.get('/unitedstates', function (req, res) {
  country = "United States"
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    if(username){
      con.query("SELECT * FROM country WHERE userName = '" + username + "'", function (err, result, fields) {
          if(result.length === 0){
            con.query("INSERT INTO country (userName, country) VALUES ('" + username + "', '" + country + "')", function (err, result, fields) {
              if (err) throw err;
              console.log("1 record inserted");
            })
          } else {
            con.query("UPDATE country SET country = '" + country + "' WHERE userName = '" + username + "'", function (err, result, fields) {
              if(err) throw err
              console.log("1 record updated");
            })
          }
      })
    }
  })
  console.log(country);
  res.redirect(currentPage);
})

app.get('/signup', function (req, res) {
  currentPage = '/signup'
  let data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1><a class="titleText" href="/">Recommend Me a Movie</a></h1></div></div><div class="overview"><h2>Create Account</h2><form method="post" action="/signup" onsubmit="return checkPassword()"><p>Username</p><input type="text" id="username" name="username" class="formInput" required/><p>Password (Must contain: one number, one lower and upper case letter, at least 8 characters)</p><input type="password" id="password" name="password" class="formInput" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required/><p>Retype Password</p><input type="password" id="retypePassword" name="retypePassword" class="formInput" required/><span id="matchingPassword"></span><p>Email</p><input type="email" id="email" name="email" class="formInput" required/><br /><br /><input type="checkbox" id="agreeToTerms" name="agreeToTerms" onkeyup="checkTerms()" required/><label for="agreeToTerms">I agree to the Recommend Me a Movie <a href>Terms of Use</a> and<a href>Privacy Policy</a></label><span id="checkedTerms"></span><br /><br /><input id="submitButton" name="submitButton" type="submit" value="Continue"/></form><span id="warningMessage" style="color:red;">' + warningMessage + '</span><p>Already have an account? <a href="/signin">Sign in</a></p><br></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>'
  fs.writeFile("signup.html", data, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully");
      fs.readFile('signup.html', function(err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
    }
  });
});

app.post('/signup', (req, res) => {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM accounts WHERE userName = '" + req.body.username + "'", function (err, result, fields) {
      if(result.length !== 0){
        warningMessage = "Username already taken!"
        res.redirect('/signup')
        setTimeout(() => {
          warningMessage = ""
        }, 2000)
      }
      else {
        con.query("INSERT INTO accounts (userName, emailAddress, password, attempts, bannedTime) VALUES ('" + req.body.username + "', '" + req.body.email + "', '" + CryptoJS.AES.encrypt(req.body.password, key) + "',0, 0)", function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
        con.query("INSERT INTO country (userName, country) VALUES ('" + req.body.username + "', '" + country + "')", function (err, result, fields) {
          if (err) throw err;
          console.log("1 record inserted");
        })
        sendMail(req.body.username, req.body.email, "Verify your Email", 'Please press this <a href="http://ec2-35-178-87-154.eu-west-2.compute.amazonaws.com/surveypage1">button</a> to verify your account');
        let newUser = {username: req.body.username, password: req.body.password};
        req.session.user = newUser;
        res.redirect('/verifyemail');
      }
    })
  })
})

app.get('/signin', function (req, res) {
  currentPage = '/signin'
  let data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1><a class="titleText" href="/">Recommend Me a Movie</a></h1></div></div><div class="overview"><h2>Sign In</h2><div><form action="/signin" method="post"><p>Username</p><input type="text" id="username" name="username" class="formInput" required/><p>Password</p><input type="password" id="password" name="password" class="formInput" required/><br /><br /><input id="submitButton" name="submitButton" type="submit" value="Sign In"/></form><span id="warningMessage" style="color:red;">' + warningMessage + '</span><br /><a href="/forgotyourpassword">Forgot your Password?</a><br /><a href="/signup">Sign up</a><br><br><br><br><br><br><br><br><br><br><br><br></div></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>'
  fs.writeFile("signin.html", data, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully");
      fs.readFile('signin.html', function(err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
    }
  });
})

const passwordCheck = (account, req, res, con) => {
  const decrypted = CryptoJS.AES.decrypt(account[0].password, key)
  if (account[0].attempts > 3){
    con.query("UPDATE accounts SET bannedTime = " + new Date().getTime() + " WHERE userName = '" + req.body.username + "'", function (err, result, fields) {
      if(err) throw err
      console.log("1 record updated");
    })
    warningMessage = "Your account is locked please try again later!"
    res.redirect('/signin')
    setTimeout(() => {
      warningMessage = ""
    }, 2000)
  }
  else if (decrypted.toString(CryptoJS.enc.Utf8) === req.body.password){
    let user = {username: req.body.username, password: req.body.password};
    req.session.user = user;          
    con.query("UPDATE accounts SET attempts = 0 WHERE userName = '" + req.body.username + "'", function (err, result, fields) {
      if(err) throw err
      console.log("1 record updated");
    })
    con.query("SELECT * FROM country WHERE userName = '" + req.body.username + "'", function (err, country, fields) {
      country = country[0].country;
    })
    res.redirect('/surveypage6')
  }
  else {
    con.query("UPDATE accounts SET attempts = " + (account[0].attempts + 1) + " WHERE userName = '" + req.body.username + "'", function (err, result, fields) {
      if(err) throw err
      console.log("1 record updated");
    })
    con.query("SELECT attempts FROM accounts WHERE userName = '" + req.body.username + "'", function (err, attempt, fields) {
      if(err) throw err
      warningMessage = "Password not found you have " + (4 - attempt[0].attempts).toString() + " attempt(s) remaining!"
      res.redirect('/signin')
      setTimeout(() => {
        warningMessage = ""
      }, 2000)
    })
  }
}

app.post('/signin', (req, res) => {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM accounts WHERE userName = '" + req.body.username + "'", function (err, account, fields) {
      if(account.length !== 0){
        if(account[0].bannedTime !== 0){
          if(parseInt(account[0].bannedTime) + (24 * 60 * 60 * 1000) <= new Date().getTime()){
            con.query("UPDATE accounts SET attempts = 0, bannedTime = '' WHERE userName = '" + req.body.username + "'", function (err, result, fields) {
              if(err) throw err
              console.log("1 record updated");
            })
            con.query("SELECT * FROM accounts WHERE userName = '" + req.body.username + "'", function (err, account, fields) {
              passwordCheck(account, req, res, con)
            })
          } else {
            warningMessage = "Your account is locked please try again later!"
            res.redirect('/signin')
            setTimeout(() => {
              warningMessage = ""
            }, 2000)
          }
        }
        else {
          passwordCheck(account, req, res, con)
        }
      }
      else {
        warningMessage = "Username not found!"
        res.redirect('/signin')
        setTimeout(() => {
          warningMessage = ""
        }, 2000)
      }
  })
})
})

app.get('/forgotyourpassword', function (req, res) {
  currentPage = '/forgotyourpassword'
  let data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1><a class="titleText" href="/">Recommend Me a Movie</a></h1></div></div><div class="overview"><h2>Forgot Your Password</h2><form action="/forgotyourpassword" method="post"><p>Username</p><input type="text" id="username" name="username" class="formInput" required/><p>Email</p><input type="email" id="email" name="email" class="formInput" required/><br /><br /><input id="submitButton" name="submitButton" type="submit" value="Continue"/></form><span id="warningMessage" style="color:red;">' + warningMessage + '</span><br><br><br><br><br><br><br><br><br><br><br><br><br /></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>'
  fs.writeFile("forgotyourpassword.html", data, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully");
      fs.readFile('forgotyourpassword.html', function(err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
    }
  });
})

app.post('/forgotyourpassword', (req, res) => {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM accounts WHERE userName = '" + req.body.username + "' AND emailAddress = '" + req.body.email + "'", function (err, result, fields) {
      if(result.length !== 0){
        username = req.body.username;
        sendMail(username, req.body.email, "Reset Your Password", 'Please press this <a href="http://ec2-35-178-87-154.eu-west-2.compute.amazonaws.com/resetyourpassword">button</a> to proceed');
        res.redirect('/verifyemail');
      }
      else {
        warningMessage = "Username and/or email not found!"
        res.redirect('/forgotyourpassword')
        setTimeout(() => {
          warningMessage = ""
        }, 4000)
      }
    })
  })
})

app.get('/resetyourpassword', tempSignIn, function (req, res) {
  currentPage = '/resetyourpassword'
  fs.readFile('resetyourpassword.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.post('/resetyourpassword', (req, res) => {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("UPDATE accounts SET password = '" + CryptoJS.AES.encrypt(req.body.password, key) + "', attempts = 0, bannedTime = 0 WHERE userName = '" + username + "'", function (err, result, fields) {
      if(err) throw err
      console.log("1 record updated");
    })
    res.redirect('/signin')
  })
})

app.get('/verifyemail', function (req, res) {
  currentPage = '/verifyemail'
  fs.readFile('verifyemail.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.get('/customerfeedback', function (req, res) {
  currentPage = '/customerfeedback'
  let data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1><a class="titleText" href="/">Recommend Me a Movie</a></h1></div></div><div class="overview"><h2>Customer Feedback</h2><form action="/customerfeedback" method="post"><p>Name</p><input type="text" id="name" name="name" class="formInput" required /><p>Email</p><input type="email" id="email" name="email" class="formInput" required/><br /><p>Subject</p><input type="text" id="subject" name="subject" class="formInput" required/><p>Message</p><textarea id="message" name="message" rows="4" cols="50" required></textarea><br /><br /><input id="submitButton" name="submitButton" type="submit" value="Submit"/></form><span id="successMessage" style="color:green;">' + successMessage + '</span></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>'
  fs.writeFile("signin.html", data, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully");
      fs.readFile('signin.html', function(err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
    }
  });
})

app.post('/customerfeedback', (req, res) => {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    sendMail(req.body.name, "recommendmeamovie1@gmail.com", req.body.subject, 'Email: ' + req.body.email  + ' Message: ' + req.body.message);
    successMessage = "Feedback Successful"
    res.redirect('/customerfeedback');
    setTimeout(() => {
      successMessage = ""
    }, 2000)
  })
})

app.get('/surveypage1', checkSignIn, function (req, res) {
  currentPage = '/surveypage1'
  let data = "";
  if(country === "United Kingdom") {
    data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1 class="titleText">Recommend Me a Movie</h1></div><div class="signUp"><p id="showUsername" class="signUpText"></p></div></div><div class="overview"><h2>Which Streaming Services do you own?</h2><p>Pick as many as you like</p><div><form action="/surveypage1" method="post"><div class="border"><div class="labelClass"><label for="netflix">Netflix</label></div><div class="checkboxClass"><input type="checkbox" id="netflix" name="netflix" /></div></div><br /><div class="border"><div class="labelClass"><label for="disneyplus">Disney +</label></div><div class="checkboxClass"><input type="checkbox" id="disneyplus" name="disneyplus" /></div></div><br /><div class="border"><div class="labelClass"><label for="amazonprime">Amazon Prime</label></div><div class="checkboxClass"><input type="checkbox" id="amazonprime" name="amazonprime" /></div></div><br /><div class="border"><div class="labelClass"><label for="nowtv">Now TV</label></div><div class="checkboxClass"><input type="checkbox" id="nowtv" name="nowtv" /></div></div><br /><div class="border"><div class="labelClass"><label for="appletv+">Apple TV +</label></div><div class="checkboxClass"><input type="checkbox" id="appletvplus" name="appletvplus" /></div></div><br /><div class="border"></div></div><br /><input id="submitButton" name="submitButton" type="submit" value="Continue"/></form><br /><br /><br /><br /><br /><br /><br /><br /><br /></div></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>'
  }
  else if(country === "United States"){
    data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1 class="titleText>Recommend Me a Movie</h1></div><div class="signUp"><p id="showUsername" class="signUpText"></p></div></div><div class="overview"><h2>Which Streaming Services do you own?</h2><p>Pick as many as you like</p><div><form action="/surveypage1" method="post"><div class="border"><div class="labelClass"><label for="netflix">Netflix</label></div><div class="checkboxClass"><input type="checkbox" id="netflix" name="netflix" /></div></div><br /><div class="border"><div class="labelClass"><label for="disneyplus">Disney +</label></div><div class="checkboxClass"><input type="checkbox" id="disneyplus" name="disneyplus" /></div></div><br /><div class="border"><div class="labelClass"><label for="amazonprime">Amazon Prime</label></div><div class="checkboxClass"><input type="checkbox" id="amazonprime" name="amazonprime" /></div></div><br /><div class="border"><div class="labelClass"><label for="appletv+">Apple TV +</label></div><div class="checkboxClass"><input type="checkbox" id="appletvplus" name="appletvplus" /></div></div><br /><div class="border"><div class="labelClass"><label for="peacock">Peacock</label></div><div class="checkboxClass"><input type="checkbox" id="peacock" name="peacock" /></div></div><br /><div class="border"><div class="labelClass"><label for="hulu">Hulu</label></div><div class="checkboxClass"><input type="checkbox" id="hulu" name="hulu" /></div></div><br /><div class="border"><div class="labelClass"><label for="max">Max</label></div><div class="checkboxClass"><input type="checkbox" id="max" name="max" /></div></div><br /><input id="submitButton" name="submitButton" type="submit" value="Continue"/></form><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /></div></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>'
  }
  fs.writeFile("surveypage1.html", data, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully");
      fs.readFile('surveypage1.html', function(err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
    }
  });
})

app.post('/surveypage1', function (req, res) {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM streamingServices WHERE userName = '" + username + "'", function (err, result) {
      if(result.length !== 0){
        con.query("UPDATE streamingServices SET netflix = '" + (req.body.netflix ?? "") + "', disneyPlus = '" + (req.body.disneyplus ?? "") + "', amazonPrime = '" + (req.body.amazonprime ?? "") + "', nowTv = '" + (req.body.nowtv ?? "") + "', appleTvPlus = '" + (req.body.appletvplus ?? "") + "', peacock = '" + (req.body.peacock ?? "") + "', max = '" + (req.body.max ?? "") + "', hulu = '" + (req.body.hulu ?? "") + "' WHERE userName = '" + username + "'", function (err, result) {
          if (err) throw err;
          console.log("1 record updated");
        });
      }
      else {
        con.query("INSERT INTO streamingServices (userName, netflix, disneyPlus, amazonPrime, nowTv, appleTvPlus, peacock, max, hulu) VALUES ('" + (username ?? "") + "', '" + (req.body.netflix ?? "") + "', '" + (req.body.disneyplus ?? "") + "', '" + (req.body.amazonprime ?? "") + "', '" + (req.body.nowtv ?? "") + "', '" + (req.body.appletvplus ?? "") + (req.body.peacock ?? "") + "', '" + (req.body.max ?? "") + "', hulu = '" + (req.body.hulu ?? "") + "')", function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      }
    });
    res.redirect('/surveypage2');
  })
})

app.get('/surveypage2', checkSignIn, function (req, res) {
  currentPage = '/surveypage2'
  fs.readFile('surveypage2.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.post('/surveypage2', function (req, res) {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM favouriteGenres WHERE userName = '" + username + "'", function (err, result) {
      if(result.length !== 0){
        con.query("UPDATE favouriteGenres SET action = '" + (req.body.action ?? "") + "', comedy = '" + (req.body.comedy ?? "") + "', drama = '" + (req.body.drama ?? "") + "', adventure = '" + (req.body.adventure ?? "") + "', thriller = '" + (req.body.thriller ?? "") + "', crime = '" + (req.body.crime ?? "") + "', romance = '" + (req.body.romance ?? "") + "', scienceFiction = '" + (req.body.scienceFiction ?? "") + "', fantasy = '" + (req.body.fantasy ?? "") + "', family = '" + (req.body.family ?? "") + "', mystery = '" + (req.body.mystery ?? "") + "', biography = '" + (req.body.biography ?? "") + "', history = '" + (req.body.history ?? "") + "', animation = '" + (req.body.animation ?? "") + "', music = '" + (req.body.music ?? "") + "', sport = '" + (req.body.sport ?? "") + "', superhero = '" + (req.body.superhero ?? "") + "', western = '" + (req.body.western ?? "") + "', war = '" + (req.body.war ?? "") + "', horror = '" + (req.body.horror ?? "") + "' WHERE userName = '" + username + "'", function (err, result) {
          if (err) throw err;
          console.log("1 record updated");
        });
      }
      else {
        con.query("INSERT INTO favouriteGenres (userName, action, comedy, drama, adventure, thriller, crime, romance, scienceFiction, fantasy, family, mystery, biography, history, animation, music, sport, superhero, western, war, horror) VALUES ('" + (username ?? "") + "', '" + (req.body.action ?? "") + "', '" + (req.body.comedy ?? "") + "', '" + (req.body.drama ?? "") + "', '" + (req.body.adventure ?? "") + "', '" + (req.body.thriller ?? "") + "', '" + (req.body.crime ?? "") + "', '" + (req.body.romance ?? "") + "', '" + (req.body.scienceFiction ?? "") + "', '" + (req.body.fantasy ?? "") + "', '" + (req.body.family ?? "") + "', '" + (req.body.mystery ?? "") + "', '" + (req.body.biography ?? "") + "', '" + (req.body.history ?? "") + "', '" + (req.body.animation ?? "") + "', '" + (req.body.music ?? "") + "', '" + (req.body.sport ?? "") + "', '" + (req.body.superhero ?? "") + "', '" + (req.body.western ?? "") + "', '" + (req.body.war ?? "") + "', '" + (req.body.horror ?? "") + "')", function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      }
    });
  })
  res.redirect('/surveypage3');
})

app.get('/surveypage3', checkSignIn, function (req, res) {
  currentPage = '/surveypage3'
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM favouriteGenres WHERE userName = '" + username + "'", function (err, result) {
      if(result.length !== 0){
        let data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css"/><script src="/index.js"></script><script src="/surveypage3.js"></script></head><body><div class="topBar"><div class="headerClass"><h1 class="titleText>Recommend Me a Movie</h1></div><div class="signUp"><p id="showUsername" class="signUpText"></p></div></div><div class="overview"><h2>Please pick your 3 least favourite genres?</h2><p>Pick 3</p><div><form action="/surveypage3" method="post" onsubmit="return checkCheckBoxes()"><table><tr><td><div class="borderTable"><div class="labelClass"><label for="action">Action</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="action" name="action" value="' + result[0].action + '"/></div></div><br /></td><td><div class="borderTable"><div class="labelClass"><label for="mystery">Mystery</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="mystery" name="mystery" value="' + result[0].mystery + '"/> </div></div><br /></td></tr><tr><td><div class="borderTable"><div class="labelClass"><label for="comedy">Comedy</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="comedy" name="comedy" value="' + result[0].comedy + '"/> </div></div><br /></td><td><div class="borderTable"><div class="labelClass"><label for="biography">Biography</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="biography" name="biography" value="' + result[0].biography + '"/></div></div><br /></td></tr><tr><td><div class="borderTable"><div class="labelClass"><label for="drama">Drama</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="drama" name="drama" value="' + result[0].drama + '"/></div></div><br /></td><td><div class="borderTable"><div class="labelClass"><label for="history">History</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="history" name="history" value="' + result[0].history + '"/></div></div><br /></td></tr><tr><td><div class="borderTable"><div class="labelClass"><label for="adventure">Adventure</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="adventure" name="adventure" value="' + result[0].adventure + '"/></div></div><br /></td><td><div class="borderTable"><div class="labelClass"><label for="animation">Animation</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="animation" name="animation" value="' + result[0].animation + '"/> </div></div><br /></td></tr><tr><td><div class="borderTable"><div class="labelClass"><label for="thriller">Thriller</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="thriller" name="thriller" value="' + result[0].thriller + '"/></div></div><br /></td><td><div class="borderTable"><div class="labelClass"><label for="music">Music</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="music" name="music" value="' + result[0].music + '"/></div></div><br /></td></tr><tr><td><div class="borderTable"><div class="labelClass"><label for="crime">Crime</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="crime" name="crime" value="' + result[0].crime + '"/></div></div><br /></td><td><div class="borderTable"><div class="labelClass"><label for="sport">Sport</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="sport" name="sport" value=' + '/></div></div><br /></td></tr><tr><td><div class="borderTable"><div class="labelClass"><label for="romance">Romance</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="romance" name="romance" value="' + result[0].romance + '"/></div></div><br /></td><td><div class="borderTable"><div class="labelClass"><label for="superhero">Superhero</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="superhero" name="superhero" value="' + result[0].superhero + '"/></div></div><br /></td></tr><tr><td><div class="borderTable"><div class="labelClass"><label for="scienceFiction">Science Fiction</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="scienceFiction" name="scienceFiction" value="' + result[0].scienceFiction + '"/></div></div><br /></td><td><div class="borderTable"><div class="labelClass"><label for="western">Western</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="western" name="western" value="' + result[0].western + '"/></div></div><br /></td></tr><tr><td><div class="borderTable"><div class="labelClass"><label for="fantasy">Fantasy</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="fantasy" name="fantasy" value="' + result[0].fantasy + '"/></div></div><br /></td><td><div class="borderTable"><div class="labelClass"><label for="war">War</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="war" name="war" value="' + result[0].war + '"/></div></div><br /></td></tr><tr><td><div class="borderTable"><div class="labelClass"><label for="family">Family</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="family" name="family" value="' + result[0].family + '"/></div></div><br /></td><td><div class="borderTable"><div class="labelClass"><label for="horror">Horror</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="horror" name="horror" value="' + result[0].horror + '"/></div></div><br /></td></tr></table> <input id="submitButton" name="submitButton" type="submit" value="Continue" /><span id="validChecks"></span><br><br></form></div></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>'
        fs.writeFile("surveypage3.html", data, (err) => {
          if (err)
            console.log(err);
          else {
            console.log("File written successfully");
            fs.readFile('surveypage3.html', function(err, data) {
              if (err) throw err;
              res.writeHead(200, {'Content-Type': 'text/html'});
              res.write(data);
              return res.end();
            });
          }
        });
      }
    });
  })
})

app.post('/surveypage3', function (req, res) {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM leastFavouriteGenres WHERE userName = '" + username + "'", function (err, result) {
      if(result.length !== 0){
        con.query("UPDATE leastFavouriteGenres SET action = '" + (req.body.action ?? "") + "', comedy = '" + (req.body.comedy ?? "") + "', drama = '" + (req.body.drama ?? "") + "', adventure = '" + (req.body.adventure ?? "") + "', thriller = '" + (req.body.thriller ?? "") + "', crime = '" + (req.body.crime ?? "") + "', romance = '" + (req.body.romance ?? "") + "', scienceFiction = '" + (req.body.scienceFiction ?? "") + "', fantasy = '" + (req.body.fantasy ?? "") + "', family = '" + (req.body.family ?? "") + "', mystery = '" + (req.body.mystery ?? "") + "', biography = '" + (req.body.biography ?? "") + "', history = '" + (req.body.history ?? "") + "', animation = '" + (req.body.animation ?? "") + "', music = '" + (req.body.music ?? "") + "', sport = '" + (req.body.sport ?? "") + "', superhero = '" + (req.body.superhero ?? "") + "', western = '" + (req.body.western ?? "") + "', war = '" + (req.body.war ?? "") + "', horror = '" + (req.body.horror ?? "") + "' WHERE userName = '" + username + "'", function (err, result) {
          if (err) throw err;
          console.log("1 record updated");
        });
      }
      else {
        con.query("INSERT INTO leastFavouriteGenres (userName, action, comedy, drama, adventure, thriller, crime, romance, scienceFiction, fantasy, family, mystery, biography, history, animation, music, sport, superhero, western, war, horror) VALUES ('" + (username ?? "") + "', '" + (req.body.action ?? "") + "', '" + (req.body.comedy ?? "") + "', '" + (req.body.drama ?? "") + "', '" + (req.body.adventure ?? "") + "', '" + (req.body.thriller ?? "") + "', '" + (req.body.crime ?? "") + "', '" + (req.body.romance ?? "") + "', '" + (req.body.scienceFiction ?? "") + "', '" + (req.body.fantasy ?? "") + "', '" + (req.body.family ?? "") + "', '" + (req.body.mystery ?? "") + "', '" + (req.body.biography ?? "") + "', '" + (req.body.history ?? "") + "', '" + (req.body.animation ?? "") + "', '" + (req.body.music ?? "") + "', '" + (req.body.sport ?? "") + "', '" + (req.body.superhero ?? "") + "', '" + (req.body.western ?? "") + "', '" + (req.body.war ?? "") + "', '" + (req.body.horror ?? "") + "')", function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      }
    });
  })
  res.redirect('/surveypage4');
})

app.get('/surveypage4', checkSignIn, function (req, res) {
  currentPage = '/surveypage4'
  fs.readFile('surveypage4.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.post('/surveypage4', function (req, res) {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM movieAge WHERE userName = '" + username + "'", function (err, result) {
      if(result.length !== 0){
        con.query("UPDATE movieAge SET preference = '" + (req.body.preference ?? "") + "' WHERE userName = '" + username + "'", function (err, result) {
          if (err) throw err;
          console.log("1 record updated");
        });
      }
      else {
        con.query("INSERT INTO movieAge (userName, preference) VALUES ('" + (username ?? "") + "', '" + (req.body.preference ?? "") + "')", function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      }
    });
    res.redirect('/surveypage5');
  })
})

app.get('/surveypage5', checkSignIn, function (req, res) {
  currentPage = '/surveypage5'
  fs.readFile('surveypage5.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.post('/surveypage5', function (req, res) {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM suitableAgeRatings WHERE userName = '" + username + "'", function (err, result) {
      if(result.length !== 0){
        con.query("UPDATE suitableAgeRatings SET preference = '" + (req.body.preference ?? "") + "' WHERE userName = '" + username + "'", function (err, result) {
          if (err) throw err;
          console.log("1 record updated");
        });
      }
      else {
        con.query("INSERT INTO suitableAgeRatings (userName, preference) VALUES ('" + (username ?? "") + "', '" + (req.body.preference ?? "") + "')", function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      }
    });
    res.redirect('/surveypage6');
  })
})

app.get('/surveypage6', checkSignIn, function (req, res) {
  currentPage = '/surveypage6'
  fs.readFile('surveypage6.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.get('/recommendation', checkSignIn, function (req, res) {
  currentPage = '/recommendation'
  console.log(currentMovie);
  let data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1><a class="titleText" href="/">Recommend Me a Movie</a></h1></div><div class="signUp"><a class="signUpText" href="/signout">Sign Out</a></div></div><div class="overview"><h2>You might like this?</h2><p>Recommended for you</p><br><h2 id="name">' + currentMovie.name + '</h2><div class="noborder"><div class="recommendationClass"><img src=' + currentMovie.poster + ' id="poster"></div><div class="recommendationClass"><p id="synopsis">Synopsis: ' + currentMovie.synopsis + '</p><p id="availableOn">Available On: ' + currentMovie.availableOn + '</p><p id="imdb">IMDB: ' + currentMovie.imdb + '</p><p id="ageRating">Age Rating: ' + currentMovie.ageRating  + '</p><p id="genres">Genres: ' + currentMovie.genres + '</p><p id="length">Length: ' + currentMovie.length + '</p><p id="yearReleased">Year Released: ' + currentMovie.yearReleased + '</p><a href="' + currentMovie.trailer + '" id="trailer" target="_blank">Watch Trailer</a><br><br><a href ="' + currentMovie.link + '" id="link" target="_blank">Watch Now</a></div></div><br><div><form action="/recommendation" method="post"><input type="hidden" name="preference" id="preference" value="' + currentMovie.preference + '"><input class="floatLeft" type="submit" value="I am not interested"/></form></div></div><br><br><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>';
  fs.writeFile("recommendation.html", data, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully");
      fs.readFile('recommendation.html', function(err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
    }
  });
})

app.post('/recommendation', function (req, res) {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM indexNum WHERE userName = '" + username + "'", function (err, result, fields) {
      if(result.length === 0){
        con.query("INSERT INTO indexNum (userName, movieIndex1, movieIndex2, tvIndex1, tvIndex2, bothIndex1, bothIndex2) VALUES ('" + username + "', 0, 0, 0, 0, 0, 0)" , function (err, result, fields) {
          if (err) throw err;
          console.log("1 record inserted");
        })
      }
    })
    setTimeout(() => {
      if(req.body.preference === "Movie"){
        con.query("SELECT movieIndex1, movieIndex2 FROM indexNum WHERE userName = '" + username + "'", function (err, result, fields) {
          i = result[0].movieIndex1
          j = result[0].movieIndex2
        })
      }
      if(req.body.preference === "TVShow"){
        con.query("SELECT tvIndex1, tvIndex2 FROM indexNum WHERE userName = '" + username + "'", function (err, result, fields) {
          i = result[0].tvIndex1
          j = result[0].tvIndex2
        })
      }
      if(req.body.preference === "Both"){
        con.query("SELECT bothIndex1, bothIndex2 FROM indexNum WHERE userName = '" + username + "'", function (err, result, fields) {
          i = result[0].bothIndex1
          j = result[0].bothIndex2
        })
      }
      const type = () => {
        if(req.body.preference !== "Both"){
          return " AND mats.type = '" + req.body.preference + "'"
        } else {
          return ""
        }
      }
      con.query("SELECT DISTINCT mats.name, mats.poster, mats.synopsis, mats.availableOn, mats.imdb as imdb, mats.ageRating, mats.genres, mats.length, mats.yearReleased, mats.trailer, mats.link FROM moviesAndTvShows mats INNER JOIN streamingServices ss ON ss.userName = '" + username +  "' INNER JOIN favouriteGenres fg ON fg.userName = '" + username + "' INNER JOIN movieAge ma ON ma.userName = '" + username + "' INNER JOIN suitableAgeRatings sar ON sar.userName = '" + username  + "' WHERE ((mats.netflix <> '' AND mats.netflix = ss.netflix) OR (mats.disneyPlus <> '' AND mats.disneyPlus = ss.disneyPlus) OR (mats.amazonPrime <> '' AND mats.amazonPrime = ss.amazonPrime) OR (mats.nowTv <> '' AND mats.nowTv = ss.nowTv) OR (mats.appleTvPlus <> '' AND mats.appleTvPlus = ss.appleTvPlus) OR (mats.peacock <> '' AND mats.peacock = ss.peacock) OR (mats.hulu <> '' AND mats.hulu = ss.hulu) OR (mats.max <> '' AND mats.max = ss.max)) AND ((mats.action <> '' AND mats.action = fg.action) OR (mats.comedy <> '' AND mats.comedy = fg.comedy) OR (mats.drama <> '' AND mats.drama = fg.drama) OR (mats.adventure <> '' AND mats.adventure = fg.adventure) OR (mats.crime <> '' AND mats.crime = fg.crime) OR (mats.romance <> '' AND mats.romance = fg.romance) OR (mats.scienceFiction <> '' AND mats.scienceFiction = fg.scienceFiction) OR (mats.fantasy <> '' AND mats.fantasy = fg.fantasy) OR (mats.family <> '' AND mats.family = fg.family) OR (mats.mystery <> '' AND mats.mystery = fg.mystery) OR (mats.biography <> '' AND mats.biography = fg.biography) OR (mats.history <> '' AND mats.history = fg.history) OR (mats.animation <> '' AND mats.animation = fg.animation) OR (mats.music <> '' AND mats.music = fg.music) OR (mats.sport <> '' AND mats.sport =  fg.sport) OR (mats.superhero <> '' AND mats.superhero  = fg.superhero) OR (mats.western <> '' AND mats.western = fg.western) OR (mats.war <> '' AND mats.war = fg.war) OR (mats.horror <> '' AND mats.horror = fg.horror)) AND mats.yearReleased >= ma.preference AND mats.country = '" + country + "' AND mats.ageRating <= sar.preference" + type() + " ORDER BY imdb DESC;", function (err, result, fields) {
        if (i < result.length){
          currentMovie = {name: result[i].name, preference: req.body.preference, poster: result[i].poster, synopsis: result[i].synopsis, availableOn: result[i].availableOn, imdb: result[i].imdb, ageRating: result[i].ageRating, genres: result[i].genres, length: result[i].length, yearReleased: result[i].yearReleased, trailer: result[i].trailer, link: result[i].link};
          res.redirect('/recommendation');
          i++;
          if(req.body.preference === "Movie"){
            con.query("UPDATE indexNum SET movieIndex1 = " + i + " WHERE userName = '" + username + "';", function (err, result, fields) {
              if (err) throw err;
              console.log("1 record updated");
            })
          }
          if(req.body.preference === "TVShow"){
            con.query("UPDATE indexNum SET tvIndex1 = " + i + " WHERE userName = '" + username + "';", function (err, result, fields) {
              if (err) throw err;
              console.log("1 record updated");
            })
          }
          if(req.body.preference === "Both") {
            con.query("UPDATE indexNum SET bothIndex1 = " + i + " WHERE userName = '" + username + "';", function (err, result, fields) {
              if (err) throw err;
              console.log("1 record updated");
            })
          }
        }
        else {
          con.query("SELECT DISTINCT mats.name, mats.poster, mats.synopsis, mats.availableOn, mats.imdb as imdb, mats.ageRating, mats.genres, mats.length, mats.yearReleased, mats.trailer, mats.link FROM moviesAndTvShows mats INNER JOIN streamingServices ss ON ss.userName = '" + username +  "' INNER JOIN favouriteGenres fg ON fg.userName = '" + username + "' INNER JOIN leastFavouriteGenres lfg ON fg.userName = '" + username + "' INNER JOIN movieAge ma ON ma.userName = '" + username + "' INNER JOIN suitableAgeRatings sar ON sar.userName = '" + username  +"' WHERE ((mats.netflix <> '' AND mats.netflix = ss.netflix) OR (mats.disneyPlus <> '' AND mats.disneyPlus = ss.disneyPlus) OR (mats.amazonPrime <> '' AND mats.amazonPrime = ss.amazonPrime) OR (mats.nowTv <> '' AND mats.nowTv = ss.nowTv) OR (mats.appleTvPlus <> '' AND mats.appleTvPlus = ss.appleTvPlus)) AND ((mats.action <> '' AND mats.action <> fg.action) OR (mats.comedy <> '' AND mats.comedy <> fg.comedy) OR (mats.drama <> '' AND mats.drama <> fg.drama) OR (mats.adventure <> '' AND mats.adventure <> fg.adventure) OR (mats.crime <> '' AND mats.crime <> fg.crime) OR (mats.romance <> '' AND mats.romance <> fg.romance) OR (mats.scienceFiction <> '' AND mats.scienceFiction = fg.scienceFiction) OR (mats.fantasy <> '' AND mats.fantasy <> fg.fantasy) OR (mats.family <> '' AND mats.family <> fg.family) OR (mats.mystery <> '' AND mats.mystery <> fg.mystery) OR (mats.biography <> '' AND mats.biography <> fg.biography) OR (mats.history <> '' AND mats.history <> fg.history) OR (mats.animation <> '' AND mats.animation <> fg.animation) OR (mats.music <> '' AND mats.music <> fg.music) OR (mats.sport <> '' AND mats.sport <>  fg.sport) OR (mats.superhero <> '' AND mats.superhero <> fg.superhero) OR (mats.western <> '' AND mats.western <> fg.western) OR (mats.war <> '' AND mats.war <> fg.war) OR (mats.horror <> '' AND mats.horror <> fg.horror))AND ((mats.action <> '' AND mats.action <> lfg.action) OR (mats.comedy <> '' AND mats.comedy <> lfg.comedy) OR (mats.drama <> '' AND mats.drama <> lfg.drama) OR (mats.adventure <> '' AND mats.adventure <> lfg.adventure) OR (mats.crime <> '' AND mats.crime <> lfg.crime) OR (mats.romance <> '' AND mats.romance <> lfg.romance) OR (mats.scienceFiction <> '' AND mats.scienceFiction <> lfg.scienceFiction) OR (mats.fantasy <> '' AND mats.fantasy <> lfg.fantasy) OR (mats.family <> '' AND mats.family <> lfg.family) OR (mats.mystery <> '' AND mats.mystery <> lfg.mystery) OR (mats.biography <> '' AND mats.biography <> lfg.biography) OR (mats.history <> '' AND mats.history <> lfg.history) OR (mats.animation <> '' AND mats.animation <> lfg.animation) OR (mats.music <> '' AND mats.music <> lfg.music) OR (mats.sport <> '' AND mats.sport <> lfg.sport) OR (mats.superhero <> '' AND mats.superhero <> lfg.superhero) OR (mats.western <> '' AND mats.western <> lfg.western) OR (mats.war <> '' AND mats.war <> lfg.war) OR (mats.horror <> '' AND mats.horror <> lfg.horror)) AND mats.yearReleased >= ma.preference AND mats.country = '" + country + "' AND mats.ageRating <= sar.preference" + type() + " ORDER BY imdb DESC;", function (err, result, fields) {
            if(j < (result.length - 1)){
            currentMovie = {name: result[j].name, preference: req.body.preference, poster: result[j].poster, synopsis: result[j].synopsis, availableOn: result[j].availableOn, imdb: result[j].imdb, ageRating: result[j].ageRating, genres: result[j].genres, length: result[j].length, yearReleased: result[j].yearReleased, trailer: result[j].trailer, link: result[j].link};
            res.redirect('/recommendation');
            j++;
            if(req.body.preference === "Movie"){
              con.query("UPDATE indexNum SET movieIndex2 = " + j + " WHERE username = '" + username + "';", function (err, result, fields) {
                if (err) throw err;
                console.log("1 record updated");
              })
            }
            if(req.body.preference === "TVShow"){
              con.query("UPDATE indexNum SET tvIndex2 = " + j + " WHERE username = '" + username + "';", function (err, result, fields) {
                if (err) throw err;
                console.log("1 record updated");
              })
            }
            if(req.body.preference === "Both"){
              con.query("UPDATE indexNum SET bothIndex2 = " + j + " WHERE username = '" + username + "';", function (err, result, fields) {
                if (err) throw err;
                console.log("1 record updated");
              })
            }
          }
          else {
            currentMovie = {name: result[j].name, preference: req.body.preference, poster: result[j].poster, synopsis: result[j].synopsis, availableOn: result[j].availableOn, imdb: result[j].imdb, ageRating: result[j].ageRating, genres: result[j].genres, length: result[j].length, yearReleased: result[j].yearReleased, trailer: result[j].trailer, link: result[j].link};
            res.redirect('/recommendation');
            if(req.body.preference === "Movie"){
              con.query("UPDATE indexNum SET movieIndex1 = 0, movieIndex2 = 0 WHERE username = '" + username + "';", function (err, result, fields) {
                if (err) throw err;
                console.log("1 record updated");
              })
            }
            if(req.body.preference === "TVShow"){
              con.query("UPDATE indexNum SET tvIndex1 = 0, tvIndex2 = 0 WHERE username = '" + username + "';", function (err, result, fields) {
                if (err) throw err;
                console.log("1 record updated");
              })
            }
            if(req.body.preference === "Both"){
              con.query("UPDATE indexNum SET bothIndex1 = 0, bothIndex2 = 0 WHERE username = '" + username + "';", function (err, result, fields) {
                if (err) throw err;
                console.log("1 record updated");
              })
            }
          }
          })
        }
      })
    }, 2000)
  })
})

app.get('/signout', checkSignIn, function (req, res) {
  currentPage = '/'
  req.session.destroy();
  res.redirect('/');
})

app.get('/addmovie', checkAdminSignIn, function (req, res) {
  currentPage = '/addmovie'
  fs.readFile('addmovie.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.post('/addmovie', function (req, res) {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("INSERT INTO moviesAndTvShows (name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, link, type, netflix, disneyPlus, amazonPrime, nowTv, appleTvPlus, action, comedy, drama, adventure, thriller, crime, romance, scienceFiction, fantasy, family, mystery, biography, history, animation, music, sport, superhero, western, war, horror, country, peacock, hulu, max) VALUES ('" + req.body.name + "', '" + req.body.poster + "', '" + req.body.synopsis + "', '" + req.body.availableOn + "', " + req.body.imdb + ", " + req.body.ageRating + ", '" + req.body.genres + "', '" + req.body.length + "', " + req.body.yearReleased + ", '" + req.body.trailer + "', '" + req.body.link + "', '" + req.body.type + "', '" + (req.body.netflix ?? "") + "', '" + (req.body.disneyplus ?? "") + "', '" + (req.body.amazonprime ?? "") + "', '" + (req.body.nowtv ?? "") + "', '" + (req.body.appletvplus ?? "") + "', '" + (req.body.action ?? "") + "', '" + (req.body.comedy ?? "") + "', '" + (req.body.drama ?? "") + "', '" + (req.body.adventure ?? "") + "', '" + (req.body.thriller ?? "") + "', '" + (req.body.crime ?? "") + "', '" + (req.body.romance ?? "") + "', '" + (req.body.scienceFiction ?? "") + "', '" + (req.body.fantasy ?? "") + "', '" + (req.body.family ?? "") + "', '" + (req.body.mystery ?? "") + "', '" + (req.body.biography ?? "") + "', '" + (req.body.history ?? "") + "', '" + (req.body.animation ?? "") + "', '" + (req.body.music ?? "") + "', '" + (req.body.sport ?? "") + "', '" + (req.body.superhero ?? "") + "', '" + (req.body.western ?? "") + "', '" + (req.body.war ?? "") + "', '" + (req.body.horror ?? "") + "', '" + (req.body.country ?? "") + "', '" + (req.body.peacock ?? "") + "', '" + (req.body.hulu ?? "") + "', '" + (req.body.max ?? "") + "')", function (err, result, fields) {
      if (err) throw err;
      console.log("1 record inserted");
    })
    res.redirect('/addmovie')
  })
})

app.get('/sqlprocessor', checkAdminSignIn, function (req, res) {
  currentPage = '/sqlprocessor'
  fs.readFile('sqlprocessor.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.post('/sqlprocessor', function (req, res) {
  var con = mysql.createConnection({
    host: host,
    port: port,
    user: mySQLUser,
    password: mysSQLPassword,
    database: database
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(req.body.sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    })
    res.redirect('/sqlprocessor')
  })
})
