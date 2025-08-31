package com.example.web_project.entity;

import java.time.LocalDateTime;

import com.example.web_project.common.Field;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "feedback")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String personalId;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Field field;

    @Column(columnDefinition = "MEDIUMTEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private Boolean isAnswered = false;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String answer;

    @Column(name = "question_time", nullable = false)
    private LocalDateTime questionTime = LocalDateTime.now();

    @Column(name = "answer_time")
    private LocalDateTime answerTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedbackStatus status = FeedbackStatus.PENDING;

    @Column(name = "responded_by")
    private String respondedBy;

    @ManyToOne
    @JoinColumn(name = "userId")
    @JsonIgnoreProperties({"articles", "feedbacks", "password"})
    private User user;

    public enum FeedbackStatus {
        PENDING("Chờ xử lý"),
        IN_PROGRESS("Đang xử lý"), 
        RESOLVED("Đã giải quyết"),
        REJECTED("Từ chối");
        
        private final String displayName;
        
        FeedbackStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}
