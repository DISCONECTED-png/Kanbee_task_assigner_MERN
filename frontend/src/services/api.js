// ✅ api.js

export const fetchTasks = async (token) => {
  const res = await fetch('https://kanbee-task-assigner-mern.onrender.com/api/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const createTask = async (task, token) => {
  const res = await fetch('https://kanbee-task-assigner-mern.onrender.com/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
    body: new URLSearchParams(task),
  });
  return res.ok ? await res.json() : null;
};

export const updateTaskStatus = async (id, status, token) => {
  if (!token) return;
  await fetch(`https://kanbee-task-assigner-mern.onrender.com/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
};
