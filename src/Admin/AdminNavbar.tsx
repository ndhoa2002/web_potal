
import { NavLink } from 'react-router-dom';

export function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <ul>
        <li>
          <NavLink to="/admin/create-article" className={({ isActive }) => isActive ? 'active' : ''}>
            Tạo bài viết mới
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/feedback" className={({ isActive }) => isActive ? 'active' : ''}>
            Phản hồi
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
