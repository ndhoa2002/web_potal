import { useState, useEffect } from 'react';
import { EditArticle } from './EditArticle';
import './Admin.css';

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
  };
}

interface ArticleListResponse {
  articles: Article[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
}

interface Props {
  onViewArticle?: (articleId: number) => void;
}

export function ArticleManagement({ onViewArticle }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  const categories = [
    { value: '', label: 'Tất cả danh mục' },
    { value: 'HOAT_DONG_BO_CONG_AN', label: 'Hoạt động của Bộ Công an' },
    { value: 'HOAT_DONG_CONG_AN_DIA_PHUONG', label: 'Hoạt động của Công an địa phương' },
    { value: 'DOI_NGOAI', label: 'Đối ngoại' },
    { value: 'AN_NINH_TRAT_TU', label: 'An ninh, trật tự' },
    { value: 'PHO_BIEN_GIAO_DUC_PHAP_LUAT', label: 'Phổ biến giáo dục pháp luật' },
    { value: 'CHI_DAO_DIEU_HANH', label: 'Chỉ đạo điều hành' },
    { value: 'NGUOI_TOT_VIEC_TOT', label: 'Người tốt, việc tốt' },
    { value: 'HOAT_DONG_XA_HOI', label: 'Hoạt động xã hội' }
  ];

  useEffect(() => {
    fetchArticles();
  }, [currentPage, selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      let url = `http://localhost:8080/api/admin/articles?page=${currentPage}&size=${pageSize}`;
      
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data: ArticleListResponse = await response.json();
        setArticles(data.articles);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
      } else {
        console.error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8080/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        alert('Xóa bài viết thành công!');
        fetchArticles(); // Refresh list
      } else {
        alert('Không thể xóa bài viết');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Có lỗi xảy ra khi xóa bài viết');
    }
  };

  const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
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

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="article-management">
      <div className="management-header">
        <h2>Quản lý bài viết</h2>
        <div className="management-controls">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="articles-stats">
        <p>Tổng cộng: <strong>{totalItems}</strong> bài viết</p>
      </div>

      <div className="articles-table-container">
        <table className="articles-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Tác giả</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id}>
                <td>{article.id}</td>
                <td className="title-cell">
                  <div className="title-text">{article.title}</div>
                  {article.summary && (
                    <div className="summary-text">{article.summary}</div>
                  )}
                </td>
                <td>
                  <span className="category-badge">
                    {getCategoryLabel(article.category)}
                  </span>
                </td>
                <td>{article.user?.username || 'N/A'}</td>
                <td>{formatDate(article.createdAt)}</td>
                <td className="actions-cell">
                  <button 
                    className="btn-view"
                    onClick={() => onViewArticle ? onViewArticle(article.id) : window.open(`/tin-tuc-su-kien/bai-viet/${article.id}`, '_blank')}
                  >
                    Xem
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => setEditingArticleId(article.id.toString())}
                  >
                    Sửa
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteArticle(article.id)}
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
            Trang {currentPage + 1} / {totalPages}
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

      {editingArticleId && (
        <EditArticle
          articleId={editingArticleId}
          onClose={() => setEditingArticleId(null)}
          onSave={() => {
            setEditingArticleId(null);
            fetchArticles();
          }}
        />
      )}
    </div>
  );
}
