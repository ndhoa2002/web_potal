package com.example.web_project.controller;

import com.example.web_project.common.Category;
import com.example.web_project.common.Field;
import com.example.web_project.dto.AnswerDTO;
import com.example.web_project.dto.QuestionDTO;
import com.example.web_project.entity.Article;
import com.example.web_project.entity.Feedback;
import com.example.web_project.repository.FeedbackRepository;
import com.example.web_project.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
@RestController
@RequiredArgsConstructor
@RequestMapping("/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final FeedbackRepository feedbackRepository;

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    @GetMapping("/by-field")
    public List<Feedback> getFeedbackByField(@RequestParam Field field) {
        List<Feedback> feedbacks = feedbackRepository.findByField(field);
        return feedbacks;
    }

    @PostMapping("/create")
    public Feedback createFeedback(@RequestBody @Valid QuestionDTO questionDTO) {
        return feedbackService.createFeedback(questionDTO);
    }

    @PostMapping("/answer/{id}")
    public Feedback answerFeedback(@PathVariable Long id, @RequestBody @Valid AnswerDTO answerDTO) {
        return feedbackService.answerFeedback(id, answerDTO);
    }

    @GetMapping("/fields")
    public List<Map<String, String>> getFields() {
        List<Map<String, String>> fields = Arrays.stream(Field.values())
                .map(field -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("value", field.name());
                    map.put("label", field.getFieldName());
                    return map;
                })
                .collect(Collectors.toList());
        return fields;
    }

}
