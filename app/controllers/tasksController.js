import Task from '../models/task';
import {responseErrorHandler, accessChecker} from '../helpers/requestHandlingHelper';

/**
 * Function for getting all of the tasks
 * @param req
 * @param res
 */
export function getAll(req, res) {
  const callback = responseErrorHandler(res);
  accessChecker(req, res, () => {
    Task.find().exec(callback);
  });
}

/**
 * Function for getting task by ID
 * @param req
 * @param res
 */
export function getOne(req, res) {
  const id = req.params.id;
  const callback = responseErrorHandler(res);
  Task.findById(id).exec(callback);
}

/**
 * Function for creating new task
 * @param req
 * @param res
 */
export function createTask(req, res) {
  const data = req.body;
  data.userId = req.user._id;

  const callback = responseErrorHandler(res);

  Task.create(data, callback);
}

/**
 * Function for updating the task
 * @param req
 * @param res
 */
export function updateTask(req, res) {
  const id = req.params.id;
  const data = req.body;
  const callback = responseErrorHandler(res);

  Task.findById(id).exec((queryError, task) => {
    if (queryError) {
      res.send(queryError);
    }
    const foundTask = task;

    foundTask.description = data.description || task.description;
    foundTask.date = data.date || task.date;

    foundTask.save(callback);
  });
}

/**
 * Function for deleting the task
 * @param req
 * @param res
 */
export function deleteTask(req, res) {
  const id = req.params.id;
  const callback = responseErrorHandler(res);
  Task.findById(id).exec((queryError, task) => {
    if (queryError) {
      res.send(queryError);
    }
    task.remove(callback);
  });
}

export function getCurrentUserTasks(req, res) {
  const currentUserId = req.user._id;
  const callback = responseErrorHandler(res);
  Task.find({userId: currentUserId}).exec(callback);
}

