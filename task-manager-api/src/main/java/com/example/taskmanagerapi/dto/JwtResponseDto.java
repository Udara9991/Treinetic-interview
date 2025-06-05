package com.example.taskmanagerapi.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class JwtResponseDto {
    private String token;
    private String type = "Bearer";
    private String id;
    private String username;
    // Could add roles here if implemented: private List<String> roles;

    public JwtResponseDto(String token, String id, String username) {
        this.token = token;
        this.id = id;
        this.username = username;
    }
}
