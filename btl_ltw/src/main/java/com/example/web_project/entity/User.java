package com.example.web_project.entity;


import com.example.web_project.common.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Entity
@Table(name = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @NotEmpty(message = "username không được để trống")
    private String username;

    @NotNull
    @NotEmpty(message = "password không được để trống")
    private String password;

    private String email;

    private String phone;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Article> articles;

    @OneToMany(mappedBy = "user")
    private List<Feedback> feedbacks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

}
