import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 sm:px-8">
      <div className="flex-1">
        <span className="text-lg font-semibold text-primary">TaskPrep</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Avatar dropdown */}
        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-ghost btn-sm gap-2 normal-case">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-8">
                <span className="text-xs font-semibold">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            <span className="hidden sm:inline text-sm text-base-content/80 max-w-[250px] truncate">
              {user?.name}
            </span>
          </button>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box shadow-md z-50 w-200 p-3 mt-1  text-ellipsis"
          >
            <li className="menu-title text-xs px-3 py-1 w-full text-base-content/50 text-clip">
              {user?.email}
            </li>
            <li>
              <button
                className="text-error text-sm"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}