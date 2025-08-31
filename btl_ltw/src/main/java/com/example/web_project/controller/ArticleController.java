package com.example.web_project.controller;


import com.example.web_project.common.Category;
import com.example.web_project.dto.ArticleDTO;
import com.example.web_project.entity.Article;
import com.example.web_project.entity.User;
import com.example.web_project.repository.ArticleRepository;
import com.example.web_project.repository.UserRepository;
import com.example.web_project.service.ArticleService;
import jakarta.servlet.ServletContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
@RestController
@RequestMapping("/writer/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final ServletContext servletContext;
    private final ArticleService articleService;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;

    @GetMapping
    public List<Article> getArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/by-category")
    public List<Article> getArticlesByCategory(@RequestParam Category category) {
        List<Article> articles = articleRepository.findByCategory(category);
        return articles;
    }

    @GetMapping("/categories")
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

    @GetMapping("/{id}")
    public Article getArticleById(@PathVariable Long id) {
        Article article = articleService.getArticleById(id);
        return article;
    }

    @PostMapping
    public Article addArticle(@RequestBody @Valid ArticleDTO articleDTO) {
        return articleService.createArticle(articleDTO);
    }

    @PutMapping("/{id}")
    public Article updateArticle(@PathVariable Long id, @RequestBody @Valid ArticleDTO articleDTO) {
        return articleService.updateArticle(id, articleDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
    }

    @PostMapping("/upload")
    public Map<String, String> uploadImage(@RequestParam("upload") MultipartFile file) throws IOException {
//        String uploadDir = "/images/";
//        Files.createDirectories(Paths.get(uploadDir));
//
//        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//        Path target = Paths.get(uploadDir, fileName);
//        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String rootPath = this.servletContext.getRealPath("/resources/images");
        String fileName = "";

        try {
            byte[] bytes = file.getBytes();

            File dir = new File(rootPath);
            if(!dir.exists())
                dir.mkdirs();

            fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            File serverFile = new File(dir.getAbsolutePath() + File.separator + fileName);

            BufferedOutputStream stream = new BufferedOutputStream(
                    new FileOutputStream(serverFile));
            stream.write(bytes);
            stream.close();
        }catch (IOException e){
            e.printStackTrace();
        }

//        return ResponseEntity.ok(Map.of("url", "http://localhost:8080/images/" + fileName)).getBody();
//        return Map.of("url", "http://localhost:8080/images/" + fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("location", "http://localhost:8080/images/" + fileName)).getBody();

    }
}
