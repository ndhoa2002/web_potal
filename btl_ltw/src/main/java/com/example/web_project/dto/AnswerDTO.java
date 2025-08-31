package com.example.web_project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnswerDTO {

    @NotBlank(message = "câu trả lời không đợc để trống")
    private String answer;
}
