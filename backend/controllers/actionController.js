import Action from '../models/Action.js';

export const getActions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const actions = await Action.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('user', 'name email') 
      .populate('task', 'title');

    res.json(actions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch actions', error: err.message });
  }
};
