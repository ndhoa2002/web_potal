package com.example.web_project.controller;

import com.example.web_project.common.Category;
import com.example.web_project.entity.Article;
import com.example.web_project.entity.Feedback;
import com.example.web_project.repository.ArticleRepository;
import com.example.web_project.repository.FeedbackRepository;
import com.example.web_project.service.ArticleService;
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
@RequestMapping("/users")
public class UserController {
    private final ArticleService articleService;
    private final ArticleRepository articleRepository;
    private final FeedbackRepository feedbackRepository;

    @GetMapping("/articles")
    public List<Article> getArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/articles/by-category")
    public List<Article> getArticlesByCategory(@RequestParam Category category) {
        List<Article> articles = articleRepository.findByCategory(category);
        return articles;
    }

    @GetMapping("/articles/{id}")
    public Article getArticleById(@PathVariable Long id) {
        Article article = articleService.getArticleById(id);
        return article;
    }

    @GetMapping("/articles/categories")
    public List<Map<String, String>> getCategories() {
        List<Map<String, String>> categories = Arrays.stream(Category.values())
                .map(cat -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("value", cat.name());
                    map.put("label", cat.getCategoryName());
                    return map;
                })
                .collect(Collectors.toList());
        return categories;
    }

    @GetMapping("/feedbacks-answered")
    public List<Feedback> getAllFeedbackByAnswered() {
        return feedbackRepository.findByIsAnsweredTrue();
    }
}
