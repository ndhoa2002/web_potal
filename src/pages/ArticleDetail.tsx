import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ArticleDetail.css';

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

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryLabels: { [key: string]: string } = {
    'HOAT_DONG_BO_CONG_AN': 'Hoạt động của Bộ Công an',
    'HOAT_DONG_CONG_AN_DIA_PHUONG': 'Hoạt động của Công an địa phương',
    'DOI_NGOAI': 'Đối ngoại',
    'AN_NINH_TRAT_TU': 'An ninh, trật tự',
    'PHO_BIEN_GIAO_DUC_PHAP_LUAT': 'Phổ biến giáo dục pháp luật',
    'CHI_DAO_DIEU_HANH': 'Chỉ đạo điều hành',
    'NGUOI_TOT_VIEC_TOT': 'Người tốt, việc tốt',
    'HOAT_DONG_XA_HOI': 'Hoạt động xã hội'
  };

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/public/articles/${id}`);
      
      if (!response.ok) {
        throw new Error('Không thể tải bài viết');
      }
      
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="article-detail-container">
        <div className="loading">Đang tải bài viết...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-container">
        <div className="error">
          {error || 'Không tìm thấy bài viết'}
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      <div className="article-detail">
        <div className="article-header">
          <div className="article-meta">
            <span className="article-category">
              {categoryLabels[article.category] || article.category}
            </span>
            <span className="article-date">
              {formatDate(article.createdAt)}
            </span>
          </div>
          
          <h1 className="article-title">{article.title}</h1>
          
          {article.summary && (
            <div className="article-summary">
              {article.summary}
            </div>
          )}
          
          {article.user && (
            <div className="article-author">
              Tác giả: <strong>{article.user.username}</strong>
            </div>
          )}
        </div>

        {article.imageUrl && (
          <div className="article-image-container">
            <img 
              src={`http://localhost:8080${article.imageUrl}`} 
              alt={article.title}
              className="article-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="article-content">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        <div className="article-footer">
          <div className="article-meta">
            <span>Ngày tạo: {formatDate(article.createdAt)}</span>
            {article.updatedAt !== article.createdAt && (
              <span>Cập nhật: {formatDate(article.updatedAt)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
