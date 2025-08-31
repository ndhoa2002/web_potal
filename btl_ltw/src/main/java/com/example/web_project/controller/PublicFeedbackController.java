package com.example.web_project.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.web_project.common.Field;
import com.example.web_project.entity.Feedback;
import com.example.web_project.service.FeedbackService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicFeedbackController {
    
    private final FeedbackService feedbackService;

    /**
     * Lấy danh sách feedback đã được trả lời để hiển thị công khai
     */
    @GetMapping("/feedbacks")
    public ResponseEntity<List<Feedback>> getAnsweredFeedbacks() {
        try {
            List<Feedback> answeredFeedbacks = feedbackService.getAnsweredFeedbacks();
            return ResponseEntity.ok(answeredFeedbacks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Gửi câu hỏi đơn giản (chỉ cần question)
     */
    @PostMapping("/feedbacks")
    public ResponseEntity<?> submitQuestion(@RequestBody SimpleQuestionRequest request) {
        try {
            Feedback feedback = new Feedback();
            feedback.setTitle("Câu hỏi từ người dân");
            feedback.setContent(request.getQuestion());
            feedback.setFullName("Người dân"); // Tên mặc định
            feedback.setEmail("anonymous@example.com"); // Email ẩn danh
            feedback.setField(Field.OTHER_FIELDS); // Lĩnh vực mặc định
            feedback.setIsAnswered(false);
            feedback.setStatus(Feedback.FeedbackStatus.PENDING);
            feedback.setQuestionTime(LocalDateTime.now());
            
            Feedback savedFeedback = feedbackService.createFeedback(feedback);
            
            return ResponseEntity.ok()
                .body(new FeedbackResponse(
                    true, 
                    "Gửi câu hỏi thành công. Chúng tôi sẽ trả lời sớm nhất có thể.",
                    savedFeedback.getId()
                ));
                
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new FeedbackResponse(
                    false, 
                    "Có lỗi xảy ra khi gửi câu hỏi: " + e.getMessage(),
                    null
                ));
        }
    }

    /**
     * User gửi phản hồi/yêu cầu (không cần đăng nhập)
     */
    @PostMapping("/feedback/submit")
    public ResponseEntity<?> submitFeedback(@Valid @RequestBody FeedbackSubmissionRequest request) {
        try {
            Feedback feedback = new Feedback();
            feedback.setTitle(request.getTitle());
            feedback.setFullName(request.getFullName());
            feedback.setEmail(request.getEmail());
            feedback.setPersonalId(request.getPersonalId());
            feedback.setPhone(request.getPhone());
            feedback.setField(request.getField());
            feedback.setContent(request.getContent());
            feedback.setIsAnswered(false);
            feedback.setStatus(Feedback.FeedbackStatus.PENDING);
            feedback.setQuestionTime(LocalDateTime.now());
            
            Feedback savedFeedback = feedbackService.createFeedback(feedback);
            
            return ResponseEntity.ok()
                .body(new FeedbackResponse(
                    true, 
                    "Gửi phản hồi thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
                    savedFeedback.getId()
                ));
                
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new FeedbackResponse(
                    false, 
                    "Có lỗi xảy ra khi gửi phản hồi: " + e.getMessage(),
                    null
                ));
        }
    }

    /**
     * User tra cứu phản hồi bằng email (không cần đăng nhập)
     */
    @GetMapping("/check")
    public ResponseEntity<List<Feedback>> checkFeedbackByEmail(@RequestParam String email) {
        try {
            List<Feedback> feedbacks = feedbackService.getFeedbacksByEmail(email);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy danh sách các lĩnh vực có thể phản hồi
     */
    @GetMapping("/fields")
    public ResponseEntity<Field[]> getAvailableFields() {
        return ResponseEntity.ok(Field.values());
    }

    // DTOs cho request/response
    public static class SimpleQuestionRequest {
        private String question;

        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }
    }

    public static class FeedbackSubmissionRequest {
        private String title;
        private String fullName;
        private String email;
        private String personalId;
        private String phone;
        private Field field;
        private String content;

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPersonalId() { return personalId; }
        public void setPersonalId(String personalId) { this.personalId = personalId; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        
        public Field getField() { return field; }
        public void setField(Field field) { this.field = field; }
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class FeedbackResponse {
        private boolean success;
        private String message;
        private Long feedbackId;

        public FeedbackResponse(boolean success, String message, Long feedbackId) {
            this.success = success;
            this.message = message;
            this.feedbackId = feedbackId;
        }

        // Getters and setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public Long getFeedbackId() { return feedbackId; }
        public void setFeedbackId(Long feedbackId) { this.feedbackId = feedbackId; }
    }
}
