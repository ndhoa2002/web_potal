package com.example.web_project.service;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.web_project.dto.AnswerDTO;
import com.example.web_project.dto.QuestionDTO;
import com.example.web_project.entity.Feedback;
import com.example.web_project.entity.User;
import com.example.web_project.exception.ResourceNotFoundException;
import com.example.web_project.repository.FeedbackRepository;
import com.example.web_project.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final ModelMapper modelMapper;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    // Existing method for DTOs
    public Feedback createFeedback(QuestionDTO questionDTO) {
        Feedback feedback = modelMapper.map(questionDTO, Feedback.class);
        feedback.setIsAnswered(false);
        feedback.setQuestionTime(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    // New method for direct entity creation (for public API)
    public Feedback createFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    // Enhanced method for answering feedback
    public Feedback answerFeedback(Long id, AnswerDTO answerDTO) {
        Feedback feedback = feedbackRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Câu hỏi không tồn tại"));
        
        feedback.setAnswer(answerDTO.getAnswer());
        feedback.setIsAnswered(true);
        feedback.setStatus(Feedback.FeedbackStatus.RESOLVED);
        feedback.setAnswerTime(LocalDateTime.now());
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
            feedback.setUser(user);
            feedback.setRespondedBy(username);
        }
        
        return feedbackRepository.save(feedback);
    }

    // New enhanced methods for admin management
    public Page<Feedback> getAllFeedbacks(Pageable pageable) {
        return feedbackRepository.findAll(pageable);
    }

    public Page<Feedback> getFeedbacksByStatus(Feedback.FeedbackStatus status, Pageable pageable) {
        return feedbackRepository.findByStatus(status, pageable);
    }

    public List<Feedback> getFeedbacksByEmail(String email) {
        return feedbackRepository.findByEmailOrderByQuestionTimeDesc(email);
    }

    public Page<Feedback> searchFeedbacks(String keyword, Pageable pageable) {
        return feedbackRepository.searchByKeyword(keyword, pageable);
    }

    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Feedback không tồn tại"));
    }

    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feedback không tồn tại");
        }
        feedbackRepository.deleteById(id);
    }

    public Feedback updateFeedbackStatus(Long id, Feedback.FeedbackStatus status) {
        Feedback feedback = getFeedbackById(id);
        feedback.setStatus(status);
        return feedbackRepository.save(feedback);
    }

    // Statistics methods
    public long countByStatus(Feedback.FeedbackStatus status) {
        return feedbackRepository.countByStatus(status);
    }

    public long getTotalFeedbacks() {
        return feedbackRepository.count();
    }

    // New method for getting answered feedbacks for public display
    public List<Feedback> getAnsweredFeedbacks() {
        return feedbackRepository.findByIsAnsweredTrueOrderByAnswerTimeDesc();
    }
}
