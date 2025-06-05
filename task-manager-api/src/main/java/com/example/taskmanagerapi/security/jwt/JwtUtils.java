package com.example.taskmanagerapi.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException; // Correct import for SignatureException
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${taskmanager.app.jwtSecret}") // To be defined in application.properties
    private String jwtSecretString;

    @Value("${taskmanager.app.jwtExpirationMs}") // To be defined in application.properties
    private int jwtExpirationMs;

    private Key key;

    @PostConstruct
    public void init() {
        // Ensure the secret string is long enough for HS256 or consider HS512
        // For HS256, the key size must be 256 bits (32 bytes) or larger.
        // If jwtSecretString is shorter, this will throw an exception.
        // A common practice is to use a Base64 encoded string for the secret.
        // For simplicity, we'll derive the key directly if it's long enough.
        // If not, generate a secure key or ensure the configured one is adequate.
        // This example assumes jwtSecretString is a sufficiently strong secret.
         if (jwtSecretString == null || jwtSecretString.length() < 32) {
            logger.warn("JWT secret is not configured or is too short. Using a default, less secure key. PLEASE CONFIGURE a strong jwtSecret in application.properties");
            // In a real app, you might throw an error or ensure a more robust default key generation
            this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Generates a new key on each startup if not configured
         } else {
            byte[] keyBytes = jwtSecretString.getBytes(); // Or Decoders.BASE64.decode(jwtSecretString); if it's Base64 encoded
            this.key = Keys.hmacShaKeyFor(keyBytes);
         }
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256) // Use the key field
                .compact();
    }

    // Overloaded method to generate token from username directly
    public String generateTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws( authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}
