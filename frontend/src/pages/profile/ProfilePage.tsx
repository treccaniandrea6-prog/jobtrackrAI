import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../store/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile</h2>
        <div className="card p-6 max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">First name</span>
              <span className="text-sm font-medium text-slate-900">{user?.firstName}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Last name</span>
              <span className="text-sm font-medium text-slate-900">{user?.lastName}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm font-medium text-slate-900">{user?.email}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
