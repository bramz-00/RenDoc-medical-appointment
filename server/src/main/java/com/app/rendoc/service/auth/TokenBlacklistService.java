package com.app.rendoc.service.auth;

import com.app.rendoc.config.JwtUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@Component
public class TokenBlacklistService {
    private JwtUtils jwtUtils;

    private final Map<String, Long> blacklistedTokens = new ConcurrentHashMap<>();

    public void blacklistToken(String token) {
        try {
            // Get expiration time from the token
            long expirationTime = jwtUtils.getExpirationFromToken(token).getTime();
            blacklistedTokens.put(token, expirationTime);
            log.debug("Token blacklisted successfully");
        } catch (Exception e) {
            log.warn("Could not extract expiration from token, blacklisting indefinitely", e);
            // If we can't get expiration, store with a default future time
            blacklistedTokens.put(token, System.currentTimeMillis() + (24 * 60 * 60 * 1000)); // 24 hours
        }
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }

    // Clean up expired tokens every hour
    @Scheduled(fixedRate = 3600000) // Every hour (3600000 ms)
    public void cleanupExpiredTokens() {
        long currentTime = System.currentTimeMillis();
        int initialSize = blacklistedTokens.size();

        // Remove tokens that have already expired
        blacklistedTokens.entrySet().removeIf(entry -> {
            boolean isExpired = entry.getValue() <= currentTime;
            if (isExpired) {
                log.debug("Removing expired token from blacklist");
            }
            return isExpired;
        });

        int removedCount = initialSize - blacklistedTokens.size();
        if (removedCount > 0) {
            log.info("Cleaned up {} expired tokens from blacklist. Remaining: {}",
                    removedCount, blacklistedTokens.size());
        }
    }

    // Optional: Get current blacklist size (useful for monitoring)
    public int getBlacklistSize() {
        return blacklistedTokens.size();
    }

    // Optional: Manual cleanup method
    public int cleanupNow() {
        int sizeBefore = blacklistedTokens.size();
        cleanupExpiredTokens();
        return sizeBefore - blacklistedTokens.size();
    }
}