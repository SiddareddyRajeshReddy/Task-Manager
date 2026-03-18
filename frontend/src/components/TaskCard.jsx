import { useState } from 'react';

export default function TaskCard({ task, onEdit, onToggle, onDelete }) {
  const [deleting,  setDeleting]  = useState(false);
  const [toggling,  setToggling]  = useState(false);

  const isDone = task.status === 'Completed';

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(task); } finally { setToggling(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try { await onDelete(task._id); } finally { setDeleting(false); }
  };

  const createdAt = new Date(task.createdAt).toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });

  return (
    <div className={`card bg-base-100 shadow-sm border-l-4 ${isDone ? 'border-success' : 'border-warning'}`}>
      <div className="card-body p-4 gap-2">

        {/* Top row: title + status badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-medium text-base leading-snug ${isDone ? 'line-through text-base-content/40' : 'text-base-content'}`}>
            {task.title}
          </h3>
          <span className={`badge badge-sm shrink-0 ${isDone ? 'badge-success' : 'badge-warning'}`}>
            {task.status}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-base-content/60 leading-relaxed">{task.description}</p>
        )}

        {/* Bottom row: date + actions */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-base-content/40">{createdAt}</span>

          <div className="flex gap-1">
            {/* Toggle status */}
            <button
              className="btn btn-xs btn-ghost"
              onClick={handleToggle}
              disabled={toggling}
              title={isDone ? 'Mark Pending' : 'Mark Complete'}
            >
              {toggling
                ? <span className="loading loading-spinner loading-xs" />
                : isDone ? '↩' : '✓'}
            </button>

            {/* Edit */}
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => onEdit(task)}
              title="Edit task"
            >
              ✎
            </button>

            {/* Delete */}
            <button
              className="btn btn-xs btn-ghost text-error"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete task"
            >
              {deleting
                ? <span className="loading loading-spinner loading-xs" />
                : '✕'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}