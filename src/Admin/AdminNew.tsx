import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { CreateArticle } from './CreateArticle';
import { ArticleManagement } from './ArticleManagement';
import { FeedbackManagement } from './Feedback';
import { Dashboard } from './Dashboard';
import './Admin.css';

interface User {
  id: number;
  username: string;
}

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8080/api/admin/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Đăng nhập thất bại' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Lỗi kết nối đến server' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('dashboard');
  };

  if (loading) {
    return <div className="loading">Đang kiểm tra trạng thái đăng nhập...</div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-left">
          <img 
            src="/images/logo.png" 
            alt="Logo Bộ Công An" 
            className="header-logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1>Hệ thống quản trị - Bộ Công An</h1>
        </div>
        <div className="header-right">
          <span className="admin-info">Xin chào, {user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </div>
      </header>
      
      <nav className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Tổng quan
        </button>
        <button 
          className={activeTab === 'articles' ? 'active' : ''}
          onClick={() => setActiveTab('articles')}
        >
          📋 Quản lý bài viết
        </button>
        <button 
          className={activeTab === 'create-article' ? 'active' : ''}
          onClick={() => setActiveTab('create-article')}
        >
          ✏️ Tạo bài viết
        </button>
        <button 
          className={activeTab === 'feedback' ? 'active' : ''}
          onClick={() => setActiveTab('feedback')}
        >
          💬 Phản hồi công dân
        </button>
      </nav>
      
      <main className="admin-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'articles' && <ArticleManagement />}
        {activeTab === 'create-article' && <CreateArticle />}
        {activeTab === 'feedback' && <FeedbackManagement />}
      </main>
    </div>
  );
};

export default Admin;
