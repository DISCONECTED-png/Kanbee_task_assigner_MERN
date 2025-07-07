import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityFeed from '../components/ActivityFeed';
import ThemePicker from '../components/ThemePicker';
import MergeConflictModal from '../components/MergeConflictModal';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from '../components/KanbanColumn';
import {
  createTask,
  fetchTasks,
  updateTaskStatus,
} from '../services/api';
import socket from '../services/socket';
import '../App.css';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const STATUSES = ['Todo', 'In Progress', 'Done'];
const COLORS = ['#8884d8', '#ffc658', '#82ca9d'];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conflict, setConflict] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const sensors = useSensors(useSensor(PointerSensor));

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'Todo').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    done: tasks.filter((t) => t.status === 'Done').length,
  };

  const chartData = [
    { name: 'Todo', value: taskStats.todo },
    { name: 'In Progress', value: taskStats.inProgress },
    { name: 'Done', value: taskStats.done },
  ];

  const completionRate = taskStats.total
    ? Math.round((taskStats.done / taskStats.total) * 100)
    : 0;

  useEffect(() => {
    const loadTasks = async () => {
      if (!token) return navigate('/');
      const fetched = await fetchTasks(token);
      setTasks(fetched);
    };
    loadTasks();
  }, [token, navigate]);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Connected to socket:', socket.id);
    });

    socket.on('taskCreated', (task) => {
      setTasks((prev) =>
        prev.some((t) => t._id === task._id) ? prev : [...prev, task]
      );
    });

    socket.on('taskUpdated', (updated) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    });

    socket.on('taskDeleted', (id) => {
      setTasks((prev) => prev.filter((t) => t._id !== id));
    });

    return () => socket.disconnect();
  }, []);
  useEffect(() => {
    const phrases = [
      "Organize your day.",
      "Boost productivity.",
      "Track your progress.",
      "Stay focused.",
    ];

    let current = 0;
    let isDeleting = false;
    let text = '';
    const speed = 80;
    const pause = 1400;

    const el = document.getElementById('typed-text');

    const type = () => {
      const full = phrases[current];
      if (isDeleting) {
        text = full.substring(0, text.length - 1);
      } else {
        text = full.substring(0, text.length + 1);
      }

      if (el) el.innerText = text;

      if (!isDeleting && text === full) {
        setTimeout(() => {
          isDeleting = true;
          type();
        }, pause);
      } else if (isDeleting && text === '') {
        isDeleting = false;
        current = (current + 1) % phrases.length;
        setTimeout(type, speed);
      } else {
        setTimeout(type, isDeleting ? speed / 2 : speed);
      }
    };

    type();
  }, []);
  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const movedTask = tasks.find((t) => t._id === active.id);
    const droppedOnTask = tasks.find((t) => t._id === over.id);
    const newStatus = droppedOnTask?.status || null;

    if (movedTask && newStatus && movedTask.status !== newStatus) {
      const updatedTasks = tasks.map((task) =>
        task._id === movedTask._id ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      if (token) await updateTaskStatus(movedTask._id, newStatus, token);
    }
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const task = await createTask(newTask, token);
    if (task) {
      setTasks((prev) =>
        prev.some((t) => t._id === task._id) ? prev : [...prev, task]
      );
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Todo',
      });
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${taskId}/smart-assign`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        const updatedTask = data.task;

        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? updatedTask : t))
        );
      }
    } catch (err) {
      console.error('Smart Assign failed', err);
    }
  };


  const handleDeleteTask = async (taskId) => {
    const confirm = window.confirm('Delete this task?');
    if (!confirm) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      } else {
        console.error('Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task', err);
    }
  };

  const handleEditTask = async (taskId, updatedFields) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
  
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...updatedFields,
          updatedAt: task.updatedAt,
        }),
      });
  
      const data = await res.json();
  
      if (res.status === 409) {
        setConflict({
          taskId,
          local: updatedFields,
          server: data.latest,
        });
        return;
      }
  
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
      }
    } catch (err) {
      console.error('Edit error:', err);
    }
  };
  

  return (
    <>
      <header className="navbar">
        <div className="navbar-title">🐝 Kanbee</div>
      </header>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/'; // redirect to login or landing page
        }}
        className="logout-btn"
      >
        🚪 Logout
      </button>

      <div className="theme-bar">
        <ThemePicker />
      </div>

      <div className="hero-banner">
        <h1 className="hero-title">🍯 Kanbee - Smart Taskboard</h1>
        <h1 className="hero-type">

          <span className="type-text" id="typed-text"></span>
          <span className="cursor">|</span>
        </h1>
      </div>


      <form onSubmit={handleAddTask} className="task-form">
        <input
          name="title"
          value={newTask.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          name="description"
          value={newTask.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleChange}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          name="status"
          value={newTask.status}
          onChange={handleChange}
        >
          {STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <button type="submit">Add Task</button>
      </form>

      <div className="dashboard-layout">
        <div className="left-panel">
          <div className="task-stats">
            <h3>📊 Task Dashboard</h3>
            <p>Total: {taskStats.total}</p>
            <p>📝 Todo: {taskStats.todo}</p>
            <p>🚧 In Progress: {taskStats.inProgress}</p>
            <p>✅ Done: {taskStats.done}</p>
            <p>📈 Completion Rate: {completionRate}%</p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="right-panel">
          <ActivityFeed token={token} />
        </div>
      </div>
      <p className="motivate-line">
        <span className="emoji-pulse">🔥</span> Stay focused. Stay consistent. Win the day.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={onDragEnd}
      >
        <div className="board">
          {STATUSES.map((status) => (
            <SortableContext
              key={status}
              id={`column-${status}`}
              items={tasks
                .filter((t) => t.status === status)
                .map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
                onSmartAssign={handleSmartAssign}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            </SortableContext>
          ))}
        </div>
      </DndContext>
      {conflict && (
  <MergeConflictModal
    conflict={conflict}
    onResolve={async (taskId, resolvedFields) => {
      setConflict(null);
      await handleEditTask(taskId, resolvedFields); // Retry with resolved
    }}
    onCancel={() => setConflict(null)}
  />
)}

    </>
  );
};

export default KanbanBoard;
