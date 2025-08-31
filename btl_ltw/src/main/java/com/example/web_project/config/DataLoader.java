package com.example.web_project.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.web_project.common.Role;
import com.example.web_project.entity.User;
import com.example.web_project.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Tạo admin user mặc định nếu chưa có
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.WRITER);
            admin.setEmail("admin@example.com");
            
            userRepository.save(admin);
            System.out.println("✅ Đã tạo admin user: admin/admin123");
        } else {
            System.out.println("✅ Admin user đã tồn tại");
        }
    }
}
