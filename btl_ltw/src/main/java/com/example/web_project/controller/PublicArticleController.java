package com.example.web_project.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.web_project.entity.Article;
import com.example.web_project.service.ArticleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/articles")
@RequiredArgsConstructor
public class PublicArticleController {
    
    private final ArticleService articleService;

    /**
     * Get all published articles for public view (no authentication required)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getPublishedArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Article> articlePage = articleService.getAllArticles(pageable);
            
            Map<String, Object> response = Map.of(
                "articles", articlePage.getContent(),
                "currentPage", articlePage.getNumber(),
                "totalItems", articlePage.getTotalElements(),
                "totalPages", articlePage.getTotalPages(),
                "pageSize", articlePage.getSize()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get a specific article by ID for public view (no authentication required)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getArticleById(@PathVariable Long id) {
        try {
            Article article = articleService.getArticleById(id);
            if (article != null) {
                // Create a simple response map to avoid serialization issues
                Map<String, Object> response = new HashMap<>();
                response.put("id", article.getId());
                response.put("title", article.getTitle());
                response.put("content", article.getContent());
                response.put("summary", article.getSummary());
                response.put("imageUrl", article.getImageUrl());
                response.put("category", article.getCategory() != null ? article.getCategory().name() : null);
                response.put("createdAt", article.getCreatedAt());
                response.put("createdBy", article.getUser() != null ? article.getUser().getUsername() : null);
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error fetching article with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}
