package com.example.web_project.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.web_project.dto.AnswerDTO;
import com.example.web_project.entity.Feedback;
import com.example.web_project.service.FeedbackService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/feedback")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('WRITER')")
public class AdminFeedbackController {
    
    private final FeedbackService feedbackService;

    /**
     * Lấy danh sách tất cả feedback với phân trang
     */
    @GetMapping
    public ResponseEntity<FeedbackPageResponse> getAllFeedbacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "questionTime") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Feedback.FeedbackStatus status,
            @RequestParam(required = false) String keyword) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Feedback> feedbackPage;
            
            if (keyword != null && !keyword.trim().isEmpty()) {
                feedbackPage = feedbackService.searchFeedbacks(keyword, pageable);
            } else if (status != null) {
                feedbackPage = feedbackService.getFeedbacksByStatus(status, pageable);
            } else {
                feedbackPage = feedbackService.getAllFeedbacks(pageable);
            }
            
            FeedbackPageResponse response = new FeedbackPageResponse();
            response.setFeedbacks(feedbackPage.getContent());
            response.setCurrentPage(feedbackPage.getNumber());
            response.setTotalItems(feedbackPage.getTotalElements());
            response.setTotalPages(feedbackPage.getTotalPages());
            response.setPageSize(feedbackPage.getSize());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy chi tiết một feedback
     */
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        try {
            Feedback feedback = feedbackService.getFeedbackById(id);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Trả lời feedback
     */
    @PostMapping("/{id}/answer")
    public ResponseEntity<?> answerFeedback(
            @PathVariable Long id, 
            @RequestBody AnswerRequest request) {
        try {
            AnswerDTO answerDTO = new AnswerDTO();
            answerDTO.setAnswer(request.getAnswer());
            
            Feedback updatedFeedback = feedbackService.answerFeedback(id, answerDTO);
            return ResponseEntity.ok(updatedFeedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Không thể trả lời feedback: " + e.getMessage()));
        }
    }

    /**
     * Cập nhật trạng thái feedback
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateFeedbackStatus(
            @PathVariable Long id, 
            @RequestBody StatusUpdateRequest request) {
        try {
            Feedback updatedFeedback = feedbackService.updateFeedbackStatus(id, request.getStatus());
            return ResponseEntity.ok(updatedFeedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Không thể cập nhật trạng thái: " + e.getMessage()));
        }
    }

    /**
     * Xóa feedback
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        try {
            feedbackService.deleteFeedback(id);
            return ResponseEntity.ok(Map.of("message", "Xóa feedback thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Không thể xóa feedback: " + e.getMessage()));
        }
    }

    /**
     * Thống kê feedback
     */
    @GetMapping("/statistics")
    public ResponseEntity<FeedbackStatistics> getFeedbackStatistics() {
        try {
            FeedbackStatistics stats = new FeedbackStatistics();
            stats.setTotal(feedbackService.getTotalFeedbacks());
            stats.setPending(feedbackService.countByStatus(Feedback.FeedbackStatus.PENDING));
            stats.setInProgress(feedbackService.countByStatus(Feedback.FeedbackStatus.IN_PROGRESS));
            stats.setResolved(feedbackService.countByStatus(Feedback.FeedbackStatus.RESOLVED));
            stats.setRejected(feedbackService.countByStatus(Feedback.FeedbackStatus.REJECTED));
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DTOs
    public static class FeedbackPageResponse {
        private java.util.List<Feedback> feedbacks;
        private int currentPage;
        private long totalItems;
        private int totalPages;
        private int pageSize;

        // Getters and setters
        public java.util.List<Feedback> getFeedbacks() { return feedbacks; }
        public void setFeedbacks(java.util.List<Feedback> feedbacks) { this.feedbacks = feedbacks; }
        
        public int getCurrentPage() { return currentPage; }
        public void setCurrentPage(int currentPage) { this.currentPage = currentPage; }
        
        public long getTotalItems() { return totalItems; }
        public void setTotalItems(long totalItems) { this.totalItems = totalItems; }
        
        public int getTotalPages() { return totalPages; }
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
        
        public int getPageSize() { return pageSize; }
        public void setPageSize(int pageSize) { this.pageSize = pageSize; }
    }

    public static class AnswerRequest {
        private String answer;
        
        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
    }

    public static class StatusUpdateRequest {
        private Feedback.FeedbackStatus status;
        
        public Feedback.FeedbackStatus getStatus() { return status; }
        public void setStatus(Feedback.FeedbackStatus status) { this.status = status; }
    }

    public static class FeedbackStatistics {
        private long total;
        private long pending;
        private long inProgress;
        private long resolved;
        private long rejected;

        // Getters and setters
        public long getTotal() { return total; }
        public void setTotal(long total) { this.total = total; }
        
        public long getPending() { return pending; }
        public void setPending(long pending) { this.pending = pending; }
        
        public long getInProgress() { return inProgress; }
        public void setInProgress(long inProgress) { this.inProgress = inProgress; }
        
        public long getResolved() { return resolved; }
        public void setResolved(long resolved) { this.resolved = resolved; }
        
        public long getRejected() { return rejected; }
        public void setRejected(long rejected) { this.rejected = rejected; }
    }
}
