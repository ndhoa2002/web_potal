package com.example.web_project.dto;

import com.example.web_project.common.Category;
import com.example.web_project.common.Type;
import com.example.web_project.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class ArticleDTO {
    private Long id;

    @NotBlank(message = "Title bài viết không được để trống")
    private String title;

    private String summary;

    @Lob
    @NotBlank(message = "Nội dung bài viết không được để trống")
    private String content;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private Category category;

//    private Long userId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
