package com.mobilemart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "MobileMart Backend API");
        response.put("version", "1.0.0");
        response.put("frontendUrl", "http://localhost:3000");
        response.put("h2ConsoleUrl", "http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:mobilemartdb)");
        response.put("message", "MobileMart Backend API is running successfully. Please visit http://localhost:3000 to access the MobileMart Web Application.");
        return ResponseEntity.ok(response);
    }
}
