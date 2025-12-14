package dev.hafil.travelCompanion.controller;

import dev.hafil.travelCompanion.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                authService.register(body.get("username"), body.get("password"))
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                authService.login(body.get("username"), body.get("password"))
        );
    }


    @PutMapping("/username")
    public ResponseEntity<?> changeUsername(
            @RequestBody Map<String, String> body,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                authService.changeUsername(auth.getName(), body.get("newUsername"))
        );
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> body,
            Authentication auth
    ) {
        authService.changePassword(
                auth.getName(),
                body.get("oldPassword"),
                body.get("newPassword")
        );
        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }
}

