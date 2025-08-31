package com.example.web_project.dto;


import com.example.web_project.common.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String phone;
    private Role role;
}
