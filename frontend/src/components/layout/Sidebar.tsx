import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '▦' },
  { path: '/jobs', label: 'Applications', icon: '▤' },
  { path: '/ai', label: 'AI Tools', icon: '✦' },
  { path: '/profile', label: 'Profile', icon: '○' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-indigo-600">JobTrackr AI</h1>
        <p className="text-xs text-slate-400 mt-1">Career Management</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;