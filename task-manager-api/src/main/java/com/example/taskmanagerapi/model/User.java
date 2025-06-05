package com.example.taskmanagerapi.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true) // Ensure username is unique
    private String username;

    private String password; // Will be stored encoded

    // Consider adding roles or authorities here later if needed
    // private Set<String> roles = new HashSet<>();
}
