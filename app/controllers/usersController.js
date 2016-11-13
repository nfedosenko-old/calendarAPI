import User from '../models/user';
import {responseErrorHandler, accessChecker} from '../helpers/requestHandlingHelper';

/**
 * Function for creating new user from admin panel
 * @param req
 * @param res
 */
export function createUser(req, res) {
  const data = req.body;
  const callback = responseErrorHandler(res);

  function customQueryCallback(err, user) {
    if (err) {
      res.send(err);
    }

    if (user) {
      res.send({success: false, message: 'User with such email already exists!'});
    } else {
      User.create(data, callback);
    }
  }

  accessChecker(req, res, () => {
    User.findOne({email: data.email}).exec(customQueryCallback);
  });
}

/**
 * Function for getting all of the users
 * @param req
 * @param res
 */
export function getAll(req, res) {
  const callback = responseErrorHandler(res);
  accessChecker(req, res, () => {
    User.find().exec(callback);
  });
}

/**
 * Function for getting user by ID
 * @param req
 * @param res
 */
export function getOne(req, res) {
  const id = req.params.id;
  const callback = responseErrorHandler(res);
  User.findById(id).exec(callback);
}

/**
 * Function for updating the user from admin panel
 * @param req
 * @param res
 */
export function updateUser(req, res) {
  const id = req.params.id;
  const data = req.body;
  const callback = responseErrorHandler(res);

  accessChecker(req, res, () => {
    User.findById(id).exec((queryError, user) => {
      if (queryError) {
        res.send(queryError);
      }
      const foundUser = user;

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
export function updateCurrentUser(req, res) {
  const user = req.user;
  const data = req.body;
  const callback = responseErrorHandler(res);

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
export function getCurrentUser(req, res) {
  const user = req.user;

  res.send(user);
}

/**
 * Function for deleting the user from admin panel
 * @param req
 * @param res
 */
export function deleteUser(req, res) {
  const id = req.params.id;
  const callback = responseErrorHandler(res);
  accessChecker(req, res, () => {
    User.findById(id).exec((queryError, user) => {
      if (queryError) {
        res.send(queryError);
      }
      user.remove(callback);
    });
  });
}
