import Action from '../models/Action.js';
import { io } from '../server.js';
export const logAction = async ({ userId, taskId, type, description }) => {
  const created = await Action.create({
    user: userId,
    task: taskId,
    type,
    description,
  });

  const log = await Action.findById(created._id)
    .populate('user', 'name')
    .populate('task', 'title');

  io.emit('logCreated', log);
};
