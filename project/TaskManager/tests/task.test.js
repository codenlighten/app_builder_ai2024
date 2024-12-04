import request from 'supertest';
import app from '../server';

/**
 * Group of tests for task CRUD operations
 * @param {*} 'Task CRUD Operations'
 * @param {*} () => {
 */
describe = ('Task CRUD Operations', () => {) => {
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'New Task', description: 'Task description' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('task');
    expect(response.body.task.title).toBe('New Task');
  });

  it('should get all tasks', async () => {
    const response = await request(app)
      .get('/api/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.tasks)).toBe(true);
  });

  it('should update a task', async () => {
    const task = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task to Update', description: 'Update description' });

    const response = await request(app)
      .put(`/api/tasks/${task.body.task._id}`)
      .send({ title: 'Updated Task' });

    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe('Updated Task');
  });

  it('should delete a task', async () => {
    const task = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task to Delete', description: 'Delete description' });

    const response = await request(app)
      .delete(`/api/tasks/${task.body.task._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');
  });
}
}

// Import necessary modules for testing
// Use supertest to make requests to the application
// Use Jest for testing framework
// Ensure that all CRUD operations for tasks are covered
export {};
