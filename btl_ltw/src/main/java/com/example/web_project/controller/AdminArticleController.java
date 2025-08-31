package com.example.web_project.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.web_project.common.Category;
import com.example.web_project.dto.ArticleDTO;
import com.example.web_project.entity.Article;
import com.example.web_project.entity.User;
import com.example.web_project.repository.ArticleRepository;
import com.example.web_project.repository.UserRepository;
import com.example.web_project.service.ArticleService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/admin/articles")
@RequiredArgsConstructor
public class AdminArticleController {

    private final ArticleService articleService;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    // Lấy tất cả bài viết có phân trang
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Category category) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Article> articlePage;
        
        if (category != null) {
            articlePage = articleRepository.findByCategory(category, pageable);
        } else {
            articlePage = articleRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("articles", articlePage.getContent());
        response.put("currentPage", articlePage.getNumber());
        response.put("totalItems", articlePage.getTotalElements());
        response.put("totalPages", articlePage.getTotalPages());
        response.put("pageSize", articlePage.getSize());

        return ResponseEntity.ok(response);
    }

    // Lấy bài viết của user hiện tại
    @GetMapping("/my-articles")
    public ResponseEntity<Map<String, Object>> getMyArticles(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        if (authentication == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, 
            Sort.by("createdAt").descending());
        Page<Article> articlePage = articleRepository.findByUser(user, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("articles", articlePage.getContent());
        response.put("currentPage", articlePage.getNumber());
        response.put("totalItems", articlePage.getTotalElements());
        response.put("totalPages", articlePage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // Tạo bài viết mới
    @PostMapping
    public ResponseEntity<Article> createArticle(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("category") String category,
            @RequestParam(value = "summary", required = false) String summary,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        ArticleDTO articleDTO = new ArticleDTO();
        articleDTO.setTitle(title);
        articleDTO.setContent(content);
        articleDTO.setCategory(Category.valueOf(category));
        articleDTO.setSummary(summary);
        
        Article article = articleService.createArticle(articleDTO, image);
        return ResponseEntity.ok(article);
    }

    // Tạo bài viết mới - endpoint cho frontend
    @PostMapping("/create")
    public ResponseEntity<?> createArticleV2(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("category") String category,
            @RequestParam(value = "summary", required = false) String summary,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "imageUrl", required = false) String imageUrl) {
        try {
            System.out.println("Creating article with title: " + title);
            System.out.println("Category: " + category);
            System.out.println("Has image file: " + (image != null && !image.isEmpty()));
            System.out.println("Has image URL: " + (imageUrl != null && !imageUrl.trim().isEmpty()));
            System.out.println("Image URL value: " + imageUrl);
            
            ArticleDTO articleDTO = new ArticleDTO();
            articleDTO.setTitle(title);
            articleDTO.setContent(content);
            articleDTO.setCategory(Category.valueOf(category.toUpperCase()));
            articleDTO.setSummary(summary);
            
            // Ưu tiên image file trước, nếu không có thì dùng imageUrl
            if (imageUrl != null && !imageUrl.trim().isEmpty() && (image == null || image.isEmpty())) {
                articleDTO.setImageUrl(imageUrl);
                System.out.println("Setting imageUrl in DTO: " + imageUrl);
            }
            
            Article article = articleService.createArticle(articleDTO, image);
            System.out.println("Article created successfully with ID: " + article.getId());
            System.out.println("Final imageUrl in article: " + article.getImageUrl());
            return ResponseEntity.ok(article);
        } catch (Exception e) {
            System.err.println("Error creating article: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", "INTERNAL_ERROR");
            errorResponse.put("message", "Đã xảy ra lỗi không xác định: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // Test endpoint
    @PostMapping("/test")
    public ResponseEntity<?> testEndpoint(@RequestParam("message") String message) {
        Map<String, String> response = new HashMap<>();
        response.put("received", message);
        response.put("status", "OK");
        return ResponseEntity.ok(response);
    }

    // Lấy bài viết theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        Article article = articleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }

    // Cập nhật bài viết
    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(
            @PathVariable Long id, 
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("category") String category,
            @RequestParam(value = "summary", required = false) String summary,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "imageUrl", required = false) String imageUrl,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.badRequest().build();
        }

        // Kiểm tra quyền sở hữu bài viết
        Article existingArticle = articleService.getArticleById(id);
        if (!existingArticle.getUser().getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        System.out.println("Updating article ID: " + id);
        System.out.println("Has image file: " + (image != null && !image.isEmpty()));
        System.out.println("Has image URL: " + (imageUrl != null && !imageUrl.trim().isEmpty()));
        System.out.println("Image URL value: " + imageUrl);

        ArticleDTO articleDTO = new ArticleDTO();
        articleDTO.setTitle(title);
        articleDTO.setContent(content);
        articleDTO.setCategory(Category.valueOf(category));
        articleDTO.setSummary(summary);
        
        // Ưu tiên image file trước, nếu không có thì dùng imageUrl
        if (imageUrl != null && !imageUrl.trim().isEmpty() && (image == null || image.isEmpty())) {
            articleDTO.setImageUrl(imageUrl);
            System.out.println("Setting imageUrl in DTO for update: " + imageUrl);
        }

        Article updatedArticle = articleService.updateArticle(id, articleDTO, image);
        System.out.println("Article updated successfully. Final imageUrl: " + updatedArticle.getImageUrl());
        return ResponseEntity.ok(updatedArticle);
    }

    // Xóa bài viết
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteArticle(
            @PathVariable Long id,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.badRequest().build();
        }

        // Kiểm tra quyền sở hữu bài viết
        Article existingArticle = articleService.getArticleById(id);
        if (!existingArticle.getUser().getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        articleService.deleteArticle(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Xóa bài viết thành công");
        return ResponseEntity.ok(response);
    }

    // Lấy danh sách categories
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, String>>> getCategories() {
        List<Map<String, String>> categories = Arrays.stream(Category.values())
                .map(cat -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("value", cat.name());
                    map.put("label", cat.getCategoryName());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    // Thống kê bài viết
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalArticles", articleRepository.countByUser(user));
        stats.put("totalAllArticles", articleRepository.count());
        
        // Thống kê theo category của user
        Map<String, Long> categoryStats = new HashMap<>();
        for (Category category : Category.values()) {
            long count = articleRepository.countByUserAndCategory(user, category);
            categoryStats.put(category.getCategoryName(), count);
        }
        stats.put("categoryStats", categoryStats);

        return ResponseEntity.ok(stats);
    }
}
