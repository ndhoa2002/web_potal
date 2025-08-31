import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './Admin.css';

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string;
}

interface EditArticleProps {
  articleId: string;
  onClose: () => void;
  onSave: () => void;
}

export const EditArticle: React.FC<EditArticleProps> = ({ articleId, onClose, onSave }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
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
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8080/api/admin/articles/${articleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        setFormData({
          title: data.title,
          summary: data.summary || '',
          content: data.content,
          category: data.category,
          imageUrl: data.imageUrl || ''
        });
      } else {
        alert('Không thể tải thông tin bài viết');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      alert('Có lỗi xảy ra khi tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('Vui lòng chọn file hình ảnh');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File ảnh không được vượt quá 5MB');
        return;
      }
      setImageFile(file);
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      
      const formDataToSend = new FormData();
      
      // Tạo multipart riêng cho từng field thay vì dùng JSON blob
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('summary', formData.summary || '');

      // Xử lý ảnh: ưu tiên image file trước, nếu không có thì dùng imageUrl
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (formData.imageUrl.trim()) {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }

      const response = await fetch(`http://localhost:8080/api/admin/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setMessage('Cập nhật bài viết thành công!');
        
        // Dispatch event to notify CategorySection about the update
        window.dispatchEvent(new CustomEvent('articleUpdated'));
        
        setTimeout(() => {
          onSave();
          onClose();
        }, 1500);
      } else {
        setMessage('Không thể cập nhật bài viết');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      setMessage('Có lỗi xảy ra khi cập nhật bài viết');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!article) {
    return <div>Không tìm thấy bài viết</div>;
  }

  return (
    <div className="edit-article-overlay">
      <div className="edit-article-modal">
        <div className="edit-article-header">
          <h2>Chỉnh sửa bài viết</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-article-form">
          <div className="form-group">
            <label htmlFor="title">Tiêu đề *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Danh mục *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="summary">Tóm tắt</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows={3}
              placeholder="Tóm tắt ngắn gọn về bài viết..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">URL hình ảnh</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={formData.imageUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="imageFile">Hoặc tải ảnh lên</label>
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input-file"
            />
            <small className="form-hint">Chọn file ảnh mới (tối đa 5MB)</small>
            {article.imageUrl && (
              <div className="current-image">
                <img 
                  src={`http://localhost:8080${article.imageUrl}`} 
                  alt="Current" 
                  style={{maxWidth: '200px', maxHeight: '150px', marginTop: '10px'}}
                />
                <p><small>Ảnh hiện tại</small></p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="content">Nội dung *</label>
            <div className="editor-container">
              <Editor
                apiKey="n3kxhrveca1is968o5bxlw315g5060dra8v1a7wofh0jla3n"
                value={formData.content}
                onEditorChange={(content: string) => setFormData({...formData, content})}
                init={{
                  height: 600,
                  menubar: false,
                  // Khôi phục plugin image để có thể thêm ảnh vào nội dung
                  plugins: 'link lists image',
                  // Khôi phục nút image trong toolbar
                  toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link | image',
                  content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
                  branding: false,
                  // Cấu hình upload ảnh cho nội dung (riêng biệt với thumbnail)
                  automatic_uploads: true,
                  file_picker_callback: (callback: any, _value: any, meta: any) => {
                    if (meta.filetype === 'image') {
                      // Tạo input riêng biệt cho TinyMCE content images
                      const input = document.createElement('input');
                      input.setAttribute('type', 'file');
                      input.setAttribute('accept', 'image/*');
                      input.setAttribute('id', 'tinymce-edit-content-image-picker');
                      input.style.display = 'none';
                      document.body.appendChild(input);
                      
                      input.onchange = function() {
                        const fileInput = this as HTMLInputElement;
                        if (fileInput.files && fileInput.files[0]) {
                          const file = fileInput.files[0];
                          const reader = new FileReader();
                          reader.onload = function() {
                            callback(reader.result, { alt: file.name });
                            document.body.removeChild(input);
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }
                  },
                  setup: (editor: any) => {
                    editor.on('init', () => {
                      console.log('TinyMCE Edit initialized - image functions enabled for content');
                    });
                  }
                }}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
            <button type="submit" disabled={saving} className="btn-save">
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>

          {message && (
            <div className={`admin-message ${message.includes('thành công') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
