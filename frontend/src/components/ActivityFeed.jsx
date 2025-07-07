import React, { useEffect, useState } from 'react';
import socket from '../services/socket';

const ActivityFeed = ({ token }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('https://kanbee-task-assigner-mern.onrender.com/api/actions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLogs(data.slice(0, 20)); // Show up to 20 recent logs
      } catch (err) {
        console.error('Failed to fetch activity logs:', err);
      }
    };

    fetchLogs();

    socket.on('logCreated', (newLog) => {
      setLogs((prev) => [newLog, ...prev].slice(0, 20));
    });

    return () => socket.off('logCreated');
  }, [token]);

  const formatTime = (log) => {
    const ts = log.createdAt || log.timestamp;
    if (!ts) return 'just now';

    try {
      const date = new Date(ts);
      return date.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return 'just now';
    }
  };

  return (
    <div className="activity-feed">
      <h3>🕘 Activity Feed</h3>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            <strong>{log.type?.replace(/_/g, ' ') || 'ACTION'}</strong> — {log.description}
            {log.task?.title && (
              <div style={{ fontStyle: 'italic', color: '#ccc' }}>
                📌 Task: {log.task.title}
              </div>
            )}
            <small style={{ color: '#888' }}>
              👤 {log.user?.name || 'System'} • 🕒 {formatTime(log)}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
