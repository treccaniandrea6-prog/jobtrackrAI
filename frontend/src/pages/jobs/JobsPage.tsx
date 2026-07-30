import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { jobsApi } from '../../api/jobs.api';
import type { Job, CreateJobForm, JobStatus } from '../../types/job.types';

const statusColors: Record<JobStatus, string> = {
  wishlist: 'bg-slate-100 text-slate-700',
  applied: 'bg-blue-50 text-blue-700',
  interview: 'bg-purple-50 text-purple-700',
  offer: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
};

const emptyForm: CreateJobForm = {
  company: '', position: '', location: '', status: 'wishlist',
  salary: '', jobUrl: '', description: '', notes: '',
};

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(window.location.search.includes('new=1'));
  const [form, setForm] = useState<CreateJobForm>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getAll({ search, status: filterStatus || undefined });
      setJobs(res.data.data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [search, filterStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await jobsApi.update(editId, form);
      } else {
        await jobsApi.create(form);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job: Job) => {
    setForm({
      company: job.company, position: job.position,
      location: job.location || '', status: job.status,
      salary: job.salary || '', jobUrl: job.jobUrl || '',
      description: job.description || '', notes: job.notes || '',
    });
    setEditId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this application?')) return;
    await jobsApi.delete(id);
    fetchJobs();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Applications</h2>
          <button className="btn-primary" onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}>
            + Add Application
          </button>
        </div>
        <div className="flex gap-4 mb-6">
          <input
            className="input-field max-w-xs"
            placeholder="Search company or position..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="input-field max-w-xs"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="wishlist">Wishlist</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {showForm && (
          <div className="card p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">{editId ? 'Edit Application' : 'New Application'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
                <input className="input-field" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position *</label>
                <input className="input-field" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input className="input-field" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as JobStatus })}>
                  <option value="wishlist">Wishlist</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                <input className="input-field" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g. 50,000 EUR" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job URL</label>
                <input className="input-field" value={form.jobUrl} onChange={e => setForm({ ...form, jobUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea className="input-field" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-slate-400 text-lg">No applications yet.</p>
            <p className="text-slate-400 text-sm mt-1">Click "Add Application" to get started.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Position</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Location</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{job.company}</td>
                    <td className="px-6 py-4 text-slate-600">{job.position}</td>
                    <td className="px-6 py-4 text-slate-500">{job.location || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(job)} className="text-sm text-indigo-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(job.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobsPage;