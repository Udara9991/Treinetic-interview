package com.example.taskmanagerapi.config;

import com.example.taskmanagerapi.security.jwt.JwtAuthTokenFilter;
import com.example.taskmanagerapi.service.UserDetailsServiceImpl; // Or your UserDetailsService implementation
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Already have this from previous step
import org.springframework.security.crypto.password.PasswordEncoder; // Already have this from previous step
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity // Enables Spring Security's web security support
@EnableMethodSecurity(prePostEnabled = true) // Enables method level security (e.g., @PreAuthorize)
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService; // Your UserDetailsService implementation

    // PasswordEncoder bean is already defined in this class from a previous step.
    // If it was defined elsewhere, ensure it's available in the context.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthTokenFilter authenticationJwtTokenFilter() {
        return new JwtAuthTokenFilter(); // This will be autowired by Spring within the filter for its dependencies
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder()); // Uses the bean defined above
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF (common for stateless APIs)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Set session management to stateless
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/auth/**").permitAll() // Allow access to auth endpoints
                    .requestMatchers("/api/tasks/**").authenticated() // Secure task endpoints
                    .anyRequest().authenticated() // All other requests must be authenticated
            );

        // Add custom JWT filter before UsernamePasswordAuthenticationFilter
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        // Set the custom authentication provider
        http.authenticationProvider(authenticationProvider());

        return http.build();
    }
}
