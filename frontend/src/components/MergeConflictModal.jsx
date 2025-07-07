import React, { useState } from 'react';

const MergeConflictModal = ({ conflict, onResolve, onCancel }) => {
  const [merged, setMerged] = useState(conflict.local);

  const handleMerge = () => {
    onResolve(conflict.taskId, merged);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>⚠️ Merge Conflict</h2>
        <p>Another user has modified this task.</p>

        <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
          <strong>Server Title:</strong> {conflict.server.title} <br />
          <strong>Your Title:</strong> {conflict.local.title}
        </div>

        <input
          value={merged.title}
          onChange={(e) => setMerged({ ...merged, title: e.target.value })}
          placeholder="Merged Title"
        />

        <textarea
          value={merged.description}
          onChange={(e) => setMerged({ ...merged, description: e.target.value })}
          placeholder="Merged Description"
          rows={4}
        />

        <div className="modal-actions">
          <button onClick={handleMerge}>💾 Save Merged</button>
          <button onClick={() => onResolve(conflict.taskId, conflict.server)}>
            Use Server Version
          </button>
          <button onClick={() => onResolve(conflict.taskId, conflict.local)}>
            Overwrite with Mine
          </button>
          <button className="cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MergeConflictModal;
