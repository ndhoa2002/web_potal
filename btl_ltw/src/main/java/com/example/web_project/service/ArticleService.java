package com.example.web_project.service;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.web_project.dto.ArticleDTO;
import com.example.web_project.entity.Article;
import com.example.web_project.entity.User;
import com.example.web_project.exception.ResourceNotFoundException;
import com.example.web_project.repository.ArticleRepository;
import com.example.web_project.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final FileStorageService fileStorageService;

    public Article createArticle(ArticleDTO articleDTO) {
        Article article = modelMapper.map(articleDTO, Article.class);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));
        article.setCreatedAt(LocalDateTime.now());
        article.setUser(user);
        return articleRepository.save(article);
    }

    public Article createArticle(ArticleDTO articleDTO, MultipartFile image) {
        Article article = modelMapper.map(articleDTO, Article.class);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));
        
        // Xử lý ảnh: ưu tiên image file trước, nếu không có thì dùng imageUrl từ DTO
        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image);
            article.setImageUrl(imageUrl);
        } else if (articleDTO.getImageUrl() != null && !articleDTO.getImageUrl().trim().isEmpty()) {
            // Sử dụng imageUrl từ DTO nếu không có image file
            article.setImageUrl(articleDTO.getImageUrl());
        }
        
        article.setCreatedAt(LocalDateTime.now());
        article.setUser(user);
        return articleRepository.save(article);
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Page<Article> getAllArticles(Pageable pageable) {
        return articleRepository.findAll(pageable);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Article not found"));
    }

    public Article updateArticle(Long id, ArticleDTO articleDTO) {
        Article currentArticle = articleRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Bài viết không tồn tại"));
        if (currentArticle != null) {
            currentArticle.setTitle(articleDTO.getTitle());
            currentArticle.setContent(articleDTO.getContent());
            currentArticle.setCategory(articleDTO.getCategory());
            currentArticle.setSummary(articleDTO.getSummary());
            currentArticle.setUpdatedAt(LocalDateTime.now());
        }
        return articleRepository.save(currentArticle);
    }

    public Article updateArticle(Long id, ArticleDTO articleDTO, MultipartFile image) {
        Article currentArticle = articleRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Bài viết không tồn tại"));
        
        // Cập nhật thông tin bài viết
        currentArticle.setTitle(articleDTO.getTitle());
        currentArticle.setContent(articleDTO.getContent());
        currentArticle.setCategory(articleDTO.getCategory());
        currentArticle.setSummary(articleDTO.getSummary());
        currentArticle.setUpdatedAt(LocalDateTime.now());
        
        // Xử lý ảnh: ưu tiên image file trước, nếu không có thì dùng imageUrl từ DTO
        if (image != null && !image.isEmpty()) {
            // Xóa ảnh cũ nếu có và là local file
            if (currentArticle.getImageUrl() != null && currentArticle.getImageUrl().startsWith("/uploads/")) {
                fileStorageService.deleteFile(currentArticle.getImageUrl());
            }
            // Upload ảnh mới
            String imageUrl = fileStorageService.storeFile(image);
            currentArticle.setImageUrl(imageUrl);
        } else if (articleDTO.getImageUrl() != null && !articleDTO.getImageUrl().trim().isEmpty()) {
            // Xóa ảnh cũ nếu có và là local file (không xóa URL ảnh)
            if (currentArticle.getImageUrl() != null && currentArticle.getImageUrl().startsWith("/uploads/")) {
                fileStorageService.deleteFile(currentArticle.getImageUrl());
            }
            // Sử dụng imageUrl từ DTO
            currentArticle.setImageUrl(articleDTO.getImageUrl());
        }
        
        return articleRepository.save(currentArticle);
    }

    public void deleteArticle(Long id) {
        articleRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Bài viết không tồn tại"));
        articleRepository.deleteById(id);
    }

}
