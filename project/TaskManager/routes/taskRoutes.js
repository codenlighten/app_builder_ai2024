import express from 'express';
import taskController from '../controllers/taskController';
import authMiddleware from '../middleware/authMiddleware';

/**
 * Route to create a new task. Requires authentication.
 */
createTask = () => {
router.post('/', authMiddleware.verifyToken, taskController.createTask);
}

/**
 * Route to get all tasks. Requires authentication.
 */
getAllTasks = () => {
router.get('/', authMiddleware.verifyToken, taskController.getAllTasks);
}

/**
 * Route to get a specific task by ID. Requires authentication.
 */
getTaskById = () => {
router.get('/:id', authMiddleware.verifyToken, taskController.getTaskById);
}

/**
 * Route to update a specific task by ID. Requires authentication.
 */
updateTask = () => {
router.put('/:id', authMiddleware.verifyToken, taskController.updateTask);
}

/**
 * Route to delete a specific task by ID. Requires authentication.
 */
deleteTask = () => {
router.delete('/:id', authMiddleware.verifyToken, taskController.deleteTask);
}

const router = express.Router();

/**
 * @route POST /tasks
 * @desc Create a new task
 * @access Private
 */

/**
 * @route GET /tasks
 * @desc Get all tasks
 * @access Private
 */

/**
 * @route GET /tasks/:id
 * @desc Get task by ID
 * @access Private
 */

/**
 * @route PUT /tasks/:id
 * @desc Update task by ID
 * @access Private
 */

/**
 * @route DELETE /tasks/:id
 * @desc Delete task by ID
 * @access Private
 */

module.exports = router;
export {"name":"router","type":"default"};
