import Action from '../models/Action.js';

export const getAllActions = async (req, res) => {
  try {
    const logs = await Action.find()
      .sort({ createdAt: -1 })         
      .limit(20)                        
      .populate('user', 'name')
      .populate('task', 'title');
      
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs', error: err.message });
  }
};
