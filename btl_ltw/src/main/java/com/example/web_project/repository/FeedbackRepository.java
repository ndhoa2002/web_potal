package com.example.web_project.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.web_project.common.Field;
import com.example.web_project.entity.Feedback;
import com.example.web_project.entity.Feedback.FeedbackStatus;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    // Existing methods
    List<Feedback> findByIsAnsweredTrue();
    List<Feedback> findByIsAnsweredTrueOrderByAnswerTimeDesc();
    List<Feedback> findByField(Field field);
    
    // New enhanced methods for admin management
    Page<Feedback> findByStatus(FeedbackStatus status, Pageable pageable);
    Page<Feedback> findByIsAnswered(Boolean isAnswered, Pageable pageable);
    List<Feedback> findByEmailOrderByQuestionTimeDesc(String email);
    
    @Query("SELECT f FROM Feedback f WHERE f.questionTime BETWEEN :startDate AND :endDate ORDER BY f.questionTime DESC")
    Page<Feedback> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                 @Param("endDate") LocalDateTime endDate, 
                                 Pageable pageable);
    
    long countByStatus(FeedbackStatus status);
    
    @Query("SELECT f FROM Feedback f WHERE " +
           "LOWER(f.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Feedback> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT f FROM Feedback f WHERE f.field = :field ORDER BY f.questionTime DESC")
    Page<Feedback> findByFieldWithPagination(@Param("field") Field field, Pageable pageable);
}
