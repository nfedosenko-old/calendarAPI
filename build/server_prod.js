/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _db = __webpack_require__(1);

	var _db2 = _interopRequireDefault(_db);

	var _config = __webpack_require__(2);

	var _config2 = _interopRequireDefault(_config);

	var _passport = __webpack_require__(3);

	var _passport2 = _interopRequireDefault(_passport);

	var _user = __webpack_require__(5);

	var _user2 = _interopRequireDefault(_user);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// modules =================================================
	var express = __webpack_require__(10);
	var app = express();
	var mongoose = __webpack_require__(6);
	var session = __webpack_require__(11);
	var bodyParser = __webpack_require__(12);
	var cookieParser = __webpack_require__(13);
	var methodOverride = __webpack_require__(14);
	var passport = __webpack_require__(15);

	// config files


	// set our port
	var port = 9000;

	// connect to our mongoDB database
	mongoose.connect(({"URL":undefined}).MONGOLAB_URI || _db2.default.url);

	mongoose.connection.on('connected', function () {
	  _user2.default.findOne({ email: 'admin@mail.com' }).exec(function (err, adminUser) {
	    if (!adminUser) {
	      console.log('Creating default admin user');
	      _user2.default.create({
	        email: 'admin@mail.com',
	        password: 'admin',
	        admin: true,
	        confirmed: true
	      });
	    }
	  });
	});

	// set app secret
	app.set('superSecret', _config2.default.secret);

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

	(0, _passport2.default)(passport);

	// routes ==================================================
	var router = __webpack_require__(16); // configure our routes

	app.use('/api', express.static('apidoc'));
	app.use('/api', router);

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('/', function (req, res) {
	  res.sendfile('./public/index.html'); // load our public/index.html file
	});

	// start app ===============================================
	// startup our app at http://localhost:8080
	app.listen(port);

	// shoutout to the user
	console.log('Magic happens on port ' + port);

	// expose app

	exports = module.exports = app;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  url: 'mongodb://localhost/koach'
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  secret: '1312311415tzfhjslkfjmasfasnlr129470518nfjsalnljka'
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _user = __webpack_require__(5);

	var _user2 = _interopRequireDefault(_user);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var LocalStrategy = __webpack_require__(8).Strategy;
	var BearerStrategy = __webpack_require__(9).Strategy;

	// load up the user model


	// expose this function to our app using module.exports

	exports.default = function (passport) {
	  passport.use('local-login', new LocalStrategy({
	    usernameField: 'email',
	    passwordField: 'password',
	    session: false
	  }, function (email, password, done) {
	    process.nextTick(function () {
	      _user2.default.findOne({ email: email }, function (err, user) {
	        if (err) {
	          return done(err);
	        }
	        if (!user) {
	          return done(null, false, { error: 'Incorrect email' });
	        }
	        if (!user.verifyPassword(password)) {
	          return done(null, false, { error: 'Incorrect password' });
	        }
	        return done(null, user);
	      });
	    });
	  }));

	  passport.use('bearer', new BearerStrategy(function (token, done) {
	    _user2.default.findOne({ accessToken: token }, function (err, user) {
	      if (err) {
	        return done(err);
	      }
	      if (!user) {
	        return done(null, false, { error: 'Incorrect token' });
	      }
	      return done(null, user, { scope: 'all' });
	    });
	  }));

	  passport.serializeUser(function (user, done) {
	    done(null, user);
	  });
	  passport.deserializeUser(function (obj, done) {
	    done(null, obj);
	  });
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var mongoose = __webpack_require__(6);
	var bcrypt = __webpack_require__(7);

	var userSchema = mongoose.Schema({
	  email: String,
	  password: String,
	  image: String,
	  displayName: String,
	  admin: Boolean,
	  accessToken: String
	});

	userSchema.methods.verifyPassword = function verifyPassword(password) {
	  var user = this;

	  return bcrypt.compareSync(password, user.password);
	};

	userSchema.pre('save', function passwordCheck(next) {
	  var user = this;
	  var SALT_FACTOR = 5;

	  if (!user.isModified('password')) {
	    return next();
	  } else {

	    bcrypt.genSalt(SALT_FACTOR, function (generateError, salt) {
	      if (generateError) {
	        throw new Error(generateError);
	      }

	      bcrypt.hash(user.password, salt, null, function (hashError, hash) {
	        if (hashError) {
	          throw new Error(hashError);
	        }

	        user.password = hash;
	        return next();
	      });
	    });
	  }
	});

	exports.default = mongoose.model('User', userSchema);

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("bcrypt-nodejs");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("passport-local");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("passport-http-bearer");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("express-session");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("method-override");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("passport");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _user = __webpack_require__(5);

	var _user2 = _interopRequireDefault(_user);

	var _usersController = __webpack_require__(17);

	var UsersController = _interopRequireWildcard(_usersController);

	var _tasksController = __webpack_require__(19);

	var TaskController = _interopRequireWildcard(_tasksController);

	var _config = __webpack_require__(2);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var express = __webpack_require__(10);
	var passport = __webpack_require__(15);

	var jwt = __webpack_require__(21);

	var router = express.Router();

	router.get('/docs', function (req, res) {
	  res.sendfile('apidoc/index.html'); // load our public/index.html file
	});

	/**
	 * @api {post} /signup Sign Up the User
	 * @apiName SignUpUser
	 * @apiGroup User
	 *
	 * @apiParam {Object} Object with email and password fields
	 * @apiParamExample {json} Request-Example:
	 *     {
	 *       "email": "emailtest@mail.com",
	 *       "password":"12345"
	 *     }
	 *
	 * @apiSuccess {Object} Object with property about success of operation
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "success":true
	 *     }
	 */
	router.post('/signup', function (req, res) {
	  var user = req.body;

	  if (!user || !user.email || !user.password) {
	    res.send({ error: 'Not all fields are provided!' });
	  }

	  _user2.default.findOne({ email: user.email }).exec(function (err, userWithEmail) {
	    if (userWithEmail) {
	      res.send({ error: 'User with such email already exists!' });
	    } else {
	      _user2.default.create({
	        email: user.email,
	        password: user.password
	      }, function (error) {
	        if (error) {
	          res.json({ success: false, error: error });
	        }

	        res.json({ success: true });
	      });
	    }
	  });
	});

	/**
	 * @api {post} /login Log in the User
	 * @apiName LoginUser
	 * @apiGroup User
	 *
	 * @apiParam {Object} Object with email and password fields
	 * @apiParamExample {json} Request-Example:
	 *     {
	 *       "email": "emailtest@mail.com",
	 *       "password":"12345"
	 *     }
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *    {
	 *     "success": true,
	 *     "message": "Enjoy!",
	 *     "token": "12345",
	 *     "user": {
	 *       "_id": "578665fe73c7d99b0e222d6c",
	 *       "confirmationToken": "5e77af3895918b868d053b5bb77e5332",
	 *       "email": "emailtest@mail.com",
	 *       "password": "$2a$05$MHb6MGYLXpAEvvnBQP5RzetoFFSEjQ3y5nwyE5Eo2dpbE1f1vewTK",
	 *       "__v": 0,
	 *       "accessToken": "12345",
	 *       "confirmed": false
	 *       }
	 *    }
	 * @apiSuccess {Object} Object with property about success of operation
	 */
	router.post('/login', function (req, res, next) {
	  passport.authenticate('local-login', function (authError, user, info) {
	    console.log(authError, user, info);

	    if (authError) {
	      return next(authError);
	    }
	    if (!user) {
	      return res.send(info);
	    }
	    req.logIn(user, function (internalError) {
	      if (internalError) {
	        return next(internalError);
	      }

	      var userForToken = user;

	      userForToken.accessToken = jwt.sign({ userId: user._id }, _config2.default.secret, {
	        expiresIn: 86400 });

	      userForToken.save(function (queryError, userWithToken) {
	        if (queryError) {
	          res.send(queryError);
	        }

	        return res.json({
	          success: true,
	          message: 'Enjoy!',
	          token: user.accessToken,
	          user: userWithToken
	        });
	      });
	    });
	  })(req, res, next);
	});

	router.use(function (req, res, next) {
	  if (req.originalUrl !== 'api/docs') {
	    passport.authenticate('bearer', { session: false }, function (tokenError, user, info) {
	      if (tokenError) {
	        return res.send(tokenError);
	      }

	      if (!user) {
	        return res.send({ error: 'Invalid token!' });
	      }
	      req.logIn(user, function (internalError) {
	        if (internalError) {
	          res.send(internalError);
	        }
	        return next();
	      });
	    })(req, res, next);
	  } else {
	    next();
	  }
	});

	/**
	 * @api {get} /tasks Get All Tasks
	 * @apiName TasksGet
	 * @apiGroup Task
	 *
	 * @apiSuccess {Array} Array of tasks
	 */
	router.get('/tasks', TaskController.getAll);

	/**
	 * @api {post} /tasks Create New Task
	 * @apiName TaskCreate
	 * @apiGroup Task
	 *
	 * @apiSuccess {Array} Task Object
	 */
	router.post('/tasks', TaskController.createTask);

	/**
	 * @api {get} /tasks/:id Get Task By Id
	 * @apiName TaskGetById
	 * @apiGroup Task
	 *
	 * @apiParam {String} Task ID
	 *
	 * @apiParamExample {json} Request-Example:
	 *     {
	 *       "id": "4711"
	 *     }
	 *
	 * @apiSuccess {Object} Task Object
	 */
	router.get('/tasks/:id', TaskController.getOne);

	/**
	 * @api {put} /tasks/:id Update Task By Id
	 * @apiName TaskUpdate
	 * @apiGroup Task
	 *
	 * @apiParam {String} Task ID
	 *
	 * @apiParamExample {json} Request-Example:
	 *     {
	 *       "description": "new test description"
	 *     }
	 *
	 * @apiSuccess {Object} Updated Task Object
	 */
	router.put('/tasks/:id', TaskController.updateTask);

	/**
	 * @api {delete} /tasks/:id Delete Task By Id
	 * @apiName TaskDelete
	 * @apiGroup Task
	 * @apiParam {String} Task ID
	 *
	 * @apiParamExample {json} Request-Example:
	 *     {
	 *       "id": "4711"
	 *     }
	 *
	 * @apiSuccess {Object} Deleted Task
	 */
	router.delete('/tasks/:id', TaskController.deleteTask);

	/**
	 * @api {get} /current-user/tasks Get Current User Tasks
	 * @apiName CurrentUserGetTasks
	 * @apiGroup Task
	 *
	 * @apiSuccess {Array} Current User Tasks
	 */
	router.get('/current-user/tasks', TaskController.getCurrentUserTasks);

	/**
	 * @api {get} /users Get All Users
	 * @apiName UsersGet
	 * @apiGroup User
	 *
	 * @apiSuccess {Array} Array of users
	 */
	router.get('/users', UsersController.getAll);

	/**
	 * @api {get} /current-user Get Current User
	 * @apiName CurrentUserGet
	 * @apiGroup User
	 *
	 * @apiSuccess {Object} User Object
	 */
	router.get('/current-user', UsersController.getCurrentUser);

	/**
	 * @api {put} /current-user Update Current User
	 * @apiName CurrentUserUpdate
	 * @apiGroup User
	 *
	 * @apiSuccess {Object} User Object
	 */
	router.put('/current-user', UsersController.updateCurrentUser);

	/**
	 * @api {post} /users Create User
	 * @apiName UsersPost
	 * @apiPermission admin
	 * @apiGroup User
	 *
	 * @apiParam {Object} New User Object
	 *
	 * @apiSuccess {Object} User Object with token
	 */
	router.post('/users', UsersController.createUser);

	/**
	 * @api {get} /users/:id Get User By Id
	 * @apiName UserGetById
	 * @apiGroup User
	 *
	 * @apiParam {String} User ID
	 *
	 * @apiParamExample {json} Request-Example:
	 *     {
	 *       "id": "4711"
	 *     }
	 *
	 * @apiSuccess {Object} User Object
	 */
	router.get('/users/:id', UsersController.getOne);

	/**
	 * @api {put} /users/:id Update User By Id
	 * @apiName UserUpdate
	 * @apiGroup User
	 *
	 * @apiParam {String} User ID
	 *
	 * @apiParamExample {json} Request-Example:
	 *     {
	 *       "email": "newemail@mail.com"
	 *     }
	 *
	 * @apiSuccess {Object} Updated User Object
	 */
	router.put('/users/:id', UsersController.updateUser);

	/**
	 * @api {delete} /users/:id Delete User By Id
	 * @apiName UserDelete
	 * @apiGroup User
	 * @apiPermission admin
	 * @apiParam {String} User ID
	 *
	 * @apiParamExample {json} Request-Example:
	 *     {
	 *       "id": "4711"
	 *     }
	 *
	 * @apiSuccess {Object} Deleted User
	 */
	router.delete('/users/:id', UsersController.deleteUser);

	module.exports = router;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createUser = createUser;
	exports.getAll = getAll;
	exports.getOne = getOne;
	exports.updateUser = updateUser;
	exports.updateCurrentUser = updateCurrentUser;
	exports.getCurrentUser = getCurrentUser;
	exports.deleteUser = deleteUser;

	var _user = __webpack_require__(5);

	var _user2 = _interopRequireDefault(_user);

	var _requestHandlingHelper = __webpack_require__(18);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Function for creating new user from admin panel
	 * @param req
	 * @param res
	 */
	function createUser(req, res) {
	  var data = req.body;
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);

	  function customQueryCallback(err, user) {
	    if (err) {
	      res.send(err);
	    }

	    if (user) {
	      res.send({ success: false, message: 'User with such email already exists!' });
	    } else {
	      _user2.default.create(data, callback);
	    }
	  }

	  (0, _requestHandlingHelper.accessChecker)(req, res, function () {
	    _user2.default.findOne({ email: data.email }).exec(customQueryCallback);
	  });
	}

	/**
	 * Function for getting all of the users
	 * @param req
	 * @param res
	 */
	function getAll(req, res) {
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);
	  (0, _requestHandlingHelper.accessChecker)(req, res, function () {
	    _user2.default.find().exec(callback);
	  });
	}

	/**
	 * Function for getting user by ID
	 * @param req
	 * @param res
	 */
	function getOne(req, res) {
	  var id = req.params.id;
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);
	  _user2.default.findById(id).exec(callback);
	}

	/**
	 * Function for updating the user from admin panel
	 * @param req
	 * @param res
	 */
	function updateUser(req, res) {
	  var id = req.params.id;
	  var data = req.body;
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);

	  (0, _requestHandlingHelper.accessChecker)(req, res, function () {
	    _user2.default.findById(id).exec(function (queryError, user) {
	      if (queryError) {
	        res.send(queryError);
	      }
	      var foundUser = user;

	      foundUser.email = data.email || user.email;
	      foundUser.displayName = data.displayName || user.displayName;
	      foundUser.image = data.image || user.image;
	      foundUser.admin = typeof data.admin !== 'undefined' ? data.admin : user.admin;
	      foundUser.password = data.password || user.password;

	      foundUser.save(callback);
	    });
	  });
	}

	/**
	 * Function for updating current user
	 * @param req
	 * @param res
	 */
	function updateCurrentUser(req, res) {
	  var user = req.user;
	  var data = req.body;
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);

	  user.email = data.email || user.email;
	  user.displayName = data.displayName || user.displayName;
	  user.image = data.image || user.image;
	  user.password = data.password || user.password;

	  user.weight = data.weight || user.weight;
	  user.height = data.height || user.height;
	  user.age = data.age || user.age;
	  user.heartRate = data.heartRate;
	  user.gender = data.gender || user.gender;

	  if (data.weight && data.height && data.age && data.gender) {
	    user.isDataCaptured = true;
	  }

	  user.save(callback);
	}

	/**
	 * Getting current user object
	 * @param req
	 * @param res
	 */
	function getCurrentUser(req, res) {
	  var user = req.user;

	  res.send(user);
	}

	/**
	 * Function for deleting the user from admin panel
	 * @param req
	 * @param res
	 */
	function deleteUser(req, res) {
	  var id = req.params.id;
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);
	  (0, _requestHandlingHelper.accessChecker)(req, res, function () {
	    _user2.default.findById(id).exec(function (queryError, user) {
	      if (queryError) {
	        res.send(queryError);
	      }
	      user.remove(callback);
	    });
	  });
	}

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.accessChecker = accessChecker;
	exports.responseErrorHandler = responseErrorHandler;
	/**
	 * Function for checking the access level of the user
	 * @param {Object} request
	 * @param {Object} response
	 * @param {Function} fn Function to be called if access level is admin
	 */
	function accessChecker(request, response, fn) {
	  var user = request.user;

	  if (user.admin && typeof fn === 'function') {
	    fn();
	  } else {
	    response.status(403).send('Forbidden');
	  }
	}

	/**
	 * Function for generating callback functions to queries to MongoDB
	 * @param {Object} response Response object
	 * @param {Function=} customCallback Custom callback for the query, not the trivial one
	 * @returns {Function}
	 */
	function responseErrorHandler(response, customCallback) {
	  function callbackHandler(err, data) {
	    if (err) {
	      response.send(err);
	    }

	    response.json(data);
	  }

	  return typeof customCallback === 'function' ? customCallback : callbackHandler;
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getAll = getAll;
	exports.getOne = getOne;
	exports.createTask = createTask;
	exports.updateTask = updateTask;
	exports.deleteTask = deleteTask;
	exports.getCurrentUserTasks = getCurrentUserTasks;

	var _task = __webpack_require__(20);

	var _task2 = _interopRequireDefault(_task);

	var _requestHandlingHelper = __webpack_require__(18);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Function for getting all of the tasks
	 * @param req
	 * @param res
	 */
	function getAll(req, res) {
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);
	  (0, _requestHandlingHelper.accessChecker)(req, res, function () {
	    _task2.default.find().exec(callback);
	  });
	}

	/**
	 * Function for getting task by ID
	 * @param req
	 * @param res
	 */
	function getOne(req, res) {
	  var id = req.params.id;
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);
	  _task2.default.findById(id).exec(callback);
	}

	/**
	 * Function for creating new task
	 * @param req
	 * @param res
	 */
	function createTask(req, res) {
	  var data = req.body;
	  data.userId = req.user._id;

	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);

	  _task2.default.create(data, callback);
	}

	/**
	 * Function for updating the task
	 * @param req
	 * @param res
	 */
	function updateTask(req, res) {
	  var id = req.params.id;
	  var data = req.body;
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);

	  _task2.default.findById(id).exec(function (queryError, task) {
	    if (queryError) {
	      res.send(queryError);
	    }
	    var foundTask = task;

	    foundTask.description = data.description || task.description;
	    foundTask.save(callback);
	  });
	}

	/**
	 * Function for deleting the task
	 * @param req
	 * @param res
	 */
	function deleteTask(req, res) {
	  var id = req.params.id;
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);
	  _task2.default.findById(id).exec(function (queryError, task) {
	    if (queryError) {
	      res.send(queryError);
	    }
	    task.remove(callback);
	  });
	}

	function getCurrentUserTasks(req, res) {
	  var currentUserId = req.user._id;
	  var callback = (0, _requestHandlingHelper.responseErrorHandler)(res);
	  _task2.default.find({ userId: currentUserId }).exec(callback);
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var mongoose = __webpack_require__(6);

	var taskSchema = mongoose.Schema({
	  dateStarted: { type: Date, default: new Date() },
	  userId: mongoose.Schema.Types.ObjectId,
	  description: String
	});

	exports.default = mongoose.model('Task', taskSchema);

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("jsonwebtoken");

/***/ }
/******/ ]);