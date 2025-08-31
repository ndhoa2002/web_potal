import { useState, useEffect } from "react";
import "./QandASection.css";

interface Feedback {
  id: number;
  title: string;
  content: string; // câu hỏi
  answer?: string;
  questionTime: string; // thời gian hỏi
  answerTime?: string; // thời gian trả lời
  fullName: string;
}

export default function QandASection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/public/feedbacks');
      if (response.ok) {
        const data = await response.json();
        // Chỉ lấy các feedback đã được trả lời
        const answeredFeedbacks = data.filter((f: Feedback) => f.answer && f.answer.trim() !== '');
        setFeedbacks(answeredFeedbacks.slice(0, 5)); // Lấy 5 câu hỏi gần nhất
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/public/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newQuestion }),
      });

      if (response.ok) {
        setMessage('Câu hỏi của bạn đã được gửi thành công! Chúng tôi sẽ trả lời sớm nhất có thể.');
        setNewQuestion('');
      } else {
        setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="qanda-section">
      <h2 className="section-title">Hỏi đáp và Phản hồi</h2>
      
      {/* Form gửi câu hỏi */}
      <div className="question-form">
        <h3>Gửi câu hỏi của bạn</h3>
        <form onSubmit={handleSubmitQuestion}>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Nhập câu hỏi của bạn về pháp luật, thủ tục hành chính..."
            rows={4}
            className="question-input"
            required
          />
          <button 
            type="submit" 
            disabled={submitting || !newQuestion.trim()}
            className="submit-question-btn"
          >
            {submitting ? 'Đang gửi...' : 'Gửi câu hỏi'}
          </button>
        </form>
        {message && (
          <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>

      {/* Danh sách Q&A */}
      <div className="qanda-list">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="qanda-item">
              <div className="question-header">
                <strong>Câu hỏi:</strong> {feedback.title}
                <small className="questioner">- {feedback.fullName}</small>
              </div>
              <p className="question-content">
                {feedback.content}
              </p>
              <p className="answer">
                <strong>Trả lời:</strong> {feedback.answer}
              </p>
              <small className="date">
                Trả lời ngày: {new Date(feedback.answerTime || feedback.questionTime).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}
              </small>
            </div>
          ))
        ) : (
          <div className="no-questions">
            <p>Chưa có câu hỏi nào được trả lời. Hãy là người đầu tiên gửi câu hỏi!</p>
          </div>
        )}
      </div>
    </section>
  );
}
