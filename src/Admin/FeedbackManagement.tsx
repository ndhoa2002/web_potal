import { useState, useEffect } from 'react';
import './Admin.css';

interface Feedback {
  id: number;
  title: string;
  fullName: string;
  email: string;
  personalId?: string;
  phone?: string;
  field: string;
  content: string;
  isAnswered: boolean;
  answer?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  questionTime: string;
  answerTime?: string;
  respondedBy?: string;
}

interface FeedbackPageResponse {
  feedbacks: Feedback[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
}

interface FeedbackStatistics {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
}

export function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [statistics, setStatistics] = useState<FeedbackStatistics | null>(null);

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'PENDING', label: 'Chờ xử lý' },
    { value: 'IN_PROGRESS', label: 'Đang xử lý' },
    { value: 'RESOLVED', label: 'Đã giải quyết' },
    { value: 'REJECTED', label: 'Từ chối' }
  ];

  const fieldLabels: { [key: string]: string } = {
    'AN_NINH_TRAT_TU': 'An ninh trật tự',
    'PHONG_CHAY_CHUA_CHAY': 'Phòng cháy chữa cháy',
    'GIOI_THIEU': 'Giới thiệu',
    'DOI_NGOAI': 'Đối ngoại',
    'BO_CONG_AN': 'Bộ Công An',
    'XA_HOI': 'Xã hội',
    'PHAP_LUAT': 'Pháp luật',
    'THONG_KE': 'Thống kê',
    'THU_TUC_HANH_CHINH': 'Thủ tục hành chính',
    'KHAC': 'Khác'
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchStatistics();
  }, [currentPage, selectedStatus, keyword]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      let url = `http://localhost:8080/api/admin/feedback?page=${currentPage}&size=${pageSize}&sortBy=questionTime&sortDir=desc`;
      
      if (selectedStatus) {
        url += `&status=${selectedStatus}`;
      }
      if (keyword.trim()) {
        url += `&keyword=${encodeURIComponent(keyword)}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data: FeedbackPageResponse = await response.json();
        setFeedbacks(data.feedbacks);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
      } else {
        console.error('Failed to fetch feedbacks');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8080/api/admin/feedback/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data: FeedbackStatistics = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleAnswerFeedback = async () => {
    if (!selectedFeedback || !answerText.trim()) {
      alert('Vui lòng nhập nội dung trả lời');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8080/api/admin/feedback/${selectedFeedback.id}/answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: answerText }),
        credentials: 'include'
      });

      if (response.ok) {
        alert('Trả lời thành công!');
        setShowAnswerModal(false);
        setAnswerText('');
        setSelectedFeedback(null);
        fetchFeedbacks();
        fetchStatistics();
      } else {
        alert('Không thể trả lời feedback');
      }
    } catch (error) {
      console.error('Error answering feedback:', error);
      alert('Có lỗi xảy ra khi trả lời');
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8080/api/admin/feedback/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (response.ok) {
        fetchFeedbacks();
        fetchStatistics();
      } else {
        alert('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa feedback này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8080/api/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        alert('Xóa feedback thành công!');
        fetchFeedbacks();
        fetchStatistics();
      } else {
        alert('Không thể xóa feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Có lỗi xảy ra khi xóa feedback');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Chờ xử lý',
      'IN_PROGRESS': 'Đang xử lý',
      'RESOLVED': 'Đã giải quyết',
      'REJECTED': 'Từ chối'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'PENDING': '#ffc107',
      'IN_PROGRESS': '#17a2b8',
      'RESOLVED': '#28a745',
      'REJECTED': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="feedback-management">
      {/* Statistics */}
      {statistics && (
        <div className="feedback-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Tổng cộng</h3>
              <p className="stat-number">{statistics.total}</p>
            </div>
            <div className="stat-card pending">
              <h3>Chờ xử lý</h3>
              <p className="stat-number">{statistics.pending}</p>
            </div>
            <div className="stat-card in-progress">
              <h3>Đang xử lý</h3>
              <p className="stat-number">{statistics.inProgress}</p>
            </div>
            <div className="stat-card resolved">
              <h3>Đã giải quyết</h3>
              <p className="stat-number">{statistics.resolved}</p>
            </div>
            <div className="stat-card rejected">
              <h3>Từ chối</h3>
              <p className="stat-number">{statistics.rejected}</p>
            </div>
          </div>
        </div>
      )}

      <div className="management-header">
        <h2>Quản lý phản hồi của công dân</h2>
        <div className="management-controls">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-filter"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="feedbacks-table-container">
        <table className="feedbacks-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Người gửi</th>
              <th>Email</th>
              <th>Lĩnh vực</th>
              <th>Trạng thái</th>
              <th>Ngày gửi</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(feedback => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td className="title-cell">
                  <div className="title-text" title={feedback.title}>
                    {feedback.title}
                  </div>
                </td>
                <td>{feedback.fullName}</td>
                <td>{feedback.email}</td>
                <td>{fieldLabels[feedback.field] || feedback.field}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(feedback.status) }}
                  >
                    {getStatusLabel(feedback.status)}
                  </span>
                </td>
                <td>{formatDate(feedback.questionTime)}</td>
                <td className="actions-cell">
                  <button 
                    className="btn-view"
                    onClick={() => {
                      setSelectedFeedback(feedback);
                      setShowAnswerModal(true);
                      setAnswerText(feedback.answer || '');
                    }}
                  >
                    {feedback.isAnswered ? 'Xem' : 'Trả lời'}
                  </button>
                  
                  <select
                    value={feedback.status}
                    onChange={(e) => handleUpdateStatus(feedback.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="IN_PROGRESS">Đang xử lý</option>
                    <option value="RESOLVED">Đã giải quyết</option>
                    <option value="REJECTED">Từ chối</option>
                  </select>
                  
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteFeedback(feedback.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="pagination-btn"
          >
            Trang trước
          </button>
          
          <span className="pagination-info">
            Trang {currentPage + 1} / {totalPages} ({totalItems} phản hồi)
          </span>
          
          <button 
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="pagination-btn"
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Answer Modal */}
      {showAnswerModal && selectedFeedback && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedFeedback.isAnswered ? 'Chi tiết phản hồi' : 'Trả lời phản hồi'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAnswerModal(false);
                  setSelectedFeedback(null);
                  setAnswerText('');
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="feedback-details">
                <h4>Thông tin người gửi</h4>
                <p><strong>Họ tên:</strong> {selectedFeedback.fullName}</p>
                <p><strong>Email:</strong> {selectedFeedback.email}</p>
                {selectedFeedback.phone && <p><strong>Điện thoại:</strong> {selectedFeedback.phone}</p>}
                {selectedFeedback.personalId && <p><strong>CCCD/CMND:</strong> {selectedFeedback.personalId}</p>}
                
                <h4>Nội dung phản hồi</h4>
                <p><strong>Tiêu đề:</strong> {selectedFeedback.title}</p>
                <p><strong>Lĩnh vực:</strong> {fieldLabels[selectedFeedback.field] || selectedFeedback.field}</p>
                <div className="content-box">
                  {selectedFeedback.content}
                </div>
                
                {selectedFeedback.isAnswered && selectedFeedback.answer && (
                  <>
                    <h4>Câu trả lời</h4>
                    <div className="answer-box">
                      {selectedFeedback.answer}
                    </div>
                    {selectedFeedback.respondedBy && (
                      <p><small>Trả lời bởi: {selectedFeedback.respondedBy} vào {selectedFeedback.answerTime && formatDate(selectedFeedback.answerTime)}</small></p>
                    )}
                  </>
                )}
                
                {!selectedFeedback.isAnswered && (
                  <>
                    <h4>Nội dung trả lời</h4>
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Nhập nội dung trả lời..."
                      rows={6}
                      className="answer-textarea"
                    />
                  </>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              {!selectedFeedback.isAnswered && (
                <button 
                  className="btn-primary"
                  onClick={handleAnswerFeedback}
                  disabled={!answerText.trim()}
                >
                  Gửi trả lời
                </button>
              )}
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowAnswerModal(false);
                  setSelectedFeedback(null);
                  setAnswerText('');
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
