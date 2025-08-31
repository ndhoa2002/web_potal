import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './Admin.css';

export function CreateArticle() {
  const [article, setArticle] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    imageUrl: '',
    image: null as File | null
  });
  const [imageType, setImageType] = useState<'file' | 'url'>('file');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(''); // Preview riêng cho thumbnail

  const categories = [
    { value: '', label: 'Chọn danh mục' },
    { value: 'HOAT_DONG_BO_CONG_AN', label: 'Hoạt động của Bộ Công an' },
    { value: 'HOAT_DONG_CONG_AN_DIA_PHUONG', label: 'Hoạt động của Công an địa phương' },
    { value: 'DOI_NGOAI', label: 'Đối ngoại' },
    { value: 'AN_NINH_TRAT_TU', label: 'An ninh, trật tự' },
    { value: 'PHO_BIEN_GIAO_DUC_PHAP_LUAT', label: 'Phổ biến giáo dục pháp luật' },
    { value: 'CHI_DAO_DIEU_HANH', label: 'Chỉ đạo điều hành' },
    { value: 'NGUOI_TOT_VIEC_TOT', label: 'Người tốt, việc tốt' },
    { value: 'HOAT_DONG_XA_HOI', label: 'Hoạt động xã hội' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!article.title.trim() || !article.content.trim() || !article.category) {
      setMessage('Vui lòng điền đầy đủ thông tin bài viết');
      return;
    }

    // Validation: Kiểm tra xung đột thumbnail và content
    if (thumbnailPreview && article.content.includes(thumbnailPreview)) {
      setMessage('Phát hiện ảnh thumbnail trong nội dung bài viết. Vui lòng xóa ảnh thumbnail khỏi nội dung trước khi lưu.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      
      // Append dữ liệu trực tiếp như @RequestParam expect
      formData.append('title', article.title);
      formData.append('content', article.content);
      formData.append('category', article.category);
      if (article.summary) {
        formData.append('summary', article.summary);
      }
      
      // Xử lý ảnh: ưu tiên image file trước, nếu không có thì dùng imageUrl
      if (article.image) {
        formData.append('image', article.image);
      } else if (article.imageUrl.trim()) {
        formData.append('imageUrl', article.imageUrl);
      }

      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8080/api/admin/articles/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Không set Content-Type, để browser tự động set multipart boundary
        },
        body: formData
      });

      if (response.ok) {
        setMessage('Tạo bài viết thành công!');
        
        // Dispatch event to notify CategorySection about the new article
        window.dispatchEvent(new CustomEvent('articleUpdated'));
        
        setArticle({
          title: '',
          summary: '',
          content: '',
          category: '',
          imageUrl: '',
          image: null
        });
        setImageType('file');
        setThumbnailPreview('');
        const fileInput = document.getElementById('thumbnail-image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const errorData = await response.text();
        setMessage(`Không thể tạo bài viết: ${errorData}`);
      }
    } catch (error) {
      console.error('Error creating article:', error);
      setMessage('Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setIsSubmitting(false);
    }
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
      setArticle({...article, image: file});
      
      // Tạo preview cho thumbnail
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setMessage('');
    }
  };

  // Handler riêng cho URL thumbnail
  const handleThumbnailUrlChange = (url: string) => {
    setArticle({...article, imageUrl: url});
    setThumbnailPreview(url);
  };

  // Reset thumbnail
  const resetThumbnail = () => {
    setArticle({...article, image: null, imageUrl: ''});
    setThumbnailPreview('');
    const fileInput = document.getElementById('thumbnail-image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="create-article">
      <div className="create-article-header">
        <h2>Tạo bài viết mới</h2>
        <p>Soạn thảo và xuất bản bài viết chính thức của Bộ Công An</p>
      </div>
      
      <div className="article-form-container">
        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="title">Tiêu đề bài viết *</label>
              <input
                id="title"
                value={article.title}
                onChange={(e) => setArticle({...article, title: e.target.value})}
                required
                placeholder="Nhập tiêu đề bài viết chính thức..."
                className="form-input-title"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="category">Danh mục *</label>
              <select
                id="category"
                value={article.category}
                onChange={(e) => setArticle({...article, category: e.target.value})}
                required
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group half-width">
              <label>Hình ảnh đại diện</label>
              <div className="image-upload-container">
                <div className="image-type-tabs">
                  <button
                    type="button"
                    className={`tab-button ${imageType === 'file' ? 'active' : ''}`}
                    onClick={() => {
                      setImageType('file');
                      setArticle({...article, imageUrl: ''});
                      setThumbnailPreview('');
                    }}
                  >
                    Tải từ máy tính
                  </button>
                  <button
                    type="button"
                    className={`tab-button ${imageType === 'url' ? 'active' : ''}`}
                    onClick={() => {
                      setImageType('url');
                      setArticle({...article, image: null});
                      setThumbnailPreview('');
                      const fileInput = document.getElementById('thumbnail-image') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    Nhập đường link
                  </button>
                </div>
                
                {/* Preview thumbnail nếu có */}
                {thumbnailPreview && (
                  <div className="thumbnail-preview" style={{marginBottom: '10px', textAlign: 'center'}}>
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      style={{
                        maxWidth: '150px', 
                        maxHeight: '100px', 
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }} 
                    />
                    <div style={{marginTop: '5px'}}>
                      <button 
                        type="button" 
                        onClick={resetThumbnail}
                        className="btn-remove-thumbnail"
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '2px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                )}
                
                {imageType === 'file' ? (
                  <div className="file-upload-section">
                    <input
                      type="file"
                      id="thumbnail-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="form-input-file"
                    />
                    <small className="form-hint">
                      Chọn file ảnh (tối đa 5MB). Ảnh này sẽ hiển thị bên trái làm ảnh đại diện của bài viết.
                    </small>
                  </div>
                ) : (
                  <div className="url-input-section">
                    <input
                      type="url"
                      value={article.imageUrl}
                      onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="form-input"
                    />
                    <small className="form-hint">
                      Nhập URL của ảnh đại diện. Ảnh này sẽ hiển thị bên trái làm ảnh đại diện của bài viết.
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="summary">Tóm tắt</label>
              <textarea
                id="summary"
                value={article.summary}
                onChange={(e) => setArticle({...article, summary: e.target.value})}
                placeholder="Nhập tóm tắt ngắn gọn về nội dung bài viết..."
                rows={3}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Nội dung bài viết *</label>
              <small className="form-hint" style={{marginBottom: '8px', display: 'block'}}>
                Nhập nội dung bài viết. Bạn có thể thêm ảnh vào nội dung bằng nút "Image" trên toolbar. Ảnh thumbnail bên trái là riêng biệt.
              </small>
              <div className="editor-container">
                <Editor
                  apiKey="n3kxhrveca1is968o5bxlw315g5060dra8v1a7wofh0jla3n"
                  value={article.content}
                  onEditorChange={(content: string) => setArticle({...article, content})}
                  init={{
                    height:400,
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
                        input.setAttribute('id', 'tinymce-content-image-picker');
                        input.style.display = 'none';
                        document.body.appendChild(input);
                        
                        input.onchange = function() {
                          const fileInput = this as HTMLInputElement;
                          if (fileInput.files && fileInput.files[0]) {
                            const file = fileInput.files[0];
                            const reader = new FileReader();
                            reader.onload = function() {
                              // Validation: đảm bảo ảnh content khác với thumbnail
                              const contentImageSrc = reader.result as string;
                              if (thumbnailPreview && contentImageSrc === thumbnailPreview) {
                                alert('Ảnh này đã được sử dụng làm thumbnail. Vui lòng chọn ảnh khác cho nội dung.');
                                document.body.removeChild(input);
                                return;
                              }
                              callback(reader.result, { alt: file.name + ' - Content Image' });
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
                        console.log('TinyMCE initialized - image functions enabled for content');
                      });
                      
                      // Validation khi paste hoặc thay đổi content
                      editor.on('SetContent', () => {
                        const content = editor.getContent();
                        if (thumbnailPreview && content.includes(thumbnailPreview)) {
                          alert('Phát hiện ảnh thumbnail trong nội dung. Vui lòng xóa ảnh thumbnail khỏi nội dung.');
                          return false;
                        }
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo bài viết'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setArticle({title: '', summary: '', content: '', category: '', imageUrl: '', image: null});
                setImageType('file');
                setThumbnailPreview('');
                const fileInput = document.getElementById('thumbnail-image') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                setMessage('');
              }}
              className="btn-secondary"
            >
              Làm mới
            </button>
          </div>
        </form>
        
        {message && (
          <div className={`admin-message ${message.includes('thành công') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
