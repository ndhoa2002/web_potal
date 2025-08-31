package com.example.web_project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.web_project.common.Role;
import com.example.web_project.dto.LoginRequest;
import com.example.web_project.dto.LoginResponse;
import com.example.web_project.entity.Feedback;
import com.example.web_project.entity.User;
import com.example.web_project.repository.FeedbackRepository;
import com.example.web_project.repository.UserRepository;
import com.example.web_project.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Xác thực user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            // Kiểm tra role admin
            Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "User không tồn tại", null, null));
            }

            User user = userOpt.get();
            if (user.getRole() != Role.WRITER) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Không có quyền admin", null, null));
            }

            // Tạo JWT token
            String token = jwtUtil.generateToken(authentication.getName());
            
            return ResponseEntity.ok(
                new LoginResponse(true, "Đăng nhập thành công", token, user.getUsername())
            );
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new LoginResponse(false, "Sai tên đăng nhập hoặc mật khẩu", null, null));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody LoginRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username đã tồn tại");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.WRITER);
        
        userRepository.save(user);
        return ResponseEntity.ok("Admin đã được tạo thành công");
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Optional<User> user = userRepository.findByUsername(authentication.getName());
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("role", user.getRole().toString());
        response.put("authenticated", true);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/feedbacks/statistics")
    public ResponseEntity<Map<String, Object>> getFeedbackStatistics() {
        List<Feedback> allFeedbacks = feedbackRepository.findAll();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", allFeedbacks.size());
        
        long pending = allFeedbacks.stream()
            .filter(f -> f.getAnswer() == null || f.getAnswer().isEmpty())
            .count();
        long resolved = allFeedbacks.stream()
            .filter(f -> f.getAnswer() != null && !f.getAnswer().isEmpty())
            .count();
            
        stats.put("pending", pending);
        stats.put("resolved", resolved);
        stats.put("inProgress", 0); // Placeholder
        stats.put("rejected", 0);   // Placeholder
        
        return ResponseEntity.ok(stats);
    }
}
