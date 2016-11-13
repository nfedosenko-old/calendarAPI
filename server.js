// modules =================================================
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const passport = require('passport');

// config files
import db from './app/config/db';
import config from './app/config/config';
import passportConfig from './app/config/passport';

import User from './app/models/user';

// set our port
const port = process.env.PORT || 9000;

// connect to our mongoDB database
mongoose.connect(process.env.MONGOLAB_URI || db.url);

mongoose.connection.on('connected', () => {
  User.findOne({ email: 'admin@mail.com' }).exec((err, adminUser) => {
    if (!adminUser) {
      console.log('Creating default admin user');
      User.create({
        email: 'admin@mail.com',
        password: 'admin',
        admin: true,
        confirmed: true,
      });
    }
  });
});

// set app secret
app.set('superSecret', config.secret);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(cookieParser());
app.use(session({ secret: 'ilovescotchyscotch', resave: false, saveUninitialized: true }));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// set the static files location /public/img will be /img for users
app.use(express.static('public'));


passportConfig(passport);


// routes ==================================================
const router = require('./app/routes'); // configure our routes

app.use('/api', express.static('apidoc'));
app.use('/api', router);

// frontend routes =========================================================
// route to handle all angular requests
app.get('/', (req, res) => {
  res.sendfile('./public/index.html'); // load our public/index.html file
});

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app

exports = module.exports = app;
