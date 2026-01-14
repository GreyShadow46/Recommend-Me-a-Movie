const express = require('express');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');
const CryptoJS = require("crypto-js");
const nodemailer = require('nodemailer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const { loadEnvFile } = require('node:process');
loadEnvFile('.env');

const host = process.env.DB_HOST || "";
const mySQLUser = process.env.DB_USER || "";
const mysSQLPassword = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "";
const encryptionKey = process.env.ENCRYPTION_KEY || "";
const emailUser = process.env.EMAIL_USER || "";
const emailPass = process.env.EMAIL_PASS || "";

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later'
});

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "",
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  },
  saveUninitialized: false,
  resave: false,
  name: 'sessionId'
}));

app.listen(8080, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:8080`);
});

// Create connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: host,
  port: 3306,
  user: mySQLUser,
  password: mysSQLPassword,
  database: database,
  charset: 'utf8mb4'
});

// Input validation and sanitization functions
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().substring(0, 255); // Limit length
}

function validateEmail(email) {
  return validator.isEmail(email);
}

function validateUsername(username) {
  // Only allow alphanumeric and underscore, 3-20 characters
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sendMail(greeting, name, email, subject, message) {
  // Validate inputs
  if (!validateEmail(email)) {
    console.error('Invalid email address');
    return;
  }
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
  
  const mailOptions = {
    from: `"Recommend Me a Movie" ${emailUser}`,
    to: email,
    subject: subject,
    html: `<!DOCTYPE html>
      <html><head><title>Recommend Me a Movie</title></head>
      <body><div>
      <p>${greeting} ${escapeHtml(name)},</p>
      <p>${message}</p>
      </div></body></html>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
}

function checkSignIn(req, res, next){
  if(req.session.user && req.session.user.username){
    next();
  } else {
    req.session.warningMessage = "You need to sign in to view that page";
    res.redirect('/signin');
  }
}

function tempSignIn(req, res, next){
  if(req.session.tempUsername){
    next();
  } else {
    req.session.warningMessage = "Something went wrong!";
    res.redirect('/forgotyourpassword');
  }
}

app.get('/', function (req, res) {
  fs.readFile('index.html', function(err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error loading page');
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.get('/unitedkingdom', function (req, res) {
  const currentPage = req.session.currentPage || '/'
  if(req.session.user && req.session.user.username) {
    const username = req.session.user.username;
    
    pool.query("SELECT * FROM country WHERE userName = ?", [username], function (err, result) {
      if (err) {
        console.error(err);
        return res.redirect(currentPage);
      }
      
      if(result.length === 0){
        pool.query("INSERT INTO country (userName, country) VALUES (?, ?)", 
          [username, "uk"], function (err) {
            if (err) console.error(err);
            console.log("1 record inserted");
          });
      } else {
        pool.query("UPDATE country SET country = ? WHERE userName = ?", 
          ["uk", username], function (err) {
            if (err) console.error(err);
            console.log("1 record updated");
          });
      }
    });
  }
  
  req.session.country = "uk";
  res.redirect(currentPage);
});

app.get('/unitedstates', function (req, res) {  
  const currentPage = req.session.currentPage || ''
  if(req.session.user && req.session.user.username) {
    const username = req.session.user.username;
    
    pool.query("SELECT * FROM country WHERE userName = ?", [username], function (err, result) {
      if (err) {
        console.error(err);
        return res.redirect(currentPage);
      }
      
      if(result.length === 0){
        pool.query("INSERT INTO country (userName, country) VALUES (?, ?)", 
          [username, "us"], function (err) {
            if (err) console.error(err);
            console.log("1 record inserted");
          });
      } else {
        pool.query("UPDATE country SET country = ? WHERE userName = ?", 
          ["us", username], function (err) {
            if (err) console.error(err);
            console.log("1 record updated");
          });
      }
    });
  }
  
  req.session.country = "us";
  res.redirect(currentPage);
});

app.get('/signup', function (req, res) {
  req.session.currentPage = '/signup';
  const warning = req.session.warningMessage || '';
  delete req.session.warningMessage;
  
  const escapedWarning = escapeHtml(warning);
  let data = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1><a class="titleText" href="/">Recommend Me a Movie</a></h1></div></div><div class="overview"><h2>Create Account</h2><form method="post" action="/signup" onsubmit="return checkPassword()"><p>Username</p><input type="text" id="username" name="username" class="formInput" required/><p>Password (Must contain: one number, one lower and upper case letter, at least 8 characters)</p><input type="password" id="password" name="password" class="formInput" pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required/><p>Retype Password</p><input type="password" id="retypePassword" name="retypePassword" class="formInput" required/><span id="matchingPassword"></span><p>Email</p><input type="email" id="email" name="email" class="formInput" required/><br /><br /><input type="checkbox" id="agreeToTerms" name="agreeToTerms" onkeyup="checkTerms()" required/><label for="agreeToTerms">I agree to the Recommend Me a Movie <a href>Terms of Use</a> and<a href>Privacy Policy</a></label><span id="checkedTerms"></span><br /><br /><input id="submitButton" name="submitButton" type="submit" value="Continue"/></form><span id="warningMessage" style="color:red;">${escapedWarning}</span><p>Already have an account? <a href="/signin">Sign in</a></p><br></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>`;
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
  return res.end();
});

app.post('/signup', (req, res) => {
  const username = sanitizeInput(req.body.username);
  const email = sanitizeInput(req.body.email);
  const password = req.body.password;
  const userCountry = req.session.country || "uk";
  
  // Validate inputs
  if (!validateUsername(username)) {
    req.session.warningMessage = "Invalid username format";
    return res.redirect('/signup');
  }
  
  if (!validateEmail(email)) {
    req.session.warningMessage = "Invalid email format";
    return res.redirect('/signup');
  }
  
  if (!password || password.length < 8) {
    req.session.warningMessage = "Password must be at least 8 characters";
    return res.redirect('/signup');
  }
  
  pool.query("SELECT * FROM accounts WHERE userName = ?", [username], function (err, result) {
    if (err) {
      console.error(err);
      req.session.warningMessage = "An error occurred";
      return res.redirect('/signup');
    }
    
    if(result.length !== 0){
      req.session.warningMessage = "Username already taken!";
      return res.redirect('/signup');
    } else {
      const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey).toString();
      
      pool.query("INSERT INTO accounts (userName, emailAddress, password, attempts, bannedTime) VALUES (?, ?, ?, 0, 0)", 
        [username, email, encryptedPassword], function (err) {
          if (err) {
            console.error(err);
            req.session.warningMessage = "An error occurred";
            return res.redirect('/signup');
          }
          console.log("1 record inserted");
          
          // Insert country preference
          pool.query("INSERT INTO country (userName, country) VALUES (?, ?)", 
            [username, userCountry], function (err) {
              if (err) console.error(err);
              console.log("1 record inserted");
            });

          const protocol = req.headers['x-forwarded-proto'] || req.protocol;
          const host = req.headers['x-forwarded-host'] || req.get('host');
          const baseUrl = `${protocol}://${host}`;

          sendMail("Hello", username, email, "Verify your Email", 
            `Please press this <a href="${baseUrl}/surveypage1">button</a> to verify your account`);
          
          // Save session before redirect
          req.session.user = {username: username};
          req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/verifyemail');
          });
        });
    }
  });
});

app.get('/signin', function (req, res) {
  req.session.currentPage = '/signin';
  const warning = req.session.warningMessage || '';
  delete req.session.warningMessage;
  
  const escapedWarning = escapeHtml(warning);
  let data = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1><a class="titleText" href="/">Recommend Me a Movie</a></h1></div></div><div class="overview"><h2>Sign In</h2><div><form action="/signin" method="post"><p>Username</p><input type="text" id="username" name="username" class="formInput" required/><p>Password</p><input type="password" id="password" name="password" class="formInput" required/><br /><br /><input id="submitButton" name="submitButton" type="submit" value="Sign In"/></form><span id="warningMessage" style="color:red;">${escapedWarning}</span><br /><a href="/forgotyourpassword">Forgot your Password?</a><br /><a href="/signup">Sign up</a><br><br><br><br><br><br><br><br><br><br><br><br></div></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>`;
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
  return res.end();
});

const passwordCheck = (account, req, res) => {
  const decrypted = CryptoJS.AES.decrypt(account[0].password, encryptionKey);
  const decryptedPassword = decrypted.toString(CryptoJS.enc.Utf8);
  
  if (account[0].attempts >= 3){
    pool.query("UPDATE accounts SET bannedTime = ? WHERE userName = ?", 
      [Date.now(), req.body.username], function (err) {
        if(err) console.error(err);
        console.log("1 record updated");
      });
    
    req.session.warningMessage = "Your account is locked please try again later!";
    return res.redirect('/signin');
  } else if (decryptedPassword === req.body.password){
    pool.query("UPDATE accounts SET attempts = 0 WHERE userName = ?", 
      [req.body.username], function (err) {
        if(err) console.error(err);
        console.log("1 record updated");
      });
    
    pool.query("SELECT country FROM country WHERE userName = ?", 
      [req.body.username], function (err, countryResult) {
        if (!err && countryResult.length > 0) {
          req.session.country = countryResult[0].country;
        } else {
          req.session.country = "uk";
        }
        
        // Set user session and save before redirect
        req.session.user = {username: req.body.username};
        req.session.save((err) => {
          if (err) console.error(err);
          res.redirect('/surveypage6');
        });
      });
  } else {
    pool.query("UPDATE accounts SET attempts = attempts + 1 WHERE userName = ?", 
      [req.body.username], function (err) {
        if(err) console.error(err);
        console.log("1 record updated");
      });
    
    pool.query("SELECT attempts FROM accounts WHERE userName = ?", 
      [req.body.username], function (err, attempt) {
        if(err) {
          console.error(err);
          req.session.warningMessage = "An error occurred";
        } else {
          req.session.warningMessage = `Password not found you have ${4 - attempt[0].attempts} attempt(s) remaining!`;
        }
        res.redirect('/signin');
      });
  }
};

app.post('/signin', authLimiter, (req, res) => {
  const username = sanitizeInput(req.body.username);
  const password = req.body.password;
  
  if (!validateUsername(username)) {
    req.session.warningMessage = "Invalid username";
    return res.redirect('/signin');
  }
  
  pool.query("SELECT * FROM accounts WHERE userName = ?", [username], function (err, account) {
    if (err) {
      console.error(err);
      req.session.warningMessage = "An error occurred";
      return res.redirect('/signin');
    }
    
    if(account.length === 0){
      req.session.warningMessage = "Username not found!";
      return res.redirect('/signin');
    }
    
    if(account[0].bannedTime !== 0){
      if(account[0].bannedTime + (24 * 60 * 60 * 1000) <= Date.now()){
        pool.query("UPDATE accounts SET attempts = 0, bannedTime = 0 WHERE userName = ?", 
          [username], function (err) {
            if(err) console.error(err);
            console.log("1 record updated");
          });
        
        pool.query("SELECT * FROM accounts WHERE userName = ?", 
          [username], function (err, account) {
            if (err) {
              console.error(err);
              return res.redirect('/signin');
            }
            passwordCheck(account, req, res);
          });
      } else {
        req.session.warningMessage = "Your account is locked please try again later!";
        return res.redirect('/signin');
      }
    } else {
      passwordCheck(account, req, res);
    }
  });
});

app.get('/forgotyourpassword', function (req, res) {
  req.session.currentPage = '/forgotyourpassword';
  const warning = req.session.warningMessage || '';
  delete req.session.warningMessage;
  
  const escapedWarning = escapeHtml(warning);
  let data = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1><a class="titleText" href="/">Recommend Me a Movie</a></h1></div></div><div class="overview"><h2>Forgot Your Password</h2><form action="/forgotyourpassword" method="post"><p>Username</p><input type="text" id="username" name="username" class="formInput" required/><p>Email</p><input type="email" id="email" name="email" class="formInput" required/><br /><br /><input id="submitButton" name="submitButton" type="submit" value="Continue"/></form><span id="warningMessage" style="color:red;">${escapedWarning}</span><br><br><br><br><br><br><br><br><br><br><br><br><br /></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>`;
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
  return res.end();
});

app.post('/forgotyourpassword', authLimiter, (req, res) => {
  const username = sanitizeInput(req.body.username);
  const email = sanitizeInput(req.body.email);
  const userCountry = req.session.country || 'uk';
  
  if (!validateUsername(username) || !validateEmail(email)) {
    req.session.warningMessage = "Invalid input";
    return res.redirect('/forgotyourpassword');
  }
  
  pool.query("SELECT * FROM accounts WHERE userName = ? AND emailAddress = ?", 
    [username, email], function (err, result) {
      if (err) {
        console.error(err);
        req.session.warningMessage = "An error occurred";
        return res.redirect('/forgotyourpassword');
      }
      
      if(result.length !== 0){
        req.session.tempUsername = username;
        req.session.save((err) => {
          if (err) console.error(err);
          const protocol = req.headers['x-forwarded-proto'] || req.protocol;
          const host = req.headers['x-forwarded-host'] || req.get('host');
          const baseUrl = `${protocol}://${host}`;

          // Send password reset email with proper HTML link
          sendMail("From", username, email, "Reset Your Password", 
            `Please click this <a href="${baseUrl}/resetyourpassword" style="color: #007bff; text-decoration: none; font-weight: bold;">button</a> to reset your password.`);
          res.redirect('/verifyemail');
        });
      } else {
        req.session.warningMessage = "Username and/or email not found!";
        res.redirect('/forgotyourpassword');
      }
    });
});

app.get('/resetyourpassword', tempSignIn, function (req, res) {
  req.session.currentPage = '/resetyourpassword'
  fs.readFile('resetyourpassword.html', function(err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error loading page');
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.post('/resetyourpassword', (req, res) => {
  const password = req.body.password;
  const username = req.session.tempUsername;
  
  if (!username || !password || password.length < 8) {
    return res.redirect('/forgotyourpassword');
  }
  
  const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey).toString();
  
  pool.query("UPDATE accounts SET password = ?, attempts = 0, bannedTime = 0 WHERE userName = ?", 
    [encryptedPassword, username], function (err) {
      if (err) console.error(err);
      console.log("1 record updated");
      delete req.session.tempUsername;
      res.redirect('/signin');
    });
});

app.get('/verifyemail', function (req, res) {
  req.session.currentPage = '/verifyemail';
  fs.readFile('verifyemail.html', function(err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error loading page');
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.get('/customerfeedback', function (req, res) {
  req.session.currentPage = '/customerfeedback';
  const success = req.session.successMessage || '';
  delete req.session.successMessage;
  
  const escapedSuccess = escapeHtml(success);
  let data = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1><a class="titleText" href="/">Recommend Me a Movie</a></h1></div></div><div class="overview"><h2>Customer Feedback</h2><form action="/customerfeedback" method="post"><p>Name</p><input type="text" id="name" name="name" class="formInput" required /><p>Email</p><input type="email" id="email" name="email" class="formInput" required/><br /><p>Subject</p><input type="text" id="subject" name="subject" class="formInput" required/><p>Message</p><textarea id="message" name="message" rows="4" cols="50" required></textarea><br /><br /><input id="submitButton" name="submitButton" type="submit" value="Submit"/></form><span id="successMessage" style="color:green;">${escapedSuccess}</span></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>`;
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
  return res.end();
});

app.post('/customerfeedback', (req, res) => {
  const name = sanitizeInput(req.body.name);
  const email = sanitizeInput(req.body.email);
  const subject = sanitizeInput(req.body.subject);
  const message = sanitizeInput(req.body.message);
  
  if (!validateEmail(email)) {
    return res.redirect('/customerfeedback');
  }
  
  sendMail(name, emailUser, subject, `Email: ${email} Message: ${message}`);
  req.session.successMessage = "Feedback Successful";
  res.redirect('/customerfeedback');
});

app.get('/surveypage1', checkSignIn, function (req, res) {
    req.session.currentPage = '/surveypage1';
    let data = ''
    const userCountry = req.session.country || "uk";
    if(userCountry === "uk") {
      data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1 class="titleText">Recommend Me a Movie</h1></div><div class="signUp"><p id="showUsername" class="signUpText"></p></div></div><div class="overview"><h2>Which Streaming Services do you own?</h2><p>Pick as many as you like</p><div><form action="/surveypage1" method="post"><div class="border"><div class="labelClass"><label for="netflix">Netflix</label></div><div class="checkboxClass"><input type="checkbox" id="netflix" name="netflix" /></div></div><br /><div class="border"><div class="labelClass"><label for="disneyplus">Disney +</label></div><div class="checkboxClass"><input type="checkbox" id="disneyplus" name="disneyplus" /></div></div><br /><div class="border"><div class="labelClass"><label for="amazonprime">Amazon Prime</label></div><div class="checkboxClass"><input type="checkbox" id="amazonprime" name="amazonprime" /></div></div><br /><div class="border"><div class="labelClass"><label for="nowtv">Now TV</label></div><div class="checkboxClass"><input type="checkbox" id="nowtv" name="nowtv" /></div></div><br /><div class="border"><div class="labelClass"><label for="appletv+">Apple TV +</label></div><div class="checkboxClass"><input type="checkbox" id="appletvplus" name="appletvplus" /></div></div><br /><div class="border"></div></div><br /><input id="submitButton" name="submitButton" type="submit" value="Continue"/></form><br /><br /><br /><br /><br /><br /><br /><br /><br /></div></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>'
    }
    else {
      data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1 class="titleText>Recommend Me a Movie</h1></div><div class="signUp"><p id="showUsername" class="signUpText"></p></div></div><div class="overview"><h2>Which Streaming Services do you own?</h2><p>Pick as many as you like</p><div><form action="/surveypage1" method="post"><div class="border"><div class="labelClass"><label for="netflix">Netflix</label></div><div class="checkboxClass"><input type="checkbox" id="netflix" name="netflix" /></div></div><br /><div class="border"><div class="labelClass"><label for="disneyplus">Disney +</label></div><div class="checkboxClass"><input type="checkbox" id="disneyplus" name="disneyplus" /></div></div><br /><div class="border"><div class="labelClass"><label for="amazonprime">Amazon Prime</label></div><div class="checkboxClass"><input type="checkbox" id="amazonprime" name="amazonprime" /></div></div><br /><div class="border"><div class="labelClass"><label for="appletv+">Apple TV +</label></div><div class="checkboxClass"><input type="checkbox" id="appletvplus" name="appletvplus" /></div></div><br /><div class="border"><div class="labelClass"><label for="peacock">Peacock</label></div><div class="checkboxClass"><input type="checkbox" id="peacock" name="peacock" /></div></div><br /><div class="border"><div class="labelClass"><label for="hulu">Hulu</label></div><div class="checkboxClass"><input type="checkbox" id="hulu" name="hulu" /></div></div><br /><div class="border"><div class="labelClass"><label for="max">Max</label></div><div class="checkboxClass"><input type="checkbox" id="max" name="max" /></div></div><br /><input id="submitButton" name="submitButton" type="submit" value="Continue"/></form><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /></div></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>'
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
});

app.post('/surveypage1', checkSignIn, function (req, res) {
  const username = req.session.user.username;
  pool.query("SELECT * FROM streamingServices WHERE userName = ?", [username], function (err, result) {
    if (err) {
      console.error(err);
      req.session.warningMessage = "An error occurred";
      return res.redirect('/surveypage2');
    }
    
    if(result.length !== 0){
      pool.query("UPDATE streamingServices SET netflix = ?, disneyPlus = ?, amazonPrime = ?, nowTv = ?, appleTvPlus = ?, peacock = ?, max = ?, hulu = ? WHERE userName = ?"
        [(req.body.netflix || ""), (req.body.disneyplus || ""), (req.body.amazonprime || ""), (req.body.nowtv || ""), (req.body.appletvplus || ""), (req.body.max || ""), (req.body.hulu || ""),  username], 
        function (err) {
          if (err) console.error(err);
          console.log("1 record updated");
        });
    } else {
      pool.query("INSERT INTO streamingServices (userName, netflix, disneyPlus, amazonPrime, nowTv, appleTvPlus, peacock, max, hulu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [username, (req.body.netflix || ""), (req.body.disneyplus || ""), (req.body.amazonprime || ""), (req.body.nowtv || ""), (req.body.appletvplus || ""), (req.body.peacock || ""), (req.body.max || ""), (req.body.hulu || "")], 
        function (err) {
          if (err) console.error(err);
          console.log("1 record inserted");
        });
    }
  });
  res.redirect('/surveypage2');
});

app.get('/surveypage2', checkSignIn, function (req, res) {
  req.session.currentPage = '/surveypage2';
  fs.readFile('surveypage2.html', function(err, data) {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.post('/surveypage2', checkSignIn, function (req, res) {
  const username = req.session.user.username;
  
  pool.query("SELECT * FROM favouriteGenres WHERE userName = ?", [username], function (err, result) {
    if (err) {
      console.error(err);
      req.session.warningMessage = "An error occurred";
      return res.redirect('/surveypage2')
    }
    
    if(result.length !== 0){
      pool.query("UPDATE favouriteGenres SET action = ?, comedy = ?, drama = ?, adventure = ?, thriller = ?, crime = ?, romance = ?, scienceFiction = ?, fantasy = ?, family = ?, mystery = ?, biography = ?, history = ?, animation = ?, music = ?, sport = ?, superhero = ?, western = ?, war = ?, horror = ? WHERE userName = ?", 
        [(req.body.action || ""), (req.body.comedy || ""), (req.body.drama || ""), (req.body.adventure || ""), (req.body.thriller || ""), (req.body.crime || ""), (req.body.romance || ""), (req.body.scienceFiction || ""), (req.body.fantasy || ""), (req.body.family || ""), (req.body.mystery || ""), (req.body.biography || ""), (req.body.history || ""), (req.body.animation || ""), (req.body.music || ""), (req.body.sport || ""), (req.body.superhero || ""), (req.body.western || ""), (req.body.war || ""), (req.body.horror || ""), username], 
        function (err) {
          if (err) console.error(err);
          console.log("1 record updated");
        });
    } else {
      pool.query("INSERT INTO favouriteGenres (userName, action, comedy, drama, adventure, thriller, crime, romance, scienceFiction, fantasy, family, mystery, biography, history, animation, music, sport, superhero, western, war, horror) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [username, (req.body.action || ""), (req.body.comedy || ""), (req.body.drama || ""), (req.body.adventure || ""), (req.body.thriller || ""), (req.body.crime || ""), (req.body.romance || ""), (req.body.scienceFiction || ""), (req.body.fantasy || ""), (req.body.family || ""), (req.body.mystery || ""), (req.body.biography || ""), (req.body.history || ""), (req.body.animation || ""), (req.body.music || ""), (req.body.sport || ""), (req.body.superhero || ""), (req.body.western || ""), (req.body.war || ""), (req.body.horror || "")], 
        function (err) {
          if (err) console.error(err);
          console.log("1 record inserted");
        });
    }
  });
  setTimeout(() => {
    res.redirect('/surveypage3');
  }, 500);
});

app.get('/surveypage3', checkSignIn, function (req, res) {
  req.session.currentPage = '/surveypage3';
  const username = req.session.user.username;
  
  pool.query("SELECT * FROM favouriteGenres WHERE userName = ?", [username], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error loading page');
    }
    
    if(result.length !== 0){
      const r = result[0];
      
      // Helper function to determine if checkbox should be disabled and which class to use
      const getBorderClass = (genre) => genre && genre !== '' ? 'disabledTable' : 'borderTable';
      const isDisabled = (genre) => genre && genre !== '' ? 'disabled' : '';
      
      let data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css"/><script src="/index.js"></script><script src="/surveypage3.js"></script></head><body><div class="topBar"><div class="headerClass"><h1 class="titleText">Recommend Me a Movie</h1></div><div class="signUp"><p id="showUsername" class="signUpText">' + escapeHtml(username) + '</p></div></div><div class="overview"><h2>Please pick your 3 least favourite genres?</h2><p>Pick 3</p><div><form action="/surveypage3" method="post" onsubmit="return checkCheckBoxes()"><table><tr><td><div class="' + getBorderClass(r.action) + '"><div class="labelClass"><label for="action">Action</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="action" name="action" value="on" ' + isDisabled(r.action) + '/></div></div><br /></td><td><div class="' + getBorderClass(r.mystery) + '"><div class="labelClass"><label for="mystery">Mystery</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="mystery" name="mystery" value="on" ' + isDisabled(r.mystery) + '/> </div></div><br /></td></tr><tr><td><div class="' + getBorderClass(r.comedy) + '"><div class="labelClass"><label for="comedy">Comedy</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="comedy" name="comedy" value="on" ' + isDisabled(r.comedy) + '/> </div></div><br /></td><td><div class="' + getBorderClass(r.biography) + '"><div class="labelClass"><label for="biography">Biography</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="biography" name="biography" value="on" ' + isDisabled(r.biography) + '/></div></div><br /></td></tr><tr><td><div class="' + getBorderClass(r.drama) + '"><div class="labelClass"><label for="drama">Drama</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="drama" name="drama" value="on" ' + isDisabled(r.drama) + '/></div></div><br /></td><td><div class="' + getBorderClass(r.history) + '"><div class="labelClass"><label for="history">History</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="history" name="history" value="on" ' + isDisabled(r.history) + '/></div></div><br /></td></tr><tr><td><div class="' + getBorderClass(r.adventure) + '"><div class="labelClass"><label for="adventure">Adventure</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="adventure" name="adventure" value="on" ' + isDisabled(r.adventure) + '/></div></div><br /></td><td><div class="' + getBorderClass(r.animation) + '"><div class="labelClass"><label for="animation">Animation</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="animation" name="animation" value="on" ' + isDisabled(r.animation) + '/> </div></div><br /></td></tr><tr><td><div class="' + getBorderClass(r.thriller) + '"><div class="labelClass"><label for="thriller">Thriller</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="thriller" name="thriller" value="on" ' + isDisabled(r.thriller) + '/></div></div><br /></td><td><div class="' + getBorderClass(r.music) + '"><div class="labelClass"><label for="music">Music</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="music" name="music" value="on" ' + isDisabled(r.music) + '/></div></div><br /></td></tr><tr><td><div class="' + getBorderClass(r.crime) + '"><div class="labelClass"><label for="crime">Crime</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="crime" name="crime" value="on" ' + isDisabled(r.crime) + '/></div></div><br /></td><td><div class="' + getBorderClass(r.sport) + '"><div class="labelClass"><label for="sport">Sport</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="sport" name="sport" value="on" ' + isDisabled(r.sport) + '/></div></div><br /></td></tr><tr><td><div class="' + getBorderClass(r.romance) + '"><div class="labelClass"><label for="romance">Romance</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="romance" name="romance" value="on" ' + isDisabled(r.romance) + '/></div></div><br /></td><td><div class="' + getBorderClass(r.superhero) + '"><div class="labelClass"><label for="superhero">Superhero</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="superhero" name="superhero" value="on" ' + isDisabled(r.superhero) + '/></div></div><br /></td></tr><tr><td><div class="' + getBorderClass(r.scienceFiction) + '"><div class="labelClass"><label for="scienceFiction">Science Fiction</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="scienceFiction" name="scienceFiction" value="on" ' + isDisabled(r.scienceFiction) + '/></div></div><br /></td><td><div class="' + getBorderClass(r.western) + '"><div class="labelClass"><label for="western">Western</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="western" name="western" value="on" ' + isDisabled(r.western) + '/></div></div><br /></td></tr><tr><td><div class="' + getBorderClass(r.fantasy) + '"><div class="labelClass"><label for="fantasy">Fantasy</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="fantasy" name="fantasy" value="on" ' + isDisabled(r.fantasy) + '/></div></div><br /></td><td><div class="' + getBorderClass(r.war) + '"><div class="labelClass"><label for="war">War</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="war" name="war" value="on" ' + isDisabled(r.war) + '/></div></div><br /></td></tr><tr><td><div class="' + getBorderClass(r.family) + '"><div class="labelClass"><label for="family">Family</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="family" name="family" value="on" ' + isDisabled(r.family) + '/></div></div><br /></td><td><div class="' + getBorderClass(r.horror) + '"><div class="labelClass"><label for="horror">Horror</label></div><div class="checkboxClass"><input class="3checkboxes" type="checkbox" id="horror" name="horror" value="on" ' + isDisabled(r.horror) + '/></div></div><br /></td></tr></table> <input id="submitButton" name="submitButton" type="submit" value="Continue" /><span id="validChecks"></span><br><br></form></div></div><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>';
      
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    } else {
      res.redirect('/surveypage2');
    }
  });
});

app.post('/surveypage3', checkSignIn, function (req, res) {
  const username = req.session.user.username;
  
  pool.query("SELECT * FROM leastFavouriteGenres WHERE userName = ?", [username], function (err, result) {
    if (err) {
      console.error(err);
      req.session.warningMessage = "An error occurred";
      return res.redirect('/surveypage3');
    }
    
    if(result.length !== 0){
      pool.query("UPDATE leastFavouriteGenres SET action = ?, comedy = ?, drama = ?, adventure = ?, thriller = ?, crime = ?, romance = ?, scienceFiction = ?, fantasy = ?, family = ?, mystery = ?, biography = ?, history = ?, animation = ?, music = ?, sport = ?, superhero = ?, western = ?, war = ?, horror = ? WHERE userName = ?", 
        [(req.body.action || ""), (req.body.comedy || ""), (req.body.drama || ""), (req.body.adventure || ""), (req.body.thriller || ""), (req.body.crime || ""), (req.body.romance || ""), (req.body.scienceFiction || ""), (req.body.fantasy || ""), (req.body.family || ""), (req.body.mystery || ""), (req.body.biography || ""), (req.body.history || ""), (req.body.animation || ""), (req.body.music || ""), (req.body.sport || ""), (req.body.superhero || ""), (req.body.western || ""), (req.body.war || ""), (req.body.horror || ""), username], 
        function (err) {
          if (err) console.error(err);
          console.log("1 record updated");
        });
    } else {
      pool.query("INSERT INTO leastFavouriteGenres (userName, action, comedy, drama, adventure, thriller, crime, romance, scienceFiction, fantasy, family, mystery, biography, history, animation, music, sport, superhero, western, war, horror) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [username, (req.body.action || ""), (req.body.comedy || ""), (req.body.drama || ""), (req.body.adventure || ""), (req.body.thriller || ""), (req.body.crime || ""), (req.body.romance || ""), (req.body.scienceFiction || ""), (req.body.fantasy || ""), (req.body.family || ""), (req.body.mystery || ""), (req.body.biography || ""), (req.body.history || ""), (req.body.animation || ""), (req.body.music || ""), (req.body.sport || ""), (req.body.superhero || ""), (req.body.western || ""), (req.body.war || ""), (req.body.horror || "")], 
        function (err) {
          if (err) console.error(err);
          console.log("1 record inserted");
        });
    }
  });
  res.redirect('/surveypage4');
});

app.get('/surveypage4', checkSignIn, function (req, res) {
  req.session.currentPage = '/surveypage4';
  fs.readFile('surveypage4.html', function(err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error loading page');
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.post('/surveypage4', checkSignIn, function (req, res) {
  const username = req.session.user.username;
  const preference = parseInt(req.body.preference) || 1900;
  
  pool.query("SELECT * FROM movieAge WHERE userName = ?", [username], function (err, result) {
    if (err) {
      console.error(err);
      req.session.warningMessage = "An error occurred";
      return res.redirect('/surveypage4');
    }
    
    if(result.length !== 0){
      pool.query("UPDATE movieAge SET preference = ? WHERE userName = ?", 
        [preference, username], function (err) {
          if (err) console.error(err);
          console.log("1 record updated");
        });
    } else {
      pool.query("INSERT INTO movieAge (userName, preference) VALUES (?, ?)", 
        [username, preference], function (err) {
          if (err) console.error(err);
          console.log("1 record inserted");
        });
    }
  });
  res.redirect('/surveypage5');
});

app.get('/surveypage5', checkSignIn, function (req, res) {
  req.session.currentPage = '/surveypage5';
  fs.readFile('surveypage5.html', function(err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error loading page');
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.post('/surveypage5', checkSignIn, function (req, res) {
  const username = req.session.user.username;
  const preference = parseInt(req.body.preference) || 18;
  
  pool.query("SELECT * FROM suitableAgeRatings WHERE userName = ?", [username], function (err, result) {
    if (err) {
      console.error(err);
      req.session.warningMessage = "An error occurred";
      return res.redirect('/surveypage5');
    }
    
    if(result.length !== 0){
      pool.query("UPDATE suitableAgeRatings SET preference = ? WHERE userName = ?", 
        [preference, username], function (err) {
          if (err) console.error(err);
          console.log("1 record updated");
        });
    } else {
      pool.query("INSERT INTO suitableAgeRatings (userName, preference) VALUES (?, ?)", 
        [username, preference], function (err) {
          if (err) console.error(err);
          console.log("1 record inserted");
        });
    }
  });
  res.redirect('/surveypage6');
});

app.get('/surveypage6', checkSignIn, function (req, res) {
  req.session.currentPage = '/surveypage6'
  fs.readFile('surveypage6.html', function(err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error loading page');
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.get('/recommendation', checkSignIn, function (req, res) { 
  req.session.currentPage = '/recommendation'; 
  // Get current movie from session
  if (!req.session.currentMovie || !req.session.currentMovie.name) {
    return res.redirect('/surveypage6');
  }
  
  const movie = req.session.currentMovie;
  
  let data = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/styles.css" /><script src="/index.js"></script></head><body><div class="topBar"><div class="headerClass"><h1><a class="titleText" href="/">Recommend Me a Movie</a></h1></div><div class="signUp"><a class="signUpText" href="/signout">Sign Out</a></div></div><div class="overview"><h2>You might like this?</h2><p>Recommended for you</p><br><h2 id="name">' + escapeHtml(movie.name) + '</h2><div class="noborder"><div class="recommendationClass"><img src="' + escapeHtml(movie.poster) + '" id="poster" alt="Movie Poster"></div><div class="recommendationClass"><p id="synopsis">Synopsis: ' + escapeHtml(movie.synopsis) + '</p><p id="availableOn">Available On: ' + escapeHtml(movie.availableOn) + '</p><p id="imdb">IMDB: ' + escapeHtml(String(movie.imdb)) + '</p><p id="ageRating">Age Rating: ' + escapeHtml(String(movie.ageRating)) + '</p><p id="genres">Genres: ' + escapeHtml(movie.genres) + '</p><p id="length">Length: ' + escapeHtml(movie.length) + '</p><p id="yearReleased">Year Released: ' + escapeHtml(String(movie.yearReleased)) + '</p><a href="' + escapeHtml(movie.trailer) + '" id="trailer" target="_blank">Watch Trailer</a><br><br></div></div><br><div><form action="/recommendation" method="post"><input type="hidden" name="preference" id="preference" value="' + escapeHtml(movie.preference) + '"><input class="floatLeft" type="submit" value="I am not interested"/></form></div></div><br><br><div class="topBar"><br /><br /><div><a class="countryText" href="/unitedkingdom">United Kingdom</a><a class="countryText" href="/unitedstates">United States</a></div></div></body></html>';
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
  return res.end();
});

app.post('/recommendation', checkSignIn, function (req, res) {
  const username = req.session.user.username;
  const preference = sanitizeInput(req.body.preference);
  const userCountry = req.session.country || "uk";
  
  // Validate preference
  if (!['Movie', 'TVShow', 'Both'].includes(preference)) {
    return res.redirect('/surveypage6');
  }
  
  // Initialize or get index numbers
  pool.query("SELECT * FROM indexNum WHERE userName = ?", [username], function (err, result) {
    if (err) {
      console.error(err);
      req.session.warningMessage = "An error occurred";
      return res.redirect('/surveypage6');
    }
    
    if(result.length === 0){
      pool.query("INSERT INTO indexNum (userName, movieIndex1, movieIndex2, tvIndex1, tvIndex2, bothIndex1, bothIndex2) VALUES (?, 0, 0, 0, 0, 0, 0)", 
        [username], function (err) {
          if (err) console.error(err);
          console.log("1 record inserted");
        });
      
      // Recursive call after insert
      return setTimeout(() => {
        req.app.handle(req, res);
      }, 500);
    }
    
    let i = 0, j = 0;
    
    // Get appropriate indices based on preference
    if(preference === "Movie"){
      i = result[0].movieIndex1;
      j = result[0].movieIndex2;
    } else if(preference === "TV Show"){
      i = result[0].tvIndex1;
      j = result[0].tvIndex2;
    } else if(preference === "Both"){
      i = result[0].bothIndex1;
      j = result[0].bothIndex2;
    } else {
      req.session.warningMessage = "An error occurred";
      return res.redirect('/surveypage6');
    }
    
    const typeCondition = preference !== "Both" ? " AND mats.type = ?" : "";
    const typeParam = preference !== "Both" ? [preference] : [];
    
    // First query - matching favorite genres
    const query1 = `
    SELECT DISTINCT 
      mats.name, mats.poster, mats.synopsis, mats.availableOn, mats.imdb, 
      mats.ageRating, mats.genres, mats.length, mats.yearReleased, mats.trailer
    FROM moviesAndTvShows mats
    INNER JOIN streamingServices ss ON ss.userName = ?
    INNER JOIN favouriteGenres fg ON fg.userName = ?
    INNER JOIN movieAge ma ON ma.userName = ?
    INNER JOIN suitableAgeRatings sar ON sar.userName = ?
    WHERE (
        (mats.netflix = 'on' AND ss.netflix = 'on')
    OR (mats.disneyPlus = 'on' AND ss.disneyPlus = 'on')
    OR (mats.amazonPrime = 'on' AND ss.amazonPrime = 'on')
    OR (mats.nowTv = 'on' AND ss.nowTv = 'on')
    OR (mats.appleTvPlus = 'on' AND ss.appleTvPlus = 'on')
    OR (mats.peacock = 'on' AND ss.peacock = 'on')
    OR (mats.hulu = 'on' AND ss.hulu = 'on')
    OR (mats.max = 'on' AND ss.max = 'on')
    )
    AND (
        (mats.action = 'on' AND fg.action = 'on')
    OR (mats.comedy = 'on' AND fg.comedy = 'on')
    OR (mats.drama = 'on' AND fg.drama = 'on')
    OR (mats.adventure = 'on' AND fg.adventure = 'on')
    OR (mats.crime = 'on' AND fg.crime = 'on')
    OR (mats.romance = 'on' AND fg.romance = 'on')
    OR (mats.scienceFiction = 'on' AND fg.scienceFiction = 'on')
    OR (mats.fantasy = 'on' AND fg.fantasy = 'on')
    OR (mats.family = 'on' AND fg.family = 'on')
    OR (mats.mystery = 'on' AND fg.mystery = 'on')
    OR (mats.biography = 'on' AND fg.biography = 'on')
    OR (mats.history = 'on' AND fg.history = 'on')
    OR (mats.animation = 'on' AND fg.animation = 'on')
    OR (mats.music = 'on' AND fg.music = 'on')
    OR (mats.sport = 'on' AND fg.sport = 'on')
    OR (mats.superhero = 'on' AND fg.superhero = 'on')
    OR (mats.western = 'on' AND fg.western = 'on')
    OR (mats.war = 'on' AND fg.war = 'on')
    OR (mats.horror = 'on' AND fg.horror = 'on')
    )
    AND mats.yearReleased >= ma.preference
    AND mats.country = ?
    AND mats.ageRating <= sar.preference${typeCondition}
    ORDER BY mats.imdb DESC`;
    
    pool.query(query1, [username, username, username, username, userCountry, ...typeParam], function (err, result1) {
      if (err) {
        console.error(err);
        req.session.warningMessage = "An error occurred";
        return res.redirect('/surveypage6');
      }
      
      if (i < result1.length){
        // Set current movie in session
        req.session.currentMovie = {
          name: result1[i].name, 
          preference: preference, 
          poster: result1[i].poster, 
          synopsis: result1[i].synopsis, 
          availableOn: result1[i].availableOn, 
          imdb: result1[i].imdb, 
          ageRating: result1[i].ageRating, 
          genres: result1[i].genres, 
          length: result1[i].length, 
          yearReleased: result1[i].yearReleased, 
          trailer: result1[i].trailer, 
        };
        
        i++;
        
        // Update index
        const indexField = preference === "Movie" ? "movieIndex1" : 
                          preference === "TVShow" ? "tvIndex1" : "bothIndex1";
        pool.query(`UPDATE indexNum SET ${indexField} = ? WHERE userName = ?`, 
          [i, username], function (err) {
            if (err) console.error(err);
            console.log("1 record updated");
          });
        
        res.redirect('/recommendation');
      } else {
        // Second query - broader recommendations excluding least favorites
        const query2 = `
        SELECT DISTINCT 
          mats.name, mats.poster, mats.synopsis, mats.availableOn, mats.imdb, 
          mats.ageRating, mats.genres, mats.length, mats.yearReleased, mats.trailer
        FROM moviesAndTvShows mats
        INNER JOIN streamingServices ss ON ss.userName = ?
        INNER JOIN leastFavouriteGenres lfg ON lfg.userName = ?
        INNER JOIN movieAge ma ON ma.userName = ?
        INNER JOIN suitableAgeRatings sar ON sar.userName = ?
        WHERE (
            (mats.netflix = 'on' AND ss.netflix = 'on')
        OR (mats.disneyPlus = 'on' AND ss.disneyPlus = 'on')
        OR (mats.amazonPrime = 'on' AND ss.amazonPrime = 'on')
        OR (mats.nowTv = 'on' AND ss.nowTv = 'on')
        OR (mats.appleTvPlus = 'on' AND ss.appleTvPlus = 'on')
        )
        AND NOT (
            (mats.action = 'on' AND lfg.action = 'on')
        OR (mats.comedy = 'on' AND lfg.comedy = 'on')
        OR (mats.drama = 'on' AND lfg.drama = 'on')
        OR (mats.adventure = 'on' AND lfg.adventure = 'on')
        OR (mats.crime = 'on' AND lfg.crime = 'on')
        OR (mats.romance = 'on' AND lfg.romance = 'on')
        OR (mats.scienceFiction = 'on' AND lfg.scienceFiction = 'on')
        OR (mats.fantasy = 'on' AND lfg.fantasy = 'on')
        OR (mats.family = 'on' AND lfg.family = 'on')
        OR (mats.mystery = 'on' AND lfg.mystery = 'on')
        OR (mats.biography = 'on' AND lfg.biography = 'on')
        OR (mats.history = 'on' AND lfg.history = 'on')
        OR (mats.animation = 'on' AND lfg.animation = 'on')
        OR (mats.music = 'on' AND lfg.music = 'on')
        OR (mats.sport = 'on' AND lfg.sport = 'on')
        OR (mats.superhero = 'on' AND lfg.superhero = 'on')
        OR (mats.western = 'on' AND lfg.western = 'on')
        OR (mats.war = 'on' AND lfg.war = 'on')
        OR (mats.horror = 'on' AND lfg.horror = 'on')
        )
        AND mats.yearReleased >= ma.preference
        AND mats.country = ?
        AND mats.ageRating <= sar.preference${typeCondition}
        ORDER BY mats.imdb DESC`;

        
        pool.query(query2, [username, username, username, username, userCountry, ...typeParam], function (err, result2) {
          if (err) {
            console.error(err);
            req.session.warningMessage = "An error occurred";
            return res.redirect('/surveypage6');
          }
          
          if(j < result2.length){
            req.session.currentMovie = {
              name: result2[j].name, 
              preference: preference, 
              poster: result2[j].poster, 
              synopsis: result2[j].synopsis, 
              availableOn: result2[j].availableOn, 
              imdb: result2[j].imdb, 
              ageRating: result2[j].ageRating, 
              genres: result2[j].genres, 
              length: result2[j].length, 
              yearReleased: result2[j].yearReleased, 
              trailer: result2[j].trailer, 
            };
            
            j++;
            
            const indexField = preference === "Movie" ? "movieIndex2" : 
                              preference === "TVShow" ? "tvIndex2" : "bothIndex2";
            pool.query(`UPDATE indexNum SET ${indexField} = ? WHERE userName = ?`, 
              [j, username], function (err) {
                if (err) console.error(err);
                console.log("1 record updated");
              });
            
            res.redirect('/recommendation');
          } else {
            // Reset indices and start over
            const resetQuery = preference === "Movie" ? "UPDATE indexNum SET movieIndex1 = 0, movieIndex2 = 0 WHERE userName = ?" : 
                              preference === "TVShow" ? "UPDATE indexNum SET tvIndex1 = 0, tvIndex2 = 0 WHERE userName = ?" : 
                              "UPDATE indexNum SET bothIndex1 = 0, bothIndex2 = 0 WHERE userName = ?";
            
            pool.query(resetQuery, [username], function (err) {
              if (err) console.error(err);
              console.log("Indices reset");
            });
            
            // Show first result again if available
            if(result2.length > 0) {
              req.session.currentMovie = {
                name: result2[0].name, 
                preference: preference, 
                poster: result2[0].poster, 
                synopsis: result2[0].synopsis, 
                availableOn: result2[0].availableOn, 
                imdb: result2[0].imdb, 
                ageRating: result2[0].ageRating, 
                genres: result2[0].genres, 
                length: result2[0].length, 
                yearReleased: result2[0].yearReleased, 
                trailer: result2[0].trailer, 
              };
              res.redirect('/recommendation');
            } else {
              res.send('No more recommendations available. Please adjust your preferences.');
            }
          }
        });
      }
    });
  });
});

app.get('/signout', checkSignIn, function (req, res) {
  req.session.destroy();
  res.redirect('/');
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});