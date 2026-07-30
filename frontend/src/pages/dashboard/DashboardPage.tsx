import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { jobsApi } from '../../api/jobs.api';
import type { JobStats } from '../../types/job.types';
import { useAuth } from '../../store/AuthContext';

const statCards = [
  { key: 'total', label: 'Total', color: 'text-slate-900' },
  { key: 'applied', label: 'Applied', color: 'text-blue-700' },
  { key: 'interview', label: 'Interview', color: 'text-purple-700' },
  { key: 'offer', label: 'Offer', color: 'text-green-700' },
  { key: 'rejected', label: 'Rejected', color: 'text-red-700' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-slate-500 mt-1">Here's your job search overview.</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map(card => (
              <div key={card.key} className="card p-6">
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className={`text-3xl font-bold mt-2 ${card.color}`}>
                  {stats?.[card.key as keyof JobStats] ?? 0}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/jobs?new=1" className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <span className="text-2xl">+</span>
              <div>
                <p className="font-medium text-slate-900">Add Application</p>
                <p className="text-sm text-slate-500">Track a new job</p>
              </div>
            </Link>
            <Link to="/jobs" className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <span className="text-2xl">&#9707;</span>
              <div>
                <p className="font-medium text-slate-900">View All Jobs</p>
                <p className="text-sm text-slate-500">Manage applications</p>
              </div>
            </Link>
            <Link to="/ai" className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <span className="text-2xl">&#10022;</span>
              <div>
                <p className="font-medium text-slate-900">AI Tools</p>
                <p className="text-sm text-slate-500">Cover letter, CV tips & more</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
