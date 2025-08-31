import React, { useState } from 'react';
import './UserFeedback.css';

export const UserFeedback: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    personalId: '',
    field: '',
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const feedbackTypes = [
    { value: 'POLICIES_AND_REGIMES', label: 'Chế độ chính sách' },
    { value: 'CRIME_PREVENTION_AND_COMBAT', label: 'Đấu tranh phòng chống tội phạm' },
    { value: 'LEGAL_AFFAIRS', label: 'Pháp chế' },
    { value: 'FIRE_SAFETY_AND_FIREFIGHTING', label: 'Phòng cháy và chữa cháy' },
    { value: 'CRIMINAL_SENTENCE_ENFORCEMENT_AND_JUDICIAL_ASSISTANCE', label: 'Thi hành án hình sự và hỗ trợ tư pháp' },
    { value: 'ADMINISTRATIVE_PROCEDURES', label: 'Thủ tục hành chính' },
    { value: 'RECRUITMENT_AND_TRAINING', label: 'Tuyển dụng và đào tạo' },
    { value: 'TRAFFIC_ORDER_AND_SAFETY', label: 'Trật tự an toàn giao thông' },
    { value: 'OTHER_FIELDS', label: 'Các lĩnh vực khác' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Gửi feedback đến server
      const response = await fetch('http://localhost:8080/api/public/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          personalId: '',
          field: '',
          title: '',
          content: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại.');
      }
    } catch (error) {
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="feedback-container">
        <div className="feedback-success">
          <div className="success-icon">✓</div>
          <h2>Gửi phản hồi thành công!</h2>
          <p>Cảm ơn bạn đã gửi phản hồi. Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="submit-another-btn"
          >
            Gửi phản hồi khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1>Phản hồi công dân</h1>
        <p>Bộ Công An luôn lắng nghe và tiếp nhận ý kiến đóng góp từ công dân</p>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              placeholder="Nhập họ và tên của bạn"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Nhập địa chỉ email"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="form-group">
            <label htmlFor="personalId">CCCD/CMND</label>
            <input
              type="text"
              id="personalId"
              name="personalId"
              value={formData.personalId}
              onChange={handleInputChange}
              placeholder="Nhập số CCCD/CMND"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="field">Lĩnh vực phản hồi *</label>
            <select
              id="field"
              name="field"
              value={formData.field}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn lĩnh vực</option>
              {feedbackTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Tiêu đề *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Nhập tiêu đề phản hồi"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Nội dung phản hồi *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={6}
            placeholder="Nhập nội dung phản hồi chi tiết..."
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
          </button>
        </div>
      </form>

      <div className="feedback-info">
        <h3>Thông tin liên hệ</h3>
        <div className="contact-info">
          <div className="contact-item">
            <strong>Địa chỉ:</strong> 47 Phạm Văn Đồng, Cầu Giấy, Hà Nội
          </div>
          <div className="contact-item">
            <strong>Điện thoại:</strong> (024) 3934 5555
          </div>
          <div className="contact-item">
            <strong>Email:</strong> info@bocongan.gov.vn
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
