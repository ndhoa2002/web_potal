package com.example.web_project.entity;


import com.example.web_project.common.Category;
import com.example.web_project.common.Type;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "article")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Article extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String title;

    @Column(length = 1000)
    private String summary;

    @Lob
    @NotNull
    private String content;

    private String imageUrl;

//    @Enumerated(EnumType.STRING)
//    private Type type;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"articles", "feedbacks", "password"})
    private User user;
}
