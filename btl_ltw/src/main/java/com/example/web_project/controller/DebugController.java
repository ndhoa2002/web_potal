package com.example.web_project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.util.List;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Autowired
    private EntityManager entityManager;

    @GetMapping("/articles")
    @Transactional
    public List<Object[]> getArticleData() {
        Query query = entityManager.createNativeQuery("SELECT id, title, category FROM article LIMIT 10");
        return query.getResultList();
    }

    @GetMapping("/fix-schema")
    @Transactional
    public String fixArticleSchema() {
        try {
            // Drop và tạo lại table với enum mới
            Query dropQuery = entityManager.createNativeQuery("DROP TABLE IF EXISTS article");
            dropQuery.executeUpdate();

            String createTableQuery = """
                CREATE TABLE article (
                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    category ENUM(
                        'HOAT_DONG_BO_CONG_AN',
                        'HOAT_DONG_CONG_AN_DIA_PHUONG',
                        'DOI_NGOAI',
                        'AN_NINH_TRAT_TU',
                        'PHO_BIEN_GIAO_DUC_PHAP_LUAT',
                        'CHI_DAO_DIEU_HANH',
                        'NGUOI_TOT_VIEC_TOT',
                        'HOAT_DONG_XA_HOI'
                    ) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    created_by VARCHAR(255),
                    updated_by VARCHAR(255),
                    user_id BIGINT,
                    FOREIGN KEY (user_id) REFERENCES user(id)
                )
                """;
            
            Query createQuery = entityManager.createNativeQuery(createTableQuery);
            createQuery.executeUpdate();
            
            return "Article table recreated successfully with new enum values";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
