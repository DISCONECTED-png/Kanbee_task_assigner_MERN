import Task from '../models/Task.js';
import User from '../models/User.js';
import { io } from '../server.js';
import { logAction } from '../utils/logAction.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority } = req.body;

    const existing = await Task.findOne({ title });
    if (existing) return res.status(400).json({ message: 'Task title already exists' });

    const task = await Task.create({
      title,
      description,
      assignedTo,
      status,
      priority,
    });

    io.emit('taskCreated', task);
    await logAction({
      userId: req.user.id,
      taskId: task._id,
      type: 'CREATE',
      description: `Created task "${task.title}"`,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    console.log('[UPDATE] params:', req.params);
    console.log('[UPDATE] body:', req.body);

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // ✅ Conflict handling using updatedAt timestamp
    if (req.body.updatedAt && new Date(req.body.updatedAt).getTime() !== new Date(task.updatedAt).getTime()) {
      return res.status(409).json({
        message: 'Conflict: Task was modified by someone else.',
        latest: task,
      });
    }    

    let changes = [];

    if (req.body.status && req.body.status !== task.status) {
      changes.push(`status to "${req.body.status}"`);
      task.status = req.body.status;
    }
    if (req.body.title && req.body.title !== task.title) {
      changes.push(`title to "${req.body.title}"`);
      task.title = req.body.title;
    }
    if (req.body.description && req.body.description !== task.description) {
      changes.push('description');
      task.description = req.body.description;
    }
    if (req.body.priority && req.body.priority !== task.priority) {
      changes.push(`priority to "${req.body.priority}"`);
      task.priority = req.body.priority;
    }

    await task.save();

    io.emit('taskUpdated', task);

    if (changes.length) {
      await logAction({
        userId: req.user.id,
        taskId: task._id,
        type: 'UPDATE',
        description: `Updated ${changes.join(', ')}`,
      });
    }

    return res.json(task);
  } catch (err) {
    console.error('[ERROR] updateTask failed:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();

    io.emit('taskDeleted', req.params.id);
    await logAction({
      userId: req.user.id,
      taskId: task._id,
      type: 'DELETE',
      description: `Deleted task "${task.title}"`,
    });

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const smartAssign = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const users = await User.find();
    const counts = await Promise.all(users.map(async (user) => {
      const activeCount = await Task.countDocuments({
        assignedTo: user._id,
        status: { $ne: 'Done' },
      });
      return { user, activeCount };
    }));

    const leastBusy = counts.reduce((min, u) =>
      u.activeCount < min.activeCount ? u : min
    );

    task.assignedTo = leastBusy.user._id;
    await task.save();
    await task.populate('assignedTo', 'name email'); // ✅ populate for frontend

    io.emit('taskUpdated', task);

    await logAction({
      userId: req.user.id,
      taskId: task._id,
      type: 'SMART_ASSIGN',
      description: `Smart assigned to ${leastBusy.user.name}`,
    });

    res.status(200).json({
      message: `Task assigned to ${leastBusy.user.name}`,
      task,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
