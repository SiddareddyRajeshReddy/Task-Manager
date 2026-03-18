import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { tasksAPI } from '../lib/api.js';
import TaskCard    from '../components/TaskCard.jsx';
import TaskModal   from '../components/TaskModal.jsx';
import Navbar      from '../components/Navbar.jsx';

const LIMIT = 10;

export default function DashboardPage() {
  const { user } = useAuth();

  const [tasks,      setTasks]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('');   
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  const [modalOpen,   setModalOpen]   = useState(false);
  const [editingTask, setEditingTask] = useState(null);  
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      if (filter) params.status = filter;

      const { data } = await tasksAPI.getAll(params);
      setTasks(data.tasks);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setError('Failed to load tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [page, search, filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => { setPage(1); }, [search, filter]);

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit   = (task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  const handleSave = async (formData) => {
    if (editingTask) {
      const { data } = await tasksAPI.update(editingTask._id, formData);
      setTasks((prev) => prev.map((t) => t._id === editingTask._id ? data.task : t));
    } else {
      await fetchTasks();
    }
    closeModal();
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    const { data } = await tasksAPI.update(task._id, { status: newStatus });
    setTasks((prev) => prev.map((t) => t._id === task._id ? data.task : t));
  };

  const handleDelete = async (id) => {
    await tasksAPI.remove(id);
    if (tasks.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      fetchTasks();
    }
  };

  const pending   = tasks.filter((t) => t.status === 'Pending').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Greeting + stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-base-content">
              Hey, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-sm text-base-content/60 mt-0.5">
              {total} task{total !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="flex gap-2">
            <div className="badge badge-warning badge-lg gap-1 py-3">
              <span className="font-medium">{pending}</span> Pending
            </div>
            <div className="badge badge-success badge-lg gap-1 py-3">
              <span className="font-medium">{completed}</span> Done
            </div>
          </div>
        </div>

        {/* Search + filter + add */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select select-bordered w-full sm:w-36"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <button className="btn btn-primary" onClick={openCreate}>
            + Add Task
          </button>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-dots loading-lg text-primary" />
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 text-base-content/50">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium">No tasks found</p>
            <p className="text-sm mt-1">
              {search || filter ? 'Try adjusting your search or filter.' : 'Click "+ Add Task" to get started.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onToggle={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-2">
            <button
              className="btn btn-sm btn-outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <span className="btn btn-sm btn-ghost no-animation cursor-default">
              {page} / {totalPages}
            </span>
            <button
              className="btn btn-sm btn-outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {/* Task create/edit modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}