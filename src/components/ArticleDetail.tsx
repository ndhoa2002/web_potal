import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ArticleDetail.css';

interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  createdBy: string;
}

interface Props {
  articleId?: number;
}

export default function ArticleDetail({ articleId }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId);
    } else if (id) {
      const parsedId = parseInt(id);
      if (!isNaN(parsedId)) {
        // ID is numeric, fetch from API
        fetchArticle(parsedId);
      } else {
        // ID is a slug, show message or redirect to static content
        setError('Đây là bài viết tĩnh, vui lòng kiểm tra đường dẫn');
        setLoading(false);
      }
    }
  }, [id, articleId]);

  const fetchArticle = async (articleId: number) => {
    try {
      console.log('Fetching article with ID:', articleId); // Debug log
      const response = await fetch(`http://localhost:8080/api/public/articles/${articleId}`);
      console.log('Response status:', response.status); // Debug log
      
      if (response.ok) {
        const data = await response.json();
        console.log('Article data:', data); // Debug log
        
        // Transform response to match interface
        const article: Article = {
          id: data.id,
          title: data.title,
          content: data.content,
          summary: data.summary || '',
          imageUrl: data.imageUrl || '',
          category: data.category || '',
          createdAt: data.createdAt,
          createdBy: data.createdBy || ''
        };
        
        setArticle(article);
      } else {
        console.error('Response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setError('Không tìm thấy bài viết');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Có lỗi xảy ra khi tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'CHI_DAO_DIEU_HANH': 'Chỉ đạo điều hành',
      'HOAT_DONG_BO_CONG_AN': 'Hoạt động Bộ Công an',
      'HOAT_DONG_CONG_AN_DIA_PHUONG': 'Hoạt động Công an địa phương',
      'AN_NINH_TRAT_TU': 'An ninh trật tự',
      'DOI_NGOAI': 'Đối ngoại',
      'HOAT_DONG_XA_HOI': 'Hoạt động xã hội',
      'NGUOI_TOT_VIEC_TOT': 'Người tốt việc tốt',
      'PHO_BIEN_GIAO_DUC_PHAP_LUAT': 'Phổ biến giáo dục pháp luật'
    };
    return categoryMap[category] || category;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="article-detail">
        <div className="loading">Đang tải bài viết...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail">
        <div className="error">{error || 'Không tìm thấy bài viết'}</div>
        <button onClick={() => navigate('/')} className="back-button">
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <div className="article-header">
        <div className="category-tag">{getCategoryName(article.category)}</div>
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <span className="author">Tác giả: {article.createdBy}</span>
          <span className="date">{formatDate(article.createdAt)}</span>
        </div>
      </div>

      {article.summary && (
        <div className="article-summary">
          <strong>{article.summary}</strong>
        </div>
      )}

      {/* {article.imageUrl && (
        <div className="article-image">
          <img 
            src={article.imageUrl.startsWith('http') ? article.imageUrl : `http://localhost:8080${article.imageUrl}`} 
            alt={article.title}
            onLoad={() => console.log('Image loaded successfully:', article.imageUrl)}
            onError={(e) => {
              console.log('Image failed to load:', article.imageUrl);
              console.log('Computed src:', article.imageUrl.startsWith('http') ? article.imageUrl : `http://localhost:8080${article.imageUrl}`);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )} */}

      <div className="article-content">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      <div className="article-footer">
        <button onClick={() => navigate('/')} className="back-button">
          ← Về trang chủ
        </button>
      </div>
    </div>
  );
}
