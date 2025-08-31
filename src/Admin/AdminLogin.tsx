import React, { useState } from 'react';
import './Admin.css';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

export const AdminLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await onLogin(username, password);
      if (!result.success && result.message) {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="government-seal">
          <img src="/images/logo.png" alt="Logo Bộ Công An" className="login-logo" onError={(e) => {
            console.log('Logo load error, trying alternative path');
            (e.target as HTMLImageElement).src = './images/logo.png';
          }} />
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-header">
            <h2>Hệ thống quản trị</h2>
            <h3>Bộ Công An Việt Nam</h3>
            <p>Đăng nhập để truy cập hệ thống quản lý nội dung</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Nhập tên đăng nhập"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="login-submit-btn">
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập hệ thống'}
          </button>
          
          {message && (
            <div className={`login-message ${message.includes('thành công') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <div className="login-footer">
            <p>© 2025 Bộ Công An Việt Nam</p>
            <p>Hệ thống được bảo mật và giám sát 24/7</p>
          </div>
        </form>
      </div>
    </div>
  );
};
