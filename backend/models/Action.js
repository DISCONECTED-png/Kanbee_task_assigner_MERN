import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  type: String,
  description: String,
}, {
  timestamps: true  // ✅ this enables createdAt & updatedAt
});

export default mongoose.model('Action', actionSchema);

