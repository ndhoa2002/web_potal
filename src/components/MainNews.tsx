import "./MainNews.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

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

export default function MainNews() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
    
    // Listen for article updates
    const handleArticleUpdate = () => {
      fetchArticles();
    };
    
    window.addEventListener('articleUpdated', handleArticleUpdate);
    
    return () => {
      window.removeEventListener('articleUpdated', handleArticleUpdate);
    };
  }, []);

  // Auto-cycle through articles every 10 seconds
  useEffect(() => {
    console.log('MainNews: Setting up auto-cycle, articles count:', articles.length);
    if (articles.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % articles.length;
          console.log('MainNews: Auto-cycling from article', prevIndex, 'to', newIndex);
          return newIndex;
        });
      }, 10000); // 10 seconds

      return () => {
        console.log('MainNews: Clearing auto-cycle interval');
        clearInterval(interval);
      };
    }
  }, [articles.length]);

  const fetchArticles = async () => {
    try {
      console.log('MainNews: Fetching articles...');
      // Fetch 24 latest articles for rotation
      const response = await fetch('http://localhost:8080/api/public/articles?page=0&size=24', {
        headers: {
          'Accept': 'application/json; charset=UTF-8',
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('MainNews: Fetched articles data:', data);
        console.log('MainNews: Data has articles property:', !!data.articles);
        console.log('MainNews: Articles array length:', data.articles ? data.articles.length : 0);
        if (data.articles && data.articles.length > 0) {
          console.log('MainNews: First article:', data.articles[0]);
          setArticles(data.articles);
          setCurrentIndex(0); // Reset to first article when articles update
          console.log('MainNews: Set articles count:', data.articles.length);
        } else {
          // Nếu không có dữ liệu từ API
          console.log('MainNews: No articles found in API response');
          setArticles([]);
        }
      } else {
        console.error('MainNews: Failed to fetch articles, status:', response.status);
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    const currentArticle = articles[currentIndex];
    if (currentArticle) {
      navigate(`/tin-tuc-su-kien/bai-viet/${currentArticle.id}`);
    }
  };

  if (loading) {
    return (
      <div className="main-news">
        <img 
          src="/images/botrong_4sao1.jpg" 
          alt="Ảnh tin nổi bật"
        />
        <div className="news-content">
          <h2>Đang tải tin tức mới nhất...</h2>
          <p>Vui lòng chờ trong giây lát...</p>
        </div>
      </div>
    );
  }

  // Nếu không có bài viết từ API, hiển thị thông báo
  if (!articles.length) {
    return (
      <div className="main-news">
        <img 
          src="/images/botrong_4sao1.jpg" 
          alt="Ảnh tin nổi bật"
        />
        <div className="news-content">
          <h2>Không có bài viết nào</h2>
          <p>Hiện tại chưa có bài viết nào được đăng. Vui lòng quay lại sau.</p>
        </div>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="main-news" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img
        src={currentArticle.imageUrl ? (currentArticle.imageUrl.startsWith('http') ? currentArticle.imageUrl : `http://localhost:8080${currentArticle.imageUrl}`) : "/images/botrong_4sao1.jpg"}
        alt="Ảnh tin nổi bật"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/images/botrong_4sao1.jpg";
        }}
      />
      <div className="news-content">
        <h2>{currentArticle.title}</h2>
        <p>{currentArticle.summary || (currentArticle.content ? currentArticle.content.substring(0, 200) + '...' : 'Không có tóm tắt')}</p>
        
        {/* Indicator dots to show current article */}
        {articles.length > 1 && (
          <div className="article-indicators">
            {articles.map((_, index) => (
              <span
                key={index}
                className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
