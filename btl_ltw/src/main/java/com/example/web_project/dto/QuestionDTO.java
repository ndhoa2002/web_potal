package com.example.web_project.dto;

import com.example.web_project.common.Field;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionDTO {

    private Long id;

    @NotBlank(message = "tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "tên không được để trống")
    private String fullName;

    @NotBlank(message = "email không được để trống")
    private String email;

    @NotBlank(message = "Id không được để trống")
    private String personalId;

    @NotBlank(message = "Phone không được để trống")
    private String phone;

    @Enumerated(EnumType.STRING)
    private Field field;

    @NotBlank(message = "Content không được để trống")
    private String content;
}
