import React, { useState, useEffect } from 'react';
import './Dashboard.css';

interface DashboardStats {
  totalArticles: number;
  totalFeedbacks: number;
  pendingFeedbacks: number;
  resolvedFeedbacks: number;
  todayArticles: number;
  todayFeedbacks: number;
  articlesByCategory: { [key: string]: number };
  feedbacksByStatus: { [key: string]: number };
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: number;
  type: 'article' | 'feedback';
  action: string;
  description: string;
  timestamp: string;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    totalFeedbacks: 0,
    pendingFeedbacks: 0,
    resolvedFeedbacks: 0,
    todayArticles: 0,
    todayFeedbacks: 0,
    articlesByCategory: {},
    feedbacksByStatus: {},
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Fetch overall statistics
      const [articlesResponse, feedbacksResponse] = await Promise.all([
        fetch('http://localhost:8080/api/admin/articles', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/admin/feedbacks/statistics', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const articlesData = await articlesResponse.json();
      const feedbackStats = await feedbacksResponse.json();

      // Extract articles from the paginated response
      const articles = articlesData.articles || [];

      // Calculate article statistics by category
      const articlesByCategory: { [key: string]: number } = {};
      articles.forEach((article: any) => {
        const category = article.category;
        articlesByCategory[category] = (articlesByCategory[category] || 0) + 1;
      });

      // Mock recent activity data (in real app, would come from backend)
      const recentActivity: ActivityItem[] = [
        {
          id: 1,
          type: 'article',
          action: 'created',
          description: 'Bài viết mới về chỉ đạo điều hành',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: 'feedback',
          action: 'resolved',
          description: 'Phản hồi từ công dân được xử lý',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          type: 'article',
          action: 'updated',
          description: 'Cập nhật bài viết về an ninh trật tự',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        }
      ];

      setStats({
        totalArticles: articles.length,
        totalFeedbacks: feedbackStats.total || 0,
        pendingFeedbacks: feedbackStats.pending || 0,
        resolvedFeedbacks: feedbackStats.resolved || 0,
        todayArticles: articles.filter((a: any) => 
          new Date(a.createdAt).toDateString() === new Date().toDateString()
        ).length,
        todayFeedbacks: Math.floor(Math.random() * 10), // Mock data
        articlesByCategory,
        feedbacksByStatus: {
          pending: feedbackStats.pending || 0,
          inProgress: feedbackStats.inProgress || 0,
          resolved: feedbackStats.resolved || 0,
          rejected: feedbackStats.rejected || 0
        },
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      'INTRODUCE': 'Giới thiệu',
      'NEWS_AND_EVENT': 'Tin tức & Sự kiện',
      'VAN_BAN': 'Văn bản',
      'FEEDBACK': 'Phản hồi',
      'GALLERY': 'Thư viện ảnh'
    };
    return categoryNames[category] || category;
  };

  const getStatusDisplayName = (status: string) => {
    const statusNames: { [key: string]: string } = {
      'pending': 'Chờ xử lý',
      'inProgress': 'Đang xử lý',
      'resolved': 'Đã xử lý',
      'rejected': 'Từ chối'
    };
    return statusNames[status] || status;
  };

  if (loading) {
    return <div className="loading">Đang tải thống kê...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Tổng quan hệ thống</h2>
        <div className="dashboard-subtitle">
          Thống kê và hoạt động gần đây của hệ thống quản lý
        </div>
      </div>

      {/* Main Statistics */}
      <div className="stats-overview">
        <div className="stats-row">
          <div className="stat-card primary">
            <div className="stat-content">
              <h3>Tổng số bài viết</h3>
              <div className="stat-number">{stats.totalArticles}</div>
              <div className="stat-change">+{stats.todayArticles} hôm nay</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-content">
              <h3>Tổng phản hồi</h3>
              <div className="stat-number">{stats.totalFeedbacks}</div>
              <div className="stat-change">+{stats.todayFeedbacks} hôm nay</div>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-content">
              <h3>Chờ xử lý</h3>
              <div className="stat-number">{stats.pendingFeedbacks}</div>
              <div className="stat-change">Cần chú ý</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>Đã xử lý</h3>
              <div className="stat-number">{stats.resolvedFeedbacks}</div>
              <div className="stat-change">Hoàn thành</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>Bài viết theo danh mục</h3>
            <div className="chart-content">
              {Object.entries(stats.articlesByCategory).map(([category, count]) => (
                <div key={category} className="category-bar">
                  <div className="category-info">
                    <span className="category-name">{getCategoryDisplayName(category)}</span>
                    <span className="category-count">{count}</span>
                  </div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${(count / Math.max(...Object.values(stats.articlesByCategory))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>Phản hồi theo trạng thái</h3>
            <div className="chart-content">
              {Object.entries(stats.feedbacksByStatus).map(([status, count]) => (
                <div key={status} className="status-item">
                  <div className="status-info">
                    <span className={`status-indicator ${status}`}></span>
                    <span className="status-name">{getStatusDisplayName(status)}</span>
                  </div>
                  <span className="status-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h3>Hoạt động gần đây</h3>
          <div className="activity-list">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-content ${activity.type}`}>
                  <div className="activity-description">{activity.description}</div>
                  <div className="activity-time">{formatTime(activity.timestamp)}</div>
                </div>
                <div className={`activity-action ${activity.action}`}>
                  {activity.action === 'created' && 'Tạo mới'}
                  {activity.action === 'updated' && 'Cập nhật'}
                  {activity.action === 'resolved' && 'Xử lý'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Thao tác nhanh</h3>
        <div className="actions-grid">
          <button className="action-btn create">
            <span className="action-text">Tạo bài viết mới</span>
          </button>
          <button className="action-btn review">
            <span className="action-text">Xem phản hồi chờ xử lý</span>
          </button>
          <button className="action-btn report">
            <span className="action-text">Xuất báo cáo</span>
          </button>
          <button className="action-btn settings">
            <span className="action-text">Cài đặt hệ thống</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
