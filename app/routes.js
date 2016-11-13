const express = require('express');
const passport = require('passport');

const jwt = require('jsonwebtoken');

const router = express.Router();

import User from './models/user';

import * as UsersController from './controllers/usersController';
import * as TaskController from './controllers/tasksController';
import config from './config/config';

router.get('/docs', (req, res) => {
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
router.post('/signup', (req, res) => {
  const user = req.body;

  if (!user || !user.email || !user.password) {
    res.send({error: 'Not all fields are provided!'});
  }

  User.findOne({email: user.email}).exec(function (err, userWithEmail) {
    if (userWithEmail) {
      res.send({error: 'User with such email already exists!'});
    } else {
      User.create({
        email: user.email,
        password: user.password,
      }, (error) => {
        if (error) {
          res.json({success: false, error});
        }

        res.json({success: true});
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
router.post('/login', (req, res, next) => {
  passport.authenticate('local-login', (authError, user, info) => {
    console.log(authError, user, info);

    if (authError) {
      return next(authError);
    }
    if (!user) {
      return res.send(info);
    }
    req.logIn(user, (internalError) => {
      if (internalError) {
        return next(internalError);
      }

      const userForToken = user;

      userForToken.accessToken = jwt.sign({userId: user._id}, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });

      userForToken.save((queryError, userWithToken) => {
        if (queryError) {
          res.send(queryError);
        }

        return res.json({
          success: true,
          message: 'Enjoy!',
          token: user.accessToken,
          user: userWithToken,
        });
      });
    });
  })(req, res, next);
});

router.use((req, res, next) => {
  if (req.originalUrl !== 'api/docs') {
    passport.authenticate('bearer', {session: false}, (tokenError, user, info) => {
      if (tokenError) {
        return res.send(tokenError);
      }

      if (!user) {
        return res.send({error: 'Invalid token!'});
      }
      req.logIn(user, (internalError) => {
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
