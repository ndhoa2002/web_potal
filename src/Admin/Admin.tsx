import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { CreateArticle } from './CreateArticle';
import { ArticleManagement } from './ArticleManagement';
import { FeedbackManagement } from './Feedback';
import { Dashboard } from './Dashboard';
import ArticleDetail from '../components/ArticleDetail';
import './Admin.css';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [viewingArticleId, setViewingArticleId] = useState<number | null>(null);

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
        if (data.success && data.token) {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('isAdmin', 'true');
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, message: data.message || 'Đăng nhập thất bại' };
        }
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Đăng nhập thất bại' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Lỗi kết nối đến server' };
    }
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
        <div className="header-center">
          <h1>Hệ thống quản trị - Bộ Công An</h1>
        </div>
      </header>
      
      <nav className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Tổng quan
        </button>
        <button 
          className={activeTab === 'articles' ? 'active' : ''}
          onClick={() => setActiveTab('articles')}
        >
          Quản lý bài viết
        </button>
        <button 
          className={activeTab === 'create-article' ? 'active' : ''}
          onClick={() => setActiveTab('create-article')}
        >
          Tạo bài viết
        </button>
        <button 
          className={activeTab === 'feedback' ? 'active' : ''}
          onClick={() => setActiveTab('feedback')}
        >
          Phản hồi công dân
        </button>
      </nav>
      
      <main className="admin-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'articles' && <ArticleManagement onViewArticle={setViewingArticleId} />}
        {activeTab === 'create-article' && <CreateArticle />}
        {activeTab === 'feedback' && <FeedbackManagement />}
        {viewingArticleId && (
          <div className="modal-overlay" onClick={() => setViewingArticleId(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setViewingArticleId(null)}>
                ×
              </button>
              <ArticleDetail articleId={viewingArticleId} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
