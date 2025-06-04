package com.example.taskmanagerapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank; // Ensure this import
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private String id;

    @NotBlank(message = "Title is mandatory and cannot be blank.")
    private String title;

    private String description;
    private String status;
    private LocalDateTime createdAt;
}
