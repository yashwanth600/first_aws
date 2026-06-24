import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5000/api/tasks"; // 👈 replace with your EC2 IP

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES   = ["Todo", "In Progress", "Done"];

const priorityColor = { Low: "#6BCB77", Medium: "#FFD166", High: "#EF476F" };
const statusColor   = { Todo: "#adb5bd", "In Progress": "#4361ee", Done: "#2ec4b6" };

function App() {
  const [tasks, setTasks]       = useState([]);
  const [filter, setFilter]     = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm]         = useState({ title: "", description: "", priority: "Medium", status: "Todo", dueDate: "" });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    const res  = await fetch(API);
    const data = await res.json();
    setTasks(data);
  };

  const openAdd = () => { setEditTask(null); setForm({ title: "", description: "", priority: "Medium", status: "Todo", dueDate: "" }); setShowForm(true); };
  const openEdit = (t) => { setEditTask(t); setForm({ title: t.title, description: t.description, priority: t.priority, status: t.status, dueDate: t.dueDate?.slice(0,10) || "" }); setShowForm(true); };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    const method = editTask ? "PUT" : "POST";
    const url    = editTask ? `${API}/${editTask._id}` : API;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const updateStatus = async (task, status) => {
    await fetch(`${API}/${task._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...task, status }) });
    fetchTasks();
  };

  const filtered = filter === "All" ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="logo">✅</span>
          <h1>TaskFlow</h1>
        </div>
        <button className="btn-add" onClick={openAdd}>+ New Task</button>
      </header>

      {/* Stats bar */}
      <div className="stats">
        {STATUSES.map(s => (
          <div className="stat-card" key={s}>
            <span className="stat-num">{tasks.filter(t => t.status === s).length}</span>
            <span className="stat-label" style={{ color: statusColor[s] }}>{s}</span>
          </div>
        ))}
        <div className="stat-card">
          <span className="stat-num">{tasks.length}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="filters">
        {["All", ...STATUSES].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Task list */}
      <div className="task-list">
        {filtered.length === 0 && <div className="empty">No tasks yet — add one!</div>}
        {filtered.map(task => (
          <div className="task-card" key={task._id}>
            <div className="task-top">
              <span className="priority-dot" style={{ background: priorityColor[task.priority] }} title={task.priority}></span>
              <h3 className="task-title">{task.title}</h3>
              <div className="task-actions">
                <button className="icon-btn" onClick={() => openEdit(task)} title="Edit">✏️</button>
                <button className="icon-btn" onClick={() => deleteTask(task._id)} title="Delete">🗑️</button>
              </div>
            </div>
            {task.description && <p className="task-desc">{task.description}</p>}
            <div className="task-bottom">
              <select
                className="status-select"
                value={task.status}
                style={{ borderColor: statusColor[task.status], color: statusColor[task.status] }}
                onChange={e => updateStatus(task, e.target.value)}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {task.dueDate && (
                <span className="due-date">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editTask ? "Edit Task" : "New Task"}</h2>
            <input className="input" placeholder="Task title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea className="input textarea" placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input className="input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit}>{editTask ? "Save Changes" : "Add Task"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
