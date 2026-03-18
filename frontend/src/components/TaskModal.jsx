import { useState, useEffect, useRef } from 'react';
import { tasksAPI } from '../lib/api.js';

export default function TaskModal({ task, onSave, onClose }) {
  const isEdit = !!task;

  const [form,    setForm]    = useState({
    title:       task?.title       || '',
    description: task?.description || '',
    status:      task?.status      || 'Pending',
  });
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState(false);

  const titleRef = useRef(null);
  useEffect(() => { titleRef.current?.focus(); }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) { setError('Title is required.'); return; }

    setSaving(true);
    try {
      if (isEdit) {
        await onSave({ title: form.title.trim(), description: form.description.trim(), status: form.status });
      } else {
        await tasksAPI.create({ title: form.title.trim(), description: form.description.trim(), status: form.status });
        await onSave();   // triggers re-fetch in parent
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card bg-base-100 w-full max-w-md shadow-xl">
        <div className="card-body gap-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {isEdit ? 'Edit Task' : 'New Task'}
            </h3>
            <button className="btn btn-sm btn-ghost btn-circle" onClick={onClose}>✕</button>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error py-2 text-sm">{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="form-control">
              <span className="label-text mb-1">Title <span className="text-error">*</span></span>
              <input
                ref={titleRef}
                type="text"
                name="title"
                className="input input-bordered w-full"
                placeholder="e.g. Practice DSA"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-1">Description</span>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full resize-none"
                placeholder="Optional details…"
                rows={3}
                value={form.description}
                onChange={handleChange}
                maxLength={500}
              />
              <span className="text-xs text-base-content/40 text-right mt-1">
                {form.description.length}/500
              </span>
            </label>

            <label className="form-control">
              <span className="label-text mb-1">Status</span>
              <select
                name="status"
                className="select select-bordered w-full"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            {/* Actions */}
            <div className="flex gap-2 justify-end mt-1">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? <span className="loading loading-spinner loading-sm" />
                  : isEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}