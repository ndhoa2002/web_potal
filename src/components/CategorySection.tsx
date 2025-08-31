import { useState, useEffect } from "react";
import "./CategorySection.css";
import { Link } from "react-router-dom";
import { categories, categoryPairs } from "../data/categories";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/đ/g, "d") // fix riêng chữ đ
    .replace(/Đ/g, "d") // phòng trường hợp viết hoa
    .normalize("NFD") // tách dấu ra khỏi chữ cái
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/[^a-z0-9]+/g, "-") // thay ký tự không hợp lệ bằng dấu gạch ngang
    .replace(/^-+|-+$/g, ""); // xóa dấu - ở đầu/cuối

type Article = {
  title: string;
  img?: string;
  id?: number; // Add ID for API articles
  isFromAPI?: boolean; // Flag to distinguish API articles
};

type ArticleFromAPI = {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  user?: any;
};

const categoryMapping: Record<string, string> = {
  'HOAT_DONG_BO_CONG_AN': 'HOẠT ĐỘNG CỦA BỘ CÔNG AN',
  'HOAT_DONG_CONG_AN_DIA_PHUONG': 'HOẠT ĐỘNG CỦA CÔNG AN ĐỊA PHƯƠNG',
  'DOI_NGOAI': 'ĐỐI NGOẠI',
  'AN_NINH_TRAT_TU': 'AN NINH, TRẬT TỰ',
  'PHO_BIEN_GIAO_DUC_PHAP_LUAT': 'PHỔ BIẾN GIÁO DỤC PHÁP LUẬT',
  'CHI_DAO_DIEU_HANH': 'CHỈ ĐẠO ĐIỀU HÀNH',
  'NGUOI_TOT_VIEC_TOT': 'NGƯỜI TỐT, VIỆC TỐT',
  'HOAT_DONG_XA_HOI': 'HOẠT ĐỘNG XÃ HỘI',
};

export default function CategorySection() {
  const [dynamicCategories, setDynamicCategories] = useState<Record<string, Article[]>>(categories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
    
    // Listen for article updates from admin
    const handleArticleUpdate = () => {
      fetchArticles();
    };
    
    window.addEventListener('articleUpdated', handleArticleUpdate);
    
    // Refresh articles every 30 seconds to catch updates
    const interval = setInterval(fetchArticles, 30000);
    
    return () => {
      window.removeEventListener('articleUpdated', handleArticleUpdate);
      clearInterval(interval);
    };
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/public/articles?page=0&size=50', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        const articles: ArticleFromAPI[] = data.articles || [];
        console.log('Articles from API:', articles); // Debug log
        
        // Group articles by category
        const grouped: Record<string, Article[]> = {};
        
        // Initialize with existing categories
        Object.keys(categories).forEach(category => {
          grouped[category] = [...categories[category]];
        });

        // Add new articles from API to the beginning, but keep original articles
        articles.forEach(article => {
          const categoryName = categoryMapping[article.category];
          if (categoryName && grouped[categoryName]) {
            // Add new articles to the beginning of existing articles
            grouped[categoryName].unshift({
              title: article.title,
              img: article.imageUrl ? (article.imageUrl.startsWith('http') ? article.imageUrl : `http://localhost:8080${article.imageUrl}`) : undefined,
              id: article.id,
              isFromAPI: true
            });
          }
        });

        setDynamicCategories(grouped);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Keep static data on error - articles will still display from categories data
      setDynamicCategories(categories);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-grid">
      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải bài viết...</div>}
      {categoryPairs.map((pair, index) => (
        <div className="category-row" key={index}>
          {pair.map((title) => (
            <section key={title} className="category-section">
              <h2 className="section-title">{title}</h2>
              <div className="news-list">
                {(dynamicCategories[title] || []).map((article, i) => {
                  const slug = slugify(article.title);
                  const linkPath = article.isFromAPI ? `/tin-tuc-su-kien/bai-viet/${article.id}` : `/tin-tuc-su-kien/bai-viet/${slug}`;
                  console.log(`Article: "${article.title}", Link: ${linkPath}`);
                  return (
                    <div className="news-item" key={`${title}-${i}`}>
                      {article.img ? (
                        <img 
                          src={article.img} 
                          alt="Ảnh tin" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="no-image-placeholder" />
                      )}
                      <Link to={linkPath}>
                        {article.title}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ))}
    </div>
  );
}
