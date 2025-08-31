import "./Header.css";


import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập admin qua localStorage hoặc JWT token
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
  }, [location]);

  const handleLogin = () => {
    navigate("/admin");
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-section">
          <img src="/images/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="search-section">
          <input type="text" placeholder="Tìm kiếm..." />
          {!isAdmin && (
            <button className="login-btn" onClick={handleLogin}>Đăng nhập</button>
          )}
          {isAdmin && (
            <button className="login-btn" style={{ background: '#888' }} onClick={handleLogout}>Đăng xuất</button>
          )}
        </div>
      </div>
    </header>
  );
}
